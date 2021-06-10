import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert, Image } from "react-native";
import Text from "../../../components/UI/CustomText";
import Button from "../../../components/UI/ModalButton";
import { useTheme } from "@react-navigation/native";

const ServiceDetailScreen = ({ navigation, route }) => {
	const { serviceDetail } = route.params;
	const { colors } = useTheme();
	const onConfirm = () => {
		Alert.alert("<To be implemented>");
	};
	return (
		<View style={styles.rootView}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-around",
					alignItems: "center",
					marginTop: 20,
					borderWidth: 1,
					borderBottomColor: colors.primary,
					borderRightColor: colors.primary,
					borderRadius: 20,
				}}
			>
				<Image
					// source={{ uri: serviceImage }}
					style={{
						...styles.imageStyle,
						borderColor: colors.primary,
					}}
				/>
				<View
					style={{
						flex: 1,
						flexDirection: "column",
						justifyContent: "center",
						textAlign: "center",
						marginLeft: 30,
					}}
				>
					<Text
						style={{
							justifyContent: "center",
							textAlign: "center",
							fontWeight: "bold",
							fontSize: 20,
						}}
					>
						{serviceDetail.name}
					</Text>
					<Text
						style={{
							justifyContent: "center",
							textAlign: "center",
							fontWeight: "bold",
							fontSize: 14,
							margin: 2,
						}}
					>
						{serviceDetail.phone_number}
					</Text>
				</View>
			</View>
			<View style={styles.buttonContainer}>
				<Button
					text="Request"
					onPress={() =>
						navigation.navigate("RequestItems", { serviceDetail })
					}
					style={{ margin: 20, width: 100 }}
				/>
				<Button
					text="Deliver"
					onPress={() =>
						navigation.navigate("AvailableRequests", {
							serviceDetail,
						})
					}
					style={{ margin: 20, width: 100 }}
				/>
			</View>
		</View>
	);
};

export default ServiceDetailScreen;

const styles = StyleSheet.create({
	rootView: {
		flex: 1,
		alignItems: "center",
	},
	buttonContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 210,
	},
	imageStyle: {
		width: 80,
		height: 80,
		marginLeft: 40,
		borderRadius: 10,
		borderWidth: 1,
		marginVertical: 15,
	},
});
