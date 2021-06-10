import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import Text from "../UI/CustomText";
import TouchableCard from "../UI/TouchableCard";
import { useTheme } from "@react-navigation/native";
import { colors } from "react-native-elements";
import Card from "../UI/Card";

const ServiceRequestCard = ({ requestDetail, onPress, style, children }) => {
	const { colors } = useTheme();
	return (
		<TouchableCard
			style={{
				backgroundColor: colors.primary,
				...style,
			}}
			onPress={onPress}
		>
			<View
				style={{ flex: 1, backgroundColor: colors.primary, margin: 2,padding:5 }}
			>
				<Card style={styles.serviceHeadingStyle}>
					<View
						style={{
							flex: 1.5,
							justifyContent: "center",
							alignItems: "center",
							flexWrap: "wrap",
						}}
					>
						<Text
							style={{
								textAlign: "center",
								fontSize: 25,
								fontWeight: "bold",
							}}
						>
							{requestDetail.service.name}
						</Text>
					</View>
					<View
						style={{
							flex: 0.5,
							justifyContent: "center",
							alignItems: "center",
							flexWrap: "wrap",
						}}
					>
						<Text
							style={{
								textAlign: "center",
								marginTop: 1,
								fontSize: 14,
							}}
						>
							Contact : {requestDetail.service.phone_number}
						</Text>
					</View>
				</Card>
				<Card style={styles.cardItemStyle}>
					<View style={{ margin: 1, flex: 1 }}>
						<Text style={{ textAlign: "center", fontSize: 18 }}>
							Items :
						</Text>
					</View>
					<View
						style={{
							flex: 2,
							flexWrap: "wrap",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<ScrollView>
							{requestDetail.items.map((item, index) => (
								<Text key={index} style={styles.itemStyle}>
									{item}
								</Text>
							))}
						</ScrollView>
					</View>
				</Card>
				{children}
			</View>
		</TouchableCard>
	);
};

export default ServiceRequestCard;

const styles = StyleSheet.create({
	serviceHeadingStyle: {
		width: "80%",
		aspectRatio: 8 / 3,
		marginVertical: 5,
		padding: 10,
		justifyContent: "center",
		alignContent: "center",
		flex: 1,
		alignItems: "center",
	},
	cardItemStyle: {
		width: "80%",
		aspectRatio: 8 / 3,
		marginVertical: 5,
		padding: 10,
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "column",
	},
	itemStyle: {
		flex: 1,
		justifyContent: "center",
		alignContent: "flex-start",
		alignItems: "center",
		fontSize: 15,
		padding: 4,
	},
});
