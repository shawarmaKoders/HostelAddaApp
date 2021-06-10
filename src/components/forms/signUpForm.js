import React, { useState, useCallback } from "react";
import {
	StyleSheet,
	View,
	ActivityIndicator,
	Button,
	Platform,
} from "react-native";
import formReducer from "../../customHooks/useFormReducer";
import * as authActions from "../../store/actions/auth";
import { useDispatch } from "react-redux";
import Input from "../UI/Input";
import Text from "../UI/CustomText";
import { useTheme } from "@react-navigation/native";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import axios from "../../customAxios";
const { backendDomain } = require("../../constants/appSettings").default;
const SIGNUP_URL = `${backendDomain}/accounts/signup/`;

const { useFormReducer, FORM_INPUT_UPDATE } = formReducer;
const signupFields = {
	username: "Username",
	email: "E-Mail",
	first_name: "First Name",
	last_name: "Last Name",
	phone_number: "Phone Number",
	password: "Password",
};

const signUpForm = ({ setError }) => {
	const { colors } = useTheme();
	const [formState, dispatchFormState] = useFormReducer(
		Object.keys(signupFields)
	);
	const [formComplete, setFormComplete] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();

	console.log("---------------------> Sign-Up Form:");
	console.log("inputValues:", formState.inputValues);

	const registerForPushNotificationsAsync = async () => {
		if (Constants.isDevice) {
			const { status: existingStatus } = await Permissions.getAsync(
				Permissions.NOTIFICATIONS
			);
			let finalStatus = existingStatus;
			if (existingStatus !== "granted") {
				const { status } = await Permissions.askAsync(
					Permissions.NOTIFICATIONS
				);
				finalStatus = status;
			}
			if (finalStatus !== "granted") {
				console.log("Failed to get push token for push notification!");
				return;
			}
			const token = await Notifications.getExpoPushTokenAsync();
			return token;
		} else {
			alert("Must use physical device for Push Notifications");
		}

		if (Platform.OS === "android") {
			Notifications.createChannelAndroidAsync("default", {
				name: "default",
				sound: true,
				priority: "max",
				vibrate: [0, 250, 250, 250],
			});
		}
	};

	const authHandler = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const push_token = await registerForPushNotificationsAsync();
			const response = await axios.post(
				SIGNUP_URL,
				formState.inputValues
			);
			const { access, refresh } = response.data;
			if (access && refresh) {
				const action = authActions.signup(
					{
						username: formState.inputValues.username,
						access,
						refresh,
					},
					push_token
				);
				dispatch(action);
			} else setFormComplete(true);
		} catch (err) {
			console.log(err);
			if (err.response) {
				const err_data = err.response.data;
				const err_data_keys = Object.keys(err_data);
				let err_key = null;
				for (let key of err_data_keys)
					if (key in signupFields) {
						err_key = key;
						break;
					}
				if (err_key)
					setError(`${signupFields[err_key]}: ${err_data[err_key]}`);
				else setError(err.message);
			} else {
				setError("An Error Occurred!");
			}
			setIsLoading(false);
		}
	};

	const inputChangeHandler = useCallback(
		(inputIdentifier, inputValue, inputValidity) => {
			dispatchFormState({
				type: FORM_INPUT_UPDATE,
				value: inputValue,
				isValid: inputValidity,
				input: inputIdentifier,
			});
		},
		[dispatchFormState]
	);

	return formComplete ? (
		<View style={{ justifyContent: "center", alignItems: "center" }}>
			<Text style={{ fontSize: 18, textAlign: "center" }}>
				A confirmation link has been sent to your email.
			</Text>
			<Text style={{ fontSize: 18, textAlign: "center" }}>
				Confirm your email and come back to Log-In!
			</Text>
		</View>
	) : (
		<View>
			<Input
				id="username"
				label={signupFields.username}
				keyboardType="default"
				required
				minLength={3}
				errorText="Please enter a proper username"
				onInputChange={inputChangeHandler}
				initialValue=""
			/>
			<Input
				id="email"
				label={signupFields.email}
				keyboardType="email-address"
				required
				email
				autoCapitalize="none"
				errorText="Please enter a valid email address."
				onInputChange={inputChangeHandler}
				initialValue=""
			/>
			<Input
				id="first_name"
				label={signupFields.first_name}
				keyboardType="default"
				required
				minLength={2}
				errorText="Please enter your First Name"
				onInputChange={inputChangeHandler}
				initialValue=""
			/>
			<Input
				id="last_name"
				label={signupFields.last_name}
				keyboardType="default"
				errorText="Please enter a proper Last Name"
				onInputChange={inputChangeHandler}
				initialValue=""
			/>
			<Input
				id="phone_number"
				label={signupFields.phone_number}
				keyboardType="phone-pad"
				required
				minLength={10}
				errorText="Please enter a valid phone number"
				onInputChange={inputChangeHandler}
				initialValue=""
			/>
			<Input
				id="password"
				label={signupFields.password}
				keyboardType="default"
				secureTextEntry
				required
				minLength={5}
				autoCapitalize="none"
				errorText="Please enter a valid password"
				onInputChange={inputChangeHandler}
				initialValue=""
			/>
			<View style={styles.buttonContainer}>
				{isLoading ? (
					<ActivityIndicator size="small" color={colors.primary} />
				) : (
					<Button
						title="Sign Up"
						color={colors.primary}
						onPress={authHandler}
					/>
				)}
			</View>
		</View>
	);
};

export default signUpForm;

const styles = StyleSheet.create({
	buttonContainer: {
		marginTop: 10,
	},
});
