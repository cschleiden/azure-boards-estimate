/// <reference path="../../typings/tsd.d.ts" />
define(["require", "exports", "q", "Estimate/lib/sessionService"], function (require, exports, Q, SessionService) {
    exports.instance;
    function init() {
        Q
            .all([VSS.getService(VSS.ServiceIds.Navigation), VSS.getService(VSS.ServiceIds.ExtensionData)])
            .spread(function (navigationService, dataService) {
            exports.instance = new AppViewModel(navigationService);
            SessionService.EstimateSessionService.instance = new SessionService.EstimateSessionService(dataService);
            ko.applyBindings(exports.instance);
            VSS.notifyLoadSucceeded();
        });
    }
    exports.init = init;
    var AppViewModel = (function () {
        function AppViewModel(navigationService) {
            this.navigationService = navigationService;
            this.component = ko.observable('default');
            this.componentParams = {};
            this.init();
        }
        AppViewModel.prototype.init = function () {
            var _this = this;
            this.navigationService.onHashChanged(function (hash) {
                _this.parseHash(hash);
            });
            this.navigationService.getHash().then(function (hash) {
                _this.parseHash(hash);
            });
        };
        AppViewModel.prototype.navigate = function (state) {
            var hash = [];
            for (var _i = 0, _a = Object.keys(state); _i < _a.length; _i++) {
                var name_1 = _a[_i];
                var value = state[name_1];
                hash.push(name_1 + "=" + value);
            }
            this.navigationService.setHash(hash.join('&'));
        };
        AppViewModel.prototype.parseHash = function (hash) {
            var state = {
                action: 'default'
            };
            var segments = hash.split('&');
            for (var _i = 0; _i < segments.length; _i++) {
                var segment = segments[_i];
                var pair = segment.split('=');
                var name_2 = decodeURIComponent(pair[0]);
                var value = decodeURIComponent(pair[1]);
                state[name_2] = value;
            }
            this.onNavigate(state);
        };
        AppViewModel.prototype.onNavigate = function (state) {
            try {
                this.componentParams.id = state.id;
                if (state.workItemIds) {
                    this.componentParams.workItemIds = state.workItemIds.split(",").map(function (x) { return parseInt(x, 10); });
                }
                if (state.showDelete === "true") {
                    this.componentParams.showDelete = true;
                }
            }
            catch (error) {
                alert("Invalid parameters in Uri.");
                this.navigate({
                    action: "default"
                });
                return;
            }
            switch (state.action) {
                case 'default':
                    this.component('default');
                    break;
                case 'create':
                    this.component('create');
                    break;
                case 'estimate':
                    if (!state.id) {
                        throw 'Id is required';
                    }
                    this.component('estimation');
                    break;
            }
        };
        return AppViewModel;
    })();
    exports.AppViewModel = AppViewModel;
});
