import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AuthScreen from "../screens/AuthScreen";

const Stack = createStackNavigator();

export default function AuthNavigator() {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Authenticate" component={AuthScreen} />
		</Stack.Navigator>
	);
}
