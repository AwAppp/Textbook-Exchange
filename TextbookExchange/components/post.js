import { Title, Card, Button, Paragraph } from 'react-native-paper';
import { View, StyleSheet, ScrollView, Image, Alert, BackHandler } from 'react-native';
import React, { Component, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from "react-native-paper";
import Chat from "../components/Chat";

import Backend from '../Backend.js';
import { TEST_ID } from 'react-native-gifted-chat';
//import { View } from 'react-native-web';
const backendInstance = new Backend();

class Post {
    constructor(bookName, postID, sellerID, sellerName, price, isbn, description, img, type) {
        this.postID = postID;
        this.bookName = bookName;
        this.sellerID = sellerID;
        this.sellerName = sellerName;
        this.price = price;
        this.isbn = isbn;
        this.description = description;
        this.img = img;
        this.type = type;
    }
}


const SinglePost = ({ postData, userid, postList }) => {
    const navigation = useNavigation();
    const navigateToUserProfile = (async () => {
        try {
            console.log("before navigation");
            navigation.replace("Profile", {
                uid: postData.sellerID,
            });
        } catch (error) { console.log(error); }
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

    /* useEffect(() => {
        console.log("user id: ", userid);

        console.log("sellerID: ", postData.sellerID);
    }, []) */

    return (
        <Card style={styles.container}>
            <Card.Title title={postData.bookName} />
            <Card.Cover source={{ uri: postData.img }} style={{ height: 500 }} />
            <Card.Content>
                <Title>ISBN: {postData.isbn}</Title>
                <Paragraph style={{ fontSize: 18, fontWeight: 'bold' }}>{postData.type}</Paragraph>
                <Paragraph>${postData.price}</Paragraph>
                <Paragraph>{postData.description}</Paragraph>
            </Card.Content>
            <Card.Actions>
                {userid != postData.sellerID ?
                    <View>
                        <Button mode="contained" onPress={navigateToUserProfile} style={styles.button}>
                            {postData.sellerName}'s Profile
                        </Button>
                        <Button mode="contained" onPress={reportButtonTestAlert} style={styles.report_button}>
                            Report Post
                        </Button>
                    </View>
                    :
                    null
                }
                {userid == postData.sellerID ?
                    <View style={styles.buttonContainer}>
                        <Button mode="contained"
                            onPress={async () => {
                                /* console.log("press the delete: ");
                                console.log(postData.postID); */
                                await backendInstance.deletePost(postData.postID);
                                postList.load();
                            }}
                            style={styles.report_button}>
                            Delete Post
                        </Button>
                    </View>
                    :
                    null
                }
            </Card.Actions>
        </Card >
    );
}


class PostList extends Component {
    // The constructor of the PostList component
    // It will initialize the state of the component
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true
        };
    }

    componentDidMount() {
        const bk = new Backend();

        console.log("In Post List: buy", this.props.buy);
        console.log("In Post List: sell", this.props.sell);
        console.log("In Post List: loading", this.state.loading);

        if (this.state.loading) {
            if (this.props.buy) {
                console.log("enter getBuyingPosts");
                bk.getBuyingPosts()
                    .then(async (data) => {
                        console.log(data);   // for debug
                        for (var i = 0; i < data.length; i++) {
                            const postId = data[i].post_id;

                            console.log(await bk.getBookCover(postId));

                            data[i]["img"] = (await bk.getBookCover(postId)).uri;
                        }

                        this.setState({ data: data, loading: false });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
            else if (this.props.sell) {
                console.log("entering getSellPost....")
                bk.getSellingPosts()
                    .then(async (data) => {
                        console.log(data);   // for debug
                        for (var i = 0; i < data.length; i++) {
                            const postId = data[i].post_id;

                            console.log(await bk.getBookCover(postId));

                            data[i]["img"] = (await bk.getBookCover(postId)).uri;
                        }

                        this.setState({ data: data, loading: false });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
            else {
                bk.listPosts()
                    .then(async (data) => {
                        // console.log(data);   // for debug
                        for (var i = 0; i < data.length; i++) {
                            const postId = data[i].post_id;

                            // console.log(await bk.getBookCover(postId));

                            data[i]["img"] = (await bk.getBookCover(postId)).uri;
                        }

                        this.setState({ data: data, loading: false });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }
    }

    load() {
        this.setState({ loading: true }, this.componentDidMount);
    }

    componentDidUpdate(prevProps) {
        console.log(prevProps);
        console.log(this.props);
        if (this.props.buy !== prevProps.buy || this.props.sell !== prevProps.sell) {
            this.load();
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <ActivityIndicator style={{ marginTop: 200 }} size="large" />
            );
        }

        var listItems = [];
        for (var i = 0; i < this.state.data.length; i++) {
            let currData = this.state.data[i];
            listItems.push(<SinglePost
                postData={new Post(currData.title, currData.post_id,
                    currData.sellerid, currData.username, currData.price, currData.isbn,
                    currData.description, currData.img, currData.type)}
                userid={this.props.userid}
                postList={this}
            />);
        }
        return listItems;
    }
}

class PostGroup extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        /* console.log("post group");
        console.log(this.buy);
        console.log(this.sell); */
        return (
            <ScrollView>
                <PostList userid={this.props.userid} buy={this.props.buy} sell={this.props.sell} />
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
        flex: 7,
    },
    report_button: {
        backgroundColor: "#00008B",
        margin: 5,
        flex: 7,
    },
    images: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    buttonContainer: {
        flex: 1,
    }
});


export default PostGroup;

// <Card.Cover source={{uri: this.props.postData.img}} resizeMode={`cover`}  />