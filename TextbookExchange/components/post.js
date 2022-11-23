import { Title, Card, Button, Paragraph } from 'react-native-paper';
import { StyleSheet, ScrollView, Image, Alert } from 'react-native';
import React, { Component, useState, useEffect } from "react";
import Backend from "./../Backend.js";
import {
    getFirestore,
    collection, setDoc, doc, getDoc, updateDoc, addDoc,
    getDocs
} from "firebase/firestore";

be = new Backend();
//const data = require('./posttest.json');
var trueTypeOf = (obj) => Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();


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
        return(
            <Card style={styles.container}>
                <Card.Title title={this.props.postData.bookName}/>
                <Card.Cover source={require("../assets/pictures/textbook.jpeg")}/>
                <Card.Content>
                    <Title>ISBN: {this.props.postData.isbn}</Title>
                    <Paragraph>${this.props.postData.price}</Paragraph>
                    <Paragraph>{this.props.postData.description}</Paragraph>
                </Card.Content>
                <Card.Actions>
                    <Button mode="contained" onPress={this.createButtonTestAlert} style={styles.button}>
                        Message {this.props.postData.sellerID}
                    </Button>
                    <Button mode="contained" onPress={this.reportButtonTestAlert} style={styles.report_button}>
                        Report Post
                    </Button>
                </Card.Actions>
            </Card>
        );
    }
}



class PostGroup extends Component {
    constructor(props) {
        super(props);
        this.state = ({postList: []});
    }
    
    async getPosts() {
        console.log("start");
        let postList = [];
        const datalist = await be.listPosts();

        console.log(datalist);
        for (var i = 0; i < datalist.length; i++) {
            console.log('here');
            let currData = datalist[i];
            let newPost = new Post(currData.title, currData.post_id, currData.sellerid, currData.price, currData.isbn, currData.description, currData.img, currData.type);
            postList.push(newPost);
        }

        console.log(postList);
        return postList;  

    }

    componentDidMount() {
        const test = async () => {
            const data = await this.getPosts();
            var listItems = [];

            for (var i = 0; i < data.length; i++) {
                listItems.push(<SinglePost postData={data[i]} />);
            }
            this.setState({postList: listItems}); 
            console.log('finished');
        };
    }

    render() {
        return(
        <ScrollView>
            {this.postList}
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

/* 
class PostGroupold extends Component {
    render() {
        return(
            <ScrollView>
                <PostList />
            </ScrollView>
        );
    }
}

function PostGroupfunc() {
    const [data, updateData] = useState();
    const getData = async () => {
        const list = [];
        const db = be.getDB();
        console.log('start');
        collection(db, "posts").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                let currData = doc.data;
                console.log(currData);
                let newPost = new Post(currData.title, currData.post_id, currData.sellerid, currData.price, currData.isbn, currData.description, currData.img, currData.type);
                list.push(newPost);
            });
            updateData(list);
        });
        console.log(list);
    };
    useEffect(() => {
        getData();
    }, []);
    return (
        <ScrollView>
            {data}
        </ScrollView>
    );
}

const PostListeh = () => {
    const [data, updateData] = useState();
    useEffect(() => {
      const getData = async () => {
        var postList = [];
        const datalist = await be.listPosts();

        //console.log(datalist);

        for (var i = 0; i < datalist.length; i++) {
            let currData = datalist[i];
            console.log(currData);
            let newPost = new Post(currData.title, currData.post_id, currData.sellerid, currData.price, currData.isbn, currData.description, currData.img, currData.type);
            postList.push(newPost);
        } 
        var listItems = [];

        if (data != undefined){
            for (var i = 0; i < data.length; i++) {
                listItems.push(<SinglePost postData={data[i]} />);
            }
        }
        console.log("List");
        console.log(listItems);
        updateData(listItems);
      }
      getData();
    }, []);
    console.log(data);
    return data;
  }

*/