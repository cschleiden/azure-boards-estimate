/// <reference path="../../typings/tsd.d.ts" />
var menuAction = function () {
    return {
        execute: function (actionContext) {
            var vsoContext = VSS.getWebContext();
            var extensionContext = VSS.getExtensionContext();
            var workItemIds;
            if (actionContext.rows) {
                workItemIds = actionContext.rows.map(function (row) { return parseInt(row[0], 10); });
            }
            else {
                workItemIds = actionContext.workItemIds;
            }
            var workItemStr = workItemIds.join(",");
            var url = vsoContext.host.uri + "/" + vsoContext.project.name + "/" + (vsoContext.team && vsoContext.team.name && (vsoContext.team.name + "/") || "") + "_apps/hub/" + extensionContext.publisherId + "." + extensionContext.extensionId + ".Estimate.Main#action=create&workItemIds=" + workItemStr;
            window.parent.location.href = url;
        }
    };
};
VSS.register("ms-devlabs.estimate.Estimate.WorkItems", menuAction);
VSS.register("Estimate.WorkItems", menuAction);
