import React, { useEffect, useState, useCallback } from "react";
import {
	StyleSheet,
	View,
	Alert,
	ScrollView,
	Text,
	RefreshControl,
} from "react-native";
import ServiceRequestCard from "../../../components/ServiceScreen/ServiceRequestCard";
import { useTheme } from "@react-navigation/native";
import appSettings from "../../../constants/appSettings";
import axios from "../../../customAxios";
import Card from "../../../components/UI/Card";
import LoadingScreen from "../../../components/UI/LoadingScreen";
const { backendDomain } = appSettings;

const pad = (number) => `${number}`.padStart(2, "0");

const timePrint = (timeStringRaw) => {
	var temp = new Date(timeStringRaw) - 5.5 * 60 * 60 * 1000;
	const dt = new Date(temp);
	return `${pad(dt.getHours())} : ${pad(dt.getMinutes())}`;
};

const getBroadcastedRequests = async () => {
	const url = `${backendDomain}/service-request/me/broadcasted`;
	const response = await axios.get(url);
	return response.data;
};

const BroadcastedRequestsScreen = ({ navigation }) => {
	const { colors } = useTheme();
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(true);

	const [broadcastedRequests, setBroadcastedRequests] = useState([]);
	useEffect(() => {
		getBroadcastedRequests()
			.then((requests) => {
				setBroadcastedRequests(requests);
				setLoading(false);
			})
			.catch((err) => {
				const errResponse = err.response;
				console.log({ err, errResponse });
			});
	}, []);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		getBroadcastedRequests()
			.then((requests) => {
				setBroadcastedRequests(requests);
				setRefreshing(false);
			})
			.catch((err) => {
				const errResponse = err.response;
				console.log({ err, errResponse });
			});
	}, [setBroadcastedRequests, setRefreshing]);
	if (loading) return <LoadingScreen />;
	return !broadcastedRequests.length ? (
		<View style={styles.rootView}>
			<View style={styles.circle}>
				<Text style={styles.text}>
					You Have no broadcasted requests !
				</Text>
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
				{broadcastedRequests.map((requestDetail) => (
					<ServiceRequestCard
						key={requestDetail._id}
						requestDetail={requestDetail}
						onPress={
							requestDetail.status === "accepted-request"
								? () =>
										navigation.navigate("RequestDetail", {
											requestDetail,
										})
								: null
						}
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							height: 300,
							width: "90%",
							flexDirection: "column",
						}}
					>
						{requestDetail.status === "accepted-request" ? (
							<Card style={styles.requesterHeadingStyle}>
								<View
									style={{
										flex: 0.8,
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<Text
										style={{
											fontSize: 15,
											color: colors.text,
										}}
									>
										Requested To :
									</Text>
								</View>
								<View
									style={{
										flex: 2,
										justifyContent: "center",
										alignItems: "center",
										flexWrap: "wrap",
									}}
								>
									<Text
										style={{
											fontSize: 25,
											fontWeight: "bold",
											color: colors.text,
										}}
									>
										{requestDetail.service_user.name}
									</Text>
								</View>
							</Card>
						) : null}
						<View style={styles.timeContainer}>
							<Text style={{ fontSize: 17 }}>
								{timePrint(requestDetail.time[0])} -{" "}
								{timePrint(requestDetail.time[1])}
							</Text>
						</View>
					</ServiceRequestCard>
				))}
			</ScrollView>
		</View>
	);
};

export default BroadcastedRequestsScreen;

const styles = StyleSheet.create({
	rootView: {
		flex: 1,
		alignItems: "center",
	},
	requesterHeadingStyle: {
		width: "80%",
		aspectRatio: 8 / 3,
		marginVertical: 5,
		padding: 10,
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	timeContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	circle: {
        paddingTop: "50%",
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'black',
        height: 35,
        marginBottom: 10,
        alignItems: 'center'
    },
    text: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    }
});
