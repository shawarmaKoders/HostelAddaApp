import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Text from "../../../components/UI/CustomText";
import axios from "../../../customAxios";
import LoadingScreen from "../../../components/UI/LoadingScreen";
import ErrorScreen from "../../../components/UI/ErrorScreen";
import OrderSummaryCard from "../../../components/PlatformScreen/OrderSummaryCard";
import appSettings from "../../../constants/appSettings";
const { backendDomain } = appSettings;

const fetchOrders = async (platform_id) => {
	const url = `${backendDomain}/orders/my-platform-orders/${platform_id}`;
	const response = await axios.get(url);
	return response.data;
};

const renderOrderSummaryCard = (platformDetail, onPress, navigation) => ({
	item: orderDetail,
}) => (
	<OrderSummaryCard
		platformDetail={platformDetail}
		onPress={onPress}
		orderDetail={orderDetail}
		navigation={navigation}
	/>
);

const MyOrdersScreen = ({ navigation, route }) => {
	const { platformDetail } = route.params;
	const [loading, setLoading] = useState(true);
	const [reqErr, setReqErr] = useState(false);
	const [orders, setOrders] = useState([]);
	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		fetchOrders(platformDetail._id)
			.then((fetchedOrders) => {
				setOrders(fetchedOrders);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
				setReqErr(true);
			});
	}, []);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		fetchOrders(platformDetail._id)
			.then((fetchedOrders) => {
				setOrders(fetchedOrders);
				setRefreshing(false);
			})
			.catch((err) => {
				console.log(err);
				setRefreshing(false);
			});
	}, [platformDetail, setRefreshing, setOrders]);

	useFocusEffect(onRefresh);

	const onOrderSelect = (orderDetail) =>
		navigation.navigate("OrderDetail", { orderDetail, platformDetail });
	return loading ? (
		<LoadingScreen />
	) : reqErr ? (
		<ErrorScreen msg="There seems to be an error fetching the orders!" />
	) : (
		<View style={{ flex: 1 }}>
			{orders.length == 0 ? (
				<Text>No Orders Placed for Today!</Text>
			) : (
				<FlatList
					data={orders}
					style={{ width: "100%" }}
					renderItem={renderOrderSummaryCard(
						platformDetail,
						onOrderSelect,
						navigation
					)}
					keyExtractor={(item) => item._id}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>
					}
				/>
			)}
		</View>
	);
};

export default MyOrdersScreen;
