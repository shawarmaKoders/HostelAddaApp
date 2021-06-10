import React from "react";
import { StyleSheet, View, Image } from "react-native";
import Text from "./UI/CustomText";
import { useTheme } from "@react-navigation/native";
import Card from "./UI/Card";

const PersonInfoCard = ({ user, style, horizontal = false }) => {
	const { colors } = useTheme();
	return (
		<Card style={{ justifyContent: "center", ...style }}>
			<View
				style={{
					...styles.cardStyle,
					flexDirection: horizontal ? "row" : "column",
					justifyContent: horizontal ? "space-between" : "center",
				}}
			>
				<Image
					source={{ uri: user.avatar }}
					source={{
						uri:
							"https://banner2.cleanpng.com/20180603/jx/kisspng-user-interface-design-computer-icons-default-stephen-salazar-photography-5b1462e1b19d70.1261504615280626897275.jpg",
					}}
					style={{
						...styles.imageStyle,
						width: horizontal ? 70 : 120,
						height: horizontal ? 70 : 120,
					}}
				/>
				<Text style={styles.nameStyle}>{user.name}</Text>
			</View>
		</Card>
	);
};

export default PersonInfoCard;

const styles = StyleSheet.create({
	cardStyle: {
		alignItems: "center",
		padding: 10,
	},
	imageStyle: {
		borderRadius: 10,
	},
	nameStyle: {
		marginTop: 10,
		padding: 10,
		textAlign: "center",
	},
});
