import * as React from "react";
import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItemList,
	DrawerItem,
} from "@react-navigation/drawer";
import { NativeModules, View } from "react-native";
import * as authActions from "../store/actions/auth";

import Text from "../components/UI/CustomText";

import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import MainScreenNavigator from "./MainScreen/MainScreenNavigator";
import AuthNavigator from "./AuthNavigator";
import StartUpScreen from "../screens/StartUpScreen";

const MainNavigator = createDrawerNavigator();

function CustomDrawerContent(props) {
	const { token, isLoggedIn } = useSelector((state) => state.auth);
	const colors = useTheme();
	const dispatch = useDispatch();
	return (
		<DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
			<DrawerItemList {...props} />
			<View
				style={{
					flex: 1,
					flexDirection: "row",
					alignItems: "center",
					paddingHorizontal: 10,
					width: "50%",
					opacity: 0.4,
				}}
			>
				<MaterialCommunityIcons
					name="gesture-swipe-horizontal"
					size={35}
					color={colors.text}
				/>
				<Text style={{ textAlign: "center" }}>
					Quick way to toggle the Menu
				</Text>
			</View>

			{isLoggedIn && (
				<DrawerItem
					label="Logout"
					onPress={() => dispatch(authActions.logout(token))}
				/>
			)}
		</DrawerContentScrollView>
	);
}

export default function MyDrawer() {
	const { colors } = useTheme();

	const [isLoggedIn, hasLoggedInOnce] = useSelector((state) => [
		state.auth.isLoggedIn,
		state.auth.hasLoggedInOnce,
	]);

	// const introDone = useSelector((state) => state.appConfig.introDone);
	const introDone = true;

	return !introDone ? (
		<IntroScreen />
	) : (
		<MainNavigator.Navigator
			drawerStyle={{ backgroundColor: colors.card }}
			drawerContentOptions={{ activeTintColor: colors.primary }}
			drawerContent={(props) => <CustomDrawerContent {...props} />}
		>
			{isLoggedIn ? (
				<>
					<MainNavigator.Screen
						name="HostelAdda"
						component={MainScreenNavigator}
					/>
				</>
			) : hasLoggedInOnce ? (
				<>
					<MainNavigator.Screen
						name="Authenticate"
						component={AuthNavigator}
					/>
				</>
			) : (
				<MainNavigator.Screen
					name="Welcome"
					component={StartUpScreen}
				/>
			)}
		</MainNavigator.Navigator>
	);
}
