/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * The type of options displayed in Select components.
 */
export interface SelectOption {
	label: string;
	value: number;
}

/**
 * An item with a name and ID number.
 */
export interface NamedIDItem {
	id: number;
	name: string;
}

/**
 * A collection of items giving a label to an item in a dataset, by index
 */
export interface TooltipItems {
	datasetIndex: number;
	yLabel: string;
	[i: number]: {
		xLabel: string;
	};
}