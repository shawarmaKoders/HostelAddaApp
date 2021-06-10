import { AUTHENTICATE, LOGOUT } from "../actions/auth";

const initialState = {
	token: null,
	email: null,
	isLoggedIn: false,
	hasLoggedInOnce: false,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case AUTHENTICATE:
			return {
				token: action.token,
				email: action.email,
				isLoggedIn: true,
				hasLoggedInOnce: true,
			};
		case LOGOUT:
			return { ...initialState, hasLoggedInOnce: true };
		default:
			return state;
	}
};
