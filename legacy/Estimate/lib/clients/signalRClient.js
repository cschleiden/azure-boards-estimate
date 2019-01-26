var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "q", "Estimate/configuration", "Estimate/lib/clients/client", "Estimate/lib/clients/model"], function (require, exports, Q, Configuration, CommClient, model) {
    var SignalRClient = (function (_super) {
        __extends(SignalRClient, _super);
        function SignalRClient(userData, identifier) {
            _super.call(this);
            this.userData = userData;
            this.identifier = identifier;
            this._initialized = false;
        }
        SignalRClient.prototype.init = function (errorHandler) {
            var _this = this;
            var deferred = Q.defer();
            var connection = $.hubConnection(Configuration.backendUri, {});
            connection.qs = {
                'sessionId': this.identifier,
                'tfId': this.userData.tfid
            };
            if (errorHandler) {
                connection.error(errorHandler);
            }
            this._hubProxy = connection.createHubProxy('estimate');
            this._hubProxy.on('broadcast', function (action, payload) {
                switch (action) {
                    case model.Actions.REVEAL: {
                        var data2 = payload;
                        _this._raiseReveal(data2.userData, data2.workItemId);
                        break;
                    }
                    case model.Actions.COMMIT: {
                        var data2_1 = payload;
                        _this._raiseCommit(data2_1.userData, data2_1.workItemId, data2_1.value);
                        break;
                    }
                    case model.Actions.CHANGE_WORKITEM: {
                        var data2_2 = payload;
                        _this._raiseChangeWorkItem(data2_2.userData, data2_2.workItemId);
                        break;
                    }
                    case model.Actions.STATUS: {
                        var data2_3 = payload;
                        _this._raiseStatus(data2_3.userData, data2_3.workItemId, data2_3.estimate, data2_3.isRevealed);
                        break;
                    }
                    case model.Actions.REQUEST_STATUS: {
                        _this._raiseRequestStatus(payload);
                        break;
                    }
                    case model.Actions.LEFT: {
                        _this._raiseLeft({
                            tfid: payload,
                            name: null
                        });
                        break;
                    }
                    case model.Actions.END: {
                        _this._raiseEnd(payload);
                        break;
                    }
                }
            });
            this._hubProxy.on(model.Actions.JOINED, function () {
            });
            connection.start({
                "withCredentials": false
            })
                .done(function () {
                _this.emit(model.Actions.HELLO, {
                    userData: _this.userData,
                    roomId: _this.identifier
                }).then(function () {
                    deferred.resolve(null);
                    _this._initialized = true;
                }, function (reason) {
                    deferred.reject(reason);
                });
            })
                .fail(function (reason) { deferred.reject(reason); });
            return deferred.promise;
        };
        SignalRClient.prototype.dispose = function () {
            if (this._hubProxy) {
                if (this._hubProxy.connection) {
                    this._hubProxy.connection.stop(false, true);
                    this._hubProxy.connection = null;
                }
                this._hubProxy = null;
            }
        };
        SignalRClient.prototype.cleanup = function () {
            if (this._initialized) {
                return this.emit(model.Actions.END, this.identifier);
            }
            else {
                return Q(null);
            }
        };
        SignalRClient.prototype.getMembers = function () {
            return Q(null);
        };
        SignalRClient.prototype.sendCommit = function (workItemId, value) {
            return this.emit(model.Actions.COMMIT, {
                userData: this.userData,
                workItemId: workItemId,
                value: value
            });
        };
        SignalRClient.prototype.sendReveal = function (workItemId) {
            return this.emit(model.Actions.REVEAL, {
                userData: this.userData,
                workItemId: workItemId
            });
        };
        SignalRClient.prototype.sendChangeWorkItem = function (workItemId) {
            return this.emit(model.Actions.CHANGE_WORKITEM, {
                userData: this.userData,
                workItemId: workItemId
            });
        };
        SignalRClient.prototype.sendStatus = function (workItemId, estimate, isRevealed) {
            return this.emit(model.Actions.STATUS, {
                userData: this.userData,
                workItemId: workItemId,
                estimate: estimate,
                isRevealed: isRevealed
            });
        };
        SignalRClient.prototype.requestStatus = function () {
            return this.emit(model.Actions.REQUEST_STATUS, this.userData);
        };
        SignalRClient.prototype.emit = function (action, data) {
            var deferred = Q.defer();
            try {
                this._hubProxy.invoke('Broadcast', this.identifier, action, data).done(function () { deferred.resolve(null); });
            }
            catch (e) {
                deferred.reject(e);
            }
            return deferred.promise;
        };
        return SignalRClient;
    })(CommClient.BaseCommunicationClient);
    exports.SignalRClient = SignalRClient;
});
