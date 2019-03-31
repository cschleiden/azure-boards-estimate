define(["require", "exports"], function (require, exports) {
    var BaseCommunicationClient = (function () {
        function BaseCommunicationClient() {
            this.statusHandlers = [];
            this.requestStatusHandlers = [];
            this.leftHandlers = [];
            this.endHandlers = [];
            this.messageHandlers = [];
            this.commitHandlers = [];
            this.revealHandlers = [];
            this.changeWorkItemHandlers = [];
        }
        BaseCommunicationClient.prototype.attachStatus = function (handler) {
            this.statusHandlers.push(handler);
        };
        BaseCommunicationClient.prototype.attachRequestStatus = function (handler) {
            this.requestStatusHandlers.push(handler);
        };
        BaseCommunicationClient.prototype.attachLeft = function (handler) {
            this.leftHandlers.push(handler);
        };
        BaseCommunicationClient.prototype.attachEnd = function (handler) {
            this.endHandlers.push(handler);
        };
        BaseCommunicationClient.prototype.attachMessage = function (handler) {
            this.messageHandlers.push(handler);
        };
        BaseCommunicationClient.prototype.attachCommit = function (handler) {
            this.commitHandlers.push(handler);
        };
        BaseCommunicationClient.prototype.attachReveal = function (handler) {
            this.revealHandlers.push(handler);
        };
        BaseCommunicationClient.prototype.attachChangeWorkItem = function (handler) {
            this.changeWorkItemHandlers.push(handler);
        };
        BaseCommunicationClient.prototype._raiseStatus = function (user, workItemId, estimate, isRevealed) {
            for (var _i = 0, _a = this.statusHandlers; _i < _a.length; _i++) {
                var handler = _a[_i];
                handler(user, workItemId, estimate, isRevealed);
            }
        };
        BaseCommunicationClient.prototype._raiseRequestStatus = function (user) {
            for (var _i = 0, _a = this.requestStatusHandlers; _i < _a.length; _i++) {
                var handler = _a[_i];
                handler(user);
            }
        };
        BaseCommunicationClient.prototype._raiseLeft = function (user) {
            for (var _i = 0, _a = this.leftHandlers; _i < _a.length; _i++) {
                var handler = _a[_i];
                handler(user);
            }
        };
        BaseCommunicationClient.prototype._raiseEnd = function (identifier) {
            for (var _i = 0, _a = this.endHandlers; _i < _a.length; _i++) {
                var handler = _a[_i];
                handler(identifier);
            }
        };
        BaseCommunicationClient.prototype._raiseMessage = function (user, message) {
            for (var _i = 0, _a = this.messageHandlers; _i < _a.length; _i++) {
                var handler = _a[_i];
                handler(user, message);
            }
        };
        BaseCommunicationClient.prototype._raiseCommit = function (user, workItemId, value) {
            for (var _i = 0, _a = this.commitHandlers; _i < _a.length; _i++) {
                var handler = _a[_i];
                handler(user, workItemId, value);
            }
        };
        BaseCommunicationClient.prototype._raiseReveal = function (user, workItemId) {
            for (var _i = 0, _a = this.revealHandlers; _i < _a.length; _i++) {
                var handler = _a[_i];
                handler(user, workItemId);
            }
        };
        BaseCommunicationClient.prototype._raiseChangeWorkItem = function (user, workItemId) {
            for (var _i = 0, _a = this.changeWorkItemHandlers; _i < _a.length; _i++) {
                var handler = _a[_i];
                handler(user, workItemId);
            }
        };
        return BaseCommunicationClient;
    })();
    exports.BaseCommunicationClient = BaseCommunicationClient;
});
