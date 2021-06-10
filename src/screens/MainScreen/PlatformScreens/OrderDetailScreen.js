import React, { useEffect, useState } from "react";
import axios from "../../../customAxios";
import { View, FlatList } from "react-native";
import Text from "../../../components/UI/CustomText";
import LoadingScreen from "../../../components/UI/LoadingScreen";
import ErrorScreen from "../../../components/UI/ErrorScreen";
import OrderProductCard from "../../../components/PlatformScreen/OrderProductCard";
import CompletionBar from "../../../components/UI/CompletionBar";
import appSettings from "../../../constants/appSettings";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import Button from "../../../components/UI/ModalButton";
import CenterModal from "../../../components/UI/CenterModal";
import * as ImagePicker from "expo-image-picker";
const { backendDomain } = appSettings;

const renderOrderProduct = ({ item }) => (
	<OrderProductCard orderProduct={item} />
);

const fetchOrders = async (order_id) => {
	const url = `${backendDomain}/orders/private/${order_id}`;
	const response = await axios.get(url);
	return response.data;
};

const markPaymentInCash = async (orderDetailID, orderID) => {
	const url = `${backendDomain}/orderDetails/mark-cash-payment/${orderDetailID}`;
	const response = await axios.patch(url, { order_id: orderID });
	return response.data;
};

const uploadReceipt = async (
	orderDetailID,
	orderID,
	{ localUri, filename, type }
) => {
	const formData = new FormData();
	formData.append("receipt_img", { uri: localUri, name: filename, type });
	formData.append("order_id", orderID);
	const res = await axios.patch(
		`${backendDomain}/orderDetails/add-payment-receipt/${orderDetailID}`,
		formData,
		true,
		{ "content-type": "multipart/form-data" }
	);
	return res.data;
};

const _pickImage = async (orderDetailID, orderID) => {
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
		await uploadReceipt(orderDetailID, orderID, {
			localUri,
			filename,
			type,
		});
	} else throw Error("Image Selection Cancelled!");
};

const OrderDetailScreen = ({ navigation, route }) => {
	const { platformDetail, orderDetail } = route.params;

	const [loading, setLoading] = useState(true);
	const [reqErr, setReqErr] = useState(false);
	const [orderData, setOrderData] = useState(null);

	const [payOnline, setPayOnline] = useState(false);
	const [modalLoading, setModalLoading] = useState(false);
	const [receiptModalVisible, setReceiptModalVisible] = useState(false);

	useEffect(() => {
		fetchOrders(orderDetail._id)
			.then((fetchedOrderData) => {
				setOrderData(fetchedOrderData);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
				setReqErr(true);
			});
	}, []);

	const onMarkPayment = () => setReceiptModalVisible(true);
	const closePaymentModal = () => setReceiptModalVisible(false);

	const setCompletedPayment = (paymentMode) => {
		setOrderData((oldOrderData) => ({
			...oldOrderData,
			my_order_details: {
				...oldOrderData.my_order_details,
				payment: {
					...oldOrderData.my_order_details.payment,
					status: "completed",
					mode: paymentMode,
				},
			},
		}));
	};

	const onPaidInCash = () => {
		setModalLoading(true);
		markPaymentInCash(orderData.my_order_details._id, orderDetail._id)
			.then(() => {
				setCompletedPayment("Cash");
				setModalLoading(false);
				closePaymentModal();
			})
			.catch((err) => {
				console.log(err);
				setModalLoading(false);
			});
	};

	const onPaidOnline = () => {
		setPayOnline(true);
	};

	const onUploadReceipt = () => {
		setModalLoading(true);
		_pickImage(orderData.my_order_details._id, orderDetail._id)
			.then(() => {
				setCompletedPayment("Online");
				setModalLoading(false);
				closePaymentModal();
			})
			.catch((err) => {
				console.log(err);
				setModalLoading(false);
			});
	};

	return loading ? (
		<LoadingScreen />
	) : reqErr ? (
		<ErrorScreen msg="There seems to be an error fetching the orders!" />
	) : (
		<View style={{ flex: 1, padding: 5 }}>
			<View style={{ flex: 1, opacity: receiptModalVisible ? 0.3 : 1 }}>
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
							style={{ fontWeight: "bold", textAlign: "center" }}
						>
							Total Amount: ₹{orderData.public_list_total}
						</Text>
					</View>
					<FlatList
						style={{ flex: 1 }}
						contentContainerStyle={{
							width: "100%",
							borderRadius: 5,
						}}
						data={Object.values(orderData.public_products)}
						keyExtractor={(item) => item.product._id}
						renderItem={renderOrderProduct}
					/>
				</View>

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
							style={{ fontWeight: "bold", textAlign: "center" }}
						>
							Total Amount: ₹{orderData.private_list_total}
						</Text>
					</View>
					<FlatList
						style={{ flex: 1 }}
						contentContainerStyle={{
							width: "100%",
							borderRadius: 5,
						}}
						data={Object.values(orderData.private_products)}
						keyExtractor={(item) => item.product._id}
						renderItem={renderOrderProduct}
					/>
				</View>

				<View style={{ flex: 2, paddingVertical: 5 }}>
					<View style={{ width: "100%", paddingVertical: 5 }}>
						<CompletionBar
							percentage={
								((orderData.private_list_total +
									orderData.public_list_total) /
									orderDetail.target_amount) *
								100
							}
						/>
					</View>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							paddingHorizontal: 10,
						}}
					>
						<View>
							<Text>
								Order Total:{" ₹"}
								{orderData.private_list_total +
									orderData.public_list_total}
							</Text>
						</View>
						<View>
							<Text>
								Target Amount: ₹{orderDetail.target_amount}
							</Text>
						</View>
					</View>
					<View style={{ marginVertical: 5 }}>
						<Text
							style={{
								textAlign: "center",
								fontWeight: "bold",
								fontSize: 16,
							}}
						>
							{`Your Order Total: ₹${orderData.current_user_total}`}
						</Text>
					</View>
				</View>
				{!orderDetail.is_admin && orderDetail.status !== "Initiated" && (
					<View
						style={{
							flex: 1,
							paddingVertical: 5,
							flexDirection: "row",
							justifyContent: "space-evenly",
							alignItems: "center",
						}}
					>
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
										orderData.my_order_details
											.personal_room_id,
								})
							}
						/>
						{orderDetail.status === "Finalized" &&
							orderData.my_order_details.payment.status ===
								"requested" && (
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
												name="md-done-all"
												size={24}
												color="black"
											/>
										</View>
									}
									onPress={onMarkPayment}
								/>
							)}
					</View>
				)}
				{orderDetail.is_admin &&
					(orderDetail.status === "Ordered" ||
						orderDetail.status === "Completed") && (
						<View
							style={{
								flex: 1,
								paddingVertical: 5,
								flexDirection: "row",
								justifyContent: "space-evenly",
								alignItems: "center",
							}}
						>
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
											orderData.my_order_details
												.personal_room_id,
									})
								}
							/>
						</View>
					)}
			</View>

			<CenterModal
				visible={receiptModalVisible}
				onCancel={modalLoading ? null : closePaymentModal}
			>
				<View style={{ width: 200 }}>
					{modalLoading ? (
						<LoadingScreen />
					) : payOnline ? (
						<>
							<Text
								style={{
									textAlign: "center",
									fontWeight: "bold",
								}}
							>
								Paid Online
							</Text>
							<Button
								text="Upload Payment Receipt"
								onPress={onUploadReceipt}
							/>
						</>
					) : (
						<>
							<Button
								text="Paid in Cash"
								onPress={onPaidInCash}
							/>
							<Button text="Paid Online" onPress={onPaidOnline} />
						</>
					)}
				</View>
			</CenterModal>
		</View>
	);
};

export default OrderDetailScreen;
