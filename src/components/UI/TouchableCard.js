import React from "react";
import {
	StyleSheet,
	TouchableOpacity,
	Platform,
	TouchableNativeFeedback,
} from "react-native";
import Card from "./Card";

let TouchableCmp = TouchableOpacity;

if (Platform.OS === "android" && Platform.Version >= 21) {
	TouchableCmp = TouchableNativeFeedback;
}

const TouchableCard = ({ onPress, children, style }) => {
	return (
		<Card style={{ ...styles.cardContainer, ...style }}>
			<TouchableCmp style={{ flex: 1 }} onPress={onPress}>
				{children}
			</TouchableCmp>
		</Card>
	);
};

export default TouchableCard;

const styles = StyleSheet.create({
	cardContainer: {
		margin: 15,
		height: 150,
		borderRadius: 10,
		overflow:
			Platform.OS === "android" && Platform.Version >= 21
				? "hidden"
				: "visible",
	},
});
