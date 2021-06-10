import * as React from "react";
import { Platform, StatusBar, View, AsyncStorage, Image } from "react-native";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { MyDarkTheme } from "./constants/Theme";
import { useSelector, useDispatch } from "react-redux";
import * as appConfigActions from "./store/actions/appConfig";
import SplashScreenView from "./components/UI/SplashScreenView";
import { Asset } from "expo-asset";

import { Provider } from "react-redux";

import MainNavigator from "./navigation/MainNavigator";
import useLinking from "./navigation/useLinking";

import store from "./store/store";

// const INTRO_DONE_KEY = "INTRO_DONE";

const cacheImages = (images) =>
	images.map((image) => {
		if (typeof image === "string") {
			return Image.prefetch(image);
		} else {
			return Asset.fromModule(image).downloadAsync();
		}
	});

function App(props) {
	const [isLoadingComplete, setLoadingComplete] = React.useState(false);
	const [
		initialNavigationState,
		setInitialNavigationState,
	] = React.useState();
	const containerRef = React.useRef();
	const { getInitialState } = useLinking(containerRef);
	const dispatch = useDispatch();

	// Load any resources or data that we need prior to rendering the app
	React.useEffect(() => {
		async function loadResourcesAndDataAsync() {
			try {
				// Load our initial navigation state
				setInitialNavigationState(await getInitialState());

				// // Load a few Images
				// await allSettled(cacheImages([
				// 	require("./assets/images/splash_bg.png"),
				// 	require("./assets/images/splash.png"),
				// ]))

				// Load fonts

				// let appIntroDone = await AsyncStorage.getItem(INTRO_DONE_KEY);
				// appIntroDone = appIntroDone ? true : false;
				// const appIntroDone = true;

				// if (appIntroDone) dispatch(appConfigActions.completeAppIntro());
			} catch (e) {
				// We might want to provide this error information to an error reporting service
				console.warn(e);
			} finally {
				setLoadingComplete(true);
			}
		}

		loadResourcesAndDataAsync();
	}, []);

	if (!isLoadingComplete && !props.skipLoadingScreen) {
		return <SplashScreenView />;
	} else {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: MyDarkTheme.colors.background,
				}}
			>
				<StatusBar
					barStyle="light-content"
					animated={true}
					backgroundColor={MyDarkTheme.colors.card}
				/>
				<NavigationContainer
					ref={containerRef}
					initialState={initialNavigationState}
					theme={MyDarkTheme}
				>
					<MainNavigator />
				</NavigationContainer>
			</View>
		);
	}
}

export default (props) => {
	return (
		<Provider store={store}>
			<App {...props} />
		</Provider>
	);
};
