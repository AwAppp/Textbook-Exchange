import { Title, Card, Button, Paragraph } from 'react-native-paper';
import { StyleSheet, ScrollView, Image, Alert, BackHandler } from 'react-native';
import React, { Component } from "react";
import { useNavigation } from '@react-navigation/native';
import Chat from "../components/Chat";

import Backend from '../Backend.js';

const data = require('./posttest.json');
const backendInstance = new Backend();

class Post {
    constructor(bookName, postID, sellerID, sellerName, price, isbn, description, img, tag) {
        this.postID = postID;
        this.bookName = bookName;
        this.sellerID = sellerID;
        this.sellerName = sellerName;
        this.price = price;
        this.isbn = isbn;
        this.description = description;
        this.img = img;
        this.tag = tag;
    }
}


const SinglePost = ({postData}) => {
    const navigation = useNavigation();
    const navigateToChat = (async() => {
        try {
            let icon = await backendInstance.getUserIcon(postData.sellerID);
            console.log(icon.uri);
            console.log("before navigation");
            let icon_uri = icon.uri;
            navigation.replace("Chat", {
                userId: postData.sellerID,
                name: postData.sellerName,
                image: icon_uri
            }, navigation);
            } catch(error) {console.log(error);}
    });

    const reportButtonTestAlert = () => {
        Alert.alert(
            "Report " + postData.sellerID,
            "Click here to report post",
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        );
    };

    return (
        <Card style={styles.container}>
            <Card.Title title={postData.bookName} />
            <Card.Cover source={{uri: postData.img}} />
            <Card.Content>
                <Title>ISBN: {postData.isbn}</Title>
                <Paragraph>${postData.price}</Paragraph>
                <Paragraph>{postData.description}</Paragraph>
            </Card.Content>
            <Card.Actions>
                <Button mode="contained" onPress={navigateToChat} style={styles.button}>
                    Contact {postData.sellerName}
                </Button>
                <Button mode="contained" onPress={reportButtonTestAlert} style={styles.report_button}>
                    Report Post
                </Button>
            </Card.Actions>
        </Card>
    );
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
                postData={new Post(currData.title, currData.post_id,
                    currData.sellerid, currData.username, currData.price, currData.isbn,
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