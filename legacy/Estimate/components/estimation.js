/// <reference path="../../../typings/tsd.d.ts" />
define(["require", "exports", "q", "VSS/Service", "TFS/WorkItemTracking/RestClient", "VSS/Controls", "VSS/Controls/Grids", "../lib/sessionService", "../lib/clients/signalRClient", "../lib/backlogUtils", "../main"], function (require, exports, Q, Service, RestClient, Controls, Grids, SessionService, SignalRClient, BacklogUtils, Main) {
    var Status;
    (function (Status) {
        Status[Status["NotConnected"] = 0] = "NotConnected";
        Status[Status["Connecting"] = 1] = "Connecting";
        Status[Status["Connected"] = 2] = "Connected";
        Status[Status["Error"] = 3] = "Error";
    })(Status || (Status = {}));
    var EstimationViewModel = (function () {
        function EstimationViewModel(params) {
            var _this = this;
            this.connectionStatus = ko.observable(Status.Connecting);
            this.title = ko.observable();
            this.url = ko.observable();
            this.cards = ko.observableArray();
            this.selectedCard = ko.observable();
            this.estimates = ko.observableArray();
            this.commitValue = ko.observable();
            this.canCommit = ko.pureComputed(function () {
                var val = _this.commitValue() && _this.commitValue() >= 0;
                var revealed = _this.isRevealed();
                return val && revealed;
            });
            this.canReveal = ko.pureComputed(function () {
                return !_this.isRevealed();
            });
            this.workItems = ko.observableArray();
            this.currentWorkItem = ko.observable();
            this.currentWorkItemLink = ko.observable();
            this.isCreator = ko.observable(false);
            this.showDelete = ko.observable(false);
            this.isRevealed = ko.observable(false);
            this.workItemColors = ko.observable();
            this.average = ko.pureComputed(function () {
                _this.isRevealed();
                _this.selectedCard();
                var estimates = _this.estimates();
                var count = 0, avg = 0;
                for (var _i = 0, _a = estimates.map(function (x) { return x.value; }).concat(_this.selectedCard()); _i < _a.length; _i++) {
                    var estimate = _a[_i];
                    var val = parseCard(estimate);
                    if (val != null) {
                        ++count;
                        avg += val;
                    }
                }
                var result = (avg / count) || 0;
                return result.toFixed(EstimationViewModel.PRECISION);
            });
            this.select = function (card) {
                if (_this.isRevealed()) {
                    return null;
                }
                var oldSelection = _this.selectedCard();
                if (_this.selectedCard() === card) {
                    _this.selectedCard(null);
                    return _this.sendEstimate(null);
                }
                else {
                    _this.selectedCard(card);
                    return _this.sendEstimate(card);
                }
            };
            this.shouldShowWarning = function (value) {
                return parseCard(value) === null;
            };
            this.commit = function () {
                return _this.witClient.updateWorkItem([{
                        "op": "add",
                        "path": "/fields/" + _this.session.effortField.refName,
                        "value": _this.commitValue()
                    }], _this.currentWorkItem().id).then(function () {
                    _this.currentWorkItem().estimate = _this.commitValue();
                    refresh(_this.workItems, _this.currentWorkItem());
                    _this.updateGridDataSource();
                    return _this.client.sendCommit(_this.currentWorkItem().id, _this.commitValue()).then(function () {
                        var idx = _this.workItems().indexOf(_this.currentWorkItem());
                        if (++idx >= _this.workItems().length) {
                            idx = 0;
                        }
                        var nextWorkItem = _this.workItems()[idx];
                        return _this.client.sendChangeWorkItem(nextWorkItem.id).then(function () {
                            _this.reset(nextWorkItem.id, true);
                        }, function () { return _this.errorHandler("Could not send change work item event, please try again.", false); });
                    }, function () { return _this.errorHandler("Could not send commit to other users, please try again.", false); });
                }, function (error) { return _this.errorHandler("Could not save work item: " + error.message, false); });
            };
            this.reveal = function () {
                return _this.client.sendReveal(_this.currentWorkItem().id).then(function () {
                    _this.commitValue(parseFloat(_this.average()));
                    _this.isRevealed(true);
                    _this.updateAverage();
                }, function () {
                    _this.errorHandler("Error occured while revealing, please try again.", false);
                });
            };
            this.end = function () {
                if (window.confirm("Do you really want to end and delete this session?")) {
                    return _this.endSession();
                }
                else {
                    return Q(null);
                }
            };
            this.previousWorkItem = function () {
                var workItem = _this.workItems().filter(function (x) { return x.id === _this.currentWorkItem().id; })[0];
                var idx = _this.workItems.indexOf(workItem);
                if (--idx < 0) {
                    idx = _this.workItems().length - 1;
                }
                var nextWorkItem = _this.workItems()[idx];
                return _this.client.sendChangeWorkItem(nextWorkItem.id).then(function () {
                    _this.reset(nextWorkItem.id, true);
                }, function () {
                    _this.errorHandler("Could not change work item, please try again.", false);
                });
            };
            this.nextWorkItem = function () {
                var workItem = _this.currentWorkItem();
                var idx = _this.workItems.indexOf(workItem);
                if (++idx >= _this.workItems().length) {
                    idx = 0;
                }
                var nextWorkItem = _this.workItems()[idx];
                return _this.client.sendChangeWorkItem(nextWorkItem.id).then(function () {
                    _this.reset(nextWorkItem.id, true);
                }, function () {
                    _this.errorHandler("Could not change work item, please try again.", false);
                });
            };
            this.init(params.id, params.showDelete);
        }
        EstimationViewModel.prototype.dispose = function () {
            if (this.client) {
                this.client.dispose();
            }
        };
        EstimationViewModel.prototype.sendEstimate = function (highlight) {
            var _this = this;
            if (!(this.selectedCard() !== "")) {
                return Q(null);
            }
            return this.client.sendStatus(this.currentWorkItem().id, this.selectedCard(), this.isRevealed()).then(function () {
            }, function () {
                _this.errorHandler("Could not send estimate, please try again.");
            });
        };
        EstimationViewModel.prototype.endSession = function () {
            var _this = this;
            return SessionService.EstimateSessionService.getInstance().deleteSession(this.id).then(function () {
                return _this.client.cleanup().then(function () {
                    Main.instance.navigate({ action: 'default' });
                });
            });
        };
        EstimationViewModel.prototype.init = function (id, showDelete) {
            var _this = this;
            this.id = id;
            BacklogUtils.getWorkItemColors().then(function (colors) {
                _this.workItemColors(colors);
            });
            var extensionContext = VSS.getExtensionContext();
            var webContext = VSS.getWebContext();
            this.url(webContext.host.uri + "/" + webContext.project.name + "/" + (webContext.team && webContext.team.name && (webContext.team.name + "/") || "") + "_apps/hub/" + extensionContext.publisherId + "." + extensionContext.extensionId + ".Estimate.Main#action=estimate&id=" + this.id);
            SessionService.EstimateSessionService.getInstance().getSession(id).then(function (session) {
                _this.session = session;
                _this.grid = Controls.create(Grids.Grid, $(".grid"), {
                    height: "200px",
                    width: "800px",
                    columns: [
                        {
                            index: "type",
                            width: 5,
                            canSortBy: false,
                            getCellContents: function () {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i - 0] = arguments[_i];
                                }
                                var idx = args[1];
                                var workItem = _this.workItems()[idx];
                                var type = workItem.type;
                                var color = _this.workItemColors()[type] || "lightgray";
                                var elem = _this.grid._drawCell.apply(_this.grid, args);
                                elem.html("<span class=\"color-bar-small\" style=\"background-color: " + color + "\"></span>");
                                return elem;
                            }
                        },
                        {
                            text: "Id", width: 50, index: "id", canSortBy: false, getCellContents: function () {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i - 0] = arguments[_i];
                                }
                                var idx = args[1];
                                var workItem = _this.workItems()[idx];
                                var elem = _this.grid._drawCell.apply(_this.grid, args);
                                elem.html("<a href=\"" + webContext.collection.uri + webContext.project.name + "/_workitems?id=" + workItem.id + "&triage=true&_a=edit&fullScreen=true\" target=\"_blank\">" + workItem.id + "</a>");
                                return elem;
                            }
                        },
                        { text: "Title", width: 400, index: "title", canSortBy: false },
                        { text: _this.session.effortField.displayName, width: 100, index: "estimate", canSortBy: false }
                    ],
                    keepSelection: false,
                    allowMoveColumns: false,
                    allowMultiSelect: false,
                    allowTextSelection: false,
                    autoSort: false
                });
                $(".grid").on('rowclicked', function (evt, data) {
                    if (_this.isCreator()) {
                        var idx = data.rowIndex;
                        var nextWorkItemId = _this.workItems()[idx].id;
                        _this.client.sendChangeWorkItem(nextWorkItemId).then(function () {
                            _this.reset(nextWorkItemId, true);
                        }, function () {
                            _this.errorHandler("Could not change work item, please try again.", false);
                        });
                    }
                });
                $(".grid").on(Grids.GridO.EVENT_SELECTED_INDEX_CHANGED, function (evt, selectedIndex) {
                    var idx = _this.workItems.indexOf(_this.currentWorkItem());
                    if (selectedIndex !== idx) {
                        _this.grid.setSelectedDataIndex(idx);
                    }
                });
                _this.title(_this.session.name);
                _this.cards(_this.session.setOfCards);
                _this.userId = VSS.getWebContext().user.id;
                _this.isCreator(session.creatorId === _this.userId);
                _this.showDelete(showDelete);
                _this.estimates([]);
                _this.client = new SignalRClient.SignalRClient({
                    name: VSS.getWebContext().user.name,
                    tfid: _this.userId
                }, _this.id);
                _this.client.attachStatus(_this.onStatus.bind(_this));
                _this.client.attachRequestStatus(_this.onStatusRequested.bind(_this));
                _this.client.attachLeft(_this.onLeft.bind(_this));
                _this.client.attachEnd(_this.onEnd.bind(_this));
                _this.client.attachCommit(_this.onCommit.bind(_this));
                _this.client.attachReveal(_this.onReveal.bind(_this));
                _this.client.attachChangeWorkItem(_this.onChangeWorkItem.bind(_this));
                _this.witClient = Service.getClient(RestClient.WorkItemTrackingHttpClient);
                _this.witClient.getWorkItems(session.workItemIds, ["System.Id", "System.WorkItemType", "System.Title", _this.session.effortField.refName])
                    .then(function (workItems) {
                    if (!workItems || workItems.length === 0) {
                        if (window.confirm("No work items found. Do you want to delete this session?")) {
                            _this.endSession();
                        }
                        else {
                            Main.instance.navigate({ action: 'default' });
                        }
                        return;
                    }
                    var workItemMap = {};
                    workItems.forEach(function (wi) { return workItemMap[wi.id] = wi; });
                    _this.workItems(session.workItemIds.map(function (workItemId) {
                        var workItem = workItemMap[workItemId];
                        if (!workItem) {
                            return null;
                        }
                        else {
                            return {
                                id: workItem.id,
                                type: workItem.fields["System.WorkItemType"],
                                title: workItem.fields["System.Title"],
                                estimate: workItem.fields[_this.session.effortField.refName]
                            };
                        }
                    }).filter(function (wi) { return !!wi; }));
                    _this.grid.setDataSource(_this.workItems());
                    _this.reset(_this.workItems()[0].id);
                    _this.updateGridDataSource();
                    return _this.client.init(function (error) {
                        _this.sendError(error);
                    }).then(function () {
                        _this.client.requestStatus();
                        _this.connectionStatus(Status.Connecting);
                    }, function (reason) {
                        _this.errorHandler("Could not connect to backend for real time communication, please try again.", true, reason);
                    });
                }, function () {
                    if (window.confirm("No work items found, maybe the specified iteration does not contain work items. Do you want to delete this session?")) {
                        _this.endSession();
                    }
                    else {
                        Main.instance.navigate({ action: 'default' });
                    }
                });
            }, function () {
                _this.errorHandler("This session could not be found!");
            });
        };
        EstimationViewModel.prototype.reset = function (workItemId, force) {
            if (force === void 0) { force = false; }
            if (!force && this.currentWorkItem() && workItemId === this.currentWorkItem().id) {
                return;
            }
            var workItem = this._getWorkItem(workItemId);
            this.currentWorkItem(workItem);
            var webContext = VSS.getWebContext();
            this.currentWorkItemLink("" + webContext.collection.uri + webContext.project.name + "/_workitems#id=" + workItem.id + "&triage=true&_a=edit");
            for (var _i = 0, _a = this.estimates(); _i < _a.length; _i++) {
                var estimate = _a[_i];
                estimate.value = null;
                refresh(this.estimates, estimate);
            }
            this.isRevealed(false);
            this.commitValue(null);
            this.selectedCard(null);
            this.updateGridSelection();
        };
        EstimationViewModel.prototype.updateGridSelection = function () {
            var _this = this;
            var idx = this.workItems.indexOf(this.workItems().filter(function (x) { return x.id === _this.currentWorkItem().id; })[0]);
            this.grid.setSelectedDataIndex(idx);
            this.grid.getSelectedRowIntoView(true);
        };
        EstimationViewModel.prototype.onStatus = function (member, workItemId, estimate, isRevealed) {
            if (member.tfid === this.userId) {
                return;
            }
            if (this.connectionStatus() === Status.Connecting) {
                this.connectionStatus(Status.Connected);
                this.reset(workItemId);
            }
            var existingEstimate = this.estimates().filter(function (x) { return x.tfid === member.tfid; });
            if (existingEstimate.length > 0) {
                existingEstimate[0].value = estimate;
                refresh(this.estimates, existingEstimate[0]);
            }
            else {
                this.estimates.push({
                    tfid: member.tfid,
                    name: member.name,
                    value: estimate
                });
            }
            this.isRevealed(isRevealed);
        };
        EstimationViewModel.prototype.onStatusRequested = function (member) {
            var myId = VSS.getWebContext().user.id;
            if (member.tfid === myId) {
                return;
            }
            var existingEstimate = this.estimates().filter(function (x) { return x.tfid === member.tfid; });
            if (existingEstimate.length === 0) {
                this.estimates.push({
                    tfid: member.tfid,
                    name: member.name,
                    value: null
                });
            }
            else {
                existingEstimate[0].value = null;
                refresh(this.estimates, existingEstimate[0]);
            }
            this.client.sendStatus(this.currentWorkItem().id, this.selectedCard(), this.isRevealed());
        };
        EstimationViewModel.prototype.onLeft = function (member) {
            var existingEstimate = this.estimates().filter(function (x) { return x.tfid === member.tfid; });
            if (existingEstimate.length > 0) {
                var idx = this.estimates.indexOf(existingEstimate[0]);
                this.estimates.splice(idx, 1);
            }
        };
        EstimationViewModel.prototype.onEnd = function (identifier) {
            if (this.session.id === identifier) {
                Main.instance.navigate({ action: 'default' });
            }
        };
        EstimationViewModel.prototype.onCommit = function (member, workItemId, commitValue) {
            var matches = this.workItems().filter(function (x) { return x.id === workItemId; });
            if (matches && matches.length > 0) {
                matches[0].estimate = commitValue;
                refresh(this.workItems, matches[0]);
                this.updateGridDataSource();
            }
        };
        EstimationViewModel.prototype.onReveal = function (member, workItemId) {
            if (workItemId !== this.currentWorkItem().id) {
                return;
            }
            this.isRevealed(true);
            this.updateAverage();
        };
        EstimationViewModel.prototype.onChangeWorkItem = function (member, workItemId) {
            this.reset(workItemId, true);
        };
        EstimationViewModel.prototype.updateGridDataSource = function () {
            this.grid.setDataSource(this.workItems());
            this.updateGridSelection();
        };
        EstimationViewModel.prototype._getWorkItem = function (id) {
            return this.workItems().filter(function (x) { return x.id === id; })[0];
        };
        EstimationViewModel.prototype.updateAverage = function () {
            $('.average .card.back span').text(this.average());
        };
        EstimationViewModel.prototype.errorHandler = function (message, navigateToStart, reason) {
            if (navigateToStart === void 0) { navigateToStart = true; }
            if (reason === void 0) { reason = null; }
            this.connectionStatus(Status.Error);
            alert(message);
            this.sendError(message, reason);
            if (navigateToStart) {
                Main.instance.navigate({ action: 'default' });
            }
        };
        EstimationViewModel.prototype.sendError = function (message, reason) {
            if (reason === void 0) { reason = null; }
            var data = {};
            if (this.session) {
                $.extend(data, {
                    effortField: this.session.effortField && this.session.effortField.refName || "",
                    numberOfWorkItems: (this.session.workItemIds || []).length
                });
            }
            if (!!reason) {
                if (reason.message) {
                    $.extend(data, {
                        reason: reason.message
                    });
                }
                else {
                    $.extend(data, {
                        reason: JSON.stringify(reason)
                    });
                }
            }
            appInsights.trackEvent("Estimation error: '" + message + "'", data);
        };
        EstimationViewModel.PRECISION = 1;
        return EstimationViewModel;
    })();
    function refresh(array, item) {
        var index = array.indexOf(item);
        if (index >= 0) {
            array.splice(index, 1);
            array.splice(index, 0, item);
        }
    }
    function parseCard(card) {
        var lookup = {
            "½": 0.5
        };
        var parsed = parseInt(card, 10);
        return lookup[card] || (isNaN(parsed) ? null : parsed);
    }
    ko.components.register("estimation", {
        viewModel: EstimationViewModel,
        template: { fromJS: "estimation.tpl" },
    });
});
