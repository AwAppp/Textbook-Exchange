import * as ImagePicker from "expo-image-picker";

import { ActivityIndicator, Dialog, IconButton, Menu, Paragraph, RadioButton } from "react-native-paper";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Button, Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import Backend from "../Backend.js";
import { EvilIcons } from "@expo/vector-icons";
import { Rating } from "react-native-ratings";

const UserProfile = ({ uid, isSelf, route }) => {
  const userID = uid || route.params.uid;
  const [profilePicture, setProfilePicture] = useState(null);
  const [name, setName] = useState("");
  const [buyerRating, setBuyerRating] = useState(0);
  const [sellerRating, setSellerRating] = useState(0);

  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);

  const [contextMenuIsVisible, setContextMenuIsVisible] = useState(false);
  const [blockDialogIsVisible, setBlockDialogIsVisible] = useState(false);
  const [reportDialogIsVisible, setReportDialogIsVisible] = useState(false);

  const [ratingValue, setRatingValue] = useState(0);
  const [ratingUserType, setRatingUserType] = useState(null);

  const contextMenuButtonRef = useRef();
  const ratingSheetRef = useRef();

  const navigation = useNavigation();

  const bk = new Backend();

  useEffect(() => {
    // define method to fetch icon from storage
    const getIcon = async () => {
      const imageResult = await bk.getUserIcon(userID);
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
      const userInfo = await bk.getUserInfoByUid(userID);

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
  const openRatingSheet = () => ratingSheetRef.current?.present();
  const closeRatingSheet = () => ratingSheetRef.current?.dismiss();
  const openBlockDialog = () => setBlockDialogIsVisible(true);
  const closeBlockDialog = () => setBlockDialogIsVisible(false);
  const openReportDialog = () => setReportDialogIsVisible(true);
  const closeReportDialog = () => setReportDialogIsVisible(false);

  const onPressChat = async () => {
    try {
      let icon = await bk.getUserIcon(userID);
      console.log(icon.uri);
      console.log("before navigation");
      let icon_uri = icon.uri;
      navigation.replace(
        "Chat",
        {
          userId: userID,
          name: name,
          image: icon_uri,
        },
        navigation
      );
    } catch (error) {
      console.log(error);
    }
  };

  const onPressRate = () => {
    closeContextMenu();
    openRatingSheet();
  };

  const onFinishRating = (ratingValue) => setRatingValue(ratingValue);

  const onRatingSheetDismiss = () => {
    setRatingValue(0);
    setRatingUserType(null);
  };

  const onPressSubmitRating = () => {
    if (ratingValue !== 0 && ratingUserType !== null) {
      // TODO: Add below function
      bk.rateUser(userID, ratingValue, ratingUserType);
      console.log(`Rated user ${userID} with ${ratingValue} stars as a ${ratingUserType}`);
      closeRatingSheet();
    }
  };

  const onPressBlock = () => {
    closeContextMenu();
    openBlockDialog();
  };

  const blockUser = () => {
    closeBlockDialog();
    // TODO: Add below function
    bk.blockUser(userID);
    console.log(`Blocked user ${userID}`);
  };

  const onPressReport = () => {
    closeContextMenu();
    openReportDialog();
  };

  const reportUser = () => {
    closeReportDialog();
    // TODO: Add below function
    bk.reportUser(userID);
    console.log(`Reported user ${userID}`);
  };

  const UpdatePhotoButton = () => (
    <Button
      title="Update Photo"
      color="#33C5FF"
      onPress={async () => {
        const uploaded_file = await ImagePicker.launchImageLibraryAsync();

        if (uploaded_file != null && uploaded_file.assets != null) {
          const waitAndRerender = async () => {
            setUpdating(true);
            await bk.updateUserIcon(userID, await bk.getBlobFromURI(uploaded_file.assets[0].uri));
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
    <>{!isSelf ? <IconButton icon="dots-horizontal" onPress={openContextMenu} /> : null}</>
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
      <RatingView ratingValue={buyerRating ?? 0} ratingText="Buyer Rating" ratingBackgroundColor="black" />
      <RatingView ratingValue={sellerRating ?? 0} ratingText="Seller Rating" />
    </View>
  );

  const RatingSheetContentView = () => (
    <View>
      <Text>Was this user a buyer or seller?</Text>
      <View>
        <RadioButton.Group onValueChange={(value) => setRatingUserType(value)} value={ratingUserType}>
          <RadioButton.Item label="Buyer" value="buyer" />
          <RadioButton.Item label="Seller" value="seller" />
        </RadioButton.Group>
      </View>
      <Rating startingValue={0} onFinishRating={onFinishRating} />
      <Button title="Submit" onPress={onPressSubmitRating} />
    </View>
  );

  const ContextMenuDialog = ({ visible, onDismiss, title, content, onPressYes, onPressCancel }) => (
    <Dialog visible={visible} onDismiss={onDismiss}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <Paragraph>{content}</Paragraph>
      </Dialog.Content>
      <Dialog.Actions>
        <Button title="Yes" onPress={onPressYes}>
          Yes
        </Button>
        <Button title="Cancel" onPress={onPressCancel}>
          Cancel
        </Button>
      </Dialog.Actions>
    </Dialog>
  );

  if (loading || updating) {
    return (
      <View style={{ marginTop: 200 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <BottomSheetModalProvider>
        <View style={{ flex: 1, marginTop: 50 }}>
          <TouchableOpacity
            style={{ marginLeft: 20 }}
            onPress={() => {
              navigation.replace("Home");
            }}
          >
            <Text>Back</Text>
          </TouchableOpacity>
          <View style={styles.profilePictureView}>{profilePicture}</View>

          {isSelf ? <UpdatePhotoButton /> : null}

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
              <Menu.Item onPress={onPressChat} title="Chat" />
              <Menu.Item onPress={onPressRate} title="Rate" />
              <Menu.Item onPress={onPressBlock} title="Block" />
              <Menu.Item onPress={onPressReport} title="Report" />
            </Menu>
          </View>

          <RatingsView />

          <BottomSheetModal ref={ratingSheetRef} index={0} snapPoints={["50%"]} onDismiss={onRatingSheetDismiss}>
            <RatingSheetContentView />
          </BottomSheetModal>

          <ContextMenuDialog
            visible={blockDialogIsVisible}
            onDismiss={closeBlockDialog}
            title="Block User"
            content="Are you sure you want to block this user?"
            onPressYes={blockUser}
            onPressCancel={closeBlockDialog}
          />
          <ContextMenuDialog
            visible={reportDialogIsVisible}
            onDismiss={closeReportDialog}
            title="Report User"
            content="Are you sure you want to report this user?"
            onPressYes={reportUser}
            onPressCancel={closeReportDialog}
          />
        </View>
      </BottomSheetModalProvider>
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
