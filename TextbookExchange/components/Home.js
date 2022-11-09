import React, { useCallback, useState, useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import { Divider, List } from 'react-native-paper';
import { Avatar } from 'react-native-elements';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';

const Home = ({navigation}) => {

    const signOutNow = () => {
        signOut(auth).then(() => {
            navigation.replace("Login");
        }).catch((error) => {
            console.log(error);
        });
    };

    useLayoutEffect(() => {
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
                <TouchableOpacity style={{
                    marginRight: 10
                }}
                    onPress={signOutNow}
                >
                    <Text>logout</Text>
                </TouchableOpacity>
            )
        })
    }, [navigation]);

    return (
        <View>
            <Text>Hello {auth?.currentUser?.email}</Text>
        </View>
    );
}
 
export default Home;
  