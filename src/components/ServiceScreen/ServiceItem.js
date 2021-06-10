import React, { useState } from "react";
import { StyleSheet, View, TextInput, Alert } from "react-native";
import Text from "../UI/CustomText";
import Button from "../UI/ModalButton";
import { useTheme } from "@react-navigation/native";

const ServiceItem = ({
	itemDescription = "",
	setItemDescription = () => {},
	confirmed = false,
	setConfirmed = () => {},
	showConfirmButton = true,
}) => {
	const { colors } = useTheme();
	const onItemsConfirmation = () => {
		if (itemDescription.length < 10) {
			Alert.alert("Description too short!");
			return;
		}
		setConfirmed(true);
	};
	const onEdit = () => {
		setConfirmed(false);
	};
	return (
		<View style={{ width: "80%" }}>
			<View
				style={{
					width: "100%",
					borderColor: colors.text,
					borderWidth: 2,
					borderRadius: 10,
					padding: 5,
					backgroundColor: colors.card,
					opacity: confirmed ? 0.5 : 1,
				}}
			>
				<TextInput
					style={{
						...styles.input,
						color: colors.text,
						fontSize: 16,
						borderBottomColor: "grey",
					}}
					multiline={true}
					numberOfLines={10}
					maxLength={399}
					textAlignVertical="top"
					onChangeText={setItemDescription}
					value={itemDescription}
					editable={!confirmed}
				/>
				<View
					style={{
						width: "100%",
						flexDirection: "row",
						justifyContent: "flex-end",
					}}
				>
					<Text>{`${itemDescription.length}/399`}</Text>
				</View>
			</View>
			{showConfirmButton ? (
				confirmed ? (
					<Button text="Edit" onPress={onEdit} />
				) : (
					<Button text="Confirm" onPress={onItemsConfirmation} />
				)
			) : null}
		</View>
	);
};

export default ServiceItem;

const styles = StyleSheet.create({
	input: {
		paddingHorizontal: 2,
		paddingVertical: 5,
		borderBottomWidth: 1,
	},
});
