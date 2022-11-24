import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Button,
} from "react-native";

import ChatItem from './ChatItem';
import Backend from "../Backend";

const backendInstance = new Backend();

const Chats = () => {
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState(false);
    const [refresh, setrefresh] = useState(false);
    const [users, setusers] = useState([]);
    const loadUsers = (async () => {
        setrefresh(true);
        seterror(null);
        try {
            console.log("querying for users");
            let userObjs = await backendInstance.listUserswithChats();
            setusers(userObjs);
            // console.log(userObjs);
        } catch (err) {
            console.log(err);
        }
        setrefresh(false);
    });

    useEffect(() => {
        setloading(false);
        loadUsers().catch(console.error);
        setrefresh(false);
    }, []);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#075E54"/>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>An error Occurred</Text>
                <Button title="Try Again" onPress={loadUsers} color="#075E54"/>
            </View>
        );
    }

    // handle when user length is zero
    // if (!loading && Users.length == 0)
    const Item = ({name}) => (
        <View>
            <Text>{name}</Text>
        </View>
    );

    const renderItem = ({item}) => (
        <ChatItem
            name={item.username}
            userId={item.uid} />
    );

    return (
        <View style={styles.chatList}>
            <FlatList 
                onRefresh={loadUsers} 
                refreshing={refresh}
                data={users}
                renderItem={renderItem} 
            />
        </View>
    );
};


export default Chats;

const styles = StyleSheet.create({
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    chatList: {
        paddingTop: 50,
        flex: 1, 
        padding: 10
    }
});