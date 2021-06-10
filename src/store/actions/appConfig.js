import { AsyncStorage } from "react-native";

export const COMPLETE_APP_INTRO = "COMPLETE_APP_INTRO";
export const FIRST_APP_USE = "FIRST_APP_USE";

export const completeAppIntro = () => {
	return { type: COMPLETE_APP_INTRO };
};

export const firstAppUse = () => {
	return { type: FIRST_APP_USE };
};
