import React, {
	useLayoutEffect,
	useEffect,
	useState,
	useCallback,
} from "react";
import { StyleSheet, View, RefreshControl } from "react-native";
import Text from "../../../components/UI/CustomText";
import { useTheme } from "@react-navigation/native";
import ServicesList from "../../../components/ServiceScreen/ServicesList";
import { MaterialIcons } from "@expo/vector-icons";
import appSettings from "../../../constants/appSettings";
import axios from "../../../customAxios";
import {
	HeaderButtons,
	HeaderButton,
	Item,
} from "react-navigation-header-buttons";
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
	const [services, setServices] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchServices()
			.then((serviceResponse) => {
				setServices(serviceResponse);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [setServices]);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: AddServiceHeaderButton.bind(null, () =>
				navigation.navigate("AddService")
			),
		});
	}, [navigation]);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		fetchServices()
			.then((fetchedServices) => {
				setServices(fetchedServices);
				setRefreshing(false);
			})
			.catch(() => {});
	}, [setServices, setRefreshing]);
	if (loading) return <LoadingScreen />;
	return !services.length ? (
		<View style={styles.circle}>
			<Text style={styles.text}>No Services to display</Text>
		</View>
	) : (
		<View style={{ flex: 1 }}>
			<View style={{ flex: 1 }}>
				<ServicesList
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>
					}
					serviceDetailList={services}
					onServiceDeliver={(serviceDetail) =>
						navigation.navigate("AvailableRequests", serviceDetail)
					}
					onServiceRequest={(serviceDetail) =>
						navigation.navigate("RequestItems", serviceDetail)
					}
					onServiceDetail={(serviceDetail) =>
						navigation.navigate("ServiceDetail", {
							serviceDetail,
						})
					}
				/>
			</View>
		</View>
	);
};

export default ServicesHomeScreen;

const styles = StyleSheet.create({
	circle: {
		paddingTop: "50%",
		borderRadius: 50,
		borderWidth: 1,
		borderColor: "black",
		height: 35,
		marginBottom: 10,
		alignItems: "center",
	},
	text: {
		fontSize: 20,
		color: "white",
		textAlign: "center",
	}
});
