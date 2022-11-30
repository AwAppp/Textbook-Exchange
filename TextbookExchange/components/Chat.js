import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';
import Backend from "../Backend";
import { GiftedChat } from 'react-native-gifted-chat';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const backendInstance = new Backend();

const ChatHeader = ({navigation, image}) => {
    return (
        <View style={styles.header}>
            <View style={{ marginLeft: 20 }}>
                <Avatar
                    rounded
                    source={{
                        uri: image,
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
    const {userId, name, image} = route.params;
    const sender = backendInstance.getCurrentUserId();
    const receiver = userId;
    const [messages, setMessages] = useState([]);

    // load the messages from backend
    const loadMessages = (async () => {
        const msg_Lsts = await backendInstance.listMessagesByUser(sender, receiver);
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
        const message = {_id, sender, receiver, createdAt,  text, user}
        try { backendInstance.addMessage(message);} catch(error) {console.log(error);}
    }, []);

    return (
        <View style={styles.container}>
        <ChatHeader navigation={navigation} image={image}/>
        <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={true}
            renderAvatar={null}
            onSend={messages => onSend(messages)}
            user={{
                _id: userId,
                name: name, 
                avatar: image
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