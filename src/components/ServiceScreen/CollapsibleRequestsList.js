import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Image } from "react-native";
import Text from "../UI/CustomText";
import Button from "../UI/ModalButton";
import { useTheme } from "@react-navigation/native";
import Accordion from "react-native-collapsible/Accordion";
import ServiceRequestCard from "./ServiceRequestCard";
import * as Animatable from "react-native-animatable";

const pad = (number) => `${number}`.padStart(2, "0");
const timePrint = (timeStringRaw) => {
	var temp = new Date(timeStringRaw) - 5.5 * 60 * 60 * 1000;
	const dt = new Date(temp);
	return `${pad(dt.getHours())} : ${pad(dt.getMinutes())}`;
};

function CollapsibleHeader({ isActive, requestDetail }) {
	const { colors } = useTheme();

	return (
		<Animatable.View
			duration={300}
			transition="backgroundColor"
			style={{
				padding: 10,
				backgroundColor: requestDetail.accepted
					? colors.status[requestDetail.status]
					: isActive
					? colors.border
					: colors.card,
				marginBottom: isActive ? 0 : 10,
				minWidth: 400,
				maxWidth: 700,
			}}
		>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-around",
					alignItems: "center",
				}}
			>
				<Image
					// source={{ uri: requestDetail.user.avatar }}
					style={{
						...styles.imageStyle,
						borderColor: colors.primary,
					}}
				/>
				<View
					style={{
						flex: 1,
						flexDirection: "column",
						justifyContent: "center",
						textAlign: "center",
						marginLeft: 40,
					}}
				>
					<Text
						style={{
							fontWeight: "bold",
							fontSize: 20,
						}}
					>
						{requestDetail.request_user.name}
					</Text>
					{requestDetail.time[0] && (
						<Text
							style={{
								fontWeight: "normal",
								fontSize: 15,
								marginVertical: 3,
							}}
						>
							{timePrint(requestDetail.time[0])}
						</Text>
					)}
				</View>
			</View>
		</Animatable.View>
	);
}

function CollapsibleContentView({
	isActive,
	index,
	requestDetail,
	buttons = [],
}) {
	const { colors } = useTheme();
	return (
		<Animatable.View
			duration={300}
			transition="backgroundColor"
			style={{
				padding: 10,
				backgroundColor: colors.border,
				marginVertical: 5,
				borderRadius: 10,
				borderBottomColor: colors.primary,
				borderRightColor: colors.primary,
				borderWidth: 1,
			}}
		>
			<View
				style={{
					alignItems: "center",
					justifyContent: "center",
					margin: 1,
				}}
			>
				{requestDetail.items.map((item, index) => (
					<Text key={index} style={styles.itemStyle}>
						{item}
					</Text>
				))}

				<View style={{ flexDirection: "row" }}>
					{buttons.map(({ text, onPress }, index) => (
						<Button
							key={index}
							text={text({ requestDetail })}
							onPress={() => onPress({ requestDetail, index })}
							style={{ margin: 8, width: "60%" }}
						/>
					))}
				</View>
			</View>
		</Animatable.View>
	);
}

const _renderHeader = (requestDetail, index, isActive) => (
	<CollapsibleHeader isActive={isActive} requestDetail={requestDetail} />
);

const _renderContent = (buttons = [], requestDetail, index, isActive) => (
	<CollapsibleContentView
		requestDetail={requestDetail}
		isActive={isActive}
		buttons={buttons}
		index={index}
	/>
);

export default function CollapsibleRequestsList({
	requestsList,
	buttons,
	refreshControl,
}) {
	const [activeSections, setActiveSections] = useState([]);
	return (
		<View style={{ flex: 1 }}>
			<ScrollView refreshControl={refreshControl}>
				<Accordion
					sections={requestsList}
					activeSections={activeSections}
					renderHeader={_renderHeader}
					renderContent={_renderContent.bind(null, buttons)}
					onChange={setActiveSections}
					containerStyle={{
						flex: 1,
						alignItems: "center",
						padding: 10,
					}}
					sectionContainerStyle={{
						width: "60%",
						alignItems: "center",
						backgroundColor: "black",
					}}
				/>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	itemStyle: {
		flex: 1,
		justifyContent: "center",
		alignContent: "flex-start",
		alignItems: "center",
		fontSize: 15,
		padding: 4,
	},
	imageStyle: {
		width: 80,
		height: 80,
		marginLeft: 30,
		borderRadius: 10,
		borderWidth: 1,
	},
});
