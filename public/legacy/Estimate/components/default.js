/// <reference path="../../../typings/tsd.d.ts" />
define(["require", "exports", 'Estimate/main', "Estimate/lib/sessionService"], function (require, exports, Main, SessionService) {
    var DefaultViewModel = (function () {
        function DefaultViewModel() {
            this.existingSessions = ko.observableArray();
            this.init();
        }
        DefaultViewModel.prototype.create = function () {
            Main.instance.navigate({
                action: 'create'
            });
        };
        DefaultViewModel.prototype.navigate = function (session) {
            Main.instance.navigate({
                action: 'estimate',
                id: session.id
            });
        };
        DefaultViewModel.prototype.init = function () {
            var _this = this;
            this.existingSessions.splice(0, this.existingSessions.length);
            SessionService.EstimateSessionService.getInstance().getSessions().then(function (sessions) {
                for (var _i = 0; _i < sessions.length; _i++) {
                    var session = sessions[_i];
                    _this.existingSessions.push(session);
                }
            });
        };
        return DefaultViewModel;
    })();
    ko.components.register('default', {
        viewModel: DefaultViewModel,
        template: { fromJS: 'default.tpl' },
    });
});
