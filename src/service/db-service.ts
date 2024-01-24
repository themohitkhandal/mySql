import {readFile} from 'react-native-fs';
import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';

const tableName = 'jsonData';

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase(
    {name: 'dmrc.db', createFromLocation: '~www/dmrc.db'},
    res => {
      console.log('Success opening DB!');
    },
    error => {
      console.log('Error while opening DB: ', error);
    },
  );
};

export const createTable = async (db: SQLiteDatabase, tableName: string) => {
  // create table if not exists
  let query: any;
  if (tableName == 'route') {
    query = `CREATE TABLE IF NOT EXISTS route(route_name text primary key, optimalApprovedLine text not null);`;
  } else if (tableName == 'tbl_user') {
    query = `CREATE TABLE IF NOT EXISTS tbl_user (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_name TEXT,
      user_contact TEXT,
      user_address TEXT
    );`;
  } else {
    query = `CREATE TABLE IF NOT EXISTS  ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT)`;
  }

  // await db.executeSql(query);

  var isCreated: boolean = false;

  await db.transaction(tx => {
    tx.executeSql(
      query,
      [],
      (tx, results) => {
        console.log('Table created successfully', results);

        isCreated = true;
      },
      error => {
        console.error('Error creating table:', error);
        isCreated = false;
      },
    );
  });

  return isCreated;
};

export const retrieveData = (
  db: SQLiteDatabase,
  tableName: string,
): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction(
        tx => {
          tx.executeSql(
            `SELECT * FROM ${tableName} LIMIT 1`,
            [],
            function (tx, res) {
              // Modify this accordingly
              const len = res.rows.length;
              let data;
              for (let i = 0; i < len; i++) {
                const row = res.rows.item(i);
                console.log('row', row.route_name);
                data = `RouteName: ${row.route_name}, Optimal: ${row.optimalApprovedLine}`;
                console.log(
                  `RouteName: ${row.route_name}, Optimal: ${row.optimalApprovedLine}`,
                );
              }
              resolve(data);
              console.log('item:', data);
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
    } catch (error) {
      console.error('Error in retrieve data');
    }
  });
};

export const insertData = async (
  db: SQLiteDatabase,
  data: any,
  tableName: string,
) => {
  await db.transaction(async tx => {
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(', ');

    tx.executeSql(
      `INSERT INTO ${tableName} (${Object.keys(data).join(
        ', ',
      )}) VALUES (${placeholders})`,
      values,
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

export const executeSqlFromFile = async (db: any) => {
  try {
    const sqlScript = await readFile('../assets/test.txt', 'utf8');
    console.log(sqlScript);

    db.transaction(
      (tx: {
        executeSql: (
          arg0: string,
          arg1: never[],
          arg2: () => void,
          arg3: (error: any) => void,
        ) => void;
      }) => {
        tx.executeSql(
          sqlScript,
          [],
          () => {
            console.log('Data inserted successfully from file');
          },
          (error: any) => {
            console.error('Error executing script:', error);
          },
        );
      },
    );
  } catch (error) {
    console.error('Error reading SQL script file:', error);
  }
};

const executeSql = (
  db: {transaction: (arg0: (tx: any) => void) => void},
  sql: any,
) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx: {
        executeSql: (
          arg0: any,
          arg1: never[],
          arg2: (_: any, result: any) => void,
          arg3: (_: any, error: any) => void,
        ) => void;
      }) => {
        tx.executeSql(
          sql,
          [],
          (_: any, result: unknown) => resolve(result),
          (_: any, error: any) => reject(error),
        );
      },
    );
  });
};
