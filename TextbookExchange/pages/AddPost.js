import { ScrollView, TextInput, Alert, StyleSheet, Text, View, Pressable} from 'react-native';
import React, { Component } from "react";

const MultilineTextInput = (props) => {
    return (
      <TextInput
        {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
        editable
        maxLength={400}
      />
    );
  }

const AddPost = () => {
    const [post, setPostData] = React.useState({name:"", price: 0, isbn: 0, description:""});
    const [text, setText] = React.useState("");

    return (
        <ScrollView>
            <TextInput clearButtonMode="always"
                style={styles.input}
                onChangeText={(text) => setPostData({...post, name: text })}
                value={post.name}
                placeholder="Textbook Name"
                keyboardType="text"
            />
            <TextInput clearButtonMode="always"
                style={styles.input}
                onChangeText={(text) => setPostData({...post, isbn: text })}
                value={post.isbn}
                placeholder="Textbook ISBN"
                keyboardType="numeric"
            />
            <TextInput clearButtonMode="always"
                style={styles.input}
                onChangeText={(text) => setPostData({...post, price: text })}
                value={post.price}
                placeholder="Price (USD)"
                keyboardType="numeric"
            />
            <MultilineTextInput
                clearButtonMode="always"
                style={styles.multilineinput}
                multiline
                numberOfLines={10}
                onChangeText={(text) => setPostData({...post, description: text })}
                value={post.description}
                placeholder="Description of Book (max length: 400 characters)"
            />
            <Pressable style={styles.button} onPress={() => Alert.alert(`Title ${post.name}, Price $${post.price}, isbn ${post.isbn}, Description: ${post.description}`)}>
                <Text style={styles.text}>Add Post</Text>
            </Pressable>

        </ScrollView>
    );
};

const AddPostPage = () => {
    return (
        <View style={styles.container}>
            <View style={styles.space}></View>
            <Text style={styles.baseText}>Add Post</Text>
            <AddPost />
        </View>
    );
};

const styles = StyleSheet.create({
    space: {
        paddingVertical: 12,
        marginVertical:10,
    },
    container: {
        backgroundColor: '#2774AE',
        justifyContent: 'center',
        flex:1,
    },
    baseText: {
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 20,
        margin:12,
        fontSize: 30,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: '#FFFFFF',
    },
    multilineinput: {
        height: 90,
        padding: 10,
        backgroundColor: '#FFFFFF',
        margin: 12,
        borderWidth: 1,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
        marginHorizontal: 10,
      },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});


export default AddPostPage;