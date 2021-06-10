import { AsyncStorage } from "react-native";
import axios from "axios";
const {
	backendDomain: hostURL,
} = require("../../constants/appSettings").default;

const LOGIN_URL = `${hostURL}/users/login`;
const LOGOUT_URL = `${hostURL}/users/logout`;
const SAVE_PUSH_TOKEN_URL = `${hostURL}/users/add-token`;
const REMOVE_PUSH_TOKEN_URL = `${hostURL}/users/delete-token`;

const USER_DATA_KEY = "userData";

export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

const make_patch_req = async (url, token, data = {}) => {
	try {
		const headers = { Authorization: `Bearer ${token}` };
		response = await axios.patch(url, data, { headers });
		return response.data;
	} catch (err) {
		console.log(error);
		console.log(error.response);
	}
};
const make_post_req = async (url, token, data = {}) => {
	const headers = { Authorization: `Bearer ${token}` };
	response = await axios.post(url, data, { headers });
	return response.data;
};

export const authenticate = (email, token, push_token = null) => {
	getDataFromStorage().then((userDataString) => {
		if (userDataString) {
			const userData = JSON.parse(userDataString);
			const stored_email = userData.email;
			if (stored_email !== email)
				make_patch_req(
					REMOVE_PUSH_TOKEN_URL,
					userData.accessToken
				).catch(() => {});
		}
	});
	if (push_token)
		make_patch_req(SAVE_PUSH_TOKEN_URL, token, {
			push_token: push_token.data,
		}).catch(() => {});

	return { type: AUTHENTICATE, email, token };
};

export const signup = ({ email, token }, pushToken = null) => {
	return async (dispatch) => {
		console.log("SIGN-UP Action Triggered");
		saveDataToStorage(email, token);

		console.log("SIGN-UP Action Response Successful");
		dispatch(authenticate(email, access, pushToken));
	};
};

export const logout = (access_token = null) => {
	if (access_token) {
		getDataFromStorage().then((userDataString) => {
			make_post_req(LOGOUT_URL, access_token).catch(() => {});
			AsyncStorage.removeItem(USER_DATA_KEY);
		});
	} else AsyncStorage.removeItem(USER_DATA_KEY);
	return { type: LOGOUT };
};

export const login = ({ email, password }, pushToken = null) => {
	return async (dispatch) => {
		console.log("LOG-IN Action Triggered");
		const response = await axios.post(LOGIN_URL, { email, password });

		const { token } = response.data;
		saveDataToStorage(email, token);

		console.log("LOG-IN Action Response Successful");
		dispatch(authenticate(email, token, pushToken));
	};
};

export const setup_local_auth = () => {
	return async (dispatch) => {
		console.log("setup_local_auth Action Triggered");

		const userDataString = await AsyncStorage.getItem(USER_DATA_KEY);
		if (userDataString) {
			const { email, accessToken } = JSON.parse(userDataString);
			dispatch(authenticate(email, accessToken));
		} else {
			console.log("No User-Token in Memory");
			dispatch(logout());
		}
	};
};

const getDataFromStorage = async () =>
	await AsyncStorage.getItem(USER_DATA_KEY);

const saveDataToStorage = (email, accessToken) => {
	AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify({ email, accessToken }));
};
