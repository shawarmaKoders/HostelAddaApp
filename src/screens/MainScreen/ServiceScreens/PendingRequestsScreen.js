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
import Card from "../../../components/UI/Card";
import { useTheme } from "@react-navigation/native";
import { colors } from "react-native-elements";
import appSettings from "../../../constants/appSettings";
import axios from "../../../customAxios";
import LoadingScreen from "../../../components/UI/LoadingScreen";
const { backendDomain } = appSettings;

const getPendingRequests = async () => {
	const url = `${backendDomain}/service-request/me/pending`;
	const response = await axios.get(url);
	return response.data;
};

const PendingRequestsScreen = ({ navigation }) => {
	const { colors } = useTheme();
	const [pendingRequests, setPendingRequest] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		getPendingRequests()
			.then((requests) => {
				setPendingRequest(requests);
				setLoading(false);
			})
			.catch((err) => {
				const errResponse = err.response;
				console.log({ err, errResponse });
			});
	}, []);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		getPendingRequests()
			.then((requests) => {
				setPendingRequest(requests);
				setRefreshing(false);
			})
			.catch((err) => {
				const errResponse = err.response;
				console.log({ err, errResponse });
			});
	}, [setPendingRequest, setRefreshing]);
	if (loading) return <LoadingScreen />;
	return !pendingRequests.length ? (
		<View style={styles.rootView}>
			<View style={styles.circle}>
				<Text style={styles.text}>
					No requests here !
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
				{pendingRequests.map((requestDetail) => (
					<ServiceRequestCard
						key={requestDetail._id}
						requestDetail={requestDetail}
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							height: 300,
							width: "90%",
							flexDirection: "column",
						}}
					>
						<Card style={styles.requesterHeadingStyle}>
							<View
								style={{
									flex: 0.8,
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Text
									style={{ fontSize: 15, color: colors.text }}
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
					</ServiceRequestCard>
				))}
			</ScrollView>
		</View>
	);
};

export default PendingRequestsScreen;

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
