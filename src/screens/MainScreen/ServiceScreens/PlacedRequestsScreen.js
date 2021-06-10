import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert, Image } from "react-native";
import Text from "../../../components/UI/CustomText";
import Button from "../../../components/UI/ModalButton";
import { useTheme } from "@react-navigation/native";
import PersonInfoCard from "../../../components/PersonInfoCard";
import * as ImagePicker from "expo-image-picker";
import axios from "../../../customAxios";
import LoadingScreen from "../../../components/UI/LoadingScreen";
import CenterModal from "../../../components/UI/CenterModal";
const { backendDomain } = require("../../../constants/appSettings").default;

const uploadReceipt = async (request_id, { localUri, filename, type }) => {
	const formData = new FormData();
	formData.append("receipt_img", { uri: localUri, name: filename, type });
	const res = await axios.post(
		`${backendDomain}/payment/add/${request_id}`,
		formData,
		true,
		{ "content-type": "multipart/form-data" }
	);
	return res.data;
};

const PlacedRequestsScreen = ({ navigation, route }) => {
	const {
		requestDetail: {
			_id,
			request_user_id,
			service,
			service_user,
			payment_status,
		},
	} = route.params;
	const [localPaymentStatus, setLocalPaymentStatus] = useState(
		payment_status
	);
	const { colors } = useTheme();
	const [receiptModalVisible, setReceiptModalVisible] = useState(false);
	const [loading, setLoading] = useState(true);

	const _pickImage = async () => {
		try {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				quality: 1,
			});
			if (!result.cancelled) {
				const localUri = result.uri;
				const filename = localUri.split("/").pop();
				let match = /\.(\w+)$/.exec(filename);
				let type = match ? `image/${match[1]}` : `image`;
				uploadReceipt(_id, { localUri, filename, type })
					.then(() => {
						setLocalPaymentStatus("captured");
					})
					.catch((err) => console.log(err));
			}
		} catch (E) {
			console.log(E);
		}
	};

	const onViewReceipt = () => {
		setReceiptModalVisible(true);
	};

	const closeImageModal = () => setReceiptModalVisible(false);

	return (
		<View style={styles.rootView}>
			<PersonInfoCard user={service_user} horizontal />
			{localPaymentStatus === "captured" ? (
				<Button text="View Receipt" onPress={onViewReceipt} />
			) : (
				localPaymentStatus === "requested" && (
					<Button text="Upload Receipt" onPress={_pickImage} />
				)
			)}
			<Button
				text="Mark as Done"
				onPress={() => {
					Alert.alert("<To be implemented>");
				}}
			/>
			<CenterModal
				visible={receiptModalVisible}
				onCancel={closeImageModal}
			>
				<Image
					source={{
						uri: `${backendDomain}/payment/get-receipt/${_id}`,
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

export default PlacedRequestsScreen;

const styles = StyleSheet.create({
	rootView: {
		flex: 1,
		alignItems: "center",
	},
});
