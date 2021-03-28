import React, { useEffect, useState, useRef } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import WebView from "react-native-webview";

import { Contained as ContainedButton } from "../../components/Button";

import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Polygon,
  Polyline,
  Geojson,
  WMSTile,
} from "react-native-maps";
import { useTheme } from "react-native-paper";
import Geolocation from "@react-native-community/geolocation";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Dialog from "../../components/Dialog";
import { SearchDialog } from "../../components/SearchDialog";
import WebViewLeaflet from "react-native-webview-leaflet";

const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 30.7934829;
const LONGITUDE = 98.9867401;

const Map = (props) => {
  const { colors } = useTheme();
  const [customMarker, setCustomMarker] = useState([]);
  const [customLine, setCustomLine] = useState([]);
  const [customPolygon, setCustomPolygon] = useState([]);
  const [paddingTopState, setPaddingTopState] = useState(0);
  const [region, setRegion] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
  });
  const [searchData, setSearchData] = useState({
    region: "",
    info: "",
    propertyFlag: false,
  });
  const mapRef = useRef(null);

  const [state, setState] = useState({
    realFlag: true,
    isModalVisible: false,
    searchModalVisible: false,
    currentTapPosition: "",
    measureShowFlag: false,
    seletedButton: "",
    searchToolbar: false,
    length: 0,
  });

  const containerStyles = {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  };

  const getMapMarkerRegion = () => ({
    latitude: region.latitude,
    longitude: region.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const getMapRegion = () => {
    console.log({
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
    return {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
  };

  useEffect(() => {
    Geolocation.watchPosition(
      (position) => {
        if (state.realFlag) {
          var tempCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          };
        }
      },
      (error) => {
        alert(error);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
        distanceFilter: 10,
      }
    );
    Geolocation.getCurrentPosition(
      (position) => {
        if (state.realFlag)
          setRegion({
            ...region,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
      },
      (error) => {
        alert(error);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
        distanceFilter: 10,
      }
    );
  }, []);

  const getCurrentPositionCustom = async () => {
    Geolocation.getCurrentPosition(
      (position) => {
        mapRef.current.animateToCoordinate(
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          1000
        );
      },
      (error) => {
        alert(error);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
        distanceFilter: 10,
      }
    );
  };

  useEffect(() => {
    if (state.seletedButton == "vector") getVectorLength(customPolygon);
    else if (state.seletedButton == "line") getLineLenth(customLine);
    else setState({ ...state, length: 0 });
  }, [state.seletedButton]);

  const haversine = (coords1, coords2) => {
    const R = 6371e3; // metres
    const φ1 = (coords1.latitude * Math.PI) / 180; // φ, λ in radians
    const φ2 = (coords2.latitude * Math.PI) / 180;
    const Δφ = ((coords2.latitude - coords1.latitude) * Math.PI) / 180;
    const Δλ = ((coords2.longitude - coords1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  function getArrayDepth(value) {
    return Array.isArray(value) ? 1 + Math.max(...value.map(getArrayDepth)) : 0;
  }

  const filterObject = (obj) => {
    var temp = {};
    Object.keys(obj).map((ele) => {
      switch (ele) {
        case "pr_registration_no":
          temp.Reg_number = obj["pr_registration_no"];
          break;
        case "dist_nm_e":
          temp.district = obj[ele];
          break;
        case "vil_nm_e":
          temp.Vilage = obj[ele];
          break;
        case "quarters_e":
          temp.Quarter = obj[ele];
          break;
        case "blck_code":
          temp.Block = obj[ele];
          break;
        case "parcel_nbr":
          temp.Parcel_no = obj[ele];
          break;
        case "sheet":
          temp.sheet = obj[ele];
          break;
        case "plans":
          temp.Plans = obj[ele];
          break;
        default:
          break;
      }
    });
    return temp;
  };

  const doSearch = (searchResult) => {
    setState({ ...state, searchModalVisible: false, searchToolbar: true });
    const searhData = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: searchResult.geo[0].geometry,
          properties: searchResult.geo[0].properties,
        },
      ],
    };
    setSearchData({
      ...searchData,
      region: searhData,
      info: filterObject(searchResult.geo[0].properties),
    });
    var temp = searchResult.geo[0].geometry.coordinates;
    var temp1 = [...temp];
    const n = getArrayDepth(temp1);
    for (var i = 0; i < n - 1; i++) {
      temp1 = temp1[0];
    }
    mapRef.current.animateToRegion(
      {
        longitude: temp1[0],
        latitude: temp1[1],
        latitudeDelta: 0.004,
        longitudeDelta: 0.004,
      },
      4000
    );
  };

  const getLineLenth = (items) => {
    if (items.length > 1) {
      let length = 0;
      for (let i = 0; i < items.length - 1; i++) {
        length += haversine(items[i], items[i + 1]);
      }
      setState({ ...state, length: length });
    } else {
      setState({ ...state, length: 0 });
    }
  };

  const getVectorLength = (items) => {
    if (items.length > 1) {
      let length = 0;
      for (let i = 0; i < items.length - 1; i++) {
        length += haversine(items[i], items[i + 1]);
      }
      length += haversine(items[0], items[items.length - 1]);
      setState({ ...state, length: length });
    } else {
      setState({ ...state, length: 0 });
    }
  };

  useEffect(() => {
    getLineLenth(customLine);
  }, [customLine]);

  useEffect(() => {
    getVectorLength(customPolygon);
  }, [customPolygon]);

  const realTimeStop = () => {
    setState({ ...state, realFlag: false });
  };

  const realTimeContinue = () => {
    setState({
      ...state,
      realFlag: true,
      searchToolbar: false,
      measureShowFlag: false,
    });
  };

  const matTap = (e) => {
    let temp = e.nativeEvent.coordinate;
    if (state.seletedButton == "marker" && state.measureShowFlag)
      setState({
        ...state,
        currentTapPosition: temp,
        isModalVisible: !state.isModalVisible,
      });
    else if (state.seletedButton == "line" && state.measureShowFlag)
      setCustomLine((customLine) => [...customLine, temp]);
    else if (state.seletedButton == "vector" && state.measureShowFlag)
      setCustomPolygon((customPolygon) => [...customPolygon, temp]);
  };

  const addCustomItem = (item) => {
    setCustomMarker((customMarker) => [
      ...customMarker,
      { coordinate: state.currentTapPosition, res: item },
    ]);
    setState({ ...state, isModalVisible: false });
  };

  const onClickMeasureButton = () => {
    setState({ ...state, measureShowFlag: !state.measureShowFlag });
  };

  const onClickSearchButton = () => {
    setState({
      ...state,
      searchModalVisible: true,
      searchToolbar: false,
      measureShowFlag: false,
    });
  };

  const onCloseSearchDialog = () => {
    setState({ ...state, searchModalVisible: false });
  };

  const viewSearchLocationInfo = () => {
    setSearchData({ ...searchData, propertyFlag: !searchData.propertyFlag });
  };

  const gotoSearchLocation = () => {
    var temp = searchData.region.features[0].geometry.coordinates;
    var temp1 = [...temp];
    const n = getArrayDepth(temp1);
    for (var i = 0; i < n - 1; i++) {
      temp1 = temp1[0];
    }
    mapRef.current.animateToRegion(
      {
        longitude: temp1[0],
        latitude: temp1[1],
        latitudeDelta: 0.004,
        longitudeDelta: 0.004,
      },
      4000
    );
  };

  return (
    <View style={containerStyles}>
      <View style={{ position: "absolute", top: 40, left: 0, zIndex: 1 }}>
        <ContainedButton
          icon={<Text style={{ fontSize: 15, color: "#fff" }}>KML</Text>}
          onPress={() => realTimeContinue()}
          style={{
            paddingHorizontal: 0,
            backgroundColor: colors.primary,
            marginTop: 10,
          }}
        />
        <ContainedButton
          icon={<FontAwesome name="arrows-v" size={25} color="#fff" />}
          onPress={() => onClickMeasureButton()}
          style={{
            paddingHorizontal: 0,
            backgroundColor: colors.primary,
            marginTop: 10,
          }}
        />
        <ContainedButton
          icon={<Entypo name="layers" size={25} color="#fff" />}
          onPress={() => realTimeContinue()}
          style={{
            paddingHorizontal: 0,
            backgroundColor: colors.primary,
            marginTop: 10,
          }}
        />
        <ContainedButton
          icon={<FontAwesome name="map" size={25} color="#fff" />}
          onPress={() => realTimeContinue()}
          style={{
            paddingHorizontal: 0,
            backgroundColor: colors.primary,
            marginTop: 10,
          }}
        />
        <ContainedButton
          icon={<FontAwesome name="search" size={25} color="#fff" />}
          onPress={() => onClickSearchButton()}
          style={{
            paddingHorizontal: 0,
            backgroundColor: colors.primary,
            marginTop: 10,
          }}
        />
      </View>
      <View style={{ flex: 1, paddingTop: paddingTopState }}>
        <MapView
          style={{ flex: 1 }}
          ref={mapRef}
          onPress={matTap}
          provider={MapView.PROVIDER_GOOGLE}
          showsUserLocation={true}
          followUserLocation={true}
          zoomEnabled={true}
          pitchEnabled={true}
          showsCompass={true}
          showsBuildings={true}
          showsMyLocationButton={true}
          zoomEnabled
          zoomControlEnabled
          showsPointsOfInterest
          onMapReady={() => {
            setPaddingTopState(1);
            getCurrentPositionCustom();
          }}
          showsIndoors={true}
        >
          {searchData.region != "" ? (
            <Geojson
              zIndex={0}
              onPress={() => console.log("admin")}
              geojson={searchData.region}
              strokeColor="red"
              fillColor="green"
              strokeWidth={5}
            >
              <Text style={{ zIndex: 2, backgroundColor: "blue" }}>Admin</Text>
            </Geojson>
          ) : (
            <></>
          )}
          {customMarker.length > 0 ? 
            <>
              {customMarker.map((marker, index) => (
                <MapView.Marker 
                  key={index}
                  pinColor={colors.primary}
                  coordinate={marker.coordinate}
                  title={marker.res.title}
                >
                  {marker.res.uri != ''?<Image source={{uri:marker.res.uri}} style={{width:40, height:40, borderRadius:5}}/>:<></>}
              </MapView.Marker>
            ))}</>:<></>
          }
          <Polyline
            tracksViewChanges={false}
            key="editingPolyline"
            coordinates={customLine}
            strokeColor={colors.blue}
            strokeWidth={2}
          />
          {customPolygon.length > 0 ? 
                  <Polygon
                  tracksViewChanges={false}
                  key={Math.random()}
                  coordinates={customPolygon}
                  holes={[]}
                  strokeColor="#000"
                  strokeWidth={2}
                />
          : <></>}
        </MapView>
      </View>
      {searchData.propertyFlag ? (
        <View
          style={{
            backgroundColor: colors.background,
            height: 250,
            width: "90%",
            position: "absolute",
            bottom: 100,
            alignSelf: "center",
            padding: 10,
          }}
        >
          <Text style={{ fontSize: 20, textAlign: "center", paddingTop: 10 }}>
            Comparable:
          </Text>
          {Object.keys(searchData.info).map((key) => (
            <Text key={Math.random()} style={{ fontSize: 15 }}>
              {key} : {searchData.info[key]}
            </Text>
          ))}
        </View>
      ) : (
        <></>
      )}
      {/* <MapView
          onTouchStart={() => realTimeStop()}
          style={{ ...StyleSheet.absoluteFillObject }}
          showUserLocation
          followUserLocation
          loadingEnabled
          region={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          region={getMapRegion()}
          initialRegion={{
            latitude: 36.81808,
            longitude: -98.640297,
            latitudeDelta: 60.0001,
            longitudeDelta: 60.0001
          }}
        >

          <Marker tracksViewChanges={false} onPress={() => realTimeContinue()} coordinate={getMapMarkerRegion()} >
            <View style={{width:10, height:10, borderRadius:10, backgroundColor:'#4385f6'}}></View>
          </Marker>
        </MapView> */}
      <Dialog
        flag={state.isModalVisible}
        onBack={matTap}
        onSave={addCustomItem}
      />
      <SearchDialog
        flag={state.searchModalVisible}
        onClose={onCloseSearchDialog}
        doSearch={doSearch}
      />
      {state.measureShowFlag ? (
        <View
          style={{
            position: "absolute",
            justifyContent: "flex-end",
            bottom: 10,
            right: 5,
            zIndex: 1,
            height: 50,
            width: "70%",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              height: "100%",
              borderRadius: 10,
              alignContent: "center",
              justifyContent: "center",
              marginRight: 20,
              backgroundColor: colors.background,
              padding: 10,
            }}
          >
            <Text>Legth:{state.length.toFixed(2)} M</Text>
          </View>
          <ContainedButton
            icon={
              <Ionicons
                name="analytics-outline"
                size={30}
                color={state.seletedButton != "line" ? colors.primary : "#fff"}
              />
            }
            onPress={() => setState({ ...state, seletedButton: "line" })}
            style={{
              paddingHorizontal: 0,
              backgroundColor:
                state.seletedButton != "line"
                  ? colors.background
                  : colors.primary,
              marginRight: 5,
            }}
          />
          <ContainedButton
            icon={
              <MaterialCommunityIcons
                name="vector-rectangle"
                size={30}
                color={
                  state.seletedButton != "vector" ? colors.primary : "#fff"
                }
              />
            }
            onPress={() => setState({ ...state, seletedButton: "vector" })}
            style={{
              paddingHorizontal: 0,
              backgroundColor:
                state.seletedButton != "vector"
                  ? colors.background
                  : colors.primary,
              marginRight: 5,
            }}
          />
          <ContainedButton
            icon={
              <MaterialCommunityIcons
                name="map-marker"
                size={30}
                color={
                  state.seletedButton != "marker" ? colors.primary : "#fff"
                }
              />
            }
            onPress={() => setState({ ...state, seletedButton: "marker" })}
            style={{
              paddingHorizontal: 0,
              backgroundColor:
                state.seletedButton != "marker"
                  ? colors.background
                  : colors.primary,
              marginRight: 5,
            }}
          />
        </View>
      ) : (
        <></>
      )}
      {state.searchToolbar ? (
        <View
          style={{
            position: "absolute",
            justifyContent: "flex-end",
            bottom: 10,
            left: 5,
            zIndex: 1,
            height: 50,
            display: "flex",
            flexDirection: "row",
          }}
        >
          <ContainedButton
            icon={<Entypo name="info" size={30} color={colors.primary} />}
            onPress={() => viewSearchLocationInfo()}
            style={{
              paddingHorizontal: 0,
              backgroundColor: colors.background,
              marginRight: 5,
            }}
          />
          <ContainedButton
            icon={
              <MaterialIcons name="pageview" size={30} color={colors.primary} />
            }
            onPress={() => gotoSearchLocation()}
            style={{
              paddingHorizontal: 0,
              backgroundColor: colors.background,
              marginRight: 5,
            }}
          />
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

export default MapScreen = React.memo(Map);