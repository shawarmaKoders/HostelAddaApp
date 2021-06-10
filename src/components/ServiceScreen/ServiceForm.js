import React, { useCallback, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import Button from "../UI/ModalButton";
import Input from "../UI/Input";
import PaymentForm from "./PaymentForm";
import formReducer from "../../customHooks/useFormReducer";

const { useFormReducer, FORM_INPUT_UPDATE } = formReducer;

const ServiceForm = ({ onSubmit }) => {
	const [requiresPayment, setRequiresPayment] = useState(false);
	const [formState, dispatchFormState] = useFormReducer(["service_name"]);

	const onPaymentTap = () => {
		setRequiresPayment((paymentStatus) => !paymentStatus);
	};

	const onPaymentConfirm = (paymentDetails) => {
		Alert.alert("<To be implemented>");
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
		<>
			<View style={{ width: "80%", marginVertical: 10 }}>
				<Input
					label="Service Name"
					id="service_name"
					minLength={5}
					onInputChange={inputChangeHandler}
					errorText="Invalid Service Name"
					initialValue=""
					autoCapitalize="none"
					keyboardType="default"
					required
				/>
				{requiresPayment ? (
					<Button
						text="Remove Payment Options"
						onPress={onPaymentTap}
					/>
				) : (
					<Button text="Add Payment Options" onPress={onPaymentTap} />
				)}
			</View>
			{requiresPayment && <PaymentForm onConfirm={onPaymentConfirm} />}
			<Button
				text="Submit"
				onPress={() => onSubmit(formState.inputValues)}
			/>
		</>
	);
};

export default ServiceForm;

const styles = StyleSheet.create({});
