/*
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
 * Copyright (c) 2015 (original work) Open Assessment Technologies SA ;
 *
 */

/**
 * This module allows adding extra buttons in the action bar of the test runner
 * 
 */
define([
    'jquery',
    'lodash',
    'core/errorHandler',
    'tpl!taoQtiTest/testRunner/tpl/button'
], function($, _, errorHandler, buttonTpl){

    'use strict';

    var _ns = '.actionBarHook';

    /**
     * Check that the toolConfig is correct
     * 
     * @param {Object} toolconfig
     * @param {String} toolconfig.label - the label to be displayed in the button
     * @param {String} toolconfig.hook - the amd module to be loaded to initialize the button
     * @param {String} [toolconfig.icon] - the icon to be displayed in the button
     * @param {String} [toolconfig.title] - the title to be displayed in the button
     * @returns {unresolved}
     */
    function isValid(toolconfig){
        return _.isObject(toolconfig) && toolconfig.label && toolconfig.hook;
    }
    
    /**
     * Init a test runner button from its config
     * 
     * @param {String} id
     * @param {Object} toolconfig
     * @param {String} toolconfig.label - the label to be displayed in the button
     * @param {String} toolconfig.hook - the amd module to be loaded to initialize the button
     * @param {String} [toolconfig.icon] - the icon to be displayed in the button
     * @param {String} [toolconfig.title] - the title to be displayed in the button
     * @param {Object} assessmentTestContext - the complete state of the test
     * @fires ready.actionBarHook when the hook has been initialized
     * @returns {undefined}
     */
    function initQtiTool($toolsContainer, id, toolconfig, assessmentTestContext){

        if(isValid(toolconfig)){
            
            var tplData = {
                id : id,
                navigation : false,
                title : toolconfig.title || toolconfig.label,
                label : toolconfig.label,
                icon : toolconfig.icon || ''
            };
            var $button = $(buttonTpl(tplData));

            require([toolconfig.hook], function(hook){
                if(_.isObject(hook) && _.isFunction(hook.init) && _.isFunction(hook.clear)){

                    hook.init($button, toolconfig, assessmentTestContext);

                    //only attach the button to the dom when everything is ready
                    $toolsContainer.append($button);

                    //ready !
                    $button.trigger('ready' + _ns);
                }else{
                    errorHandler.throw(_ns, 'invalid hook format');
                }
            }, function(e){
                errorHandler.throw(_ns, 'the hook amd module cannot be found');
            });
            
        }else{
            errorHandler.throw(_ns, 'invalid tool config format');
        }

    }

    return {
        isValid : isValid,
        initQtiTool : initQtiTool
    };
});