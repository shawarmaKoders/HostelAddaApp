import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useTheme } from "@react-navigation/native";

const LoadingScreen = () => {
	const { colors } = useTheme();
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<ActivityIndicator size="large" color={colors.primary} />
		</View>
	);
};

export default LoadingScreen;
