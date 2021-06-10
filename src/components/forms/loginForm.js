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
import { useTheme } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";

const { useFormReducer, FORM_INPUT_UPDATE } = formReducer;
const loginForm = ({ setError }) => {
	const { colors } = useTheme();
	const [formState, dispatchFormState] = useFormReducer([
		"email",
		"password",
	]);
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();

	console.log("---------------------> Log-in Form Render:");
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
		const push_token = await registerForPushNotificationsAsync();
		const action = authActions.login(formState.inputValues, push_token);
		setError(null);
		try {
			await dispatch(action);
		} catch (err) {
			console.log(err);
			setError(err.message);
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

	return (
		<View>
			<Input
				id="email"
				label="E-mail"
				keyboardType="default"
				email
				required
				errorText="Please enter a proper email-ID"
				onInputChange={inputChangeHandler}
				initialValue=""
			/>
			<Input
				id="password"
				label="Password"
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
						title="Login"
						color={colors.primary}
						onPress={authHandler}
					/>
				)}
			</View>
		</View>
	);
};

export default loginForm;

const styles = StyleSheet.create({
	buttonContainer: {
		marginTop: 10,
	},
});
