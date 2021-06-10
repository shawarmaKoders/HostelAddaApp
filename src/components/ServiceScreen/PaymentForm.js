import React, { useCallback, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import Button from "../UI/ModalButton";
import Input from "../UI/Input";
import Text from "../UI/CustomText";
import formReducer from "../../customHooks/useFormReducer";

const { useFormReducer, FORM_INPUT_UPDATE } = formReducer;

const PaymentForm = ({ onConfirm }) => {
	const [formState, dispatchFormState] = useFormReducer([]);

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
		<View style={{ width: "80%", marginVertical: 10 }}>
			<Text>Payment Form Here</Text>
			<Button
				text="Confirm Payment Details"
				onPress={() => onConfirm(formState.inputValues)}
			/>
		</View>
	);
};

export default PaymentForm;

const styles = StyleSheet.create({});
