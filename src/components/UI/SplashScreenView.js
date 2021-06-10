import React from "react";
import { View, Text, ImageBackground, StyleSheet, Image } from "react-native";
import { MyDarkTheme } from "../../constants/Theme";

const { colors } = MyDarkTheme;

export default function SplashScreenView() {
	return (
		<View style={styles.root}>
			<ImageBackground
				source={require("../../assets/images/splash_bg.png")}
				style={styles.altImage}
				imageStyle={{ opacity: 0.25 }}
				resizeMode="cover"
			>
				<View
					style={{
						flex: 3,
						...styles.centerStyle,
					}}
				>
					<Image
						source={require("../../assets/images/splash_icon.png")}
						style={styles.imageStyle}
					/>
				</View>
				<View
					style={{
						flex: 2,
						...styles.centerStyle,
					}}
				>
					<Text style={styles.text}>Hostel Adda</Text>
				</View>
			</ImageBackground>
		</View>
	);
}

const styles = StyleSheet.create({
	root: { flex: 1, backgroundColor: colors.background },
	altImage: { flexGrow: 1 },
	imageStyle: {
		height: "50%",
		width: "50%",
	},
	centerStyle: {
		justifyContent: "center",
		alignItems: "center",
	},
	text: {
		color: colors.text,
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
	},
});
