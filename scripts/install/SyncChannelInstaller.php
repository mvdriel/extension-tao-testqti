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
 * Copyright (c) 2017 (original work) Open Assessment Technologies SA;
 *
 */

namespace oat\taoQtiTest\scripts\install;

use oat\oatbox\extension\InstallAction;
use oat\taoQtiTest\models\runner\communicator\CommunicationService;
use oat\taoQtiTest\models\runner\communicator\QtiCommunicationService;
use oat\taoQtiTest\models\runner\communicator\SyncChannel;

/**
 * Class SyncChannelInstaller
 *
 * Tool to setup a sync channel for taoQtiTest extension.
 * QtiCommunicationService is set to QtiCommunicationService class to be able to manage channel
 *
 * @package oat\taoQtiTest\scripts\install
 */
class SyncChannelInstaller extends InstallAction
{
    /**
     * Attach channels to Qti Communication Service
     *
     * @param $params
     */
    public function __invoke($params)
    {
        if ($this->getServiceLocator()->has(QtiCommunicationService::SERVICE_ID)) {
            $service = $this->getServiceLocator()->get(QtiCommunicationService::SERVICE_ID);
            if (!$service instanceof CommunicationService) {
                $service = new QtiCommunicationService($service->getOptions());
            }
        } else {
            $service = new QtiCommunicationService();
        }

        $service->attachChannel(new SyncChannel(), QtiCommunicationService::CHANNEL_TYPE_INPUT);
        $this->registerService(QtiCommunicationService::SERVICE_ID, $service);
    }
}