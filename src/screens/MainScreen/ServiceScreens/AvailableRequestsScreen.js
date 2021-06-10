import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, Alert, RefreshControl } from "react-native";
import Text from "../../../components/UI/CustomText";
import Button from "../../../components/UI/ModalButton";
import CollapsibleRequestsList from "../../../components/ServiceScreen/CollapsibleRequestsList";
import axios from "../../../customAxios";
import appSettings from "../../../constants/appSettings";
import { useDispatch } from "react-redux";
import { preNavigateTripDetailScreen } from "../../../store/actions/screenReducer";
import LoadingScreen from "../../../components/UI/LoadingScreen";
const { backendDomain } = appSettings;

const fetchRequests = async (serviceId) => {
	const url = `${backendDomain}/service-request/time/?service_id=${serviceId}&time=${new Date(
		Date.now()
	)}`;
	const response = await axios.get(url);
	return response.data;
};

const addTrip = async (service_id, time, requests) => {
	const url = `${backendDomain}/trips/requests`;
	const response = await axios.post(url, {
		service_id,
		time,
		requests,
	});
	return response.data;
};

const AvailableRequestsScreen = ({ navigation, route }) => {
	const [availableRequests, setAvailableRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const { serviceDetail } = route.params;
	const [refreshing, setRefreshing] = useState(false);
	const dispatch = useDispatch();
	useEffect(() => {
		fetchRequests(serviceDetail._id)
			.then((serviceRequests) => {
				setAvailableRequests(serviceRequests);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		fetchRequests(serviceDetail._id)
			.then((serviceRequests) => {
				setAvailableRequests(serviceRequests);
				setRefreshing(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [setAvailableRequests, setRefreshing]);

	const setRequestAccepted = (requestDetail) => {
		setAvailableRequests((currentAvailableRequests) =>
			currentAvailableRequests.map((availRequest) =>
				availRequest._id === requestDetail._id
					? Object.assign(availRequest, {
							accepted: !availRequest.accepted,
					  })
					: availRequest
			)
		);
	};
	const onReceiveMoreRequests = () => {
		const acceptedRequests = availableRequests.filter(
			(availRequest) => availRequest.accepted
		);
		navigation.navigate("DeliverTimeConfirm", {
			serviceDetail,
			acceptedRequests,
		});
	};
	const onAccept = () => {
		setLoading(true);
		const acceptedRequests = availableRequests.filter(
			(availRequest) => availRequest.accepted
		);
		//redux userid
		addTrip(
			serviceDetail._id,
			new Date(Date.now()).toLocaleString("en-US", {
				timeZone: "Asia/Kolkata",
			}),
			acceptedRequests
		)
			.then((tripDetail) => {
				dispatch(preNavigateTripDetailScreen(tripDetail));
				setLoading(false);
				navigation.navigate("TripDetail", {
					screen: "TripAcceptedRequests",
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};
	const selectButton = {
		text: ({ requestDetail }) =>
			requestDetail.accepted ? "Un-Select" : "Select",
		onPress: ({ requestDetail }) => setRequestAccepted(requestDetail),
	};
	if (loading) return <LoadingScreen />;
	return (
		<View style={styles.rootView}>
			<Text>{serviceDetail.name}</Text>
			{availableRequests.length === 0 ? (
				<>
					<View style={{ ...styles.circle, marginBottom: 50 }}>
						<Text style={styles.text}>
							No new request Available!
						</Text>
					</View>
					<Button
						text="Add Trip Time"
						onPress={onReceiveMoreRequests}
					/>
				</>
			) : (
				<>
					<CollapsibleRequestsList
						requestsList={availableRequests}
						buttons={[selectButton]}
						refreshControl={
							<RefreshControl
								refreshing={refreshing}
								onRefresh={onRefresh}
							/>
						}
					/>
					{availableRequests.filter(
						(availRequest) => availRequest.accepted
					).length === 0 && (
						<Button
							text="Add Trip Time"
							onPress={onReceiveMoreRequests}
						/>
					)}
					<Button text="Accept and Proceed" onPress={onAccept} />
				</>
			)}
		</View>
	);
};

export default AvailableRequestsScreen;

const styles = StyleSheet.create({
	rootView: {
		flex: 1,
		alignItems: "center",
	},
	circle: {
		paddingTop: "10%",
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
	tripButton: {
		marginTop: "90%",
		marginLeft: "3%",
		height: 50,
		width: "90%",
	},
});
