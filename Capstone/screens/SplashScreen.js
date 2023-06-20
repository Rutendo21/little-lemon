import * as React from "react";
import { View, StyleSheet, Image } from "react-native";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../assets/Logo.png")} accessible={true} accessibilityLabel={'Logo'}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: 100,
    width: 300,
    resizeMode: "contain",
  },
});

export default SplashScreen;