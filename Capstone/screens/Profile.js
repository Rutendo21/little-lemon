import { useState, useEffect, useContext } from 'react';
import { View, Image, Text, TextInput, Pressable, StyleSheet, ScrollView} from 'react-native';
import { Checkbox } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateEmail, validateName, validateNumber } from '../utils';
import { AuthContext } from '../contexts/AuthContext';
import * as ImagePicker from "expo-image-picker";

const Profile = ({ navigation }) => {

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

  const [discard, setDiscard] = useState(false);

  const validEmail = validateEmail(profile.email);
  const validFirstName = validateName(profile.firstName);
  const validLastName = validateName(profile.lastName);
  const validPhoneNumber = validateNumber(profile.phoneNumber);
  
  useEffect(() => {
    (async () => {
      try {
        const getProfile = await AsyncStorage.getItem("profile");
        const getProfileConvert = JSON.parse(getProfile)
        setProfile(getProfileConvert);
        setDiscard(false);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [discard]);
  
  const { update } = useContext(AuthContext);
  const { logout } = useContext(AuthContext);
  
  const updateProfile = (key, value) => {
    setProfile(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const chooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      setProfile(prevState => ({
        ...prevState,
        ["image"]: result.assets[0].uri,
      }));
    }
  };
  
  const removeImage = () => {
    setProfile(prevState => ({
      ...prevState,
      ["image"]: "",
    }));
  };
  
  return (

    <ScrollView style={styles.container}>
      
      <View style={styles.header}>
        <Pressable onPress={() => navigation.navigate("Home")}>
          <Image style={styles.back} source={require('../assets/back.jpg')} />
        </Pressable>
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
        <Text style={styles.titleText}> Personal information </Text>
        <Text style={styles.avatarText}> Avatar </Text>

        <View style={styles.bio}>
          <View style={styles.bioAvatar}>
          {profile.image ? (
            <Image source={{ uri: profile.image }} style={styles.bioAvatarImage} />
          ) : (
            <View style={styles.bioEmptyAvatar}>
              <Text style={styles.emptyAvatarText}>
                {profile.firstName && Array.from(profile.firstName)[0]}
                {profile.lastName && Array.from(profile.lastName)[0]}
              </Text>
            </View>
          )}
          </View>
          <Pressable style={styles.changeButton} onPress={chooseImage}>
            <Text style={styles.changeButtonText}> Change </Text>
          </Pressable>
          <Pressable style={styles.removeButton} onPress={removeImage}>
            <Text style={styles.removeButtonText}> Remove </Text>
          </Pressable>
        </View>

        <Text style={styles.bodyText}> First Name </Text>
        <TextInput style={styles.inputBox} value={profile.firstName} onChangeText={newValue => updateProfile("firstName", newValue)} disabled={validFirstName ? false : true}/>
        <Text style={styles.bodyText}> Last Name </Text>
        <TextInput style={styles.inputBox} value={profile.lastName} onChangeText={newValue => updateProfile("lastName", newValue)} disabled={validLastName ? false : true}/>
        <Text style={styles.bodyText}> Email </Text>
        <TextInput style={styles.inputBox} value={profile.email} onChangeText={newValue => updateProfile("email", newValue)} keyboardType={'email-address'} disabled={validEmail ? false : true}/>
        <Text style={styles.bodyText}> Phone Number </Text>
        <TextInput style={styles.inputBox} value={profile.phoneNumber} onChangeText={newValue => updateProfile("phoneNumber", newValue)} keyboardType={'phone-pad'}/>
        <Text style={styles.Text}> Email notifications </Text>
        <View style={styles.checkboxPosition}>
          <Checkbox style={styles.checkbox} color={ 'checked' ? 'grey' : undefined } status={profile.orderStatuses ? 'checked' : 'unchecked'} onPress={() => {updateProfile("orderStatuses", !profile.orderStatuses)}}/>
          <Text style={styles.checkboxText}> Order Statuses </Text>
        </View>
        <View style={styles.checkboxPosition}>
          <Checkbox style={styles.checkbox} color={ 'checked' ? 'grey' : undefined } status={profile.passwordChanges ? 'checked' : 'unchecked'} onPress={() => {updateProfile("passwordChanges", !profile.passwordChanges)}}/>
          <Text style={styles.checkboxText}> Password Changes </Text>
        </View>
        <View style={styles.checkboxPosition}>
          <Checkbox style={styles.checkbox} color={ 'checked' ? 'grey' : undefined } status={profile.specialOffers ? 'checked' : 'unchecked'} onPress={() => {updateProfile("specialOffers", !profile.specialOffers)}}/>
          <Text style={styles.checkboxText}> Special Offers </Text>
        </View>
        <View style={styles.checkboxPosition}>
          <Checkbox style={styles.checkbox} color={ 'checked' ? 'grey' : undefined } status={profile.newsletter ? 'checked' : 'unchecked'} onPress={() => {updateProfile("newsletter", !profile.newsletter)}}/>
          <Text style={styles.checkboxText}> Newsletter </Text>
        </View>
        
        <Pressable style={styles.logOutButton} onPress={() => logout()}>
          <Text style={styles.logOutButtonText}> Log out </Text>
        </Pressable>
        <View>
          <Pressable style={styles.discardChangesButton} onPress={ () => setDiscard(true)}>
            <Text style={styles.discardChangesButtonText}> Discard changes </Text>
          </Pressable>
          <Pressable style={[styles.saveChangesButton, validEmail && validFirstName && validLastName && validPhoneNumber ? styles.saveChangesButtonEnabled : ""]} onPress={ () => update(profile)} disabled={validEmail && validFirstName && validLastName && validPhoneNumber ? false : true}>
            <Text style={styles.saveChangesButtonText}> Save changes </Text>
          </Pressable>
        </View>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:  "#FFFFFF",
  },
  header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor:  "#FFFFFF",
    paddingTop: 30,
  },
  back: {
    height: 40,
    width: 40,
    left: 20,
    top: 15,
  },
  logo: {
    width: 150,
    height: 70,
    left: 80,
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
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BFC9D5",
    margin: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
    color: "#495E57",
  },
  avatarText: {
    fontSize: 14,
    paddingLeft: 30,
    color: "#BFC9D5",
  },
  bioAvatar: {
    flex: 1,
    position: "absolute",
    left: 20,
    top: 10,
  },
  bioAvatarImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  bioEmptyAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#BFC9D5",
    alignItems: "center",
    justifyContent: "center",
  },
  changeButton: {
    padding: 10,
    width: 80,
    height: 40,
    left: 100,
    backgroundColor: '#A3A5A8',
    borderRadius: 10,
    top: 30,
  },
  removeButton: {
    padding: 10,
    width: 80,
    height: 40,
    left: 200,
    bottom: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#A3A5A8',
    borderWidth: 1,
  },
  changeButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
  },
  removeButtonText: {
    color: '#A3A5A8',
    textAlign: 'center',
    fontSize: 14,
  },
  bodyText: {
    top: 20,
    left: 20,
    fontSize: 14,
    color: "#495E57",
  },
  Text: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 20,
    color: "#495E57",
  },
  inputBox: {
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BFC9D5",
    margin: 20,
    height: 40,
    padding: 10,
    top: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    color: "#FFFFFF",
  },
  checkboxPosition: {
    left: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checkbox: {
    borderWidth: 1,
    borderColor: "#BFC9D5",
  },
  checkboxText: {
    fontSize: 14,
    color: "#495E57",
    left: 10,
    padding: 7,
  },
  logOutButton: {
    backgroundColor: "#F4CE14",
    borderColor: "#F4CE14",
    borderRadius: 10,
    height: 40,
    padding: 10,
    margin: 10,
  },
  logOutButtonText: {
    fontSize: 16,
    color: "#000000",
    fontWeight: 'bold',
    textAlign: 'center',
  },
  discardChangesButton: {
    padding: 10,
    width: 140,
    height: 40,
    left: 40,
    top: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#A3A5A8',
    borderWidth: 1,
    borderRadius: 10,
  },
  discardChangesButtonText: {
    color: '#A3A5A8',
    textAlign: 'center',
    fontSize: 14,
  },
  saveChangesButton: {
    padding: 10,
    width: 130,
    height: 40,
    left: 200,
    backgroundColor: '#A3A5A8',
    borderRadius: 10,
    bottom: 30,
  },
  saveChangesButtonEnabled: {
    padding: 10,
    width: 130,
    height: 40,
    left: 200,
    backgroundColor: "#F4CE14",
    borderRadius: 10,
    bottom: 30,
  },
  saveChangesButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
  },
})

export default Profile;