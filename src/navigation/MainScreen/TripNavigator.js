import * as React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TripAcceptedRequest from "../../screens/MainScreen/ServiceScreens/TripAcceptedRequest";
import TripNewRequest from "../../screens/MainScreen/ServiceScreens/TripNewRequest";

const Tab = createMaterialTopTabNavigator();

export default function TripNavigator() {
	return (
		<Tab.Navigator>
			<Tab.Screen
				name="Accepted Requests"
				component={TripAcceptedRequest}
			/>
			<Tab.Screen name="New Requests" component={TripNewRequest} />
		</Tab.Navigator>
	);
}
