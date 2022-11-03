import { Title, Card, Button, Paragraph } from 'react-native-paper';
import { StyleSheet, View, Image, Alert } from 'react-native';
import React, { Component } from "react";


const data = require('./posttest.json');

class PostData {
   constructor(bookName, sellerID, price, isbn, description, img) {
       this.bookName = bookName;
       this.sellerID = sellerID;
       this.price = price;
       this.isbn = isbn;
       this.description = description;
       this.img = img;
   }
};

const postList = [];

for (var i = 0; i < data.length; i++) {
  let currData = data[i];
  let newPost = new PostData(currData.bookName, currData.sellerID, currData.price, currData.isbn, currData.description, currData.img);
  postList.push(newPost);
}

const PostCard = (props) => (
   <Card>
      <Card.Title title={props.postData.bookName}/>
      <Card.Content>
         <Title>ISBN: {props.postData.isbn}</Title>
         <Paragraph>${props.postData.price}</Paragraph>
         <Paragraph>{props.postData.description}</Paragraph>
      </Card.Content>
      <Button icon="camera" mode="contained" onPress={() => alertSeller(props.PostData.sellerID)}>
         Contact {props.PostData.sellerID}
      </Button>
   </Card>
)



function alertSeller(seller) {
   Alert.alert(
      "Tell" + {seller} + "!",
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]
    );
}

const PostList = () => {
   var listItems = [];

   for (var i = 0; i < postList.length; i++) {
      listItems.push(<PostCard postData = {postList[i]}/>);

  }
  return listItems;
}

const PostGroup = () => {
   return(
   <View>
      <PostList />
   </View>
   );
}

export default PostGroup;

/*<Button className='remove' onClick={() => alertSeller(props.postData.sellerID)}>Contact {props.postData.sellerID}</Button>
*/

   