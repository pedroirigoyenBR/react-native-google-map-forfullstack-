import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Text } from "react-native-paper";
import theme from "../assets/theme";
import Modal from "react-native-modal";
import Spinner from "react-native-loading-spinner-overlay";
import { TabView, SceneMap } from "react-native-tab-view";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import { api_url } from "../utils/api";

const initialLayout = { width: Dimensions.get("window").width };

export const SearchDialog = ({ flag, onClose, doSearch }) => {
  const { colors } = theme;

  //config component state
  const [isVisible, setIsVisible] = useState(false);
  const [index, setIndex] = React.useState(0);
  const [spinner, setSpinnerData] = useState(false);

  let registrationno = "";
  let parcelnumber = "";

  const [registListData, setRegistListData] = useState({
    district: [
      { label: "LEFKOSIA", value: "1" },
      { label: "KERYNEIA", value: "2" },
      { label: "AMMOCHOSTOS", value: "3" },
      { label: "LARNAKA", value: "4" },
      { label: "LEMESOS", value: "5" },
      { label: "PAFOS", value: "6" },
    ],
    muncivila: [],
    quarter: [],
    registrationblock: [],
  });

  const [registSelectedKey, setSelectedKey] = useState({
    district: "",
    muncivila: "",
    quarter: "",
    registrationblock: "",
  });

  const [routes] = React.useState([
    { key: "first", title: "Map reference" },
    { key: "second", title: "Registration No" },
  ]);

  {/* Define registration tap functions */}

  const FirstRoute = () => (
    <ScrollView contentContainerStyle={{ minHeight: 750 }}>
      <View style={styles.container}>
        <Text style={styles.title}>FIND A PARCEL/PROPERTY</Text>
        <View style={styles.dropItem}>
          <Text style={styles.dropDownItemTitle}>District</Text>
          <DropDownPicker
            items={mapReferenceData.district}
            containerStyle={{ height: 40, width: "100%" }}
            style={{ backgroundColor: "#fafafa" }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            defaultValue={mapReferencetSelectedKey.district}
            dropDownStyle={{ backgroundColor: "#fafafa" }}
            onChangeItem={(item) => mapReferenceDistricSelect(item)}
          />
        </View>
        <View style={styles.dropItem}>
          <Text style={styles.dropDownItemTitle}>Municipality/Village</Text>
          <DropDownPicker
            items={mapReferenceData.muncivila}
            containerStyle={{ height: 40, width: "100%" }}
            style={{ backgroundColor: "#fafafa" }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            defaultValue={mapReferencetSelectedKey.muncivila}
            dropDownStyle={{ backgroundColor: "#fafafa" }}
            disabled={mapReferenceData.muncivila.length == 0}
            onChangeItem={(item) => mapReferenceMunicipalitySelect(item)}
          />
        </View>
        <View style={styles.dropItem}>
          <Text style={styles.dropDownItemTitle}>Quarter</Text>
          <DropDownPicker
            items={mapReferenceData.quarter}
            containerStyle={{ height: 40, width: "100%" }}
            style={{ backgroundColor: "#fafafa" }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            dropDownStyle={{ backgroundColor: "#fafafa" }}
            disabled={mapReferenceData.quarter.length == 0}
            onChangeItem={(item) => mapReferenQuarterSelect(item)}
            defaultValue={mapReferencetSelectedKey.quarter}
          />
        </View>
        <View style={styles.dropItem}>
          <Text style={styles.dropDownItemTitle}>Blocks</Text>
          <DropDownPicker
            items={mapReferenceData.registrationblock}
            containerStyle={{ height: 40, width: "100%" }}
            style={{ backgroundColor: "#fafafa" }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            dropDownStyle={{ backgroundColor: "#fafafa" }}
            disabled={mapReferenceData.registrationblock.length == 0}
            onChangeItem={(item) => mapReferenceBlockSelect(item)}
            defaultValue={mapReferencetSelectedKey.block}
          />
        </View>
        <View style={styles.dropItem}>
          <Text style={styles.dropDownItemTitle}>Sheet</Text>
          <DropDownPicker
            items={mapReferenceData.sheet}
            containerStyle={{ height: 40, width: "100%" }}
            style={{ backgroundColor: "#fafafa" }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            dropDownStyle={{ backgroundColor: "#fafafa" }}
            disabled={mapReferenceData.sheet.length == 0}
            onChangeItem={(item) => mapReferenceSheetSelect(item)}
            defaultValue={mapReferencetSelectedKey.sheet}
          />
        </View>
        <View style={styles.dropItem}>
          <Text style={styles.dropDownItemTitle}>Plan</Text>
          <DropDownPicker
            items={mapReferenceData.plan}
            containerStyle={{ height: 40, width: "100%" }}
            style={{ backgroundColor: "#fafafa" }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            dropDownStyle={{ backgroundColor: "#fafafa" }}
            disabled={mapReferenceData.plan.length == 0}
            onChangeItem={(item) => mapReferencePlanSelect(item)}
            defaultValue={mapReferencetSelectedKey.plan}
          />
        </View>
        <View style={styles.dropItem}>
          <Text style={styles.dropDownItemTitle}>Parcel Number</Text>
          <TextInput
            keyboardType="numeric"
            onChangeText={(text) => (parcelnumber = text)}
            containerStyle={{ height: 40, width: "100%" }}
            style={{
              backgroundColor: "#fff",
              borderColor: "#dbdbdb",
              borderWidth: 1,
              borderRadius: 5,
            }}
          ></TextInput>
        </View>
        <TouchableOpacity
          onPress={() => onReferenceMapButtonClick()}
          style={{
            width: 200,
            height: 50,
            backgroundColor: colors.primary,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
          }}
        >
          <Text style={{ color: colors.white, fontSize: 17 }}>Zoom</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  {/* Map Registration Tap Render Part */}

  const SecondRoute = () => (
    <ScrollView contentContainerStyle={{ minHeight: 650 }}>
      <View style={styles.container}>
        <Text style={styles.title}>FIND A PARCEL/PROPERTY</Text>
        <View style={styles.dropItem}>
          <Text style={styles.dropDownItemTitle}>District</Text>
          <DropDownPicker
            items={registListData.district}
            containerStyle={{ height: 40, width: "100%" }}
            style={{ backgroundColor: "#fafafa" }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            defaultValue={registSelectedKey.district}
            dropDownStyle={{ backgroundColor: "#fafafa" }}
            onChangeItem={(item) => registrationDistricSelect(item)}
          />
        </View>
        <View style={styles.dropItem}>
          <Text style={styles.dropDownItemTitle}>Municipality/Village</Text>
          <DropDownPicker
            items={registListData.muncivila}
            containerStyle={{ height: 40, width: "100%" }}
            style={{ backgroundColor: "#fafafa" }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            defaultValue={registSelectedKey.muncivila}
            dropDownStyle={{ backgroundColor: "#fafafa" }}
            disabled={registListData.muncivila.length == 0}
            onChangeItem={(item) => registrationMunicipalitySelect(item)}
          />
        </View>
        <View style={styles.dropItem}>
          <Text style={styles.dropDownItemTitle}>Quarter</Text>
          <DropDownPicker
            items={registListData.quarter}
            containerStyle={{ height: 40, width: "100%" }}
            style={{ backgroundColor: "#fafafa" }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            dropDownStyle={{ backgroundColor: "#fafafa" }}
            disabled={registListData.quarter.length == 0}
            onChangeItem={(item) => registrationQuarterSelect(item)}
            defaultValue={registSelectedKey.quarter}
          />
        </View>
        <View style={styles.dropItem}>
          <Text style={styles.dropDownItemTitle}>Registration Block</Text>
          <DropDownPicker
            items={registListData.registrationblock}
            containerStyle={{ height: 40, width: "100%" }}
            style={{ backgroundColor: "#fafafa" }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            dropDownStyle={{ backgroundColor: "#fafafa" }}
            disabled={registListData.registrationblock.length == 0}
            onChangeItem={(item) => registrationBlockSelect(item)}
            defaultValue={registSelectedKey.registrationblock}
          />
        </View>
        <View style={styles.dropItem}>
          <Text style={styles.dropDownItemTitle}>Registration No</Text>
          <TextInput
            keyboardType="numeric"
            onChangeText={(text) => (registrationno = text)}
            containerStyle={{ height: 40, width: "100%" }}
            style={{
              backgroundColor: "#fff",
              borderColor: "#dbdbdb",
              borderWidth: 1,
              borderRadius: 5,
            }}
          ></TextInput>
        </View>
        <TouchableOpacity
          onPress={() => onRegistrationButtonClick()}
          style={{
            width: 200,
            height: 50,
            backgroundColor: colors.primary,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
          }}
        >
          <Text style={{ color: colors.white, fontSize: 17 }}>Zoom</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const registrationDistricSelect = (item) => {
    setSpinnerData(true);
    setSelectedKey({ ...registSelectedKey, district: item.value });
    getListData({ dist_code: parseInt(item.value) }, "getvillages");
  };

  const registrationMunicipalitySelect = (item) => {
    setSpinnerData(true);
    setSelectedKey({ ...registSelectedKey, muncivila: item.value });
    getListData(
      {
        dist_code: parseInt(registSelectedKey.district),
        vil_code: parseInt(item.value),
      },
      "getquarters"
    );
  };

  const registrationQuarterSelect = (item) => {
    setSpinnerData(true);
    setSelectedKey({ ...registSelectedKey, quarter: item.value });
    getListData(
      {
        dist_code: parseInt(registSelectedKey.district),
        vil_code: parseInt(registSelectedKey.muncivila),
        qrtr_code: parseInt(item.value),
      },
      "getblocks"
    );
  };

  const registrationBlockSelect = (item) => {
    setSelectedKey({ ...registSelectedKey, registrationblock: item.value });
  };

  const getListData = (para, endpoint) => {
    axios
      .get(`${api_url}${endpoint}`, {
        params: para,
      })
      .then((res) => {
        if (endpoint == "getblocks") {
          var result = formatBlockArray(res.data);
          setRegistListData({ ...registListData, registrationblock: result });
        } else {
          var result = formatArray(res.data);
          if (endpoint == "getvillages")
            setRegistListData({ ...registListData, muncivila: result });
          else if (endpoint == "getquarters") {
            setRegistListData({ ...registListData, quarter: result });
          }
        }
        setSpinnerData(false);
      }).catch((err) => {
        alert(err);
      });
  };

  const onRegistrationButtonClick = () => {
    if (
      registSelectedKey.district.toString().length <= 0 ||
      registSelectedKey.muncivila.toString().length <= 0 ||
      registSelectedKey.quarter.toString().length <= 0 ||
      registSelectedKey.registrationblock.toString().length <= 0 ||
      registrationno.length <= 0
    ) {
      alert("Please fill out the required fields.");
      return;
    }
    setSpinnerData(true);
    axios
      .post(`${api_url}searchregno`, {
        dist_code: registSelectedKey.district,
        vil_code: registSelectedKey.muncivila,
        qrtr_code: registSelectedKey.quarter,
        regblock: registSelectedKey.registrationblock,
        regno: registrationno,
      })
      .then((res) => {
        if (!res.data.geo.length) alert("Couldn't find your area!");
        else doSearch(res.data);
        setSpinnerData(false);
      });
  };

  {/* Define Map Reference Tap functions */}

  const [mapReferenceData, setMapReferenceData] = useState({
    district: [
      { label: "LEFKOSIA", value: "1" },
      { label: "KERYNEIA", value: "2" },
      { label: "AMMOCHOSTOS", value: "3" },
      { label: "LARNAKA", value: "4" },
      { label: "LEMESOS", value: "5" },
      { label: "PAFOS", value: "6" },
    ],
    muncivila: [],
    quarter: [],
    registrationblock: [],
    sheet:[],
    plan:[]
  });

  const [mapReferencetSelectedKey, setMapReferenceSelectedKey] = useState({
    district: "",
    muncivila: "",
    quarter: "",
    block: "",
    sheet: "",
    plan: "",
  });

  const getMapReferenceListData = (para, endpoint) => {
    axios
      .get(`${api_url}${endpoint}`, {
        params: para,
      })
      .then((res) => {
        if (endpoint == "getblocks") {
          var result = formatBlockArray(res.data);
          setMapReferenceData({ ...mapReferenceData, registrationblock: result });
        } else if (endpoint == "getsheets") {
          var result = formatBlockArray(res.data);
          setMapReferenceData({ ...mapReferenceData, sheet: result });
        } else if(endpoint == "getplans"){
          var result = formatBlockArray(res.data);
          setMapReferenceData({ ...mapReferenceData, plan: result });
        } else {
          var result = formatArray(res.data);
          if (endpoint == "getvillages")
            setMapReferenceData({ ...mapReferenceData, muncivila: result });
          else if (endpoint == "getquarters") {
            setMapReferenceData({ ...mapReferenceData, quarter: result });
          }
        }
        setSpinnerData(false);
      }).catch((err) => {
        setSpinnerData(false);
      });
  };

  const mapReferenceDistricSelect = (item) => {
    setSpinnerData(true);
    setMapReferenceSelectedKey({
      ...mapReferencetSelectedKey,
      district: item.value,
    });
    getMapReferenceListData({ dist_code: parseInt(item.value) }, "getvillages");
  };

  const mapReferenceMunicipalitySelect = (item) => {
    setSpinnerData(true);
    setMapReferenceSelectedKey({
      ...mapReferencetSelectedKey,
      muncivila: item.value,
    });
    getMapReferenceListData(
      {
        dist_code: parseInt(mapReferencetSelectedKey.district),
        vil_code: parseInt(item.value),
      },
      "getquarters"
    );
  };

  const mapReferenQuarterSelect = (item) => {
    setSpinnerData(true);
    setMapReferenceSelectedKey({ ...mapReferencetSelectedKey, quarter: item.value });
    getMapReferenceListData(
      {
        dist_code: parseInt(mapReferencetSelectedKey.district),
        vil_code: parseInt(mapReferencetSelectedKey.muncivila),
        qrtr_code: parseInt(item.value),
      },
      "getblocks"
    );
  };

  const mapReferenceBlockSelect = (item) => {
    setSpinnerData(true);
    setMapReferenceSelectedKey({...mapReferencetSelectedKey, block: item.value});
    getMapReferenceListData(
      {
        dist_code: parseInt(mapReferencetSelectedKey.district),
        vil_code: parseInt(mapReferencetSelectedKey.muncivila),
        qrtr_code: parseInt(mapReferencetSelectedKey.quarter),
        block_code: parseInt(item.value),
      },
      "getsheets"
    );
  };

  const mapReferenceSheetSelect = (item) => {
    setSpinnerData(true);
    setMapReferenceSelectedKey({...mapReferencetSelectedKey, sheet: item.value});
    getMapReferenceListData(
      {
        dist_code: parseInt(mapReferencetSelectedKey.district),
        vil_code: parseInt(mapReferencetSelectedKey.muncivila),
        qrtr_code: parseInt(mapReferencetSelectedKey.quarter),
        block_code: parseInt(mapReferencetSelectedKey.block),
        sheet: parseInt(item.value),
      },
      "getplans"
    );
  };

  const mapReferencePlanSelect = (item) => {
    setMapReferenceSelectedKey({...mapReferencetSelectedKey, plan: item.value});
  };

  const onReferenceMapButtonClick = () => {
    if (
      mapReferencetSelectedKey.district.toString().length <= 0 ||
      mapReferencetSelectedKey.muncivila.toString().length <= 0 ||
      mapReferencetSelectedKey.quarter.toString().length <= 0 ||
      mapReferencetSelectedKey.block.toString().length <= 0 ||
      mapReferencetSelectedKey.sheet.toString().length <= 0 ||
      mapReferencetSelectedKey.plan.toString().length <= 0 ||
      parcelnumber.length <= 0
    ) {
      alert("Please fill out the required fields.");
      return;
    }
    setSpinnerData(true);
    axios
      .post(`${api_url}searchcadastral`, {
        dist_code: mapReferencetSelectedKey.district,
        vil_code: mapReferencetSelectedKey.muncivila,
        qrtr_code: mapReferencetSelectedKey.quarter,
        blck_code: mapReferencetSelectedKey.block,
        sheet:mapReferencetSelectedKey.sheet,
        plans:mapReferencetSelectedKey.plan,
        parcel_no: parcelnumber
      })
      .then((res) => {
        if (!res.data.geo.length) alert("Couldn't find your area!");
        else {
          setIsVisible(false);
          let data =  res.data.geo;
          var result = data.replace(`'\'`, '');
          result = JSON.parse(result);
          res.data.geo = result;
          doSearch(res.data);
        }
        setSpinnerData(false);
      });
  }

  {/* Define Convert Array functions */}

  const formatBlockArray = (array) => {
    const temp = [];
    array.map((ele) => {
      var obj = {};
      Object.keys(ele).map((i) => {
        obj.label = ele[i].toString();
        obj.value = ele[i];
      });
      temp.push(obj);
    });
    return temp;
  };

  const formatArray = (array) => {
    const temp = [];
    array.map((ele) => {
      var obj = {};
      Object.keys(ele).map((i) => {
        if (typeof ele[i] == "string") obj.label = ele[i];
        else obj.value = ele[i];
      });
      temp.push(obj);
    });
    return temp;
  };

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  useEffect(() => {
    setIsVisible(flag);
  }, [flag]);

  const onBack = () => {
    onClose();
  };

  return (
    <Modal
      style={{ height: "100%" }}
      isVisible={isVisible}
      onBackdropPress={onBack}
    >
      <Spinner
        visible={spinner}
        textContent={"Loading..."}
        textStyle={styles.spinnerTextStyle}
      />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    height: "90%",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 20,
  },
  dropItem: {
    width: "100%",
    paddingTop: 10,
    paddingBottom: 10,
  },
  dropDownItemTitle: {
    color: "#018034",
  },
  scene: {
    flex: 1,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
});