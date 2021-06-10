import React from "react";
import { Text } from "react-native";
import { useTheme } from "@react-navigation/native";

const CustomText = (props) => {
	const { colors } = useTheme();
	return <Text {...props} style={{ ...props.style, color: colors.text }} />;
};

export default CustomText;
