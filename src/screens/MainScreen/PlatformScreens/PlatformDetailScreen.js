import React from "react";
import { StyleSheet, View, Alert, Image } from "react-native";
import Text from "../../../components/UI/CustomText";
import Button from "../../../components/UI/ModalButton";
import { useTheme } from "@react-navigation/native";

const PlatformDetailScreen = ({ navigation, route }) => {
	const { platformDetail } = route.params;
	const { colors } = useTheme();
	return (
		<View style={{ flex: 1 }}>
			<View
				style={{
					justifyContent: "center",
					alignItems: "center",
					flex: 1,
					width: "100%",
				}}
			>
				<Image
					source={{ uri: platformDetail.logo }}
					style={{
						height: "60%",
						minWidth: "50%",
						borderRadius: 10,
						resizeMode: "contain",
					}}
				/>
				<View style={{ marginVertical: 5 }}>
					<Text
						style={{
							justifyContent: "center",
							textAlign: "center",
							fontWeight: "bold",
							fontSize: 20,
						}}
					>
						{platformDetail.name}
					</Text>
				</View>
			</View>
			<View style={styles.buttonContainer}>
				<Button
					text="Place Order"
					onPress={() =>
						navigation.navigate("PlaceOrder", {
							platformDetail,
						})
					}
					style={{ margin: 10, width: "50%" }}
				/>
				<Button
					text="View Other's Orders"
					onPress={() =>
						navigation.navigate("ParivaarOrders", {
							platformDetail,
						})
					}
					style={{ margin: 10, width: "50%" }}
				/>
				<Button
					text="View My Active Orders"
					onPress={() =>
						navigation.navigate("MyOrders", {
							platformDetail,
						})
					}
					style={{ margin: 10, width: "50%" }}
				/>
			</View>
		</View>
	);
};

export default PlatformDetailScreen;

const styles = StyleSheet.create({
	buttonContainer: {
		flex: 1,
		width: "100%",
		marginVertical: 10,
		alignItems: "center",
	},
});
