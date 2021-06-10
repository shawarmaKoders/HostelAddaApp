import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

const Card = (props) => {
	const { colors } = useTheme();
	return (
		<View
			style={{
				...styles.card,
				backgroundColor: colors.card,
				shadowColor: colors.border,
				...props.style,
			}}
		>
			{props.children}
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		shadowColor: "black",
		shadowOpacity: 0.26,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 8,
		elevation: 5,
		borderRadius: 10,
	},
});

export default Card;
