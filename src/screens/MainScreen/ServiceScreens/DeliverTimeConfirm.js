import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import Text from "../../../components/UI/CustomText";
import TimeBox from "../../../components/UI/TimeBox";
import { useTheme } from "@react-navigation/native";
import Button from "../../../components/UI/ModalButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "../../../customAxios";
import appSettings from "../../../constants/appSettings";
import { useDispatch } from "react-redux";
import { preNavigateTripDetailScreen } from "../../../store/actions/screenReducer";
import LoadingScreen from "../../../components/UI/LoadingScreen";
import { floor } from "react-native-reanimated";
const { backendDomain } = appSettings;

const addTrip = async (service_id, time) => {
	const url = `${backendDomain}/trips`;
	const response = await axios.post(url, {
		service_id,
		time,
	});
	return response.data;
};

const DeliverTimeConfirm = ({ navigation, route }) => {
	const { acceptedRequests, serviceDetail } = route.params;
	const { colors } = useTheme();
	const dispatch = useDispatch();
	const [date, setDate] = useState(new Date());
	const [showSelectTimer, setShowSelectTimer] = useState(false);
	const [loading, setLoading] = useState(false);

	const onDateChange = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setShowSelectTimer(false);
		setDate(currentDate);
	};

	const onBookTime = () => {
		setLoading(true);
		addTrip(
			serviceDetail._id,
			new Date(date).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
		)
			.then((TripDetail) => {
				setLoading(false);
				dispatch(preNavigateTripDetailScreen(TripDetail));
				navigation.navigate("TripDetail", {
					screen: "TripAcceptedRequests",
				});
			})
			.catch((err) => {
				console.log(err, err.response);
			});
	};
	if (loading) return <LoadingScreen />;
	return (
		<View>
			<TimeBox
				time={date}
				onPress={() => setShowSelectTimer(true)}
				style={{ marginVertical: 10, alignItems: "center" }}
			/>
			{showSelectTimer && (
				<DateTimePicker
					testID="serviceRequestTime"
					value={date}
					mode="time"
					is24Hour={true}
					display="default"
					onChange={onDateChange}
				/>
			)}
			<Button text="Book a Timing" onPress={onBookTime} />
		</View>
	);
};

export default DeliverTimeConfirm;

const styles = StyleSheet.create({});
