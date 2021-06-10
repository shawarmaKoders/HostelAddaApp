import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, View, StyleSheet, Button, Alert } from "react-native";

import LoginForm from "../components/forms/loginForm";
import SignUpForm from "../components/forms/signUpForm";

import Card from "../components/UI/Card";

const AuthScreen = (props) => {
	const [error, setError] = useState();
	const [isSignup, setIsSignup] = useState(false);

	useEffect(() => {
		if (error) {
			Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
		}
	}, [error]);

	const switchForm = useCallback(
		() => setIsSignup((prevState) => !prevState),
		[setIsSignup]
	);

	return (
		<View style={styles.screen}>
			<Card style={styles.authContainer}>
				<ScrollView>
					{isSignup ? (
						<SignUpForm setError={setError} />
					) : (
						<LoginForm setError={setError} />
					)}

					{/* <View style={styles.buttonContainer}>
						<Button
							title={`Switch to ${
								isSignup ? "Login" : "Sign Up"
							}`}
							color="grey"
							onPress={switchForm}
						/>
					</View> */}
				</ScrollView>
			</Card>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	authContainer: {
		width: "80%",
		maxWidth: 400,
		maxHeight: 400,
		padding: 20,
	},
	buttonContainer: {
		marginTop: 10,
	},
});

export default AuthScreen;
