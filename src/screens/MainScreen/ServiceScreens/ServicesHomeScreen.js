import React, { useLayoutEffect, useEffect, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import Text from "../../../components/UI/CustomText";
import { useTheme } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "../../../components/UI/ModalButton";
import ServiceCard from "../../../components/ServiceScreen/ServiceCard";
import {
	HeaderButtons,
	HeaderButton,
	Item,
} from "react-navigation-header-buttons";
import appSettings from "../../../constants/appSettings";
import axios from "../../../customAxios";
import LoadingScreen from "../../../components/UI/LoadingScreen";
const { backendDomain } = appSettings;

const fetchServices = async (userId) => {
	const url = `${backendDomain}/services`;
	const response = await axios.get(url);
	return response.data;
};

const IoniconsHeaderButton = (props) => {
	const { colors } = useTheme();
	return (
		<HeaderButton
			IconComponent={MaterialIcons}
			iconSize={30}
			color={colors.primary}
			{...props}
		/>
	);
};

const AddServiceHeaderButton = (navigateToAddServiceScreen, props) => (
	<HeaderButtons HeaderButtonComponent={IoniconsHeaderButton} {...props}>
		<Item
			title="Add Service"
			iconName="fiber-new"
			onPress={navigateToAddServiceScreen}
		/>
	</HeaderButtons>
);

const ServicesHomeScreen = ({ navigation }) => {
	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: AddServiceHeaderButton.bind(null, () =>
				navigation.navigate("AddService")
			),
		});
	}, [navigation]);

	const [loading, setLoading] = useState(true);
	const [topServices, setServices] = useState([]);
	useEffect(() => {
		fetchServices()
			.then((serviceResponse) => setServices(serviceResponse))
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<View
				style={{
					flex: 1,
					maxHeight: 200,
				}}
			>
				<ScrollView
					horizontal
					contentContainerStyle={{ alignItems: "center" }}
				>
					{topServices.map((serviceDetail) => (
						<ServiceCard
							key={serviceDetail._id}
							serviceDetail={serviceDetail}
							onPress={() =>
								navigation.navigate("ServiceDetail", {
									serviceDetail,
								})
							}
						/>
					))}
				</ScrollView>
			</View>
			<Button
				text="See More Services"
				onPress={() => navigation.navigate("BookServices")}
			/>
			<Button
				text="My Broadcasted Requests"
				onPress={() => navigation.navigate("BroadcastedRequests")}
			/>
			<Button
				text="My Pending Requests"
				onPress={() => navigation.navigate("PendingRequests")}
			/>
			<Button
				text="Confirmed Requests"
				onPress={() => navigation.navigate("ConfirmedRequests")}
			/>
			<Button
				text="My Trips"
				onPress={() => navigation.navigate("MyTrips")}
			/>
		</View>
	);
};

export default ServicesHomeScreen;

const styles = StyleSheet.create({});
