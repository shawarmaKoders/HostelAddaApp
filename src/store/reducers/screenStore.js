import {
	NAVIGATE_TRIP_DETAIL_SCREEN,
	LEAVE_TRIP_DETAIL_SCREEN,
} from "../actions/screenReducer";

const initialState = {
	tripDetailScreen: null,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case NAVIGATE_TRIP_DETAIL_SCREEN:
			return { ...state, tripDetailScreen: action.tripData };
		case LEAVE_TRIP_DETAIL_SCREEN:
			return { ...state, tripDetailScreen: null };
		default:
			return state;
	}
};
