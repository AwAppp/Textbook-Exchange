import { View, Text, StyleSheet, Image } from "react-native";
import { useEffect, useState } from "react";
import { EvilIcons } from "@expo/vector-icons";
import { Rating } from "react-native-ratings";
import Backend from "../Backend.js"

const UserProfile = (props) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [name, setName] = useState("");
  const [buyerRating, setBuyerRating] = useState(0);
  const [sellerRating, setSellerRating] = useState(0);

  useEffect(() => {
    // fetch profile picture. if none, set to default

    // setProfilePicture(<EvilIcons name="user" size={200} style={styles.profilePicture} />);

    // TODO: use the uid from props instead of the hard-coding one
    // const uid = props.uid;
    const uid = "YvAxwpwDWMN4As4mrVTyufueN4I3";

    const bk = new Backend();

    // define method to fetch icon from storage
    const getIcon = async () => {
      const imageResult = await bk.getUserIcon(uid);

      // console.log(imageResult); // for debug

      if (imageResult.uri != null) {
        setProfilePicture(<Image
          source={{ uri: imageResult.uri }}
          style={{ width: 200, height: 200 }}
        />);
      } else {
        setProfilePicture(<EvilIcons name="user"
          size={200}
          style={styles.profilePicture}
        />);
      }
    };

    // define method to fetch infomation from firestore
    const getInfo = async () => {
      const user_info = await bk.getUserInfoByUid(uid);

      // console.log(name); // for debug

      if(user_info.username != null) {
        setName(user_info.username);
      } else {
        setName("error when set name");
      }

      if(user_info.buyerRating != null) {
        setBuyerRating(user_info.buyerRating);
      } else {
        setBuyerRating(0);
      }

      if(user_info.sellerRating != null) {
        setSellerRating(user_info.sellerRating);
      } else {
        setSellerRating(0);
      }
    }

    // call the methods to get result
    getIcon();

    getInfo();

    // setName("John Doe");
  }, []);

  const RatingView = ({ ratingValue, ratingText }) => (
    <View style={styles.ratingView}>
      <Rating readonly startingValue={ratingValue} imageSize={30} />
      <Text style={styles.ratingText}>{ratingText}</Text>
    </View>
  );

  const RatingsView = () => (
    <View style={styles.ratingsView}>
      {/* TODO: change icon to a textbook */}
      <RatingView ratingValue={buyerRating} ratingText="Buyer Rating" />
      <RatingView ratingValue={sellerRating} ratingText="Seller Rating" />
    </View>
  );

  return (
    <View style={{ marginTop: 50 }}>
      <View style={styles.profilePictureView}>{profilePicture}</View>

      <Text style={styles.name}>{name}</Text>

      <RatingsView />
    </View>
  );
};

const styles = StyleSheet.create({
  profilePictureView: {
    alignItems: "center",
    margin: 15,
  },
  profilePicture: {
    color: "black",
    resizeMode: "contain",
  },
  name: {
    textAlign: "center",
    fontSize: 30,
  },
  ratingsView: {
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
  },
  ratingView: {
    marginLeft: 10,
    marginRight: 10,
  },
  ratingText: {
    fontSize: 17,
    textAlign: "center",
    padding: 10,
  },
});

export default UserProfile;
