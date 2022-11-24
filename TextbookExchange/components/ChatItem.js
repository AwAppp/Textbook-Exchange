import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"; // styling not right
import Backend from "../Backend";

const backendInstace = new Backend();

const ChatItem = ({ name, userId}) => {
    const navigation = useNavigation();
    const [image, setImage] = useState(null);
    const [lastmsg, setLastMsg] = useState(null);
    
    useEffect(() => {
        backendInstace.getUserIcon(userId).then((data) => {
            setImage(data.uri);
        });
        backendInstace.getLatestMessage(userId).then((data) => {
            console.log(data);
            setLastMsg(data.text);
        }).catch(error => console.log(error));
    })
    
    return (
        <TouchableOpacity
        style={styles.ChatItem}
        onPress={() => {
            navigation.replace("Chat", {
            userId: userId,
            name: name,
            image: image,
            }, navigation);
        }}
        >
        <View style={styles.container}>
            <Image
            style={styles.image}
            source={{
                uri: image,
            }}
            />
            <View style={styles.detailscontainer}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.lastmsg}>{lastmsg}</Text>
            </View>
        </View>
        {/* <Text style={styles.msgsent}>{msgsent}</Text> */}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    ChatItem: {
        marginHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 200,
    },
    container: {
        marginVertical: 10,
        flexDirection: "row",
    },
    detailscontainer: {
        flexDirection: "column",
        marginHorizontal: 10,
    },
    title: {
        fontFamily: "Cochin",
        fontSize: 20,
    },
    lastmsg: {
        color: "#808080",
        fontSize: 15,
    },
    msgsent: {
        color: "#808080",
        fontSize: 10,
        marginBottom: 10,
    },
});

export default ChatItem;