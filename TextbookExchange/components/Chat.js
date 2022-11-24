import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';
import Backend from "../Backend";
import { GiftedChat } from 'react-native-gifted-chat';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const backendInstance = new Backend();

const ChatHeader = ({navigation}) => {
    return (
        <View style={styles.header}>
            <View style={{ marginLeft: 20 }}>
                <Avatar
                    rounded
                    source={{
                        uri: backendInstance.getCurrentUserInfo().avatar,
                    }}
                />
            </View>
            <View>
            <TouchableOpacity 
                    style={{marginRight: 20}}
                    onPress={()=> {navigation.replace("Home")}}>
                    <Text>Back</Text>
                </TouchableOpacity>
            </View> 
        </View>
    )
};

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
        <View style={styles.container}>
        <ChatHeader navigation={navigation}/>
        <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={true}
            onSend={messages => onSend(messages)}
            user={{
                _id: sender_email,
                name: sender_email, // TODO: use a proper name rather than email name
                avatar: sender_avatar
            }}/>
        </View>
    );
}

export default Chat;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 50,
      marginBottom: 5,
    },

    header: {
        paddingTop: 10,
        paddingLeft: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    } 
});