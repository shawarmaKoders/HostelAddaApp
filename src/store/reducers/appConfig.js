import { COMPLETE_APP_INTRO, FIRST_APP_USE } from "../actions/appConfig";

const initialState = {
	introDone: false,
	firstAppUse: false,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case COMPLETE_APP_INTRO:
			return { ...state, introDone: true };
		case FIRST_APP_USE:
			return { ...state, firstAppUse: true };
		default:
			return state;
	}
};
