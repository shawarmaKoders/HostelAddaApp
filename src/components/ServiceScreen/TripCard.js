import React from "react";
import { View } from "react-native";
import { colors } from "react-native-elements";
import Text from "../UI/CustomText";
import TouchableCard from "../UI/TouchableCard";
const pad = (number) => `${number}`.padStart(2, "0");
const timePrint = (timeStringRaw) => {
	var temp = new Date(timeStringRaw)-(5.5 * 60 * 60 * 1000);
	const dt = new Date(temp);
	return `${pad(dt.getHours())} : ${pad(dt.getMinutes())}`;
};

const TripCard = ({ tripDetail, onPress, style }) => {
	return (
		<TouchableCard
			style={{
				...style,
				borderColor: colors.primary,
				borderWidth: 1,
				borderRadius: 20,
				height:180
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
					{tripDetail.service.name}
				</Text>
				<Text
					style={{
						textAlign: "center",
						fontSize: 15,
						marginVertical: 5,
					}}
				>
					Tel: {tripDetail.service.phone_number}
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
						{timePrint(tripDetail.time)}
					</Text>
				</Text>
				<View>
					<Text
						style={{
							textAlign: "center",
							fontSize: 15,
							marginVertical: 5,
						}}
					>
						No. of requests are :{" "}
						<Text style={{ fontWeight: "bold" }}>
							{tripDetail.requests.length}
						</Text>
					</Text>
				</View>
			</View>
		</TouchableCard>
	);
};

export default TripCard;
