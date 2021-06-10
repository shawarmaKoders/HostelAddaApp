import React, { useEffect } from "react";
import { View } from "react-native";
import * as authActions from "../store/actions/auth";
import { useSelector, useDispatch } from "react-redux";
import Text from "../components/UI/CustomText";
import SplashScreenView from "../components/UI/SplashScreenView";

const StartUpScreen = () => {
	const dispatch = useDispatch();
	const hasLoggedInOnce = useSelector((state) => state.auth.hasLoggedInOnce);
	// const firstAppUse = useSelector((state) => state.appConfig.firstAppUse);
	const firstAppUse = false;

	useEffect(() => {
		if (!hasLoggedInOnce) dispatch(authActions.setup_local_auth());
	}, []);

	return !firstAppUse ? (
		<SplashScreenView />
	) : (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<View
				style={{
					marginVertical: 10,
					paddingHorizontal: 10,
				}}
			>
				<Text
					style={{
						fontSize: 20,
						textAlign: "center",
						fontWeight: "bold",
					}}
				>
					Setting you ... UP! ;)
				</Text>
			</View>
		</View>
	);
};

export default StartUpScreen;
