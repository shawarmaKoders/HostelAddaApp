import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ParivaarHomeScreen from "../../screens/MainScreen/PlatformScreens/ParivaarHomeScreen";
import PlatformDetailScreen from "../../screens/MainScreen/PlatformScreens/PlatformDetailScreen";
import PlaceOrderScreen from "../../screens/MainScreen/PlatformScreens/PlaceOrderScreen";
import AddOrderScreen from "../../screens/MainScreen/PlatformScreens/AddOrderScreen";
import ParivaarOrdersScreen from "../../screens/MainScreen/PlatformScreens/ParivaarOrdersScreen";
import MyOrdersScreen from "../../screens/MainScreen/PlatformScreens/MyOrdersScreen";
import OrderDetailScreen from "../../screens/MainScreen/PlatformScreens/OrderDetailScreen";
import ParticipantsListScreen from "../../screens/MainScreen/PlatformScreens/ParticipantsListScreen";
import ParticipantOrderDetailScreen from "../../screens/MainScreen/PlatformScreens/ParticipantOrderDetailScreen";
import ChatScreen from "../../screens/ChatScreen";
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
			<Stack.Screen name="ParivaarHome" component={ParivaarHomeScreen} />
			<Stack.Screen
				name="PlatformDetail"
				component={PlatformDetailScreen}
			/>
			<Stack.Screen name="PlaceOrder" component={PlaceOrderScreen} />
			<Stack.Screen name="AddOrder" component={AddOrderScreen} />
			<Stack.Screen name="MyOrders" component={MyOrdersScreen} />
			<Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
			<Stack.Screen
				name="ParticipantOrderDetail"
				component={ParticipantOrderDetailScreen}
			/>
			<Stack.Screen
				name="ParivaarOrders"
				component={ParivaarOrdersScreen}
			/>
			<Stack.Screen
				name="ParticipantList"
				component={ParticipantsListScreen}
			/>
			<Stack.Screen name="ChatScreen" component={ChatScreen} />
		</Stack.Navigator>
	);
}
