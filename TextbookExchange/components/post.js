import { Title, Card, Button, Paragraph } from 'react-native-paper';
import { StyleSheet, ScrollView, Image, Alert, BackHandler } from 'react-native';
import React, { Component } from "react";

import Backend from '../Backend.js';
import { View } from 'react-native-web';

const data = require('./posttest.json');

class Post {
    constructor(bookName, postID, sellerID, price, isbn, description, img, type) {
        this.postID = postID;
        this.bookName = bookName;
        this.sellerID = sellerID;
        this.price = price;
        this.isbn = isbn;
        this.description = description;
        this.img = img;
        this.type = type;
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
                <Card.Cover source={{uri: this.props.postData.img}} style={{height:500}} />
                <Card.Content>
                    <Title>ISBN: {this.props.postData.isbn}</Title>
                    <Title>{this.props.postData.type}</Title>
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
        this.buy = props.buy;
        this.sell = props.sell;
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
        console.log("State:");
        console.log(this.buy);
        console.log(this.sell);
        for (var i = 0; i < this.state.data.length; i++) {
            let currData = this.state.data[i];
            if(this.buy && currData.type == "Buying") {
                listItems.push(<SinglePost
                    postData={new Post(currData.title, currData.postID,
                        currData.sellerID, currData.price, currData.isbn,
                        currData.description, currData.img, currData.type)}
                />);
            }
            else if(this.sell && currData.type == "Selling") {
                listItems.push(<SinglePost
                    postData={new Post(currData.title, currData.postID,
                        currData.sellerID, currData.price, currData.isbn,
                        currData.description, currData.img, currData.type)}
                />);
            }
            else if(!this.sell && !this.buy) {
                listItems.push(<SinglePost
                    postData={new Post(currData.title, currData.postID,
                        currData.sellerID, currData.price, currData.isbn,
                        currData.description, currData.img, currData.type)}
                />);
            }
        }
        return listItems;
    }
}

class PostGroup extends Component {
    constructor(props) {
        super(props);
        this.buy = props.buy;
        this.sell = props.sell;
    }
    render() {
        console.log("post group");
        console.log(this.buy);
        console.log(this.sell);
        return (
            <ScrollView>
                <PostList buy={this.buy} sell={this.sell}/>
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

// <Card.Cover source={{uri: this.props.postData.img}} resizeMode={`cover`}  />