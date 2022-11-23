import { View, Pressable, Alert, StyleSheet, Text} from 'react-native';
import React, { Component, useState } from "react";
import { FloatingAction } from "react-native-floating-action";
import PostGroup from './../components/post.js';
import AddPostPage from './AddPost.js';


const actions = [
    {
      text: "Add New Post",
      icon: require("./../assets/pictures/plus.jpeg"),
      name: "new_post",
      position: 1
    }];

class FloatButton extends Component {
    render() {
        return (
            <View style={styles.floatbutton}>
                <FloatingAction
                    actions={actions}
                    onPressItem={name => {
                    console.log(`selected button: ${name}`);
                    }}
                />
            </View>
        );
    }
}


class FilterBar extends Component {
    render() {
        return (
            <View style={styles.fixToText}>
                <Pressable style={styles.button} onPress={() => Alert.alert('Filter by posts selling books')}>
                    <Text style={styles.text}>Looking to Sell</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => Alert.alert('Filter by posts looking to buy books')}>
                    <Text style={styles.text}>Looking to Buy</Text>
                </Pressable>
            </View>
        );
    }
}



const PostFeed = (props) => {
    const [showAddPage, setShowAddPage] = useState(false);
    return (
        <View style={styles.container}>
            <View style={styles.space}></View>
            {showAddPage ? ( 
                <View style={styles.groupcontainer}>
                    <AddPostPage userid={props.userid}/>
                </View> ) : ( 
                <View style={styles.groupcontainer}>
                    <FilterBar /> 
                    <PostGroup /> 
                </View>
            )}
            <View style={styles.floatbutton}>
                <FloatingAction
                    actions={actions}
                    onPressItem={() => setShowAddPage(!showAddPage)}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#2774AE',
      justifyContent: 'center',
      flex:1,
    },
    floatbutton: {
        flex: 1,
        backgroundColor: "#fff"
    },
    fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
      },
    space: {
        paddingVertical: 12,
        marginVertical:10,
    },
    fonts: {
      marginBottom: 8,
    },
    user: {
      flexDirection: 'row',
      marginBottom: 6,
    },
    image: {
      width: 30,
      height: 30,
      marginRight: 10,
    },
    name: {
      fontSize: 16,
      marginTop: 5,
    },
    groupcontainer: {
        backgroundColor: '#2774AE',
        justifyContent: 'center',
        flex:70,
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

export default PostFeed;

/*
{showAddPage ? ( 
                <View style={styles.groupcontainer}>
                    <AddPostPage />
                </View> ) : ( 
                <View style={styles.groupcontainer}>
                    <FilterBar /> 
                    <PostGroup /> 
                </View>
            )}
*/