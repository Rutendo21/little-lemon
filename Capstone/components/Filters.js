import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const Filters = ({ onChange, selections, sections }) => {
  return (
    <View style={styles.container}>
      {sections.map((section, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {onChange(index);}}
          style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 10, backgroundColor: selections[index] ? "#495e57" : "#EDEFEE", borderRadius: 20, marginRight: 15, marginLeft: 15, width: 50,}}
        >
          <View>
            <Text style={{ fontFamily: "sans-serif", fontWeight: "bold", color: selections[index] ? "#EDEFEE" : "#495e57",}}>
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingLeft: 15,
  },
});

export default Filters;