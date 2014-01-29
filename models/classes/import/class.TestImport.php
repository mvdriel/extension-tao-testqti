<?php
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
 * Copyright (c) 2013 (original work) Open Assessment Technologies SA (under the project TAO-PRODUCT);
 * 
 */

/**
 * Imprthandler for QTI packages
 *
 * @access public
 * @author Joel Bout, <joel@taotesting.com>
 * @package taoQTI
 * @subpackage models_classes_import
 */
class taoQtiTest_models_classes_import_TestImport implements tao_models_classes_import_ImportHandler
{

    /**
     * (non-PHPdoc)
     * @see tao_models_classes_import_ImportHandler::getLabel()
     */
    public function getLabel() {
    	return __('QTI Test Package');
    }
    
    /**
     * (non-PHPdoc)
     * @see tao_models_classes_import_ImportHandler::getForm()
     */
    public function getForm() {
    	$form = new taoQtiTest_models_classes_import_TestImportForm();
    	return $form->getForm();
    }

    /**
     * (non-PHPdoc)
     * @see tao_models_classes_import_ImportHandler::import()
     */
    public function import($class, $form) {
		
        try {
            $fileInfo = $form->getValue('source');
            
            if(isset($fileInfo['uploaded_file'])){
                	
                $uploadedFile = $fileInfo['uploaded_file'];
                	
                helpers_TimeOutHelper::setTimeOutLimit(helpers_TimeOutHelper::LONG);	//the zip extraction is a long process that can exced the 30s timeout
                 
                $test = taoTests_models_classes_TestsService::singleton()->createInstance($class);
                $qtiTestModelResource = new core_kernel_classes_Resource(INSTANCE_TEST_MODEL_QTI);
                $modelProperty = new core_kernel_classes_Property(PROPERTY_TEST_TESTMODEL);
                $test->setPropertyValue($modelProperty, $qtiTestModelResource);
                
                $itemClass = new core_kernel_classes_Class(TAO_ITEM_CLASS);
                $subClass = $itemClass->createSubClass($test->getLabel());
                $report = taoQtiTest_models_classes_QtiTestService::singleton()->importTest($test, $uploadedFile, $subClass);
            
                // The test is now successfuly imported.
                if ($report->containsError() === true) {
                    $report->setMessage(__('The IMS QTI Test Package could not be imported.'));
                    $report->setType(common_report_Report::TYPE_ERROR);
                }
                else {
                    $report->setMessage(__('The IMS QTI Test Package was successfuly imported.'));
                    $report->setType(common_report_Report::TYPE_SUCCESS);
                }
            
                helpers_TimeOutHelper::reset();
                tao_helpers_File::remove($uploadedFile);
            } else {
                throw new common_exception_Error('No source file for import');
            }
            return $report;
        }
        catch (Exception $e) {
            return common_report_Report::createFailure($e->getMessage());
        }
    }

}