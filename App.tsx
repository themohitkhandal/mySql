/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import {
  getDBConnection,
  retrieveData,
  deleteItem,
} from './src/service/db-service';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [text, onChangeText] = React.useState('');
  const [data, setData] = React.useState([]);
  const [number, onChangeNumber] = React.useState('');

  const saveData = async () => {
    try {
      const db = await getDBConnection();

      const dataToInsert = {
        user_name: 'John Doe',
        user_contact: '123-456-7890',
        user_address: '123 Main St',
      };

      // await createTable(db, 'tbl_user')

      // await insertData(db, dataToInsert, 'tbl_user');

      // Convert JSON object to string
      // const sqlFilePath = 'src/components/populateDb.sql';

      // executeSqlFromFile(db, sqlFilePath)
      //   .then(() => {
      //     console.log('SQL commands executed successfully');
      //   })
      //   .catch(err => {
      //     console.error(err);
      //   });

      return () => {
        db.close();
      };
    } catch (error) {
      console.error('Error inserting data');
    }
  };

  const getData = async () => {
    try {
      const db = await getDBConnection();
      const data = await retrieveData(db, 'route');
      console.log('Retrieved Data: ', data);
      setData(data);
    } catch (error) {
      console.error('Error in getData', error);
    }
  };

  const deleteData = async () => {
    const db = await getDBConnection();
    await deleteItem(db);
    setData('');
  };

  // const saveFromFile = async () => {
  //   const db = await getDBConnection();
  //   executeSqlFromFile(db)
  // }

  // useEffect(() => {
  //   saveFromFile()
  // }, [])

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <Text style={{fontSize: 20}}>Enter Data: </Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
        />
        <Button
          onPress={saveData}
          title="Save Data"
          color="#841584"
          accessibilityLabel="save json data"
        />
        <Button
          onPress={getData}
          title="Get Data"
          color="#841584"
          accessibilityLabel="save json data"
        />
        <Button
          onPress={deleteData}
          title="Delete Data"
          color="#841584"
          accessibilityLabel="save json data"
        />
        {data && (
          <View>
            <Text>Retrieved Data: {JSON.stringify(data)}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  appTitleView: {
    marginTop: 20,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  appTitleText: {
    fontSize: 24,
    fontWeight: '800',
  },
  textInputContainer: {
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'flex-end',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    height: 30,
    margin: 10,
    backgroundColor: 'pink',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
export default App;
