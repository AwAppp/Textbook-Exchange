import { View, Text, StyleSheet, Image, Button } from "react-native";
import { useEffect, useRef, useState } from "react";
import { EvilIcons } from "@expo/vector-icons";
import { Rating } from "react-native-ratings";
import Backend from "../Backend.js";
import * as ImagePicker from "expo-image-picker";
import { ActivityIndicator, Menu, IconButton, Button as PaperButton } from "react-native-paper";

// TODO: Add prop isNotSelf
const UserProfile = ({ uid }) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [name, setName] = useState("");
  const [buyerRating, setBuyerRating] = useState(0);
  const [sellerRating, setSellerRating] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contextMenuIsVisible, setContextMenuIsVisible] = useState(false);

  const contextMenuButtonRef = useRef();

  const bk = new Backend();

  // TODO: Remove this var
  const isNotSelf = true;

  useEffect(() => {
    // define method to fetch icon from storage
    const getIcon = async () => {
      const imageResult = await bk.getUserIcon(uid);
      if (imageResult.uri != null) {
        setProfilePicture(
          <Image
            source={{ uri: imageResult.uri, cache: "reload" }}
            style={{ width: 200, height: 200 }}
            key={new Date()}
          />
        );
      } else {
        setProfilePicture(<EvilIcons name="user" size={200} style={styles.profilePicture} />);
      }
    };

    // define method to fetch infomation from firestore
    const getInfo = async () => {
      const userInfo = await bk.getUserInfoByUid(uid);

      // console.log(name); // for debug

      if (userInfo.username != null) {
        setName(userInfo.username);
      } else {
        setName("error when set name");
      }

      if (userInfo.buyerRating != null) {
        setBuyerRating(userInfo.buyerRating);
      } else {
        setBuyerRating(0);
      }

      if (userInfo.sellerRating != null) {
        setSellerRating(userInfo.sellerRating);
      } else {
        setSellerRating(0);
      }
    };

    // call the methods to get result
    getIcon();
    getInfo();

    setLoading(false);
  }, [updating, loading]);

  const openContextMenu = () => setContextMenuIsVisible(true);
  const closeContextMenu = () => setContextMenuIsVisible(false);

  const onPressRate = () => {
    // popup rate modal, has buyer or seller toggles and then a star rating component
  };

  const onPressBlock = () => {};
  const onPressReport = () => {};

  const UpdatePhotoButton = () => (
    <Button
      title="Update Photo"
      color="#33C5FF"
      onPress={async () => {
        const uploaded_file = await ImagePicker.launchImageLibraryAsync();

        if (uploaded_file != null && uploaded_file.assets != null) {
          const waitAndRerender = async () => {
            setUpdating(true);
            await bk.updateUserIcon(uid, await bk.getBlobFromURI(uploaded_file.assets[0].uri));
            await new Promise((resolve) => setTimeout(resolve, 3000));
            setUpdating(false);
          };

          waitAndRerender();
        } else {
          console.log("error when fetch file from uri");
        }
      }}
    />
  );

  const ContextMenuButton = () => (
    <>{isNotSelf ? <IconButton icon="dots-horizontal" onPress={openContextMenu} /> : null}</>
  );

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

  if (loading || updating) {
    return (
      <View style={{ marginTop: 200 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <View style={{ marginTop: 50 }}>
        <View style={styles.profilePictureView}>{profilePicture}</View>

        <UpdatePhotoButton />

        <View style={styles.nameAndContextMenu}>
          <Text style={styles.name}>{name}</Text>

          <Menu
            visible={contextMenuIsVisible}
            onDismiss={closeContextMenu}
            anchor={<ContextMenuButton />}
            anchorPosition="bottom"
            style={styles.contextMenu}
          >
            {/* TODO: Add icons to each of the options */}
            <Menu.Item onPress={onPressRate} title="Rate" />
            <Menu.Item onPress={onPressBlock} title="Block" />
            <Menu.Item onPress={onPressReport} title="Report" />
          </Menu>
        </View>

        <RatingsView />
      </View>
    );
  }
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
  nameAndContextMenu: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    textAlign: "center",
    fontSize: 30,
  },
  contextMenu: {
    paddingTop: 30,
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
  activityView: {
    alignItems: "center",
    margin: 100,
  },
});

export default UserProfile;
