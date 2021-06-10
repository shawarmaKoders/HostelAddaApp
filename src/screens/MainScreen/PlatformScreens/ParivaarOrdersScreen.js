import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import Text from "../../../components/UI/CustomText";
import { useTheme } from "@react-navigation/native";
import axios from "../../../customAxios";
import LoadingScreen from "../../../components/UI/LoadingScreen";
import ErrorScreen from "../../../components/UI/ErrorScreen";
import OrderSummaryCard from "../../../components/PlatformScreen/OrderSummaryCard";
import appSettings from "../../../constants/appSettings";
const { backendDomain } = appSettings;

const fetchOrders = async (platform_id) => {
	const url = `${backendDomain}/orders/platform?platform_id=${platform_id}`;
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

const ParivaarOrdersScreen = ({ navigation, route }) => {
	const { platformDetail } = route.params;
	const [loading, setLoading] = useState(true);
	const [reqErr, setReqErr] = useState(false);
	const [orders, setOrders] = useState([]);
	const { colors } = useTheme();
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
	const onOrderSelect = (orderDetail) =>
		navigation.navigate("AddOrder", { orderDetail, platformDetail });
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
				/>
			)}
		</View>
	);
};

export default ParivaarOrdersScreen;

const styles = StyleSheet.create({});
