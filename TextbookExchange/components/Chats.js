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
    const [refresh, setrefresh] = useState(false);
    const [users, setusers] = useState([]);
    const loadUsers = (async () => {
        setrefresh(true);
        try {
            console.log("querying for users");
            let userObjs = await backendInstance.listUserswithChats();
            setusers(userObjs);
            console.log(userObjs);
            setrefresh(false);
        } catch (err) {
            console.log(err);
        }
    });

    useEffect(() => {
        setloading(true);
        loadUsers().catch(console.error);
        setloading(false);
        console.log(loading);
    }, []);

    const renderItem = ({item}) => (
        <ChatItem
            name={item.username}
            userId={item.uid} />
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#075E54"/>
            </View>
        );
    } else {
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
    }
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