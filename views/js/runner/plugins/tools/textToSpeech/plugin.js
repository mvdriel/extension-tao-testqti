/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2017 (original work) Open Assessment Technologies SA ;
 */

define([
    'jquery',
    'lodash',
    'i18n',
    'taoTests/runner/plugin',
    'ui/hider',
    'ui/stacker',
    'taoQtiTest/runner/plugins/tools/textToSpeech/textToSpeech',
], function (
    $,
    _,
    __,
    pluginFactory,
    hider,
    stackerFactory,
    ttsFactory
) {
    'use strict';

    /**
     * Returns the configured plugin
     * @returns {Object}
     */
    return pluginFactory({

        /**
         * Plugin name
         * @type {String}
         */
        name: 'textToSpeech',

        /**
         * Initialize plugin
         * @returns {this}
         */
        init: function init() {
            var self = this;
            var testRunner = this.getTestRunner();

            this.ttsButton = this.getAreaBroker().getToolbox().createEntry({
                control: 'tts',
                icon: 'audio',
                text: __('Text to Speech'),
                title: __('Text to Speech')
            })
            .on('render', function () {
                var stacker = stackerFactory('test-runner');
                var testConfig = testRunner.getConfig();

                self.tts = ttsFactory({
                    tenantId: 'tenant-id', // TODO: set tenant id
                    deliveryId: testConfig.serviceCallId // TODO: verify delivery id will work
                })
                .render(self.ttsButton.getElement());

                stacker.autoBringToFront(self.tts.getElement());
            })
            .on('click', function (e) {
                // prevent action if the click is made inside the tts controls which is a sub part of the button
                if ($(e.target).closest(self.tts.getElement()).length) {
                    return;
                }

                hider.toggle(self.tts.getElement());
            });

            testRunner
            .on('loaditem', function () {
                self.ttsButton.show();
                self.ttsButton.disable();
            })
            .on('renderitem enabletools', function () {
                self.ttsButton.enable();
            })
            .on('disabletools unloaditem', function () {
                self.ttsButton.disable();
            });

            return this;
        }
    });
});
