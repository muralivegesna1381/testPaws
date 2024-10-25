import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from "react-native-sqlite-storage";
import { NotificationObject } from "./notification.home";

const _tableName = "notifications";

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({ name: "paws_digital.db", location: "default" });
};

export const createTable = async (db: SQLiteDatabase) => {

  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${_tableName}(
    _id INTEGER PRIMARY KEY AUTOINCREMENT,
notificationId INTEGER NOT NULL UNIQUE,
description TEXT,
notificationDate TEXT,
createdUser TEXT,
read_status BLOB DEFAULT (0),
user_id TEXT,
createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`;
 // console.log("query", query);
  let reulst = await db.executeSql(query);

};

export const getNotificationItems = async (
  db: SQLiteDatabase,
  user_id: string
): Promise<NotificationObject[]> => {
  const notifyItems: NotificationObject[] = [];
  try {
    const results = await db.executeSql(
      `SELECT * FROM ${_tableName} WHERE user_id=${user_id} ORDER BY _id DESC`
    );
    results.forEach((result) => {
      for (let index = 0; index < result.rows.length; index++) {
        notifyItems.push(result.rows.item(index));
      }
    });
    return notifyItems;
  } catch (error) {
    //console.log("Notificaion DB", error);
    return notifyItems;
  }
};

export const getNotificationReadStatus = async (
  db: SQLiteDatabase,
  notificationId: number
): Promise<NotificationObject[]> => {
  try {
    const notifyItems: NotificationObject[] = [];
    const results = await db.executeSql(
      `SELECT * FROM ${_tableName} WHERE _id=${notificationId}`
    );
    results.forEach((result) => {
      for (let index = 0; index < result.rows.length; index++) {
        notifyItems.push(result.rows.item(index));
      }
    });
   // console.log("NOTIFICy read", results.length);
    return notifyItems;
  } catch (error) {
    throw Error("Failed to get notifyItems !!!");
  }
};
export const saveNotifiyItemsList = async (
  db: SQLiteDatabase,
  notifyItems: NotificationObject[],
  user_id: string
) => {
  try {
    const insertQuery =
      `INSERT OR IGNORE INTO  ${_tableName}(notificationId, createdUser, description, notificationDate,user_id) values` +
      notifyItems
        .map(
          (i) =>
            `(${i.notificationId},'${i.createdUser}' ,'${i.description}' ,'${i.notificationDate}',${user_id} )`
        )
        .join(",");

    return db.executeSql(insertQuery);
  } catch (e) {
    console.error(e);
  }
};

export const saveNotifiyItem = async (
  db: SQLiteDatabase,
  i?: NotificationObject,
  user_id: string
) => {
  try {
    if (i) {
      const insertQuery =
        `INSERT OR IGNORE INTO  ${_tableName}(notificationId, createdUser, description, notificationDate,user_id) values` +
        `(${i?.notificationId},'${i?.createdUser}' ,'${i?.description}' ,'${i?.notificationDate}',${user_id} )`;

     // console.log("insertQuery", insertQuery);
      return db.executeSql(insertQuery);
    }
  } catch (e) {
    console.error(e);
  }
};

export const deleteNotifyItem = async (db: SQLiteDatabase, id: number) => {
  const deleteQuery = `DELETE from ${_tableName} where notificationId = ${id}`;
 // console.log("deleteQuery", deleteQuery);
  var result = await db.executeSql(deleteQuery);
  return result;
};
export const deleteAllNotificaion = async (
  db: SQLiteDatabase,
  user_id: string
) => {
  const deleteQuery = `DELETE from ${_tableName} where user_id = ${user_id}`;
  var result = await db.executeSql(deleteQuery);
  //console.log("deleteAllNotificaion", deleteQuery, result);
  return result;
};

export const deleteTableNotifications = async (db: SQLiteDatabase) => {
  const query = `drop table ${_tableName}`;

  await db.executeSql(query);
};
