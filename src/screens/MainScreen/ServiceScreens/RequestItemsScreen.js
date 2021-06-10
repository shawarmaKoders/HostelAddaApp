import React, { useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import Text from "../../../components/UI/CustomText";
import Button from "../../../components/UI/ModalButton";
import { useTheme } from "@react-navigation/native";
import LoadingScreen from "../../../components/UI/LoadingScreen";
import ServiceItem from "../../../components/ServiceScreen/ServiceItem";

const RequestScreen = ({ navigation, route }) => {
	const { serviceDetail } = route.params;
	const [itemDescription, setItemDescription] = useState("");
	const [itemConfirmed, setItemConfirmed] = useState(false);
	const [loading, setLoading] = useState(true);
	const { colors } = useTheme();
	const onProceed = () => {
		if (!itemConfirmed) {
			Alert.alert("Confirm all items!");
			return;
		}
		navigation.navigate("RequestTimeOrPerson", {
			itemDescriptions: [itemDescription],
			serviceDetail,
		});
	};
	return (
		<View style={styles.rootView}>
			<Text style={{ textAlign: "center" }}>{serviceDetail.name}</Text>
			<View style={{ marginVertical: 20 }}>
				<ServiceItem
					itemDescription={itemDescription}
					setItemDescription={setItemDescription}
					confirmed={itemConfirmed}
					setConfirmed={setItemConfirmed}
				/>
			</View>
			<Button text="Proceed" onPress={onProceed} />
		</View>
	);
};

export default RequestScreen;

const styles = StyleSheet.create({
	rootView: {
		flex: 1,
		alignItems: "center",
	},
	input: {
		paddingHorizontal: 2,
		paddingVertical: 5,
		borderBottomWidth: 1,
	},
});
