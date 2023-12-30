import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';

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

export const createTable = async (db: SQLiteDatabase, tableName: string) => {
  // create table if not exists
  let query: any
  if(tableName = "route") {
    query = `CREATE TABLE IF NOT EXISTS route(route_name text primary key, optimalApprovedLine text not null);`;
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

        isCreated = true
      },
      error => {
        console.error('Error creating table:', error);
        isCreated = false
      },
    );
  });

  return isCreated
};

export const retrieveData = (db: SQLiteDatabase, tableName :string): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          `SELECT * FROM ${tableName}`,
          [],
          (_, results) => {
            const len = results.rows.length;

            const jsonDataArray: any = [];

            for (let i = 0; i < len; i++) {
              const row = results.rows.item(i);
              const jsonData = JSON.parse(row.data);
              console.log('jsonData', jsonData);
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

export const executeSqlFromFile = async (db: any, filePath: any) => {
  try {
    const sqlStatements = await fetch(filePath).then((response) => response.text());
  //   RNFS.readFile(sqlFilePath, 'utf8')
  // .then((sqlFileContent: any) => {
  //   console.log(sqlFileContent);
  // })
  // .catch((error: any) => {
  //   console.error('Error reading the SQL file:', error);
  // });

    await executeSql(db, sqlStatements);
  } catch (error) {
    console.error('Error executing SQL from file:', error);
  }
};

const executeSql = (db: { transaction: (arg0: (tx: any) => void) => void; }, sql: any) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: { executeSql: (arg0: any, arg1: never[], arg2: (_: any, result: any) => void, arg3: (_: any, error: any) => void) => void; }) => {
      tx.executeSql(
        sql,
        [],
        (_: any, result: unknown) => resolve(result),
        (_: any, error: any) => reject(error)
      );
    });
  });
};
