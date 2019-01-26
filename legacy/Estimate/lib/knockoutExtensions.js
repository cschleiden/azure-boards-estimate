/// <reference path="../../../typings/tsd.d.ts" />
define(["require", "exports", "q"], function (require, exports, Q) {
    var MIN_DELAY_MS = 400;
    ko.bindingHandlers['spinClick'] = {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var allBindingsAccessor = allBindingsAccessor;
            var originalFunction = valueAccessor();
            var newValueAccesssor = function () {
                return function () {
                    var promise = originalFunction.apply(viewModel, arguments);
                    if (promise && Q.isPromise(promise)) {
                        var $spinElement = $(element);
                        if (!$spinElement.is('button')) {
                            $spinElement = $($spinElement).find('button');
                        }
                        $spinElement.addClass('spin-button');
                        if ($spinElement.find('.label').length === 0) {
                            $spinElement.contents().wrap('<span class="label"></span>');
                            $spinElement.append($('<span class="progress"></span>').append(getSpinner(16, 16, 'white')));
                        }
                        setTimeout(function () {
                            $spinElement.addClass('active').attr('disabled', 'disabled');
                        }, 0);
                        promise.delay(MIN_DELAY_MS).done(function () {
                            $spinElement.removeClass('active').removeAttr('disabled');
                        });
                    }
                };
            };
            ko.bindingHandlers.click.init(element, newValueAccesssor, allBindingsAccessor, viewModel, bindingContext);
        }
    };
    ko.components.loaders.unshift({
        loadTemplate: function (name, templateConfig, callback) {
            if (templateConfig.fromJS) {
                ko.components.defaultLoader.loadTemplate(name, templates[templateConfig.fromJS], callback);
            }
            else {
                callback(null);
            }
        }
    });
    var spinCount = 0;
    function getSpinner(width, height, color) {
        spinCount++;
        var $container = $('<span class="spin"></span>')
            .css({
            'display': 'inline-block',
            'width': width + 'px',
            'height': height + 'px',
            'position': 'relative'
        });
        $container.append($('<style type="text/css">@keyframes spin-' + spinCount + '{ 0% { background-color: transparent; } 100% { background-color: white } }</style>'));
        var speed = 0.8;
        var segmentCount = 12;
        for (var i = 0; i < segmentCount; ++i) {
            $container.append($('<span></span>')
                .css({
                'position': 'absolute',
                'background-color': 'white',
                'width': '6px',
                'height': '2px',
                'left': Math.sin(2 * Math.PI - Math.PI * 2 * (i / segmentCount)) * ((width) / 2) + 'px',
                'top': Math.cos(2 * Math.PI - Math.PI * 2 * (i / segmentCount)) * ((height) / 2) + 'px',
                'animation-name': 'spin-' + spinCount,
                'animation-duration': speed + 's',
                'animation-iteration-count': 'infinite',
                'animation-direction': 'normal',
                'animation-delay': (i * (speed / segmentCount)) + 's',
                'transform': 'rotate(' + (-90 + (360 / segmentCount) * i) + 'deg)'
            }));
        }
        return $container;
    }
});
