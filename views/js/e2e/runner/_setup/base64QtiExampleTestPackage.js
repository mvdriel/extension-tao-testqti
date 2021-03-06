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
 * Copyright (c) 2019 (original work) Open Assessment Technologies SA ;
 */

 /**
 * QTI test package with one block interaction
 */
const base64Test = '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';

export default base64Test;