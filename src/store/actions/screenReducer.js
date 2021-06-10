import { AsyncStorage } from "react-native";

export const NAVIGATE_TRIP_DETAIL_SCREEN = "NAVIGATE_TRIP_DETAIL_SCREEN";
export const LEAVE_TRIP_DETAIL_SCREEN = "LEAVE_TRIP_DETAIL_SCREEN";

export const preNavigateTripDetailScreen = (tripData) => ({
	type: NAVIGATE_TRIP_DETAIL_SCREEN,
	tripData,
});

export const leaveTripDetailScreen = () => ({ type: LEAVE_TRIP_DETAIL_SCREEN });
