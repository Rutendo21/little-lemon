import React, { useState, useContext} from "react";
import { View, Image, StyleSheet, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView } from "react-native";
import { validateEmail, validateName } from "../utils";
import { AuthContext } from "../contexts/AuthContext";

const Onboarding = () => {
  const [firstName, onChangeFirstName] = useState("");
  const [lastName, onChangeLastName] = useState("");
  const [email, onChangeEmail] = useState("");

  const validEmail = validateEmail(email);
  const validFirstName = validateName(firstName);
  const validLastName = validateName(lastName);

  const { onboard } = useContext(AuthContext);

  return (

    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Image style={styles.logo} source={require("../assets/Logo.png")} accessible={true} accessibilityLabel={"Logo"}/>
      </View>

      <View style={styles.body}>
        <Text style={styles.headerText}>Let us get to know you</Text>
      
        <View style={styles.inputContainer}>
          <Text style={styles.inputText}>First Name</Text>
          <TextInput style={styles.inputBox} value={firstName} onChangeText={onChangeFirstName} placeholder={"First Name"}/>
      
          <Text style={styles.inputText}>Last Name</Text>
          <TextInput style={styles.inputBox} value={lastName} onChangeText={onChangeLastName} placeholder={"Last Name"}/>
      
          <Text style={styles.inputText}>Email</Text>
          <TextInput style={styles.inputBox} value={email} onChangeText={onChangeEmail} placeholder={"Email"} keyboardType="email-address"/>
        </View>
      </View>
          
      <Pressable style={[styles.button, validEmail && validFirstName && validLastName ? "" : styles.buttonDisabled]}
        onPress={() => onboard({ firstName, lastName, email })}
        disabled={validEmail && validFirstName && validLastName ? false : true}
      >
        <Text style={styles.buttonText}>Next</Text>
      </Pressable>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DEE3E9",
  },
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#DEE3E9",
  },
  logo: {
    height: 70,
    width: 280,
    resizeMode: "contain",
    top: 10,
  },
  body: {
    backgroundColor: "#BFC9D5",
  },
  headerText: {
    fontSize: 22,
    paddingVertical: 50,
    color: "#495E57",
    textAlign: "center",
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  inputText: {
    fontSize: 20,
    color: "#495E57",
  },
  inputBox: {
    borderColor: "#495E57",
    backgroundColor: "#BFC9D5",
    height: 40,
    width: 300,
    margin: 20,
    borderWidth: 2,
    padding: 10,
    fontSize: 20,
    borderRadius: 9,
  },
  button: {
    backgroundColor: "#F4CE14",
    borderColor: "#F4CE14",
    marginHorizontal: 18,
    marginTop: 50,
    borderWidth: 1,
    paddingTop: 10,
    width: 120,
    height: 50,
    borderRadius: 10,
    left: 220,
  },
  buttonDisabled: {
    backgroundColor: "#BFC9D5",
    borderColor: "#BFC9D5",
  },
  buttonText: {
    fontSize: 20,
    color: "#495E57",
    textAlign: "center",
  },
});

export default Onboarding;