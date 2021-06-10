import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ServicesHomeScreen from "../../screens/MainScreen/ServiceScreens/ServicesHomeScreen";
import BookServicesScreen from "../../screens/MainScreen/ServiceScreens/BookServicesScreen";
import RequestItemsScreen from "../../screens/MainScreen/ServiceScreens/RequestItemsScreen";
import RequestTimeOrPersonScreen from "../../screens/MainScreen/ServiceScreens/RequestTimeOrPersonScreen";
import RequestPersonDetailScreen from "../../screens/MainScreen/ServiceScreens/RequestPersonDetail";
import AddServiceScreen from "../../screens/MainScreen/ServiceScreens/AddServiceScreen";
import BroadcastedRequestsScreen from "../../screens/MainScreen/ServiceScreens/BroadcastedRequestsScreen";
import ServiceDetailScreen from "../../screens/MainScreen/ServiceScreens/ServiceDetailScreen";
import PendingRequestsScreen from "../../screens/MainScreen/ServiceScreens/PendingRequestsScreen";
import RequestDetailScreen from "../../screens/MainScreen/ServiceScreens/RequestDetailScreen";
import ConfirmedRequestsScreen from "../../screens/MainScreen/ServiceScreens/ConfirmedRequestsScreen";
import PlacedRequestsScreen from "../../screens/MainScreen/ServiceScreens/PlacedRequestsScreen";
import AvailableRequestsScreen from "../../screens/MainScreen/ServiceScreens/AvailableRequestsScreen";
import DeliverTimeConfirm from "../../screens/MainScreen/ServiceScreens/DeliverTimeConfirm";
import DeliverConfirmation from "../../screens/MainScreen/ServiceScreens/DeliverConfirmation";
import ConfirmedTripsScreen from "../../screens/MainScreen/ServiceScreens/ConfirmedTripsScreen";
import TripNavigator from "./TripNavigator";
import { Ionicons } from "@expo/vector-icons";
import {
	HeaderButtons,
	HeaderButton,
	Item,
} from "react-navigation-header-buttons";
import { useTheme } from "@react-navigation/native";

const Stack = createStackNavigator();

const IoniconsHeaderButton = (props) => {
	const { colors } = useTheme();
	return (
		<HeaderButton
			IconComponent={Ionicons}
			iconSize={25}
			color={colors.text}
			{...props}
		/>
	);
};

const BackButton = (goBack, props) => (
	<HeaderButtons HeaderButtonComponent={IoniconsHeaderButton} {...props}>
		<Item title="Go Back" iconName="md-arrow-back" onPress={goBack} />
	</HeaderButtons>
);

export default function ServicesNavigator() {
	return (
		<Stack.Navigator>
			<Stack.Screen name="ServicesHome" component={ServicesHomeScreen} />
			<Stack.Screen
				name="BookServices"
				component={BookServicesScreen}
				options={({ navigation }) => ({
					headerLeft: BackButton.bind(null, () =>
						navigation.popToTop()
					),
				})}
			/>
			<Stack.Screen
				name="BroadcastedRequests"
				component={BroadcastedRequestsScreen}
				options={({ navigation }) => ({
					headerLeft: BackButton.bind(null, () =>
						navigation.popToTop()
					),
				})}
			/>
			<Stack.Screen name="TripDetail" component={TripNavigator} />
			<Stack.Screen
				name="DeliverTimeConfirm"
				component={DeliverTimeConfirm}
			/>
			<Stack.Screen
				name="DeliverConfirmation"
				component={DeliverConfirmation}
			/>
			<Stack.Screen
				name="PendingRequests"
				component={PendingRequestsScreen}
				options={({ navigation }) => ({
					headerLeft: BackButton.bind(null, () =>
						navigation.popToTop()
					),
				})}
			/>
			<Stack.Screen
				name="ConfirmedRequests"
				component={ConfirmedRequestsScreen}
				options={({ navigation }) => ({
					headerLeft: BackButton.bind(null, () =>
						navigation.popToTop()
					),
				})}
			/>
			<Stack.Screen
				name="AvailableRequests"
				component={AvailableRequestsScreen}
			/>
			<Stack.Screen
				name="PlacedRequests"
				component={PlacedRequestsScreen}
			/>
			<Stack.Screen
				name="RequestDetail"
				component={RequestDetailScreen}
			/>
			<Stack.Screen
				name="MyTrips"
				component={ConfirmedTripsScreen}
				options={({ navigation }) => ({
					headerLeft: BackButton.bind(null, () =>
						navigation.popToTop()
					),
				})}
			/>
			<Stack.Screen
				name="ServiceDetail"
				component={ServiceDetailScreen}
			/>
			<Stack.Screen name="RequestItems" component={RequestItemsScreen} />
			<Stack.Screen
				name="RequestTimeOrPerson"
				component={RequestTimeOrPersonScreen}
			/>
			<Stack.Screen
				name="RequestPersonDetail"
				component={RequestPersonDetailScreen}
			/>
			<Stack.Screen name="AddService" component={AddServiceScreen} />
		</Stack.Navigator>
	);
}
