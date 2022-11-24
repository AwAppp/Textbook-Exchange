import React, { Component, useState } from "react";
import { Appbar } from 'react-native-paper';
import { StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';

function Header() {
    //const [pages] = useState(0);
    const navigation = useNavigation();

    const _goBack = () => {
        console.log('Went back');
        navigation.goBack()
        navigation.navigate('Home');
    };

    const _handleSearch = () => console.log('Searching');

    const _handleMore = () => console.log('Shown more');

    
        return(
            <Appbar.Header style={styles.container}>
                <Appbar.BackAction onPress={_goBack} />
                <Appbar.Content title="Textbook Exchange" />
                <Appbar.Action icon="magnify" onPress={_handleSearch} />
                <Appbar.Action icon="dots-vertical" onPress={_handleMore} />
            </Appbar.Header>
        );
    
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: "#72a7fc",
      marginBottom: 5,
    },
  });

export default Header;