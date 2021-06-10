import React, { useCallback, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import Text from "../../../components/UI/CustomText";
import Button from "../../../components/UI/ModalButton";
import { useTheme } from "@react-navigation/native";
import LoadingScreen from "../../../components/UI/LoadingScreen";
import ServiceForm from "../../../components/ServiceScreen/ServiceForm";

const AddServiceScreen = ({ navigation }) => {
	const { colors } = useTheme();
	const onSubmit = () => {
		Alert.alert("<To be implemented>");
	};
	return (
		<View style={styles.rootView}>
			<ServiceForm onSubmit={onSubmit} />
		</View>
	);
};

export default AddServiceScreen;

const styles = StyleSheet.create({
	rootView: {
		flex: 1,
		alignItems: "center",
	},
});
