import React, { useEffect, useState, useCallback } from "react";
import {
	Alert,
	StyleSheet,
	View,
	RefreshControl,
	ToastAndroid,
} from "react-native";
import Text from "../../../components/UI/CustomText";
import { useTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";
import CollapsibleRequestsList from "../../../components/ServiceScreen/CollapsibleRequestsList";
import appSettings from "../../../constants/appSettings";
import axios from "../../../customAxios";
import { useFocusEffect } from "@react-navigation/native";
import LoadingScreen from "../../../components/UI/LoadingScreen";
const { backendDomain } = appSettings;

const addRequestToTrip = async ({ request_id, tripDetail }) => {
	const acceptUrl = `${backendDomain}/service-request/confirm/${request_id}`;
	const acceptedRequestResp = await axios.patch(acceptUrl);
	const tripUrl = `${backendDomain}/trips/add-request/${tripDetail._id}`;
	const newTripResponse = await axios.patch(tripUrl, {
		request_id,
	});
	return newTripResponse.data;
};

const getNewRequests = async (service_id) => {
	const url = `${backendDomain}/service-request/me/requested?service_id=${service_id}`;
	const response = await axios.get(url);
	return response.data;
};

const TripNewRequest = ({ navigation }) => {
	const { colors } = useTheme();
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(false);
	const { tripDetailScreen: tripDetail } = useSelector(
		(state) => state.screensData
	);
	const [avRequests, setAvRequests] = useState([]);
	useEffect(() => {
		getNewRequests(tripDetail.service_id)
			.then((availableRequests) => {
				setAvRequests(availableRequests);
			})
			.catch((err) => {
				const errResponse = err.response;
				console.log({ err, errResponse });
			});
	}, []);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		getNewRequests(tripDetail.service_id)
			.then((availableRequests) => {
				setAvRequests(availableRequests);
				setRefreshing(false);
			})
			.catch((err) => {
				const errResponse = err.response;
				console.log({ err, errResponse });
			});
	}, [setAvRequests, setRefreshing]);

	useFocusEffect(onRefresh);

	const confirmButton = {
		text: () => "Confirm",
		onPress: ({ requestDetail, index }) => {
			addRequestToTrip({ request_id: requestDetail._id, tripDetail })
				.then((trip) => {
					//TODO : Loading Screen until request is added
					setAvRequests((oldRequests) =>
						oldRequests.filter((_, reqIndex) => index !== reqIndex)
					);
					ToastAndroid.show(
						"Request added in your trip!",
						ToastAndroid.SHORT
					);
				})
				.catch((err) => {
					const errResponse = err.response;
					console.log({ err, errResponse });
				});
		},
	};
	const rejectButton = {
		text: () => "Reject",
		onPress: ({ requestDetail }) => {
			Alert.alert(`Selected Request: ${requestDetail._id}`);
		},
	};

	return !avRequests.length ? (
		<View style={styles.rootView}>
			<View style={styles.circle}>
				<Text style={styles.text}>
					No new requests for current trip !
				</Text>
			</View>
		</View>
	) : (
		<View style={styles.rootView}>
			<CollapsibleRequestsList
				requestsList={avRequests}
				buttons={[confirmButton, rejectButton]}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>
				}
			/>
		</View>
	);
};

export default TripNewRequest;

const styles = StyleSheet.create({
	rootView: {
		flex: 1,
		alignItems: "center",
	},
	circle: {
		paddingTop: "50%",
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
