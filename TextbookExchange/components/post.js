import { Title, Card, Button, Paragraph } from 'react-native-paper';
import { StyleSheet, ScrollView, Image, Alert, BackHandler } from 'react-native';
import React, { Component } from "react";

import Backend from '../Backend.js';

const data = require('./posttest.json');

class Post {
    constructor(bookName, postID, sellerID, price, isbn, description, img, tag) {
        this.postID = postID;
        this.bookName = bookName;
        this.sellerID = sellerID;
        this.price = price;
        this.isbn = isbn;
        this.description = description;
        this.img = img;
        this.tag = tag;
    }
}

class SinglePost extends Component {
    createButtonTestAlert = () =>
        Alert.alert(
            "Contact " + this.props.postData.sellerID,
            "Click here to redirect to chat",
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        );
    reportButtonTestAlert = () =>
        Alert.alert(
            "Report " + this.props.postData.sellerID,
            "Click here to report post",
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        );

    render() {
        return (
            <Card style={styles.container}>
                <Card.Title title={this.props.postData.bookName} />
                <Card.Cover source={{uri: this.props.postData.img}} />
                <Card.Content>
                    <Title>ISBN: {this.props.postData.isbn}</Title>
                    <Paragraph>${this.props.postData.price}</Paragraph>
                    <Paragraph>{this.props.postData.description}</Paragraph>
                </Card.Content>
                <Card.Actions>
                    <Button mode="contained" onPress={this.createButtonTestAlert} style={styles.button}>
                        Contact {this.props.postData.sellerID}
                    </Button>
                    <Button mode="contained" onPress={this.reportButtonTestAlert} style={styles.report_button}>
                        Report Post
                    </Button>
                </Card.Actions>
            </Card>
        );
    }
}

class PostList extends Component {
    // The constructor of the PostList component
    // It will initialize the state of the component
    constructor(props) {
        super(props);
        this.state = { data: [] };
    }

    componentDidMount() {
        const bk = new Backend();

        bk.listPosts()
            .then(async (data) => {
                // console.log(data);   // for debug
                for(var i = 0; i < data.length; i++) {
                    const postId = data[i].post_id;

                    // console.log(await bk.getBookCover(postId));

                    data[i]["img"] = (await bk.getBookCover(postId)).uri;
                }

                this.setState({data: data});
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        var listItems = [];

        for (var i = 0; i < this.state.data.length; i++) {
            let currData = this.state.data[i];
            listItems.push(<SinglePost
                postData={new Post(currData.title, currData.postID,
                    currData.sellerID, currData.price, currData.isbn,
                    currData.description, currData.img, currData.tag)}
            />);
        }
        return listItems;
    }
}

class PostGroup extends Component {
    render() {
        return (
            <ScrollView>
                <PostList />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        marginBottom: 10,
        marginLeft: 5,
        marginRight: 5,
    },
    button: {
        backgroundColor: "#FFD100",
        margin: 5,
    },
    report_button: {
        backgroundColor: "#00008B",
        margin: 5,
    },
    images: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    }
});


export default PostGroup;