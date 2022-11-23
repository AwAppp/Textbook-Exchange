import { ScrollView, TextInput, Alert, StyleSheet, Text, View, Pressable} from 'react-native';
import React, { Component } from "react";
import Backend from "./../Backend.js";

be = new Backend();

const MultilineTextInput = (props) => {
    return (
      <TextInput
        {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
        editable
        maxLength={400}
      />
    );
  }

const AddPost = (props) => {
    const [post, setPostData] = React.useState({name:"", price: 0, isbn: 0, type:"", description:""});
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
            <TextInput clearButtonMode="always"
                style={styles.input}
                onChangeText={(text) => setPostData({...post, type: text })}
                value={post.type}
                placeholder="Buying or Selling"
                keyboardType="text"
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
            <Pressable style={styles.imgbutton} 
                        onPress={() => {
                                Alert.alert("Add Image!");
                        }
            }>
                <Text style={styles.text}>Add Image</Text>
            </Pressable>
            <Pressable style={styles.button} 
                        onPress={() => {
                                be.addPost({sellerid: props.userid, title: post.name, price: post.price, isbn: post.isbn, description: post.description, type: post.type});
                                Alert.alert("New Post Created!");
                        }
            }>
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
            <AddPost userid="test"/>
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
        marginVertical:10,
      },
    imgbutton: {
        backgroundColor: '#2020a8',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 4,
        elevation: 3,
        marginHorizontal: 10,
        marginVertical:10,
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

//Backend.AddPost({key:value})
//prop for userID

/*            <Pressable style={styles.button} onPress={Backend.addPost({sellerid: props.userid, title: post.name, price: post.price, isbn: post.isbn, description: post.description})}>
                <Text style={styles.text}>Add Post</Text>
            </Pressable>*/