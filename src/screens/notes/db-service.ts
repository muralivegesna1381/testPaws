import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';
import { ToDoItem } from './models';

const tableName = 'todoData';

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({ name: 'todo-data.db', location: 'default' });
};

export const createTable = async (db: SQLiteDatabase) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        value TEXT NOT NULL, 
        date TEXT,
        status TEXT,
        createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;
  await db.executeSql(query);
};

export const getTodoItems = async (db: SQLiteDatabase): Promise<ToDoItem[]> => {
  try {
    const todoItems: ToDoItem[] = [];
    const results = await db.executeSql(`SELECT * FROM ${tableName} ORDER BY createdOn DESC`);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        todoItems.push(result.rows.item(index))
      }
    });
    return todoItems;
  } catch (error) {
    throw Error('Failed to get todoItems !!!');
  }
};

export const saveTodoItems = async (db: SQLiteDatabase, todoItems: ToDoItem[]) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}(value, date, status) values` +
    //    todoItems.map(i => `(${i.id}, '${i.value}','${i.date}' )`).join(',');
    todoItems.map(i => `('${i.value}','${i.date}' ,'${i.status}' )`).join(',');

  return db.executeSql(insertQuery);
};

export const editTodoItems = async (db: SQLiteDatabase, todoItems: ToDoItem[]) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}(id, value, date, status) values` +
    todoItems.map(i => `(${i.id}, '${i.value}','${i.date}', '${i.status}' )`).join(',');
  // todoItems.map(i => `('${i.value}','${i.date}' ,'${i.status}' )`).join(',');

  return db.executeSql(insertQuery);
};

export const deleteTodoItem = async (db: SQLiteDatabase, id: number) => {
  const deleteQuery = `DELETE from ${tableName} where id = ${id}`;
  var result = await db.executeSql(deleteQuery);
  return result;
};

export const deleteTable = async (db: SQLiteDatabase) => {
  const query = `drop table ${tableName}`;

  await db.executeSql(query);
};