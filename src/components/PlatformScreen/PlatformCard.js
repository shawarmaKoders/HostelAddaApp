import React from "react";
import { StyleSheet, View, Image } from "react-native";
import Text from "../UI/CustomText";
import { useTheme } from "@react-navigation/native";
import TouchableCard from "../UI/TouchableCard";

const PlatformCard = ({ platformDetail, onPress = () => {}, style }) => {
	const { colors } = useTheme();
	return (
		<TouchableCard style={{ width: 120, ...style }} onPress={onPress}>
			<View style={styles.cardStyle}>
				<Image
					source={{ uri: platformDetail.logo }}
					style={styles.imageStyle}
				/>

				<Text style={styles.nameStyle}>{platformDetail.name}</Text>
			</View>
		</TouchableCard>
	);
};

export default PlatformCard;

const styles = StyleSheet.create({
	cardStyle: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
		padding: 10,
	},
	imageStyle: {
		width: 120,
		height: 120,
	},
	nameStyle: {
		marginTop: 10,
	},
});
