import React from "react";
import { StyleSheet, View, Modal } from "react-native";
import { useTheme } from "@react-navigation/native";

const CenterModal = ({
	children,
	visible,
	onCancel = () => {},
	outerStyle,
	innerStyle,
}) => {
	const { colors } = useTheme();
	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={visible}
			onRequestClose={onCancel}
		>
			<View
				style={{
					...styles.centeredView,
					...outerStyle,
				}}
			>
				<View
					style={{
						...styles.modalView,
						backgroundColor: colors.card,
						shadowColor: colors.border,
						...innerStyle,
					}}
				>
					{children}
				</View>
			</View>
		</Modal>
	);
};

export default CenterModal;

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		borderRadius: 20,
		padding: 30,
		alignItems: "center",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
});
