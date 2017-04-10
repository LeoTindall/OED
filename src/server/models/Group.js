/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const database = require('./database');

const db = database.db;
const sqlFile = database.sqlFile;

class Group {

	/**
	 * @param id should be undefined when creating a new group
	 * @param name group's name
	 */
	constructor(id, name) {
		this.id = id;
		this.name = name;
	}

	/**
	 * Returns a promise to create all the groups tables.
	 * @returns {Promise<>}
	 */
	static createTables() {
		return db.none(sqlFile('group/create_groups_tables.sql'));
	}

	/**
	 * Returns a promise to insert this group into the db
	 * @param conn the connection to be used, defaults to the default database connection.
	 * @return {Promise.<void>}
	 */
	async insert(conn = db) {
		const group = this;
		if (group.id !== undefined) {
			throw new Error('Attempt to insert a group that already has an ID');
		}
		await conn.none(sqlFile('group/insert_new_group.sql'), group);
	}

	/**
	 * Creates a new group based on the data in a row
	 * @param row the row from which a group is to be created
	 * @returns {Group}
	 */
	static mapRow(row) {
		return new Group(row.id, row.name);
	}

	/**
	 * Returns a promise to retrieve the meter with the given name.
	 * @param name the groups name
	 * @param conn the connection to be used, defaults to the default database connection.
	 * @returns {Promise.<Group>}
	 */
	static async getByName(name, conn = db) {
		const row = await conn.one(sqlFile('group/get_group_by_name.sql'), { name: name });
		return Group.mapRow(row);
	}

	/**
	 * Returns a promise to retrieve the group with the given id.
	 * @param id the id of the group
	 * @param conn the connection to be used, defaults to the default database connection.
	 * @returns {Promise.<*>}
	 */
	static async getByID(id, conn = db) {
		const row = await conn.one(sqlFile('group/get_group_by_id.sql'), { id: id });
		return Group.mapRow(row);
	}

	/**
	 * returns a promise to retrieve all groups in the database
	 * @param conn the connection to be used, defaults to the default database connection.
	 * @returns {Promise.<void>}
	 */
	static async getAll(conn = db) {
		const rows = await conn.any(sqlFile('group/get_all_groups.sql'));
		return rows.map(Group.mapRow);
	}

	/**
	 * Returns a promise to retrieve the IDs of all meters that are immediate children of the group with the given id.
	 * @param id The id of the group whose meters you are desirous of seeing.
	 * @param conn the connection to be used, defaults to the default database connection.
	 * @returns {Promise.<*>}
	 */
	static async getImmediateMetersByGroupID(id, conn = db) {
		const rows = await conn.any(sqlFile('group/get_immediate_meters_by_group_id.sql'), { id: id });
		return rows.map(row => row.id);
	}

	/**
	 * Returns a promise to retrieve the IDs of all the child groups of the group whose id is given.
	 * @param id the id of the group whose children are to be retrieved
	 * @param conn the connection to be used, defaults to the default database connection.
	 * @returns {Promise.<*>}
	 */
	static async getImmediateGroupsByGroupID(id, conn = db) {
		const rows = await conn.any(sqlFile('group/get_immediate_groups_by_group_id.sql'), { id: id });
		return rows.map(row => row.id);
	}

	/**
	 * Returns a promise to associate this group with a child group
	 * @param childID ID of the meter to be the child
	 * @param conn the connection to be used, defaults to the default database connection.
	 * @return {Promise.<void>}
	 */
	async associateWithChildGroup(childID, conn = db) {
		// Confirm that such a group exists
		const child = await Group.getByID(childID, conn);
		await conn.none(sqlFile('group/associate_child_group_with_parent_group.sql'), { parent_id: this.id, child_id: child.id });
	}

}
module.exports = Group;