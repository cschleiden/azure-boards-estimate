/// <reference path="../../../typings/tsd.d.ts" />
define(["require", "exports", "q", "VSS/Service", "TFS/Work/RestClient", "TFS/Work/Contracts", "TFS/WorkItemTracking/RestClient", "TFS/Core/RestClient"], function (require, exports, Q, Service, WorkRestClient, WorkContracts, WitRestClient, CoreRestClient) {
    function getWorkItemColors() {
        return Q({
            "User Story": "rgb(0, 156, 204)",
            "Product Backlog Item": "rgb(0, 156, 204)",
            "Requirement": "rgb(0, 156, 204)",
            "Bug": "rgb(204, 41, 61)",
            "Epic": "rgb(255, 123, 0)",
            "Feature": "rgb(119, 59, 147)"
        });
    }
    exports.getWorkItemColors = getWorkItemColors;
    function getTypeFieldsForCurrentProject() {
        return getProjectTypeForCurrentProject().then(function (type) {
            var r = function (t) { return {
                "effort": getEffortField(type),
                "order": getOrderField(type)
            }; };
            if (type !== TemplateType.Custom) {
                return r(type);
            }
            else {
                var webContext = VSS.getWebContext();
                var witClient = Service.getClient(WitRestClient.WorkItemTrackingHttpClient);
                return witClient.getWorkItemTypeCategory(webContext.project.id, "Microsoft.RequirementCategory")
                    .then(function (category) {
                    if (category.workItemTypes.some(function (type) { return type.name === "Requirement"; })) {
                        type = TemplateType.CMMI;
                    }
                    else if (category.workItemTypes.some(function (type) { return type.name === "User Story"; })) {
                        type = TemplateType.Agile;
                    }
                    else if (category.workItemTypes.some(function (type) { return type.name === "Product Backlog Item"; })) {
                        type = TemplateType.Scrum;
                    }
                    else {
                        throw "Cannot identify the process template of your project";
                    }
                    appInsights.trackEvent("Used category to identify template '" + TemplateType[type] + "'");
                    return r(type);
                });
            }
        });
    }
    exports.getTypeFieldsForCurrentProject = getTypeFieldsForCurrentProject;
    function getProjectTypeForCurrentProject() {
        var webContext = VSS.getWebContext();
        var coreClient = Service.getClient(CoreRestClient.CoreHttpClient);
        return coreClient.getProject(webContext.project.id, true).then(function (project) {
            var projectProcess = project.capabilities["processTemplate"]["templateName"];
            var template = parseTemplate(projectProcess);
            if (template === TemplateType.Custom) {
                appInsights.trackEvent("Could not parse template for name '" + projectProcess + "'");
            }
            return template;
        });
    }
    function getBacklogQueryForIteration(iteration, effortFieldRefName, orderFieldRefName) {
        var webContext = VSS.getWebContext();
        var teamContext = {
            projectId: webContext.project.id,
            project: webContext.project.name,
            teamId: webContext.team.id,
            team: webContext.team.name
        };
        var witClient = Service.getClient(WitRestClient.WorkItemTrackingHttpClient);
        var workClient = Service.getClient(WorkRestClient.WorkHttpClient);
        return Q.all([
            workClient.getTeamSettings(teamContext),
            workClient.getTeamFieldValues(teamContext),
            witClient.getWorkItemTypeCategory(webContext.project.id, "Microsoft.RequirementCategory"),
            witClient.getWorkItemTypeCategory(webContext.project.id, "Microsoft.BugCategory")
        ])
            .spread(function (teamSettings, teamfieldValues, requirementCategory, bugCategory) {
            var workItemTypes = requirementCategory.workItemTypes.map(function (x) { return x.name; });
            if (teamSettings.bugsBehavior === WorkContracts.BugsBehavior.AsRequirements) {
                workItemTypes = workItemTypes.concat(bugCategory.workItemTypes.map(function (x) { return x.name; }));
            }
            var buildTeamFieldClause = function (prefix) {
                if (prefix !== "") {
                    prefix += ".";
                }
                if (teamfieldValues.field.referenceName === "System.AreaPath") {
                    return teamfieldValues.values.map(function (tfv) {
                        var op;
                        if (tfv.includeChildren) {
                            op = "UNDER";
                        }
                        else {
                            op = "=";
                        }
                        return prefix + "[System.AreaPath] " + op + " '" + tfv.value + "'";
                    }).join(" OR ");
                }
                else {
                    return teamfieldValues.values.map(function (tfv) { return ("" + prefix + teamfieldValues.field.referenceName + " = '" + tfv.value + "'"); }).join(" OR ");
                }
            };
            var targetStates = ["Proposed", "New", "Active", "Approved", "Committed"];
            return "SELECT [System.Id] FROM WorkItemLinks\n                        WHERE Source.[System.WorkItemType] IN ('" + workItemTypes.join("','") + "')\n                            AND Source.[System.IterationPath] UNDER '" + iteration + "'\n                            AND (" + buildTeamFieldClause("Source") + ")\n                            AND Target.[System.WorkItemType] IN ('" + workItemTypes.join("','") + "')\n                            AND Target.[System.IterationPath] UNDER '" + iteration + "'\n                            AND Target.[System.State] IN ('" + targetStates.join("', '") + "')\n                            AND (" + buildTeamFieldClause("Target") + ")\n                            AND [System.Links.LinkType] = 'System.LinkTypes.Hierarchy-Forward'\n                            ORDER BY [" + orderFieldRefName + "], [System.Id] MODE(Recursive, ReturnMatchingChildren)";
        });
    }
    exports.getBacklogQueryForIteration = getBacklogQueryForIteration;
    var TemplateType;
    (function (TemplateType) {
        TemplateType[TemplateType["Agile"] = 0] = "Agile";
        TemplateType[TemplateType["Scrum"] = 1] = "Scrum";
        TemplateType[TemplateType["CMMI"] = 2] = "CMMI";
        TemplateType[TemplateType["Custom"] = 3] = "Custom";
    })(TemplateType || (TemplateType = {}));
    function parseTemplate(templateName) {
        if (templateName.indexOf("Scrum") !== -1) {
            return TemplateType.Scrum;
        }
        else if (templateName.indexOf("Agile") !== -1) {
            return TemplateType.Agile;
        }
        else if (templateName.indexOf("CMMI") !== -1) {
            return TemplateType.CMMI;
        }
        return TemplateType.Custom;
    }
    function getEffortField(templateType) {
        switch (templateType) {
            case TemplateType.CMMI:
                return {
                    refName: "Microsoft.VSTS.Scheduling.Size",
                    displayName: "Size"
                };
            case TemplateType.Agile:
                return {
                    refName: "Microsoft.VSTS.Scheduling.StoryPoints",
                    displayName: "Story Points"
                };
            case TemplateType.Scrum:
                return {
                    refName: "Microsoft.VSTS.Scheduling.Effort",
                    displayName: "Effort"
                };
        }
    }
    function getOrderField(templateType) {
        switch (templateType) {
            case TemplateType.CMMI:
            case TemplateType.Agile:
                return {
                    refName: "Microsoft.VSTS.Common.StackRank",
                    displayName: "Stack Rank"
                };
            case TemplateType.Scrum:
                return {
                    refName: "Microsoft.VSTS.Common.BacklogPriority",
                    displayName: "Backlog Priority"
                };
        }
    }
    function getWorkItemTypes() {
        var webContext = VSS.getWebContext();
        var teamContext = {
            projectId: webContext.project.id,
            project: webContext.project.name,
            teamId: webContext.team.id,
            team: webContext.team.name
        };
        var witClient = Service.getClient(WitRestClient.WorkItemTrackingHttpClient);
        var workClient = Service.getClient(WorkRestClient.WorkHttpClient);
        return Q.all([
            workClient.getTeamSettings(teamContext),
            witClient.getWorkItemTypeCategory(webContext.project.id, "Microsoft.RequirementCategory"),
            witClient.getWorkItemTypeCategory(webContext.project.id, "Microsoft.BugCategory")
        ])
            .spread(function (teamSettings, requirementCategory, bugCategory) {
            var workItemTypes = requirementCategory.workItemTypes.map(function (x) { return x.name; });
            if (teamSettings.bugsBehavior === WorkContracts.BugsBehavior.AsRequirements) {
                workItemTypes = workItemTypes.concat(bugCategory.workItemTypes.map(function (x) { return x.name; }));
            }
            return workItemTypes;
        });
    }
    exports.getWorkItemTypes = getWorkItemTypes;
    function getUnorderedBacklogQuery(workItemTypes) {
        var webContext = VSS.getWebContext();
        var teamContext = {
            projectId: webContext.project.id,
            project: webContext.project.name,
            teamId: webContext.team.id,
            team: webContext.team.name
        };
        var witClient = Service.getClient(WitRestClient.WorkItemTrackingHttpClient);
        var workClient = Service.getClient(WorkRestClient.WorkHttpClient);
        return Q.all([
            workClient.getTeamSettings(teamContext),
            workClient.getTeamFieldValues(teamContext)
        ])
            .spread(function (teamSettings, teamfieldValues) {
            return workClient.getTeamIteration(teamContext, teamSettings.backlogIteration.id)
                .then(function (backlogIteration) {
                var buildTeamFieldClause = function (prefix) {
                    if (prefix !== "") {
                        prefix += ".";
                    }
                    if (teamfieldValues.field.referenceName === "System.AreaPath") {
                        return teamfieldValues.values.map(function (tfv) {
                            var op;
                            if (tfv.includeChildren) {
                                op = "UNDER";
                            }
                            else {
                                op = "=";
                            }
                            return prefix + "[System.AreaPath] " + op + " '" + tfv.value + "'";
                        }).join(" OR ");
                    }
                    else {
                        return teamfieldValues.values.map(function (tfv) { return ("" + prefix + teamfieldValues.field.referenceName + " = '" + tfv.value + "'"); }).join(" OR ");
                    }
                };
                var targetStates = ["Proposed", "New", "Active", "Approved", "Committed"];
                return "SELECT [System.Id] FROM WorkItemLinks\n                        WHERE Source.[System.WorkItemType] IN ('" + workItemTypes.join("','") + "')\n                            AND Source.[System.IterationPath] UNDER '" + backlogIteration.path + "'\n                            AND (" + buildTeamFieldClause("Source") + ")\n                            AND Target.[System.WorkItemType] IN ('" + workItemTypes.join("','") + "')\n                            AND Target.[System.IterationPath] UNDER '" + backlogIteration.path + "'\n                            AND Target.[System.State] IN ('" + targetStates.join("', '") + "')\n                            AND (" + buildTeamFieldClause("Target") + ")\n                            AND [System.Links.LinkType] = 'System.LinkTypes.Hierarchy-Forward'\n                            ORDER BY [System.Id] MODE(Recursive, ReturnMatchingChildren)";
            });
        });
    }
    exports.getUnorderedBacklogQuery = getUnorderedBacklogQuery;
});
