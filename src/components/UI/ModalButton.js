import React from "react";
import { StyleSheet, View, TouchableHighlight, Text } from "react-native";
import { useTheme } from "@react-navigation/native";

const ModalButton = ({ onPress, text, icon, style = { marginTop: 10 } }) => {
	const { colors } = useTheme();
	return (
		<TouchableHighlight
			style={{
				...styles.openButton,
				backgroundColor: colors.primary,
				...style,
			}}
			onPress={onPress}
		>
			<View
				style={{
					flexDirection: "row",
					alignContent: "center",
					justifyContent: "space-around",
				}}
			>
				{icon && <View style={{ marginHorizontal: 5 }}>{icon}</View>}
				{text && (
					<View style={{ marginHorizontal: 5 }}>
						<Text style={{ color: "white", textAlign: "center" }}>
							{text}
						</Text>
					</View>
				)}
			</View>
		</TouchableHighlight>
	);
};

export default ModalButton;

const styles = StyleSheet.create({
	openButton: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
});
