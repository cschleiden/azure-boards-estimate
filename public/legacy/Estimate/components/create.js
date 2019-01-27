/// <reference path="../../../typings/tsd.d.ts" />
define(["require", "exports", "q", "VSS/Service", "Estimate/main", "TFS/Work/RestClient", "TFS/WorkItemTracking/RestClient", "Estimate/lib/sessionService", "Estimate/lib/backlogUtils"], function (require, exports, Q, Service, Main, WorkRestClient, WitRestClient, SessionService, BacklogUtils) {
    var CreateViewModel = (function () {
        function CreateViewModel(params) {
            var _this = this;
            this.name = ko.observable();
            this.cards = ko.observable();
            this.cardData = [
                "0 ½ 1 2 3 5 8 13 20 40 ? ∞ ☕",
                "0 1 2 3 5 8 13 20 40 100"
            ];
            this.workItemSource = ko.observable("iteration");
            this.iteration = ko.observable();
            this.iterationData = ko.observableArray();
            this.workItemIds = ko.observable();
            this.isEnabled = ko.pureComputed(function () { return _this._isEnabled(); });
            this.init();
            if (params.workItemIds && params.workItemIds.length > 0) {
                this.workItemIds(params.workItemIds.join(", "));
                this.workItemSource("ids");
            }
        }
        CreateViewModel.prototype.init = function () {
            this._getIterationNames();
        };
        CreateViewModel.prototype.create = function () {
            var _this = this;
            var id = guid();
            var webContext = VSS.getWebContext();
            var getWorkItemIds = function (typeFields) {
                var diagnosticData = {
                    workItemSource: _this.workItemSource()
                };
                if (_this.workItemSource() === "iteration") {
                    var witClient = Service.getClient(WitRestClient.WorkItemTrackingHttpClient);
                    return BacklogUtils.getBacklogQueryForIteration(_this.iteration().path, typeFields["effort"]
                        .refName, typeFields["order"].refName).then(function (wiql) {
                        return witClient.queryByWiql({ query: wiql }, webContext.project.id).then(function (queryResult) {
                            if (!queryResult.workItemRelations || queryResult.workItemRelations.length === 0) {
                                appInsights.trackTrace("Empty query result returned. Query " + wiql);
                            }
                            return queryResult.workItemRelations.map(function (x) { return x.target.id; });
                        }, function (reason) {
                            alert("Could not run query to get work items.");
                            appInsights.trackEvent("Error while running query to get work items", $.extend({}, diagnosticData, {
                                reason: JSON.stringify(reason)
                            }));
                        });
                    }, function (reason) {
                        alert("Could not get generate query to retrieve backlog items");
                        appInsights.trackEvent("Error while generating query", $.extend({}, diagnosticData, {
                            reason: JSON.stringify(reason)
                        }));
                    });
                }
                else {
                    return Q(_this.workItemIds().split(",").map(function (x) { return parseInt(x.trim(), 10); }));
                }
            };
            return BacklogUtils.getTypeFieldsForCurrentProject().then(function (typeFields) {
                return getWorkItemIds(typeFields).then(function (workItemIds, roomId) {
                    var session = {
                        id: id,
                        name: _this.name(),
                        teamId: webContext.team.id,
                        workItemIds: workItemIds,
                        creatorId: webContext.user.id,
                        createdAt: new Date(),
                        setOfCards: _this.cards().split(" "),
                        effortField: typeFields["effort"]
                    };
                    var sessionService = SessionService.EstimateSessionService.getInstance();
                    sessionService.getSessions().then(function (sessions) {
                        if (sessions.some(function (x) { return x.name === _this.name(); })) {
                            alert('A session with this name already exists.');
                        }
                        else {
                            sessionService.saveSession(session).then(function () {
                                Main.instance.navigate({
                                    action: 'estimate',
                                    id: id
                                });
                            }, function (reason) {
                                appInsights.trackEvent("Error while saving session", {
                                    reason: JSON.stringify(reason)
                                });
                            });
                        }
                    });
                });
            }, function (reason) {
                alert("Error while determining typo fields for the current project.");
                appInsights.trackEvent("Error while retrieving typefields", {
                    reason: JSON.stringify(reason)
                });
            });
        };
        CreateViewModel.prototype._isEnabled = function () {
            var iterationDataRetrieved = this.iterationData().length > 0;
            var name = this.name();
            var hasName = name && name.trim().length > 0;
            var workItemSourceIsIteration = this.workItemSource() === "iteration";
            var hasIteration = this.iteration() !== null;
            var ids = (this.workItemIds() || "").split(",");
            var hasIds = ids && ids.length > 0 && ids.every(function (x) { return parseInt(x.trim(), 10) > 0; });
            return hasName && ((workItemSourceIsIteration && hasIteration && iterationDataRetrieved) || (!workItemSourceIsIteration && hasIds));
        };
        CreateViewModel.prototype._getIterationNames = function () {
            var _this = this;
            var webContext = VSS.getWebContext();
            var client = Service.getClient(WorkRestClient.WorkHttpClient);
            client.getTeamIterations({
                project: webContext.project.name,
                projectId: webContext.project.id,
                team: webContext.team.name,
                teamId: webContext.team.id
            }).then(function (iterations) {
                _this.iterationData(iterations.map(function (x) { return { id: x.id, name: x.name, path: x.path }; }));
            });
        };
        return CreateViewModel;
    })();
    ko.components.register('create', {
        viewModel: CreateViewModel,
        template: { fromJS: 'create.tpl' },
    });
    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
});
