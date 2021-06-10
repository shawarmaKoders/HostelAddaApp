import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, Alert, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Text from "../../../components/UI/CustomText";
import axios from "../../../customAxios";
import LoadingScreen from "../../../components/UI/LoadingScreen";
import ErrorScreen from "../../../components/UI/ErrorScreen";
import appSettings from "../../../constants/appSettings";
import ParticipantOrderSummaryCard from "../../../components/PlatformScreen/ParticipantOrderSummaryCard";
import Button from "../../../components/UI/ModalButton";
const { backendDomain } = appSettings;

const getParticipantsData = async (order_id) => {
	const url = `${backendDomain}/orders/view-participants-order/${order_id}`;
	const response = await axios.get(url);
	return response.data;
};

const placeOrder = async (order_id) => {
	const url = `${backendDomain}/orders/order-on-site/${order_id}`;
	const response = await axios.patch(url, {});
	return response.data;
};

const renderParticipantOrderSummaryCard = (onPress) => ({
	item: participantOrderDetail,
}) => (
	<ParticipantOrderSummaryCard
		onPress={onPress}
		participantOrderDetail={participantOrderDetail}
	/>
);

const ParticipantsListScreen = ({ navigation, route }) => {
	const { orderDetail: orderDetailFromPrevScreen } = route.params;
	const [orderDetail, setOrderDetail] = useState(orderDetailFromPrevScreen);
	useEffect(() => {
		setOrderDetail(orderDetailFromPrevScreen);
	}, [orderDetailFromPrevScreen]);
	const [loading, setLoading] = useState(true);
	const [reqErr, setReqErr] = useState(false);
	const [participantsData, setParticipantsData] = useState([]);
	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		getParticipantsData(orderDetail._id)
			.then((fetchedParticipants) => {
				setParticipantsData(fetchedParticipants);
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
		getParticipantsData(orderDetail._id)
			.then((fetchedParticipants) => {
				setParticipantsData(fetchedParticipants);
				setRefreshing(false);
			})
			.catch((err) => {
				console.log(err);
				setRefreshing(false);
			});
	}, [orderDetail, setRefreshing, setParticipantsData]);

	useFocusEffect(onRefresh);

	const onParticipantOrderSelect = (participantOrderDetail) => {
		if (orderDetail.status !== "Initiated")
			navigation.navigate("ParticipantOrderDetail", {
				orderData: orderDetail,
				participantOrderDetail,
			});
	};
	const onPlaceOrder = () => {
		setLoading(true);
		placeOrder(orderDetail._id)
			.then((freshOrderDetail) => {
				setOrderDetail((oldOrderDetail) => ({
					...oldOrderDetail,
					status: "Ordered",
				}));
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	};
	return loading ? (
		<LoadingScreen />
	) : reqErr ? (
		<ErrorScreen msg="There seems to be an error fetching the participants' information!" />
	) : (
		<View style={{ flex: 1 }}>
			<View style={{ flex: 1 }}>
				{participantsData.length == 0 ? (
					<Text>No-one has contributed to this order, yet!</Text>
				) : (
					<FlatList
						data={participantsData}
						style={{ width: "100%" }}
						renderItem={renderParticipantOrderSummaryCard(
							onParticipantOrderSelect
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
			{orderDetail.status === "Finalized" && (
				<View style={{ paddingVertical: 10, marginHorizontal: 10 }}>
					<Button
						text="Mark your order Placed!"
						onPress={onPlaceOrder}
					/>
				</View>
			)}
		</View>
	);
};

export default ParticipantsListScreen;
