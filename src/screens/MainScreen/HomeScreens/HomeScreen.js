import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import Text from "../../../components/UI/CustomText";
import Card from "../../../components/UI/Card";
import { useTheme } from "@react-navigation/native";

const features = [
	{
		name: "Hostel Parivaar",
		img: "",
	},
	{
		name: "Hostel Saathi",
		img: "",
	},
	{
		name: "Hostel Samachaar",
		img: "",
	},
	{
		name: "Hostel Gup-Shup",
		img: "",
	},
];

const HomeScreen = () => {
	const { colors } = useTheme();
	return (
		<View style={{ flex: 1 }}>
			<ScrollView>
				{features.map(({ name, img }, index) => (
					<Card
						key={index}
						style={{
							flex: 1,
							height: 180,
							justifyContent: "flex-end",
							alignItems: "flex-end",
							padding: 10,
							backgroundColor: colors.card,
							margin: 10,
						}}
					>
						<Text style={{ fontWeight: "bold", fontSize: 20 }}>
							{name}
						</Text>
					</Card>
				))}
			</ScrollView>
		</View>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({});
