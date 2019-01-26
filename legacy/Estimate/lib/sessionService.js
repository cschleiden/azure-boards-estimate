/// <reference path="../../../typings/tsd.d.ts" />
define(["require", "exports"], function (require, exports) {
    var EstimateSessionService = (function () {
        function EstimateSessionService(dataService) {
            this.dataService = dataService;
        }
        EstimateSessionService.getInstance = function () {
            return EstimateSessionService.instance;
        };
        EstimateSessionService.prototype.getSessions = function () {
            var webContext = VSS.getWebContext();
            return this.dataService.getDocuments(EstimateSessionService.COLLECTION_NAME).then(function (documents) {
                return documents.filter(function (x) { return !x.teamId || x.teamId === webContext.team.id; });
            }, function () {
                return [];
            });
        };
        EstimateSessionService.prototype.getSession = function (id) {
            return this.dataService.getDocument(EstimateSessionService.COLLECTION_NAME, id).then(function (document) {
                return document;
            }, function () {
                throw "Session not found";
            });
        };
        EstimateSessionService.prototype.saveSession = function (session) {
            return this.dataService.setDocument(EstimateSessionService.COLLECTION_NAME, session);
        };
        EstimateSessionService.prototype.deleteSession = function (id) {
            return this.dataService.deleteDocument(EstimateSessionService.COLLECTION_NAME, id);
        };
        EstimateSessionService.COLLECTION_NAME = "EstimationSessions";
        return EstimateSessionService;
    })();
    exports.EstimateSessionService = EstimateSessionService;
});
