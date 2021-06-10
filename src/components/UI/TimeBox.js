import React from "react";
import {
	StyleSheet,
	TouchableOpacity,
	Platform,
	TouchableNativeFeedback,
	View,
} from "react-native";
import Text from "./CustomText";
import { useTheme } from "@react-navigation/native";

let TouchableCmp = TouchableOpacity;

if (Platform.OS === "android" && Platform.Version >= 21) {
	TouchableCmp = TouchableNativeFeedback;
}

const pad = (number) => `${number}`.padStart(2, "0");

const TimeBox = ({ time, onPress, style }) => {
	const { colors } = useTheme();
	return (
		<View
			style={{
				backgroundColor: colors.border,
				padding: 5,
				borderRadius: 10,
				...style,
			}}
		>
			<TouchableCmp onPress={onPress}>
				<Text style={{ fontWeight: "bold", fontSize: 25 }}>
					{`${pad(time.getHours())} : ${pad(time.getMinutes())}`}
				</Text>
			</TouchableCmp>
		</View>
	);
};

export default TimeBox;

const styles = StyleSheet.create({});
