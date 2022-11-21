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

    const getIcon = async () => {
      const bk = new Backend();

      // TODO: replace the hard-wired user_id to props.user_id
      const imageResult = await bk.getUserIcon('CuKe0_3VUAAVsdz');

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

    getIcon();

    setName("John Doe");
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
