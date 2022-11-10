import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Button,
} from "react-native";
import { collection, addDoc, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';

import ChatItem from './ChatItem';

const customChatData = [
    {
        "name" : "Plato",
        "profileImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Plato_Silanion_Musei_Capitolini_MC1377.jpg/330px-Plato_Silanion_Musei_Capitolini_MC1377.jpg",
        "userId": 1
    },

    {
        "name": "Aristotle",
        "profileImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Aristotle_Altemps_Inv8575.jpg/330px-Aristotle_Altemps_Inv8575.jpg",
        "userId": 2
    },
    
    {
        "name": "Nietzsche",
        "profileImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Nietzsche187a.jpg/330px-Nietzsche187a.jpg",
        "userId": 3
    }
];


const Chats = () => {
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState(false);
    const [refresh, setrefresh] = useState(false);
    const [users, setusers] = useState([]);
    // user and its friends: a table 
    // use firestore to get all these info
    // const userId = useSelector((state)=> state.auth.userId);
    // const Users = useSelector((state) => state.users.users.filter((user)=> user.userId != userId));
    // const dispatch = useDispatch();
    
    // function to load the user's past chatted users
    const loadUsers = (() => {
        setrefresh(true);
        seterror(null);
        try {
            // TODO: firestore fetch users
            // console.log("fetch users");
            setusers(customChatData);
        } catch (err) {
            console.log(err);
        }
        setrefresh(false);
    });

    useEffect(() => {
        setloading(false);
        loadUsers();
        setrefresh(false);
    });

    if (loading) {
        console.log("loading");
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
            name={item.name}
            image={item.profileImageUrl}
            userId={item.userId} />
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
        flex: 1, 
        padding: 10
    }
});