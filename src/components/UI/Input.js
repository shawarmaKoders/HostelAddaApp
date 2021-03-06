import React, { useReducer, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import CustomText from "./CustomText";
import { useTheme } from "@react-navigation/native";

const INPUT_CHANGE = "INPUT_CHANGE";

const inputReducer = (state, action) => {
	switch (action.type) {
		case INPUT_CHANGE:
			return {
				...state,
				value: action.value,
				isValid: action.isValid,
				touched: true,
			};
		default:
			return state;
	}
};

const Input = (props) => {
	const { colors } = useTheme();
	const [inputState, dispatch] = useReducer(inputReducer, {
		value: props.initialValue ? props.initialValue : "",
		isValid: props.initiallyValid,
		touched: false,
	});

	const textChangeHandler = (text) => {
		const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		let isValid = true;
		if (props.required && text.trim().length === 0) {
			isValid = false;
		}
		if (props.email && !emailRegex.test(text.toLowerCase())) {
			isValid = false;
		}
		if (props.min != null && +text < props.min) {
			isValid = false;
		}
		if (props.max != null && +text > props.max) {
			isValid = false;
		}
		if (props.minLength != null && text.length < props.minLength) {
			isValid = false;
		}
		dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid });

		const { onInputChange, id } = props;
		onInputChange(id, text, isValid);
	};

	return (
		<View style={styles.formControl}>
			<CustomText style={styles.label}>{props.label}</CustomText>
			<TextInput
				{...props}
				style={{ ...styles.input, color: colors.text }}
				value={inputState.value}
				onChangeText={textChangeHandler}
			/>
			{!inputState.isValid && inputState.touched && (
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>{props.errorText}</Text>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	formControl: {
		width: "100%",
	},
	label: {
		// fontFamily: 'open-sans-bold',
		marginVertical: 8,
	},
	input: {
		paddingHorizontal: 2,
		paddingVertical: 5,
		borderBottomColor: "#ccc",
		borderBottomWidth: 1,
	},
	errorContainer: {
		marginVertical: 5,
	},
	errorText: {
		// fontFamily: 'open-sans',
		color: "red",
		fontSize: 13,
	},
});

export default Input;
