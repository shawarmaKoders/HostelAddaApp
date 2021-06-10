import React from "react";
import { StyleSheet, View } from "react-native";
import Text from "../components/UI/CustomText";
import { useTheme } from "@react-navigation/native";

const SomeScreen = () => {
	const { colors } = useTheme();
	return (
		<View>
			<Text>Some Screen Text</Text>
		</View>
	);
};

export default SomeScreen;

const styles = StyleSheet.create({});
