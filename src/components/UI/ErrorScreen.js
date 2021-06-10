import React from "react";
import { View } from "react-native";
import Text from "./CustomText";

const ErrorScreen = ({ msg }) => {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Text>{msg || "There seems to some connectivity issue!"}</Text>
		</View>
	);
};

export default ErrorScreen;
