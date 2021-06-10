import React, { useEffect, useState, useCallback } from "react";
import {
	StyleSheet,
	View,
	Alert,
	Text,
	ScrollView,
	RefreshControl,
} from "react-native";
import ServiceRequestCard from "../../../components/ServiceScreen/ServiceRequestCard";
import { useTheme } from "@react-navigation/native";
import appSettings from "../../../constants/appSettings";
import axios from "../../../customAxios";
import LoadingScreen from "../../../components/UI/LoadingScreen";
import { useFocusEffect } from "@react-navigation/native";
const { backendDomain } = appSettings;

const getConfirmedRequests = async () => {
	const url = `${backendDomain}/service-request/me/confirmed`;
	const response = await axios.get(url);
	return response.data;
};

const ConfirmedRequestsScreen = ({ navigation }) => {
	const { colors } = useTheme();
	const [confirmedRequests, setConfirmedRequests] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getConfirmedRequests()
			.then((requests) => {
				setConfirmedRequests(requests);
				setLoading(false);
			})
			.catch((err) => {
				const errResponse = err.response;
				console.log({ err, errResponse });
			});
	}, []);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		getConfirmedRequests()
			.then((requests) => {
				setConfirmedRequests(requests);
				setRefreshing(false);
			})
			.catch((err) => {
				const errResponse = err.response;
				console.log({ err, errResponse });
			});
	}, [setConfirmedRequests, setRefreshing]);

	useFocusEffect(onRefresh);

	if (loading) return <LoadingScreen />;
	return !confirmedRequests.length ? (
		<View style={styles.rootView}>
			<View style={styles.circle}>
				<Text style={styles.text}>No requests here !</Text>
			</View>
		</View>
	) : (
		<View style={styles.rootView}>
			<ScrollView
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>
				}
			>
				{confirmedRequests.map((requestDetail) => (
					<ServiceRequestCard
						key={requestDetail._id}
						requestDetail={requestDetail}
						onPress={() =>
							navigation.navigate("PlacedRequests", {
								requestDetail,
							})
						}
						style={{
							height: 220,
							padding: 3,
							margin: 5,
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
						}}
					/>
				))}
			</ScrollView>
		</View>
	);
};

export default ConfirmedRequestsScreen;

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
