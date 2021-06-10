import { DefaultTheme, DarkTheme } from "@react-navigation/native";

export const MyTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
	},
};

export const MyDarkTheme = {
	...DarkTheme,
	colors: {
		...DarkTheme.colors,
		status: {
			placed: "blue",
			"accepted-request": "green",
			"accepted-delivery": "yellow",
			confirmed: "red",
		},
	},
};

export default MyTheme;
