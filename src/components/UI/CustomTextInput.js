import React from "react";
import { TextInput } from "react-native";
import { useTheme } from "@react-navigation/native";

const CustomTextInput = (props) => {
	const { colors } = useTheme();
	return (
		<TextInput
			{...props}
			style={{
				color: colors.text,
				backgroundColor: colors.border,
				paddingHorizontal: 5,
			}}
			placeholderTextColor="#666"
		/>
	);
};

export default CustomTextInput;
