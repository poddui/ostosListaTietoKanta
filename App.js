import { FlatList, StyleSheet, Text, View} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Header, Input} from "@rneui/base";
import {
  ListItem,
  Icon,
  Button,
  lightColors
  } from '@rneui/themed';

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
      <Header
      barStyle="default"
      centerComponent={{
        text: "OSTOSLISTA",
        style: { color: "#fff" }
      }}
      containerStyle={{ width: 'auto' }}
      placement="center"
    />
        <Input
          label="Enter product"
          placeholder='Product'
          onChangeText={(product) => setProduct(product)}
          value={product}  
        />
        <Input
          label="Enter Amount"
          placeholder='Amount'
          onChangeText={(amount) => setAmount(amount)}
          value={amount}
        />
      <Button 
        radius={"sm"} 
        type="solid" 
        onPress={saveItem}
        buttonStyle={{ width: 150 }}>
        Save
        <Icon name="save" color="white" />
      </Button>   
      <FlatList
        ListHeaderComponent={
          <View style={styles.list}>
            {shopList.map((item, i) => (
              <ListItem key={i} bottomDivider containerStyle={{ width: '100%' }}>
                <ListItem.Content >
                  <ListItem.Title style={{ color: 'black' }}>
                    {item.product}
                  </ListItem.Title>
                  <ListItem.Subtitle style={{ color: 'grey' }}>
                    {item.amount}
                  </ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Content right>
                  <Icon
                    name="delete"
                    type="material"
                    color="red"
                    onPress={() => deleteItem(item.id)} 
                  />
                </ListItem.Content>
              </ListItem>
            ))}
          </View>
        }
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
  list: {
    width: 400,
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: lightColors.greyOutline,
  },
 });
