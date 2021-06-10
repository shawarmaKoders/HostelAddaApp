import React, { useLayoutEffect, useEffect, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import Text from "../../../components/UI/CustomText";
import { useTheme } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "../../../components/UI/ModalButton";
import PlatformCard from "../../../components/PlatformScreen/PlatformCard";
import {
	HeaderButtons,
	HeaderButton,
	Item,
} from "react-navigation-header-buttons";
import appSettings from "../../../constants/appSettings";
import axios from "../../../customAxios";
import LoadingScreen from "../../../components/UI/LoadingScreen";
const { backendDomain } = appSettings;

const fetchPlatforms = async () => {
	const url = `${backendDomain}/platforms`;
	const response = await axios.get(url);
	return response.data;
};

const IoniconsHeaderButton = (props) => {
	const { colors } = useTheme();
	return (
		<HeaderButton
			IconComponent={MaterialIcons}
			iconSize={30}
			color={colors.primary}
			{...props}
		/>
	);
};

const AddServiceHeaderButton = (navigateToAddPlatform, props) => (
	<HeaderButtons HeaderButtonComponent={IoniconsHeaderButton} {...props}>
		<Item
			title="Add Platform"
			iconName="fiber-new"
			onPress={navigateToAddPlatform}
		/>
	</HeaderButtons>
);

const ParivaarHomeScreen = ({ navigation }) => {
	const [loading, setLoading] = useState(true);
	const [platforms, setPlatforms] = useState([]);
	useEffect(() => {
		fetchPlatforms()
			.then((fetchedPlatforms) => setPlatforms(fetchedPlatforms))
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		<View style={{ flex: 1 }}>
			{Object.entries(platforms).map(([category, categoryPlatforms]) => (
				<View
					key={category}
					style={{
						flex: 1,
						maxHeight: 200,
					}}
				>
					<View style={{ padding: 10 }}>
						<Text style={{ fontWeight: "bold", fontSize: 16 }}>
							{category}
						</Text>
					</View>
					<ScrollView
						horizontal
						contentContainerStyle={{ alignItems: "center" }}
					>
						{categoryPlatforms.map((platformDetail) => (
							<PlatformCard
								key={platformDetail._id}
								platformDetail={platformDetail}
								onPress={() =>
									navigation.navigate("PlatformDetail", {
										platformDetail,
									})
								}
							/>
						))}
					</ScrollView>
				</View>
			))}
		</View>
	);
};

export default ParivaarHomeScreen;
