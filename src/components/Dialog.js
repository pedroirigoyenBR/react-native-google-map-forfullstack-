import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  TextInput,
  Image,
} from "react-native";
import { Text } from "react-native-paper";
import theme from "../assets/theme";
import Modal from "react-native-modal";
import Entypo from "react-native-vector-icons/Entypo";
import * as ImagePicker from "react-native-image-picker";

import { Contained as ContainedButton } from "../components/Button";

const Dialog = ({ flag, onBack, onSave }) => {
  const { colors } = theme;
  const [isVisible, setIsVisible] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    setIsVisible(flag);
    setImgUrl(""); setTitle("");
  }, [flag]);

  const openLibrary = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: "photo",
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      (response) => {
        if(response.uri)
            setImgUrl(response.uri);
      }
    );
  };

  const openCamera = () => {
    ImagePicker.launchCamera(
      {
        mediaType: "photo",
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      (response) => {
        if(response.uri)
            setImgUrl(response.uri);
      }
    );
  };

  const saveItem = () => {
    onSave({title:title, uri:imgUrl});
    setIsVisible(false);
  }

  return (
    <Modal isVisible={isVisible} onBackdropPress={onBack}>
      <View style={styles.container}>
        <View style={styles.titleCotainer}>
          <Text style={styles.title}>Text:</Text>
            <TextInput style={styles.titleInput}                 onChangeText={(text) =>
                  setTitle(text)
                } value={title}/>
        </View>
        <View style={styles.imageContainer} onCh>
          {imgUrl == "" ? (
            <Entypo style={styles.image} size={90} color={colors.lightGray} name={"image"} />
          ) : (
            <Image
              style={{ width: 90, height: 90 }}
              source={{
                uri: imgUrl,
              }}
            />
          )}

          <View style={{ flexDirection: "column" }}>
            <ContainedButton
              icon={<Entypo name="camera" size={30} color={colors.lightPurple} />}
              onPress={openCamera}
              style={{
                paddingHorizontal: 0,
                backgroundColor: colors.background,
                marginTop: 10,
              }}
            />
            <ContainedButton
              icon={<Entypo name="upload" size={30} color={colors.lightPurple} />}
              onPress={openLibrary}
              style={{
                paddingHorizontal: 0,
                backgroundColor: colors.background,
                marginTop: 10,
              }}
            />
          </View>
        </View>
        <ContainedButton
              icon={<Entypo name="save" size={30} color={colors.white} />}
              onPress={saveItem}
              style={{
                paddingHorizontal: 0,
                backgroundColor: colors.primary,
                position: 'absolute',
                bottom:10,
                right: 10
              }}
            />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    margin: 30,
    height: 350,
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 10,
  },
  imageContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignContent:'center',
    justifyContent: "space-evenly",
  },
  titleCotainer: {
    width: "100%",
    justifyContent: "space-evenly",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
  },
  titleInput: {
    width: "60%",
    height: 50,
    padding: 10,
    borderRadius: 10,
    backgroundColor: theme.colors.background,
    borderWidth: 0.5,
  },
  image:{
      alignSelf:'center'
  }
});

export default Dialog;
