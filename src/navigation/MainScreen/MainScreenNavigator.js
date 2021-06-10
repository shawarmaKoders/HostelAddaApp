import * as React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import HomeNavigator from "./HomeNavigator";
import ServicesNavigator from "./ServicesNavigator";
import PlatformsNavigator from "./PlatformsNavigator";

const Tab = createMaterialBottomTabNavigator();

export default function MainScreenNavigator() {
	return (
		<Tab.Navigator>
			<Tab.Screen name="Home" component={HomeNavigator} />
			<Tab.Screen name="Services" component={ServicesNavigator} />
			<Tab.Screen name="Parivaar" component={PlatformsNavigator} />
		</Tab.Navigator>
	);
}
