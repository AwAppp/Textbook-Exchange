import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import Backend from "../Backend";
import { GiftedChat } from 'react-native-gifted-chat';
import { Message } from '../models/message';

const backendInstance = new Backend();

// input: for each chat session, get the chatting user (target)
// the sender is the current authenticated user.
const Chat = ({route, navigation}) => {
    // console.log("Chat")
    // console.log(route)
    const {userId, name, image} = route.params;
    const receiver = userId;
    const currentUserInfo = backendInstance.getCurrentUserInfo();
    const sender_email = currentUserInfo["email"];
    const sender_avatar = currentUserInfo["avatar"];
    const receiver_name = name;
    // const navigation = useNavigation();
    const [messages, setMessages] = useState([]);

    // load the messages from backend
    const loadMessages = (async () => {
        const msg_Lsts = await backendInstance.listMessagesByUser(sender_email, receiver);
        setMessages(msg_Lsts);
    });

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <Avatar
                        rounded
                        source={{
                            uri: backendInstance.getCurrentUserInfo().avatar,
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
        const { _id, createdAt, text, user} = messages[0]
        // console.log(messages[0]);
        const message = {_id, sender_email, receiver, createdAt,  text, user}
        try { backendInstance.addMessage(message);} catch(error) {console.log(error);}
    }, []);

    return (
        <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={true}
            onSend={messages => onSend(messages)}
            user={{
                _id: sender_email,
                name: sender_email, // TODO: use a proper name rather than email name
                avatar: sender_avatar
            }}
        />
    );
}

export default Chat;