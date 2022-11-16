import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Button,
} from "react-native";
import { auth, db } from '../firebase';
import { collection, addDoc, getDocs, query, where, orderBy, onSnapshot } from 'firebase/firestore';

import ChatItem from './ChatItem';

const Chats = () => {
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState(false);
    const [refresh, setrefresh] = useState(false);
    const [users, setusers] = useState([]);
    // user and its friends: a table 
    // use firestore to get all these info
    // function to load the user's past chatted users
    const curr_user = auth?.currentUser?.email;
    const messageDB = collection(db, "messages");
    const userDB = collection(db, "users");
    const loadUsers = (async () => {
        setrefresh(true);
        seterror(null);
        try {
            console.log("querying for users");
            // find all the users that the current user chatted with before.
            const q_msgs_rec = query(messageDB, where("receiver", "==", curr_user));
            const q_msgs_sed = query(messageDB, where("sender", "==", curr_user));
            const msg_rec_snapshot = await getDocs(q_msgs_rec);
            const msg_sed_snapshot = await getDocs(q_msgs_sed);
            var userLsts = [];
            msg_rec_snapshot.forEach((doc) => {
                let sender = doc.data().sender;
                let receiver = doc.data().receiver;
                if (sender !=  curr_user && ! userLsts.includes(sender)) { userLsts.push(sender);}
                if (receiver !=  curr_user && ! userLsts.includes(receiver)) {userLsts.push(receiver);}
            })
            msg_sed_snapshot.forEach((doc) => {
                let sender = doc.data().sender;
                let receiver = doc.data().receiver;
                if (sender !=  curr_user && ! userLsts.includes(sender)) { userLsts.push(sender);}
                if (receiver !=  curr_user && ! userLsts.includes(receiver)) {userLsts.push(receiver);}
            })
            
            // get the users from the user db
            var userObjs = []
            const userSnapshots = await getDocs(userDB);
            userSnapshots.forEach((doc) => {
                if (userLsts.includes(doc.data().userId)) {
                    userObjs.push(doc.data());
                }
            })
            setusers(userObjs);

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