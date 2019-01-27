define(["require", "exports"], function (require, exports) {
    var Actions = (function () {
        function Actions() {
        }
        Actions.HELLO = "hello";
        Actions.REVEAL = "reveal";
        Actions.COMMIT = "commit";
        Actions.CHANGE_WORKITEM = "change-workitem";
        Actions.JOINED = "joined";
        Actions.LEFT = "left";
        Actions.STATUS = "status";
        Actions.REQUEST_STATUS = "request-status";
        Actions.END = "end";
        return Actions;
    })();
    exports.Actions = Actions;
});
