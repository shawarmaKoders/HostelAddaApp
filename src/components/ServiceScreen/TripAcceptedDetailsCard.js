import React from "react";
import { View } from "react-native";
import { colors } from "react-native-elements";
import Text from "../UI/CustomText";
import TouchableCard from "../UI/TouchableCard";
const pad = (number) => `${number}`.padStart(2, "0");
const timePrint = (timeStringRaw) => {
	var temp = new Date(timeStringRaw) - 5.5 * 60 * 60 * 1000;
	const dt = new Date(temp);
	return `${pad(dt.getHours())} : ${pad(dt.getMinutes())}`;
};

const TripAcceptedDetailsCard = ({ tripDetail, onPress, style }) => {
	return tripDetail.time[0] == undefined ? (
		<TouchableCard
			style={{
				...style,
				borderColor: colors.primary,
				borderWidth: 1,
				borderRadius: 20,
				height: 200,
				padding: 5,
			}}
			onPress={onPress}
		>
			<View style={{ flex: 1, padding: 10 }}>
				<Text
					style={{
						textAlign: "center",
						fontSize: 24,
						fontWeight: "bold",
						marginVertical: 5,
					}}
				>
					{tripDetail.request_user.name}
				</Text>
				<Text
					style={{
						textAlign: "center",
						fontSize: 15,
						marginVertical: 5,
					}}
				>
					{tripDetail.request_user.hostel_details.building}
				</Text>
				<Text
					style={{
						textAlign: "center",
						fontSize: 15,
						marginVertical: 5,
					}}
				>
					Tel: {tripDetail.request_user.phone_number}
				</Text>

				<Text
					style={{
						textAlign: "center",
						fontSize: 15,
						marginVertical: 5,
					}}
				>
					No. of Items :{tripDetail.items.length}
				</Text>

				<Text
					style={{
						textAlign: "center",
						fontSize: 15,
						marginVertical: 5,
					}}
				>
					<Text
						style={{
							textAlign: "center",
							fontSize: 15,
							marginVertical: 5,
							fontWeight: "bold",
						}}
					></Text>
				</Text>
			</View>
		</TouchableCard>
	) : (
		<TouchableCard
			style={{
				...style,
				borderColor: colors.primary,
				borderWidth: 1,
				borderRadius: 20,
				height: 200,
				padding: 5,
			}}
			onPress={onPress}
		>
			<View style={{ flex: 1, padding: 10 }}>
				<Text
					style={{
						textAlign: "center",
						fontSize: 24,
						fontWeight: "bold",
						marginVertical: 5,
					}}
				>
					{tripDetail.request_user.name}
				</Text>
				<Text
					style={{
						textAlign: "center",
						fontSize: 15,
						marginVertical: 5,
					}}
				>
					{tripDetail.request_user.hostel_details.building}
				</Text>
				<Text
					style={{
						textAlign: "center",
						fontSize: 15,
						marginVertical: 5,
					}}
				>
					Tel: {tripDetail.request_user.phone_number}
				</Text>

				<Text
					style={{
						textAlign: "center",
						fontSize: 15,
						marginVertical: 5,
					}}
				>
					No. of Items :{tripDetail.items.length}
				</Text>

				<Text
					style={{
						textAlign: "center",
						fontSize: 15,
						marginVertical: 5,
					}}
				>
					Time:{" "}
					<Text
						style={{
							textAlign: "center",
							fontSize: 15,
							marginVertical: 5,
							fontWeight: "bold",
						}}
					>
						{timePrint(tripDetail.time[0])} -{" "}
						{timePrint(tripDetail.time[1])}
					</Text>
				</Text>
			</View>
		</TouchableCard>
	);
};

export default TripAcceptedDetailsCard;
