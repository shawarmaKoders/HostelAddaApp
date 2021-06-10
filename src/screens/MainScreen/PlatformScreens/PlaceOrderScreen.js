import React, { useState } from "react";
import axios from "../../../customAxios";
import { View, FlatList } from "react-native";
import Text from "../../../components/UI/CustomText";
import LoadingScreen from "../../../components/UI/LoadingScreen";
import OrderProductCard from "../../../components/PlatformScreen/OrderProductCard";
import EnterOrderDetail from "../../../components/PlatformScreen/EnterOrderDetail";
import OrderListComp from "../../../components/PlatformScreen/OrderListComp";
import AddProductLink from "../../../components/PlatformScreen/AddProductLink";
import Button from "../../../components/UI/ModalButton";
import Modal from "../../../components/UI/CenterModal";
import appSettings from "../../../constants/appSettings";
const { backendDomain } = appSettings;

const placeOrder = async (public_list, private_list, platform_id) => {
	const url = `${backendDomain}/orders/initiate-new-order`;
	const payload = {
		public_list: Object.values(public_list),
		private_list: Object.values(private_list),
		platform_id,
	};
	payload.total_amount =
		sumUpList(payload.public_list) + sumUpList(payload.private_list);
	const response = await axios.post(url, payload);
	return response.data;
};

const renderOrderProduct = ({ item }) => (
	<OrderProductCard orderProduct={item} />
);

const sumUpList = (orderListArray) =>
	orderListArray.reduce((accumulator, { amount }) => accumulator + amount, 0);

const calculateListTotal = (orderList) => sumUpList(Object.values(orderList));

const PlaceOrderScreen = ({ navigation, route }) => {
	const { platformDetail } = route.params;

	const [loading, setLoading] = useState(false);
	const [orderData, setOrderData] = useState({
		public_list_total: 0,
		private_list_total: 0,
		public_products: {},
	});

	const [addOrderModalVisible, setAddOrderModalVisible] = useState(false);
	const [productData, setProductData] = useState(null);

	const [userOrderPublicList, setUserOrderPublicList] = useState({});
	const [userOrderPrivateList, setUserOrderPrivateList] = useState({});

	const [newPrivateOrderData, setNewPrivateOrderData] = useState({});

	const [orderListModalVisible, setOrderListModalVisible] = useState(false);

	const closeAddOrderModal = () => {
		setProductData(null);
		setAddOrderModalVisible(false);
	};
	const onAddProduct = () => {
		setAddOrderModalVisible(true);
	};
	const onShowOrderListModal = () => setOrderListModalVisible(true);
	const closeOrderListModal = () => setOrderListModalVisible(false);

	const onSubmitOrderDetail = ({ quantity, unit, inPrivateList }) => {
		console.log({ quantity, unit, inPrivateList, productData });
		if (!inPrivateList) {
			const publicOrder = {
				product_id: productData._id,
				quantity,
				unit_ordered: unit.unit_quantity,
				amount: unit.price * quantity,
				offer_available: false,
			};
			const productKey = `${publicOrder.product_id}|${publicOrder.unit_ordered}`;
			setUserOrderPublicList((currentPublicList) => ({
				...currentPublicList,
				[productKey]: publicOrder,
			}));
			const publicListAmount = calculateListTotal({
				...userOrderPublicList,
				[productKey]: publicOrder,
			});
			setOrderData((currentOrderData) => {
				let newOrderData = null;
				if (
					publicOrder.product_id in currentOrderData.public_products
				) {
					newOrderData = {
						...currentOrderData,
						public_products: {
							...currentOrderData.public_products,
							[publicOrder.product_id]: {
								orders: {
									...currentOrderData.public_products[
										publicOrder.product_id
									].orders,
									[unit.unit_quantity]: {
										price: unit.price,
										quantity: quantity,
									},
								},
								product: productData,
							},
						},
					};
				} else
					newOrderData = {
						...currentOrderData,
						public_products: {
							...currentOrderData.public_products,
							[publicOrder.product_id]: {
								orders: {
									[unit.unit_quantity]: {
										price: unit.price,
										quantity: quantity,
									},
								},
								product: productData,
							},
						},
					};

				newOrderData.public_list_total = publicListAmount;
				return newOrderData;
			});
		} else {
			const privateOrder = {
				product_id: productData._id,
				quantity,
				amount: unit.price * quantity,
				unit_ordered: unit.unit_quantity,
			};
			const productKey = `${privateOrder.product_id}|${privateOrder.unit_ordered}`;
			setUserOrderPrivateList((currentPrivateList) => ({
				...currentPrivateList,
				[productKey]: privateOrder,
			}));
			setNewPrivateOrderData((currentPrivateOrderData) => {
				let currentOrderDataOrders = {};
				if (privateOrder.product_id in currentPrivateOrderData)
					currentOrderDataOrders =
						currentPrivateOrderData[privateOrder.product_id].orders;
				return {
					...currentPrivateOrderData,
					[privateOrder.product_id]: {
						orders: {
							...currentOrderDataOrders,
							[unit.unit_quantity]: {
								price: unit.price,
								quantity: quantity,
							},
						},
						product: productData,
					},
				};
			});
			const privateListAmount = calculateListTotal({
				...userOrderPrivateList,
				[productKey]: privateOrder,
			});
			setOrderData((currentOrderData) => ({
				...currentOrderData,
				private_list_total: privateListAmount,
			}));
		}
		closeAddOrderModal();
	};

	const onPlaceOrder = () => {
		setLoading(true);
		placeOrder(
			userOrderPublicList,
			userOrderPrivateList,
			platformDetail._id
		)
			.then((response_data) => {
				setLoading(false);
				console.log({ response_data });
				navigation.navigate("MyOrders", { platformDetail });
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	};

	const orderTotal =
		calculateListTotal(userOrderPublicList) +
		calculateListTotal(userOrderPrivateList);

	return loading ? (
		<LoadingScreen />
	) : (
		<>
			<View
				style={{
					flex: 1,
					padding: 5,
					opacity:
						addOrderModalVisible || orderListModalVisible ? 0.3 : 1,
				}}
			>
				<View
					style={{
						flex:
							Object.keys(newPrivateOrderData).length > 0
								? 12
								: 1.5,
						padding: 5,
					}}
				>
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

				<View style={{ flex: 1.5, alignItems: "center", padding: 5 }}>
					<Text style={{ fontWeight: "bold", fontSize: 20 }}>
						Private List
					</Text>
					<View style={{ flex: 1, paddingBottom: 5 }}>
						<Text
							style={{ fontWeight: "bold", textAlign: "center" }}
						>
							Total Amount: ₹{orderData.private_list_total}
						</Text>
					</View>
				</View>

				<View style={{ flex: 1.5, paddingVertical: 5 }}>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "center",
							paddingHorizontal: 10,
						}}
					>
						<Text>
							Order Total:{" ₹"}
							{orderData.private_list_total +
								orderData.public_list_total}
						</Text>
					</View>
					<View style={{ marginVertical: 5 }}>
						<Text
							style={{
								textAlign: "center",
								fontWeight: "bold",
								fontSize: 16,
							}}
						>
							{`Your Order Total: ₹${orderTotal}`}
						</Text>
					</View>
				</View>

				<View
					style={{
						flex: 2,
						flexDirection: "row",
						justifyContent: "space-evenly",
						alignItems: "center",
					}}
				>
					<Button text="Add Product" onPress={onAddProduct} />
					{Object.keys(newPrivateOrderData).length > 0 && (
						<Button
							text="Show Private"
							onPress={onShowOrderListModal}
						/>
					)}
					{orderTotal > 0 && (
						<Button text="Place Order" onPress={onPlaceOrder} />
					)}
				</View>
			</View>
			<Modal
				visible={orderListModalVisible}
				onCancel={closeOrderListModal}
				outerStyle={{ width: "70%", alignSelf: "center" }}
				innerStyle={{ padding: 5, width: "100%" }}
			>
				<View style={{ width: "100%", height: 500, borderRadius: 10 }}>
					<OrderListComp orderList={newPrivateOrderData} />
				</View>
			</Modal>
			<Modal visible={addOrderModalVisible} onCancel={closeAddOrderModal}>
				{productData ? (
					<EnterOrderDetail
						productData={productData}
						onSubmitOrderDetail={onSubmitOrderDetail}
					/>
				) : (
					<AddProductLink
						platformDetail={platformDetail}
						setProductData={setProductData}
					/>
				)}
			</Modal>
		</>
	);
};

export default PlaceOrderScreen;
