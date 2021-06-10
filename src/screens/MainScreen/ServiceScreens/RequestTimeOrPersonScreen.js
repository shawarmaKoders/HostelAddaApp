import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert, ScrollView, Platform } from "react-native";
import Text from "../../../components/UI/CustomText";
import Button from "../../../components/UI/ModalButton";
import { useTheme } from "@react-navigation/native";
import TouchableCard from "../../../components/UI/TouchableCard";
import TimeBox from "../../../components/UI/TimeBox";
import DateTimePicker from "@react-native-community/datetimepicker";
import appSettings from "../../../constants/appSettings";
import axios from "../../../customAxios";
import LoadingScreen from "../../../components/UI/LoadingScreen";
const { backendDomain } = appSettings;

const fetchpeopleAvailable = async (service_id) => {
	const url = `${backendDomain}/trips/time?service_id=${service_id}`;
	const response = await axios.get(url);
	return response.data;
};
const pad = (number) => `${number}`.padStart(2, "0");
const timePrint = (timeStringRaw) => {
	var temp = new Date(timeStringRaw) - 5.5 * 60 * 60 * 1000;
	const dt = new Date(temp);
	return `${pad(dt.getHours())} : ${pad(dt.getMinutes())}`;
};

const createRequest = async ({ service_id, itemDescriptions, time }) => {
	const url = `${backendDomain}/service-request`;
	const response = await axios.post(url, {
		time,
		service_id,
		items: itemDescriptions,
	});
	return response.data;
};
const RequestScreen = ({ navigation, route }) => {
	const { serviceDetail, itemDescriptions } = route.params;
	const [startDate, setDate] = useState(new Date(Date.now()));
	const [endDate, setEndDate] = useState(
		new Date(Date.now() + 3 * 60 * 60 * 1000)
	);
	const [showSelectTimer, setShowSelectTimer] = useState(false);
	const [showSelectTimerEnd, setShowSelectTimerEnd] = useState(false);
	const [peopleAvailableToDeliver, setPeopleAvailableToDeliver] = useState(
		[]
	);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		fetchpeopleAvailable(serviceDetail._id)
			.then((peopleResponse) => {
				setPeopleAvailableToDeliver(peopleResponse);
				setLoading(false);
			})
			.catch((err) => {
				const errResponse = err.response;
				console.log({ err, errResponse });
			});
	}, []);

	const { colors } = useTheme();
	const onStartDateChange = (event, selectedDate) => {
		const currentDate = selectedDate || startDate;
		setShowSelectTimer(false);
		setDate(currentDate);
	};
	const onEndDateChange = (event, selectedDate) => {
		const currentDate2 = selectedDate || endDate;
		setShowSelectTimerEnd(false);
		setEndDate(currentDate2);
	};
	const onPersonSelect = ({ person, trip_id }) => {
		navigation.navigate("RequestPersonDetail", {
			serviceDetail,
			itemDescriptions,
			person,
			trip_id,
		});
	};
	const onNotifyTouch = () => {
		if (startDate > endDate) {
			Alert.alert(
				"Time Slot error",
				"Please enter a valid Time slot",
				[{ text: "OK", onPress: () => console.log("OK Pressed") }],
				{ cancelable: false }
			);
		} else {
			setLoading(true);
			createRequest({
				service_id: serviceDetail._id,
				itemDescriptions,
				time: [
					new Date(startDate).toLocaleString("en-US", {
						timeZone: "Asia/Kolkata",
					}),
					new Date(endDate).toLocaleString("en-US", {
						timeZone: "Asia/Kolkata",
					}),
				],
			})
				.then((request) => {
					setLoading(false);
					navigation.navigate("BroadcastedRequests");
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};
	if (loading) return <LoadingScreen />;
	return !peopleAvailableToDeliver.length ? (
		<View style={styles.rootView}>
			<Text>{serviceDetail.name}</Text>
			<View style={styles.circle}>
	<Text style={styles.text}>No trips available for your request !{"\n"}</Text>
				<Text style={styles.text}>Select a Time slot and Proceed</Text>
			</View>
			<View
				style={{
					marginTop:"50%",
					flexDirection: "row",
					padding: 10,
					justifyContent: "space-around",
					alignContent: "center",
					alignItems: "center",
				}}
			>
				<TimeBox
					style={styles.timeboxStyle}
					time={startDate}
					onPress={() => setShowSelectTimer(true)}
				/>
				<Text
					style={{
						fontSize: 30,
						marginVertical: 10,
						marginHorizontal: 5,
						fontWeight: "normal",
					}}
				>
					To
				</Text>
				{showSelectTimer && (
					<DateTimePicker
						testID="serviceRequestTime"
						value={startDate}
						mode="time"
						is24Hour={true}
						display="default"
						onChange={onStartDateChange}
					/>
				)}

				<View
					style={{
						flexDirection: "row",
						padding: 10,
						justifyContent: "space-around",
						alignContent: "center",
						alignItems: "center",
					}}
				>
					<TimeBox
						style={styles.timeboxStyle}
						time={endDate}
						onPress={() => setShowSelectTimerEnd(true)}
					/>
				</View>
				{showSelectTimerEnd && (
					<DateTimePicker
						testID="serviceRequestEndTime"
						value={endDate}
						mode="time"
						is24Hour={true}
						display="default"
						onChange={onEndDateChange}
					/>
				)}
			</View>

			<Button text="Notify when available" onPress={onNotifyTouch} />
		</View>
	) : (
		<View style={styles.rootView}>
			<Text style={{ textAlign: "center" }}>{serviceDetail.name}</Text>
			{peopleAvailableToDeliver.length > 0 && (
				<View style={{ marginVertical: 10, flex: 1 }}>
					<ScrollView>
						{peopleAvailableToDeliver.map(
							({ user: person, time, trip_id }, index) => (
								<TouchableCard
									style={{
										height: 85,
										padding: 5,
										alignItems: "center",
										width: 250,
										borderWidth: 1,
										borderBottomColor: colors.primary,
										borderRightColor: colors.primary,
										textAlign: "center",
									}}
									onPress={() =>
										onPersonSelect({ person, trip_id })
									}
									key={index}
								>
									<View style={{ flex: 1 }}>
										<Text
											style={{
												textAlign: "center",
												fontSize: 24,
												fontWeight: "bold",
												marginVertical: 5,
											}}
										>
											{person.name}
										</Text>
										<Text
											style={{
												textAlign: "center",
												fontSize: 15,
												marginVertical: 5,
											}}
										>
											{timePrint(time)}
										</Text>
									</View>
								</TouchableCard>
							)
						)}
					</ScrollView>
					<View style={{ marginTop: 10 }}>
						<Text style={{ textAlign: "center" }}>OR</Text>
					</View>
				</View>
			)}
			<Text>Select a Time and Proceed</Text>
			<View
				style={{
					flexDirection: "row",
					padding: 10,
					justifyContent: "space-around",
					alignContent: "center",
					alignItems: "center",
				}}
			>
				<TimeBox
					style={styles.timeboxStyle}
					time={startDate}
					onPress={() => setShowSelectTimer(true)}
				/>
				<Text
					style={{
						fontSize: 30,
						marginVertical: 10,
						marginHorizontal: 5,
						fontWeight: "normal",
					}}
				>
					To
				</Text>
				{showSelectTimer && (
					<DateTimePicker
						testID="serviceRequestTime"
						value={startDate}
						mode="time"
						is24Hour={true}
						display="default"
						onChange={onStartDateChange}
					/>
				)}

				<View
					style={{
						flexDirection: "row",
						padding: 10,
						justifyContent: "space-around",
						alignContent: "center",
						alignItems: "center",
					}}
				>
					<TimeBox
						style={styles.timeboxStyle}
						time={endDate}
						onPress={() => setShowSelectTimerEnd(true)}
					/>
				</View>
				{showSelectTimerEnd && (
					<DateTimePicker
						testID="serviceRequestEndTime"
						value={endDate}
						mode="time"
						is24Hour={true}
						display="default"
						onChange={onEndDateChange}
					/>
				)}
			</View>

			<Button text="Notify when available" onPress={onNotifyTouch} />
		</View>
	);
};

export default RequestScreen;

const styles = StyleSheet.create({
	rootView: {
		flex: 1,
		alignItems: "center",
		paddingVertical: 5,
	},
	timeboxStyle: {
		marginHorizontal: 5,
	},
	circle: {
		paddingTop:"10%",
		borderRadius: 50,
		borderWidth: 1,
		borderColor: "black",
		height: 35,
		marginBottom: 10,
		alignItems: "center",
	},
	text: {
		fontSize: 20,
		color: "white",
		textAlign: "center",
	},
});
