import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../../screens/MainScreen/HomeScreens/HomeScreen";

const Stack = createStackNavigator();

export default function HomeNavigator() {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Home" component={HomeScreen} />
		</Stack.Navigator>
	);
}
