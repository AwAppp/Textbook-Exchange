import React, { Component } from "react";
import { Appbar } from 'react-native-paper';
import { StyleSheet} from 'react-native';

class Header extends Component {
    _goBack = () => console.log('Went back');

    _handleSearch = () => console.log('Searching');

    _handleMore = () => console.log('Shown more');

    render() {
        return(
            <Appbar.Header style={styles.container}>
                <Appbar.BackAction onPress={this._goBack} />
                <Appbar.Content title="Textbook Exchange" />
                <Appbar.Action icon="magnify" onPress={this._handleSearch} />
                <Appbar.Action icon="dots-vertical" onPress={this._handleMore} />
            </Appbar.Header>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: "#72a7fc",
      marginBottom: 5,
    },
  });

export default Header;