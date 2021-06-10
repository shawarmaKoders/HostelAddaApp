import React, { useEffect, useState } from "react";
import axios from "../../../customAxios";
import { View, FlatList, Image, Alert } from "react-native";
import Text from "../../../components/UI/CustomText";
import LoadingScreen from "../../../components/UI/LoadingScreen";
import ErrorScreen from "../../../components/UI/ErrorScreen";
import CenterModal from "../../../components/UI/CenterModal";
import Button from "../../../components/UI/ModalButton";
import OrderProductCard from "../../../components/PlatformScreen/OrderProductCard";
import appSettings from "../../../constants/appSettings";
import {
	Ionicons,
	MaterialCommunityIcons,
	FontAwesome,
} from "@expo/vector-icons";
const { backendDomain } = appSettings;

const renderOrderProduct = ({ item }) => (
	<OrderProductCard orderProduct={item} />
);

const fetchData = async (orderDetailID) => {
	const url = `${backendDomain}/orderDetails/private/${orderDetailID}`;
	const response = await axios.get(url);
	return response.data;
};

const acceptReceipt = async (orderDetailID, orderID) => {
	const url = `${backendDomain}/orderDetails/accept-payment/${orderDetailID}`;
	const response = await axios.patch(url, { order_id: orderID });
	return response.data;
};

const ParticipantOrderDetailScreen = ({ navigation, route }) => {
	const { orderData, participantOrderDetail: orderDetailFromPrevScreen } =
		route.params;

	const [loading, setLoading] = useState(true);
	const [reqErr, setReqErr] = useState(false);
	const [participantOrderDetail, setParticipantOrderDetail] = useState(
		orderDetailFromPrevScreen
	);
	const [participantOrderData, setParticipantOrderData] = useState(null);
	const [receiptModalVisible, setReceiptModalVisible] = useState(false);
	console.log({ orderData, participantOrderDetail });

	useEffect(() => {
		fetchData(participantOrderDetail._id)
			.then((orderDataFresh) => {
				setParticipantOrderData(orderDataFresh);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
				setReqErr(true);
			});
	}, []);

	const onViewReceipt = () => setReceiptModalVisible(true);
	const closeImageModal = () => setReceiptModalVisible(false);
	const onAcceptReceipt = () => {
		closeImageModal();
		setParticipantOrderDetail((oldOrderDetail) => ({
			...oldOrderDetail,
			payment: { ...oldOrderDetail.payment, status: "accepted" },
		}));
		acceptReceipt(participantOrderDetail._id, orderData._id)
			.then(() => {})
			.catch((err) => {
				setParticipantOrderDetail((oldOrderDetail) => ({
					...oldOrderDetail,
					payment: { ...oldOrderDetail.payment, status: "completed" },
				}));
				Alert.alert("Oh ... oh!", "Failed to accept Payment!");
				console.log(err);
			});
	};

	return loading ? (
		<LoadingScreen />
	) : reqErr ? (
		<ErrorScreen msg="There seems to be an error fetching the orders!" />
	) : (
		<View style={{ flex: 1, padding: 5 }}>
			<View style={{ flex: 1, opacity: receiptModalVisible ? 0.3 : 1 }}>
				{participantOrderData.public_list_total > 0 && (
					<View style={{ flex: 5, padding: 5 }}>
						<Text
							style={{
								fontWeight: "bold",
								textAlign: "center",
								fontSize: 20,
							}}
						>
							Public List
						</Text>
						<View style={{ paddingBottom: 5 }}>
							<Text
								style={{
									fontWeight: "bold",
									textAlign: "center",
								}}
							>
								Total Amount: ₹
								{participantOrderData.public_list_total}
							</Text>
						</View>
						<FlatList
							style={{ flex: 1 }}
							contentContainerStyle={{
								width: "100%",
								borderRadius: 5,
							}}
							data={Object.values(
								participantOrderData.public_products
							)}
							keyExtractor={(item) => item.product._id}
							renderItem={renderOrderProduct}
						/>
					</View>
				)}

				{participantOrderData.private_list_total > 0 && (
					<View style={{ flex: 5, padding: 5 }}>
						<Text
							style={{
								fontWeight: "bold",
								textAlign: "center",
								fontSize: 20,
							}}
						>
							Private List
						</Text>
						<View style={{ paddingBottom: 5 }}>
							<Text
								style={{
									fontWeight: "bold",
									textAlign: "center",
								}}
							>
								Total Amount: ₹
								{participantOrderData.private_list_total}
							</Text>
						</View>
						<FlatList
							style={{ flex: 1 }}
							contentContainerStyle={{
								width: "100%",
								borderRadius: 5,
							}}
							data={Object.values(
								participantOrderData.private_products
							)}
							keyExtractor={(item) => item.product._id}
							renderItem={renderOrderProduct}
						/>
					</View>
				)}
				<View style={{ marginVertical: 5 }}>
					<Text
						style={{
							textAlign: "center",
							fontWeight: "bold",
							fontSize: 16,
						}}
					>
						Order Total:{" ₹"}
						{participantOrderData.private_list_total +
							participantOrderData.public_list_total}
					</Text>
					{(participantOrderDetail.payment.status === "requested" ||
						participantOrderDetail.payment.status ===
							"accepted") && (
						<Text
							style={{
								textAlign: "center",
								fontWeight: "bold",
								fontSize: 16,
							}}
						>
							(Payment {participantOrderDetail.payment.status})
						</Text>
					)}
				</View>
				<View
					style={{
						flex: 1.5,
						paddingVertical: 5,
						flexDirection: "row",
						justifyContent: "space-evenly",
						alignItems: "center",
					}}
				>
					{orderData.status === "Finalized" && (
						<Button
							style={{ width: 80 }}
							icon={
								<Ionicons
									name="md-chatbubbles"
									size={24}
									color="black"
								/>
							}
							onPress={() =>
								navigation.navigate("ChatScreen", {
									chat_room_id:
										participantOrderDetail.personal_room_id,
								})
							}
						/>
					)}
					{participantOrderDetail.payment.status === "completed" &&
						(participantOrderDetail.payment.mode === "On-Line" ? (
							<Button
								style={{ width: 80 }}
								icon={
									<MaterialCommunityIcons
										name="receipt"
										size={24}
										color="black"
									/>
								}
								onPress={onViewReceipt}
							/>
						) : (
							<Button
								style={{ width: 80 }}
								icon={
									<View style={{ flexDirection: "row" }}>
										<FontAwesome
											name="rupee"
											size={24}
											color="black"
										/>
										<Ionicons
											name="md-thumbs-up"
											size={24}
											color="black"
										/>
									</View>
								}
								onPress={onAcceptReceipt}
							/>
						))}
				</View>
			</View>
			<CenterModal
				visible={receiptModalVisible}
				onCancel={closeImageModal}
			>
				<Image
					source={{
						uri: `${backendDomain}/view-payment-receipt/${participantOrderDetail._id}`,
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
						text="Report"
						onPress={() => {
							Alert.alert("Order payment reported to HostelAdda!");
							closeImageModal();
						}}
					/>
					<Button text="Accept" onPress={onAcceptReceipt} />
				</View>
			</CenterModal>
		</View>
	);
};

export default ParticipantOrderDetailScreen;
