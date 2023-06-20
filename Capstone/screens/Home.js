import { useEffect, useState, useCallback, useMemo } from "react";
import { Text, View, StyleSheet, SectionList, Image, Pressable, StatusBar, Alert } from "react-native";
import { Searchbar } from "react-native-paper";
import debounce from "lodash.debounce";
import { createTable, getMenuItems, saveMenuItems, filterByQueryAndCategories } from "../database";
import Filters from "../components/Filters";
import { getSectionListData, useUpdateEffect } from "../utils/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";
const sections = ["starters", "mains", "desserts"];

const Item = ({ name, price, description, image }) => (
  <View style={styles.item}>
    <View style={styles.itemBody}>
      <Text style={styles.itemName}>{name}</Text>
      <Text style={styles.itemDescription}>{description}</Text>
      <Text style={styles.itemPrice}>${price}</Text>
    </View>
    <Image style={styles.itemImage} source={{ uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${image}?raw=true`}}/>
  </View>
);

const Home = ({ navigation }) => {

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    orderStatuses: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
    image: "",
  });
  
  const [data, setData] = useState([]);
  const [searchBarText, setSearchBarText] = useState('');
  const [query, setQuery] = useState('');
  const [filterSelections, setFilterSelections] = useState(
    sections.map(() => false)
  );

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();

      const results = json.menu.map((item, index) => ({
        id: index + 1,
        name: item.name,
        price: item.price,
        description: item.description,
        image: item.image,
        category: item.category,
      }));
      return results;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await createTable();
        menuItems = await getMenuItems();
        if (!menuItems.length) {
          let menuItems = await fetchData();
          saveMenuItems(menuItems);
        }
        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);
        const getProfile = await AsyncStorage.getItem("profile");
        setProfile(JSON.parse(getProfile));
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, []);

  useUpdateEffect(() => {
    (async () => {
      const activeCategories = sections.filter((s, i) => {
        if (filterSelections.every(item => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      try {
        const menuItems = await filterByQueryAndCategories(
          query,
          activeCategories
        );
        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, [filterSelections, query]);

  const lookup = useCallback(q => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  const handleFiltersChange = async (index) => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };

  return (

    <View style={styles.container}>
      
      <View style={styles.header}>
        <Image style={styles.logo} source={require('../assets/Logo.png')} resizeMode='contain' accessible={true} accessibilityLabel={'Logo'}/>
        <Pressable style={styles.avatar} onPress={() => navigation.navigate("Profile")}>
          {profile.image ? (
            <Image source={{ uri: profile.image }} style={styles.avatarImage} />
          ) : (
            <View style={styles.emptyAvatar}>
              <Text style={styles.emptyAvatarText}>
                {profile.firstName && Array.from(profile.firstName)[0]}
                {profile.lastName && Array.from(profile.lastName)[0]}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.body}>
        <Text style={styles.bodyTitle}>Little Lemon</Text>
        <View style={styles.bodyContent}>
          <View style={styles.bodyContentLeft}>
            <Text style={styles.bodyContentLeftTitle}>Chicago</Text>
            <Text style={styles.bodyContentLeftContent}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text>
          </View>
          <Image
            style={styles.image} source={require("../assets/Bruschetta.png")} accessible={true} accessibilityLabel={"Logo"}/>
        </View>
        <Searchbar onChangeText={handleSearchChange} value={searchBarText} style={styles.searchBar} iconColor= "#495E57" inputStyle={{color: "#495E57"}}/>
      </View>
      
      <Text style={styles.menuHeader}>ORDER FOR DELIVERY!</Text>
      <Filters selections={filterSelections} onChange={handleFiltersChange} sections={sections}/>
      <SectionList style={styles.menu} sections={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Item name={item.name} price={item.price} description={item.description} image={item.image}/>
        )}
      />
      <View style={styles.footer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#BFC9D5",
    paddingVertical: 15,
  },
  itemBody: {
    flex: 1,
  },
  itemName: {
    paddingTop: 5,
    fontSize: 18,
    color: "#000000",
    paddingBottom: 5,
    fontWeight: "bold",
    fontFamily: 'serif',
  },
  itemDescription: {
    color: "#495e57",
    paddingRight: 10,
    paddingTop: 10,
    fontFamily: 'serif',
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 18,
    color: "#495e57",
    paddingTop: 12,
    fontFamily: 'serif',
    fontWeight: "bold",
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor:  "#FFFFFF",
    paddingTop: 30,
  },
  logo: {
    width: 150,
    height: 70,
    left: 110,
  },
  avatar: {
    flex: 1,
    position: "absolute",
    right: 20,
    top: 35,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  emptyAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#BFC9D5",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    backgroundColor: '#495E57',
    padding: 15,
  },
  bodyTitle: {
    color: "#F4CE14",
    fontSize: 40,
    fontFamily: "serif",
  },
  bodyContent: {
    flexDirection: "row",
  },
  bodyContentLeft: {
    flex: 1,
  },
  bodyContentLeftTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontFamily: "serif",
  },
  bodyContentLeftContent: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "sans-serif",
    paddingRight: 30,
    paddingTop: 15,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 12,
  },
  searchBar: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#E4E4E4",
    borderRadius: 10,
  },
  menuHeader: {
    fontSize: 15,
    paddingTop: 30,
    paddingLeft: 25,
    paddingBottom: 10,
    fontFamily: "sans-serif",
    fontWeight: "bold",
  },
  menu: {
    padding: 15,
  },
  footer: {
    height: 50,
    backgroundColor: "#FFFFFF"
  }
});

export default Home;