import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Text from "../UI/CustomText";
import TouchableCard from "../UI/TouchableCard";
import CompletionBar from "../UI/CompletionBar";
import Button from "../UI/ModalButton";
import itemColors from "../../constants/itemColors";
import appSettings from "../../constants/appSettings";
import axios from "../../customAxios";
import { Ionicons } from "@expo/vector-icons";

const { backendDomain } = appSettings;
const { orders: orderColors } = itemColors;

const finalizeOrder = async (order_id) => {
	const url = `${backendDomain}/orders/finalize_order/${order_id}`;
	const response = await axios.patch(url, {});
	return response.data;
};

const OrderSummaryCard = ({ onPress = () => {}, orderDetail, navigation }) => {
	const [localOrderDetail, setLocalOrderDetail] = useState(orderDetail);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		setLocalOrderDetail(orderDetail);
	}, [orderDetail]);
	const onFinalizeOrder = () => {
		setLoading(true);
		finalizeOrder(localOrderDetail._id)
			.then((newOrderDetail) => {
				setLocalOrderDetail((currentOrderDetail) => ({
					...currentOrderDetail,
					...newOrderDetail,
				}));
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				console.warn(err);
			});
	};
	const {
		initiating_user,
		current_total_amount,
		target_amount,
		end_date_time,
		is_admin,
		status,
	} = localOrderDetail;

	return (
		<TouchableCard
			style={{ height: is_admin ? 200 : 150 }}
			onPress={loading ? null : () => onPress(localOrderDetail)}
		>
			<View
				style={{
					width: "100%",
					height: "100%",
					backgroundColor: orderColors[status],
				}}
			>
				<View style={styles.cardStyle}>
					<View style={{ flex: 1 }}>
						<Text>Initiated By:</Text>
						<Text>{is_admin ? "You" : initiating_user.name}</Text>
					</View>
					<View style={{ flex: 1 }}>
						<Text>Order By:</Text>
						<Text>{end_date_time}</Text>
					</View>
				</View>
				<CompletionBar
					percentage={(current_total_amount / target_amount) * 100}
					style={{ marginTop: 10 }}
				/>
				<View style={styles.cardStyle}>
					<View style={{ flex: 1 }}>
						<Text>Current Amount:</Text>
						<Text>{`₹${current_total_amount}`}</Text>
					</View>
					<View style={{ flex: 1 }}>
						<Text>Target Amount:</Text>
						<Text>{`₹${target_amount}`}</Text>
					</View>
				</View>
				{is_admin && !loading && (
					<View
						style={{
							...styles.cardStyle,
							marginBottom: 10,
							alignItems: "center",
							justifyContent: "space-evenly",
						}}
					>
						<View style={{ flex: 1, marginHorizontal: 20 }}>
							<Button
								icon={
									<Ionicons
										name="md-people"
										size={32}
										color="black"
									/>
								}
								onPress={() =>
									navigation.navigate("ParticipantList", {
										orderDetail: localOrderDetail,
									})
								}
							/>
						</View>
						{status === "Initiated" && (
							<View style={{ flex: 1, marginHorizontal: 20 }}>
								<Button
									icon={
										<Ionicons
											name="md-done-all"
											size={32}
											color="black"
										/>
									}
									onPress={onFinalizeOrder}
								/>
							</View>
						)}
					</View>
				)}
			</View>
		</TouchableCard>
	);
};

export default OrderSummaryCard;

const styles = StyleSheet.create({
	cardStyle: {
		flex: 1,
		padding: 10,
		flexDirection: "row",
	},
});
