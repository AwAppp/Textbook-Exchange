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
    },
    {
        text: "Back to Home",
        icon: require("./../assets/pictures/plus.jpeg"),
        name: "back_home",
        position: 2
    },
];

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

const PostFilter = (props) => {
    
}


const PostFeed = (props) => {
    const [showAddPage, setShowAddPage] = useState(false);
    const [filterSell, setFilterSell] = useState(false);
    const [filterBuy, setFilterBuy] = useState(false);


    return (
        <View style={styles.container}>
            {showAddPage ? ( 
                <View style={styles.groupcontainer}>
                    <AddPostPage userid={props.userid}/>
                </View> ) : ( 
                <View style={styles.groupcontainer}>
                <View style={styles.fixToText}>
                    <Pressable style={styles.button} onPress={() => {setFilterSell(true); 
                                                                    setFilterBuy(false);
                                                                    Alert.alert('Filter by posts selling books');
                                                                    console.log('set to sell');}}>
                        <Text style={styles.text}>Looking to Sell</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={() => {setFilterBuy(true);
                                                                    setFilterSell(false);
                                                                    Alert.alert('Filter by posts looking to buy books');
                                                                    console.log('set to buy');}}>
                        <Text style={styles.text}>Looking to Buy</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={() => {setFilterBuy(false);
                                                                     setFilterSell(false);
                                                                    Alert.alert('Reset View');
                                                                    console.log('reset view');}}>
                        <Text style={styles.text}>Reset View</Text>
                    </Pressable>
                </View>
                    <PostGroup buy={filterBuy} sell={filterSell}/> 
                </View>
            )}
            <View style={styles.floatbutton}>
                <FloatingAction
                    actions={actions}
                    onPressItem={name => {
                        if(name == "new_post") {
                            setShowAddPage(true);
                        }
                        else { 
                            setShowAddPage(false);
                        }}}
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
        paddingVertical: 5,
        paddingHorizontal: 6,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
        marginHorizontal: 6,
      },
    text: {
        fontSize: 15,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
  });

export default PostFeed;

