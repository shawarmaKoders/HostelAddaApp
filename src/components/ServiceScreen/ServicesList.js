import React, { useState } from "react";
import { View, ScrollView, Image, StyleSheet } from "react-native";
import Text from "../UI/CustomText";
import Button from "../UI/ModalButton";
import { useTheme } from "@react-navigation/native";
import Accordion from "react-native-collapsible/Accordion";
import * as Animatable from "react-native-animatable";

function CollapsibleHeader({ isActive, serviceName, serviceImage }) {
	const { colors } = useTheme();
	return (
		<Animatable.View
			duration={300}
			transition="backgroundColor"
			style={{
				padding: 15,
				backgroundColor: isActive ? colors.border : colors.card,
				marginBottom: isActive ? 0 : 10,
				minWidth: 330,
				maxWidth: 700,
				borderRadius: 10,
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
					source={{ uri: serviceImage }}
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
							justifyContent: "center",
							textAlign: "center",
							fontWeight: "bold",
							fontSize: 20,
						}}
					>
						{serviceName}
					</Text>
				</View>
			</View>
		</Animatable.View>
	);
}

function CollapsibleContentView({
	isActive,
	serviceDetail,
	onServiceRequest = () => {},
	onServiceDeliver = () => {},
	onServiceDetail = () => {},
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
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					margin: 1,
				}}
			>
				<Button
					style={styles.buttonStyle}
					text="View Details"
					onPress={() => onServiceDetail({ serviceDetail })}
				/>
				<Button
					style={styles.buttonStyle}
					text="Deliver"
					onPress={() => onServiceDeliver({ serviceDetail })}
				/>

				<Button
					style={styles.buttonStyle}
					text="Request"
					onPress={() => onServiceRequest({ serviceDetail })}
				/>
			</View>
		</Animatable.View>
	);
}

const _renderHeader = (serviceDetail, index, isActive) => (
	<CollapsibleHeader
		isActive={isActive}
		serviceName={serviceDetail.name}
		serviceImage={serviceDetail.image}
	/>
);

const _renderContent = (
	onServiceRequest = null,
	onServiceDeliver = null,
	onServiceDetail = null,
	serviceDetail,
	index,
	isActive
) => (
	<CollapsibleContentView
		serviceDetail={serviceDetail}
		isActive={isActive}
		onServiceDetail={onServiceDetail}
		onServiceRequest={onServiceRequest}
		onServiceDeliver={onServiceDeliver}
	/>
);

export default function ServicesList({
	serviceDetailList,
	onServiceRequest = null,
	onServiceDeliver = null,
	onServiceDetail = null,
	refreshControl,
}) {
	const [activeSections, setActiveSections] = useState([]);
	return (
		<View style={{ flex: 1 }}>
			<ScrollView refreshControl={refreshControl}>
				<Accordion
					sections={serviceDetailList}
					activeSections={activeSections}
					renderHeader={_renderHeader}
					renderContent={_renderContent.bind(
						null,
						onServiceRequest,
						onServiceDeliver,
						onServiceDetail
					)}
					onChange={setActiveSections}
					containerStyle={{
						flex: 1,
						alignItems: "center",
						padding: 10,
					}}
					sectionContainerStyle={{
						width: "100%",
						alignItems: "center",
						backgroundColor: "black",
					}}
				/>
			</ScrollView>
		</View>
	);
}
const styles = StyleSheet.create({
	buttonStyle: {
		padding: 10,
		margin: 3,
	},
	imageStyle: {
		width: 80,
		height: 80,
		marginLeft: 30,
		borderRadius: 10,
		borderWidth: 1,
	},
});
