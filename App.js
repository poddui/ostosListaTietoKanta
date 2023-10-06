import { Button, FlatList, StyleSheet, Text, TextInput, View} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';

const db = SQLite.openDatabase('coursedb.db');

export default function App() {

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [shopList, setShopList] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
    tx.executeSql('create table if not exists shopList (id integer primary key not null, product text , amount text);');
    }, () => console.error("Error when creating DB"), updateList);
    }, []);

  const saveItem = () => {
    db.transaction(tx => {
    tx.executeSql('insert into shopList (product, amount) values (?, ?);',
    [product, amount]);
    }, null, updateList)
  }

  const updateList = () => {
    db.transaction(tx => {
    tx.executeSql('select * from shopList;', [], (_, { rows }) =>
    setShopList(rows._array));
    }, null, null);
  }

  const deleteItem = (id) => {
    db.transaction(
      tx => tx.executeSql('delete from shopList where id = ?;', [id]),
      null, 
      updateList
    )
  };    

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };
    
    
  return (
    <View style={styles.container}>
      <TextInput placeholder='Product' style={{marginTop: 30, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(product) => setProduct(product)}
        value={product}/>  
      <TextInput placeholder='Amount' style={{ marginTop: 5, marginBottom: 5,  fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(amount) => setAmount(amount)}
        value={amount}/>      
      <Button onPress={saveItem} title="Save" /> 
      <Text style={{marginTop: 30, fontSize: 20}}>Shopping List</Text>
      <FlatList
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) =>
        <View style={styles.listcontainer}>
        <Text>{item.product},  {item.amount} </Text>
        <Text style={{color: '#0000ff'}} onPress={() => deleteItem(item.id)}>bought</Text>
        </View>}
        data={shopList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   backgroundColor: '#fff',
   alignItems: 'center',
   justifyContent: 'center',
  },
  listcontainer: {
   flexDirection: 'row',
   backgroundColor: '#fff',
   alignItems: 'center'
  },
 });
