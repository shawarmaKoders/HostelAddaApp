import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import Text from "../../../components/UI/CustomText";
import Button from "../../../components/UI/ModalButton";
import ServiceRequestCard from "../../../components/ServiceScreen/ServiceRequestCard";
import PersonInfoCard from "../../../components/PersonInfoCard";
import { useTheme } from "@react-navigation/native";
import LoadingScreen from "../../../components/UI/LoadingScreen";

import appSettings from "../../../constants/appSettings";
import axios from "../../../customAxios";
const { backendDomain } = appSettings;

const confirmRequest = async ({ requestId }) => {
	const url = `${backendDomain}/service-request/confirm/${requestId}`;
	const response = await axios.patch(url);
	return response.data;
};

const RequestDetailScreen = ({ navigation, route }) => {
	const { requestDetail } = route.params;
	const { colors } = useTheme();
	const [loading, setLoading] = useState(false);
	const onConfirm = () => {
		setLoading(true);
		confirmRequest({ requestId: requestDetail._id })
			.then((request) => {
				setLoading(false);
				navigation.navigate("ConfirmedRequests");
			})
			.catch((err) => {
				const errResponse = err.response;
				console.log({ err, errResponse });
			});
	};
	if (loading) return <LoadingScreen />;
	return (
		<View style={styles.rootView}>
			<ServiceRequestCard
				requestDetail={requestDetail}
				style={{ flex: 1 }}
			/>
			<PersonInfoCard
				user={requestDetail.service_user}
				style={{ flex: 1 }}
			/>
			<Button text="Confirm" onPress={onConfirm} />
		</View>
	);
};

export default RequestDetailScreen;

const styles = StyleSheet.create({
	rootView: {
		flex: 1,
		alignItems: "center",
	},
});
