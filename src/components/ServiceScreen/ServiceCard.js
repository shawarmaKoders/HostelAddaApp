import React, { useState } from "react";
import { StyleSheet, View, TextInput, Alert ,Image } from "react-native";
import Text from "../UI/CustomText";
import Button from "../UI/ModalButton";
import { useTheme } from "@react-navigation/native";
import TouchableCard from "../UI/TouchableCard";



const ServiceCard = ({ serviceDetail, onPress = () => {}, style }) => {
	const { colors } = useTheme();
	return (
		<TouchableCard style={{ width: 120, ...style }} onPress={onPress}>
			<View
				style={styles.cardStyle}
			>
			<Image source={{uri: serviceDetail.image}}

       style={styles.imageStyle} />
		
				<Text style={styles.nameStyle}>{serviceDetail.name}</Text>
			</View>
			
		</TouchableCard>
	);
};

export default ServiceCard;

const styles = StyleSheet.create({
	cardStyle:{
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
		padding:10
	},
	imageStyle:{
	width: 120,
	 height: 120
	},
	nameStyle:{
		marginTop:10
	}
});
