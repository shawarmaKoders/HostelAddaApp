import React, { useEffect, useState, useCallback } from "react";
import {
	StyleSheet,
	View,
	Alert,
	ScrollView,
	RefreshControl,
} from "react-native";
import Text from "../../../components/UI/CustomText";
import { useTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";
import appSettings from "../../../constants/appSettings";
import axios from "../../../customAxios";
import { useFocusEffect } from "@react-navigation/native";
import TripAcceptedDetailsCard from "../../../components/ServiceScreen/TripAcceptedDetailsCard";
import LoadingScreen from "../../../components/UI/LoadingScreen";
const { backendDomain } = appSettings;

const getTripRequests = async ({ tripId }) => {
	const url = `${backendDomain}/trips/${tripId}`;
	const response = await axios.get(url);
	return response.data;
};

const TripAcceptedRequest = ({ navigation, route }) => {
	const { colors } = useTheme();
	const [acceptedRequests, setAcceptedRequests] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(true);
	const { tripDetailScreen: tripData } = useSelector(
		(state) => state.screensData
	);
	useEffect(() => {
		getTripRequests({ tripId: tripData._id })
			.then((tripDetails) => {
				setAcceptedRequests(tripDetails.requests);
				setLoading(false);
			})
			.catch((err) => console.log(err));
	}, []);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		getTripRequests({ tripId: tripData._id })
			.then((tripDetails) => {
				setAcceptedRequests(tripDetails.requests);
				setRefreshing(false);
			})
			.catch((err) => console.log(err));
	}, [tripData, setAcceptedRequests, setRefreshing]);

	useFocusEffect(onRefresh);

	if (loading) return <LoadingScreen />;
	return !acceptedRequests.length ? (
		<View style={styles.rootView}>
			<View style={styles.circle}>
				<Text style={styles.text}>
					No accepted requests for current trip !
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
				{acceptedRequests.map((requestDetail) => (
					<TripAcceptedDetailsCard
						key={requestDetail._id}
						tripDetail={requestDetail}
						onPress={
							requestDetail.status === "confirmed"
								? () =>
										navigation.navigate(
											"DeliverConfirmation",
											{
												requestDetail: Object.assign(
													requestDetail,
													{
														service:
															tripData.service,
													}
												),
											}
										)
								: null
						}
					/>
				))}
			</ScrollView>
		</View>
	);
};

export default TripAcceptedRequest;

const styles = StyleSheet.create({
	rootView: {
		flex: 1,
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
