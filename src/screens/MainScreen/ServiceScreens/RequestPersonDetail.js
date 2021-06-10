import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert, ScrollView } from "react-native";
import Text from "../../../components/UI/CustomText";
import Button from "../../../components/UI/ModalButton";
import { useTheme } from "@react-navigation/native";
import Card from "../../../components/UI/Card";
import { colors } from "react-native-elements";
import appSettings from "../../../constants/appSettings";
import axios from "../../../customAxios";
import LoadingScreen from "../../../components/UI/LoadingScreen";
const { backendDomain } = appSettings;

const createRequest = async (service_id, itemDescriptions, service_user_id) => {
	const url = `${backendDomain}/service-request`;
	const response = await axios.post(url, {
		service_user_id,
		service_id,
		items: itemDescriptions,
	});
	return response.data;
};

const RequestPersonDetail = ({ navigation, route }) => {
	const {
		serviceDetail,
		itemDescriptions,
		person: deliveryPerson,
		trip_id,
	} = route.params;
	const [loading, setLoading] = useState(false);

	const { colors } = useTheme();
	const onConfirm = () => {
		setLoading(true);
		createRequest(serviceDetail._id, itemDescriptions, deliveryPerson._id)
			.then((request) => {
				setLoading(false);
				navigation.navigate("PendingRequests");
			})
			.catch((err) => {
				console.log(err);
			});
	};
	if (loading) return <LoadingScreen />;
	return (
		<View style={styles.rootView}>
			<Card style={styles.cardHeaderStyle}>
				<Text
					style={{
						textAlign: "center",
						fontSize: 25,
						fontWeight: "bold",
					}}
				>
					{deliveryPerson.name}
				</Text>
				<Text style={{ textAlign: "center", marginTop: 3 }}>
					{deliveryPerson.hostel_details.building}
				</Text>
			</Card>
			<Text style={styles.textHeadingStyle}>Your ordered items :</Text>

			<Card style={styles.cardItemStyle}>
				<View>
					<ScrollView>
						{itemDescriptions.map((item, index) => (
							<Text key={index} style={styles.itemStyle}>
								{item}
							</Text>
						))}
					</ScrollView>
				</View>
			</Card>

			<Button text="Confirm" onPress={onConfirm} />
		</View>
	);
};

export default RequestPersonDetail;

const styles = StyleSheet.create({
	rootView: {
		flex: 1,
		alignItems: "center",
	},
	itemStyle: {
		flex: 1,
		justifyContent: "center",
		alignContent: "flex-start",
		alignItems: "center",
		fontSize: 15,
		padding: 4,
	},
	cardHeaderStyle: {
		width: 340,
		height: 70,
		marginVertical: 15,
		padding: 10,
		borderColor: colors.primary,
		borderWidth: 1,
	},
	cardItemStyle: {
		width: 220,
		height: 50,
		marginVertical: 15,
		padding: 10,
		borderBottomColor: colors.primary,
		borderRightColor: colors.primary,
		borderWidth: 1,
		alignItems: "center",
		justifyContent: "center",
		margin: 1,
	},
	textHeadingStyle: {
		fontSize: 18,
		margin: 5,
		backgroundColor: colors.primary,
		width: 180,
		height: 40,
		padding: 8,
		borderRadius: 10,
		textAlign: "center",
	},
});
