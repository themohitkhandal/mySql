import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';
import {ToDoItem} from '../models/index';

const tableName = 'jsonData';

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase(
    {name: 'local', location: 'default'},
    () => {},
    error => {
      console.log(error);
    },
  );
};

export const createTable = async (db: SQLiteDatabase) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS  ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT)`;

  // await db.executeSql(query);

  await db.transaction(tx => {
    tx.executeSql(
      query,
      [],
      (tx, results) => {
        console.log('Table created successfully', results);
      },
      error => {
        console.error('Error creating table:', error);
      },
    );
  });
};

export const retrieveData = (db: SQLiteDatabase): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          `SELECT * FROM ${tableName}`,
          [],
          (_, results) => {
            const len = results.rows.length;

            const jsonDataArray = [];

            for (let i = 0; i < len; i++) {
              const row = results.rows.item(i);
              const jsonData = JSON.parse(row.data);
              console.log("jsonData",jsonData)
              jsonDataArray.push(jsonData);
            }

            // if (len > 0) {
            //   const name = results.rows.item(0).data;
            //   console.log('Retrieved JSON data:', name);
            // }
              resolve(jsonDataArray);
          },
          error => {
            console.error('Error retrieving data:', error);
            reject(error);
          },
        );
      },
      error => {
        console.error('Error opening transaction:', error);
        reject(error);
      },
    );
  });
};

export const insertData = async (db: SQLiteDatabase, data: any) => {
  await db.transaction(async tx => {
    tx.executeSql(
      `INSERT INTO ${tableName} (data) VALUES (?)`,
      [data],
      () => {
        console.log('Data inserted successfully');
      },
      error => {
        console.error('Error inserting data:', error);
      },
    );
  });
};

export const deleteItem = async (db: SQLiteDatabase) => {
  const deleteQuery = `DELETE FROM ${tableName}`;
  await db.executeSql(deleteQuery);
};

export const deleteTable = async (db: SQLiteDatabase) => {
  const query = `TRUNCATE TABLE ${tableName}`;
  await db.transaction(async tx => {
    tx.executeSql(
      query,
      [],
      () => {
        console.log('Data deleted successfully');
      },
      error => {
        console.error('Error deleting data:', error);
      },
    );
  });
};
