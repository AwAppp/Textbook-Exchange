import React, { useCallback, useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, addDoc, doc, getDocs, query, where, orderBy, onSnapshot, setDoc } from 'firebase/firestore';
import { GiftedChat } from 'react-native-gifted-chat';
import Message from '../models/message';

// input: for each chat session, get the chatting user (target)
// the sender is the current authenticated user.
const Chat = ({route, navigation}) => {
    const {userId, name, image} = route.params;
    const receiver = userId;
    const receiver_name = name;
    const messageDB = collection(db, "messages")
    // const navigation = useNavigation();
    const [messages, setMessages] = useState([]);
    const signOutNow = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigation.replace('Login');
        }).catch((error) => {
            // An error happened.
        });
    }

    // load the messages from backend
    const loadMessages = (async () => {
        console.log("loading messages");
        const q_msgs = query(messageDB, where("sender", "==", auth?.currentUser?.email),
                                        where("receiver", "==", receiver));
        const msg_snapshot = await getDocs(q_msgs);
        var msg_Lsts = [];
        console.log(msg_snapshot);

        msg_snapshot.forEach(doc => {
            msg_Lsts.push(new Message(doc));
         });

         msg_Lsts.sort((a,b) => a.createdAt <= b.createdAt);
        setMessages(msg_Lsts);
    });

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <Avatar
                        rounded
                        source={{
                            uri: auth?.currentUser?.photoURL,
                        }}
                    />
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity 
                    style={{marginRight: 10}}
                    onPress={()=> {navigation.replace("Chats")}}>
                    <Text>Back</Text>
                </TouchableOpacity>
            )
        })
        loadMessages().catch(console.error);
    });

    const onSend = useCallback((messages = []) => {

        setMessages(previousMessages => 
            GiftedChat.append(previousMessages, messages)
        );
        const { id, createdAt, text, user} = messages[0]
        console.log(messages[0]);
        const sender = auth?.currentUser?.email;
        addDoc(collection(db, 'messages'), { id, sender, receiver, createdAt,  text, user});
    }, []);

    return (
        <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={true}
            onSend={messages => onSend(messages)}
            user={{
                _id: auth?.currentUser?.email,
                name: auth?.currentUser?.displayName,
                avatar: auth?.currentUser?.photoURL
            }}
        />
    );
}

export default Chat;