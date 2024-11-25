import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from "react-native-sqlite-storage";
enablePromise(true);
export const getDBConnection = async () => {
  return openDatabase({ name: "paws_digital.db", location: "default" });
};
const _tableName = "offlineDataTable";
export type OfflineObject = {
  _id: number;
  url: string;
  request_body: string;
  act_count: number;
  act_id: number;
  sync_status: string;
  user_id: number;
};
/**
 *
 * @param db Offline DB
 */
export const createRecodTable = async (db: SQLiteDatabase) => {

  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${_tableName}(
_id INTEGER PRIMARY KEY AUTOINCREMENT,
url TEXT NOT NULL,
request_body TEXT,
act_count INTEGER,
act_id INTEGER,
sync_status BLOB DEFAULT (0),
user_id TEXT,
createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`;
  let reulst = await db.executeSql(query);

};
/**
 *
 * @param db Offline DB
 * @param offlineRecord  list of offlineRecords
 * @param user_id login user_id
 * @returns
 */
export const saveRequestObject = async (
  db: SQLiteDatabase,
  i: OfflineObject
) => {
  try {
    const insertQuery =
      `INSERT OR IGNORE INTO  ${_tableName}(url, request_body, act_count, act_id,sync_status,user_id) values` +
      `('${i.url}','${i.request_body}',${i.act_count} ,${i.act_id},'${i.sync_status}',${i.user_id} )`;

    return db.executeSql(insertQuery);
  } catch (e) {
    console.error(e);
  }
};

/**
 *
 * @param db Offline DB
 * @param user_id login user_id
 * @returns Resultset
 */
export const deleteRecordByUserId = async (
  db: SQLiteDatabase,
  user_id: number
) => {
  const deleteQuery = `DELETE from ${_tableName} where user_id = ${user_id}`;
  var result = await db.executeSql(deleteQuery);
  return result;
};

export const deleteRecordByRecordId = async (
  db: SQLiteDatabase,
  recordId: number
) => {
  const deleteQuery = `DELETE from ${_tableName} where _id= ${recordId}`;
  var result = await db.executeSql(deleteQuery);
  return result;
};
/**
 *
 * @param db Offline DB
 * @param user_id Login user id
 * @param sync_status Recoded status
 * @returns
 */
export const getAllItems = async (
  db: SQLiteDatabase,
  user_id: string,
  sync_status: string
): Promise<OfflineObject[]> => {
  const notifyItems: OfflineObject[] = [];
  try {
    let qry = `SELECT * FROM ${_tableName} WHERE user_id=${user_id} AND sync_status='${sync_status}' ORDER BY _id DESC`;

    const results = await db.executeSql(qry);

    results.forEach((result) => {
      for (let index = 0; index < result.rows.length; index++) {
        notifyItems.push(result.rows.item(index));
      }
    });
    return notifyItems;
  } catch (error) {
    return notifyItems;
  }
};
