import React, { useEffect, useState, useCallback } from "react";
import {
	StyleSheet,
	View,
	Alert,
	ScrollView,
	Text,
	RefreshControl,
} from "react-native";
import TripCard from "../../../components/ServiceScreen/TripCard";
import { useTheme } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { preNavigateTripDetailScreen } from "../../../store/actions/screenReducer";
import appSettings from "../../../constants/appSettings";
import axios from "../../../customAxios";
import LoadingScreen from "../../../components/UI/LoadingScreen";
const { backendDomain } = appSettings;

const getConfirmedTrips = async () => {
	const url = `${backendDomain}/trips/me`;
	const response = await axios.get(url);
	return response.data;
};

const ConfirmedTripsScreen = ({ navigation }) => {
	const { colors } = useTheme();
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();
	const [confirmedTrips, setConfirmedTrips] = useState([]);

	useEffect(() => {
		getConfirmedTrips()
			.then((confirmedTripsData) => {
				setConfirmedTrips(confirmedTripsData);
				setLoading(false);
			})
			.catch((err) => console.log(err));
	}, []);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		getConfirmedTrips()
			.then((confirmedTripsData) => {
				setConfirmedTrips(confirmedTripsData);
				setRefreshing(false);
			})
			.catch((err) => console.log(err));
	}, [setConfirmedTrips, setRefreshing]);
	if (loading) return <LoadingScreen />;
	return (!confirmedTrips.length) ? (
		<View style={styles.circle}>
		<Text style={styles.text}>You have no active trips!</Text>
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
				{confirmedTrips.map((tripDetail) => (
					<TripCard
						key={tripDetail._id}
						tripDetail={tripDetail}
						onPress={() => {
							dispatch(preNavigateTripDetailScreen(tripDetail));
							navigation.navigate("TripDetail", {
								screen: "TripAcceptedRequests",
							});
						}}
					></TripCard>
				))}
			</ScrollView>
		</View>
	);
};

export default ConfirmedTripsScreen;

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
