import React from "react";
import { useTheme } from "@react-navigation/native";
import { View } from "react-native";

const CompletionBar = ({ percentage, style = {} }) => {
	const { colors } = useTheme();
	return (
		<View
			style={{
				height: 10,
				width: "90%",
				alignSelf: "center",
				backgroundColor: colors.text,
				borderRadius: 10,
				...style,
			}}
		>
			<View
				style={{
					height: "100%",
					width: `${Math.min(100, percentage)}%`,
					backgroundColor: colors.primary,
					borderRadius: 10,
				}}
			/>
		</View>
	);
};
export default CompletionBar;
