import React from "react";
import { StyleSheet, View, Image } from "react-native";
import Text from "../UI/CustomText";
import TouchableCard from "../UI/TouchableCard";
import itemColors from "../../constants/itemColors";

const { payment: paymentColors } = itemColors;

const ParticipantOrderSummaryCard = ({
	onPress = () => {},
	participantOrderDetail,
}) => {
	const {
		private_list,
		public_list,
		total_amount,
		user,
		payment,
	} = participantOrderDetail;

	return (
		<TouchableCard onPress={() => onPress(participantOrderDetail)}>
			<View
				style={{
					width: "100%",
					height: "100%",
					backgroundColor: paymentColors[payment.status],
					flexDirection: "row",
				}}
			>
				<View style={{ flex: 3, paddingTop: 5 }}>
					<View style={styles.cardStyle}>
						<View style={{ flex: 1 }}>
							<Text>Placed By:</Text>
							<Text>{user.name}</Text>
						</View>
					</View>
					<View style={styles.cardStyle}>
						<View style={{ flex: 1 }}>
							<Text>Total Amount:</Text>
							<Text>{`₹${total_amount}`}</Text>
						</View>
					</View>
					<View style={styles.cardStyle}>
						<View style={{ flex: 1 }}>
							<Text>Public/Private Products:</Text>
							<Text>{`${public_list.length}/${private_list.length}`}</Text>
						</View>
					</View>
				</View>
				<View style={{ flex: 2, alignItems: "flex-end" }}>
					{public_list.length > 0 ? (
						<Image
							source={{
								uri: public_list[0].product_details.image,
							}}
							style={{
								height: "100%",
								width: "100%",
								resizeMode: "contain",
							}}
						/>
					) : (
						<Image
							source={{
								uri: "https://images-na.ssl-images-amazon.com/images/I/81vZaXuCQ-L._SL1500_.jpg",
							}}
							style={{
								height: "100%",
								width: 120,
								resizeMode: "contain",
							}}
						/>
					)}
				</View>
			</View>
		</TouchableCard>
	);
};

export default ParticipantOrderSummaryCard;

const styles = StyleSheet.create({
	cardStyle: {
		flex: 1,
		paddingHorizontal: 10,
		paddingBottom: 5,
		flexDirection: "row",
	},
});
