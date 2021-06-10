import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert, Image } from "react-native";
import axios from "../../../customAxios";
import { useTheme } from "@react-navigation/native";
import ServiceRequestCard from "../../../components/ServiceScreen/ServiceRequestCard";
import PersonInfoCard from "../../../components/PersonInfoCard";
import Button from "../../../components/UI/ModalButton";
import CenterModal from "../../../components/UI/CenterModal";
import Text from "../../../components/UI/CustomText";
const { backendDomain } = require("../../../constants/appSettings").default;

const makePaymentRequest = async ({ request_id }) => {
	const url = `${backendDomain}/payment/request/${request_id}`;
	const response = await axios.get(url);
	return response.data;
};

const viewReceipt = async ({ request_id }) => {
	const url = `${backendDomain}/payment/get-receipt/${request_id}`;
	console.log({ url });
	const response = await axios.get(url);
	console.log({ response });
	return response;
};

const DeliverTimeConfirm = ({ navigation, route }) => {
	const { requestDetail } = route.params;
	const { colors } = useTheme();
	const [receiptModalVisible, setReceiptModalVisible] = useState(false);
	const [localPaymentStatus, setLocalPaymentStatus] = useState(
		requestDetail.payment_status
	);

	const onPaymentRequest = () => {
		makePaymentRequest({ request_id: requestDetail._id })
			.then((responseData) => {
				setLocalPaymentStatus("requested");
			})
			.catch((err) =>
				Alert.alert(`Failed to make Payment Request. ${err.message}`)
			);
	};

	const onViewReceipt = () => {
		// viewReceipt({ request_id: requestDetail._id });
		setReceiptModalVisible(true);
	};

	const closeImageModal = () => setReceiptModalVisible(false);

	return (
		<View style={styles.rootView}>
			<ServiceRequestCard
				requestDetail={requestDetail}
				style={{ flex: 1 }}
			/>
			<PersonInfoCard
				user={requestDetail.request_user}
				style={{ flex: 1, backgroundColor: colors.background }}
			/>
			<View
				style={{
					width: "100%",
					flexDirection: "row",
					justifyContent: "space-evenly",
				}}
			>
				{localPaymentStatus === "un-requested" ? (
					<Button text="Request Payment" onPress={onPaymentRequest} />
				) : localPaymentStatus === "captured" ? (
					<Button text="View Receipt" onPress={onViewReceipt} />
				) : (
					<Text>Payment Requested!</Text>
				)}
			</View>
			<CenterModal
				visible={receiptModalVisible}
				onCancel={closeImageModal}
			>
				<Image
					source={{
						uri: `${backendDomain}/payment/get-receipt/${requestDetail._id}`,
					}}
					style={{
						height: 220,
						width: 170,
						resizeMode: "contain",
					}}
				/>
				<View
					style={{
						width: 200,
						flexDirection: "row",
						justifyContent: "space-evenly",
					}}
				>
					<Button
						text="Download"
						onPress={() => {
							Alert.alert("<To be implemented>");
							closeImageModal();
						}}
					/>
					<Button text="OK" onPress={closeImageModal} />
				</View>
			</CenterModal>
		</View>
	);
};

export default DeliverTimeConfirm;

const styles = StyleSheet.create({
	rootView: {
		flex: 1,
		alignItems: "center",
	},
});
