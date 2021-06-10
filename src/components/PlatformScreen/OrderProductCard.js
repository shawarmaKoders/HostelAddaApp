import React from "react";
import { StyleSheet, View, Image } from "react-native";
import Text from "../UI/CustomText";
import TouchableCard from "../UI/TouchableCard";
import * as Linking from "expo-linking";

const OrderProductCard = ({
	onPress = () => {},
	orderProduct,
	showImage = true,
	style,
}) => {
	const { product, orders } = orderProduct;
	return (
		<TouchableCard
			style={{ height: 120, marginVertical: 10, ...style }}
			onPress={() => Linking.openURL(product.link)}
		>
			<View style={{ flex: 1, flexDirection: "row" }}>
				{showImage && (
					<Image
						source={{ uri: product.image }}
						style={{
							height: "100%",
							width: 120,
							resizeMode: "contain",
						}}
					/>
				)}
				<View style={{ flex: 1, padding: 10 }}>
					<Text
						numberOfLines={2}
						style={{ fontWeight: "bold", fontSize: 16 }}
					>
						{orderProduct.product.name}
					</Text>
					<View style={{ paddingVertical: 2.5 }}>
						<Text>Units Ordered:</Text>
						{Object.entries(orders).map(
							([unit_ordered, { price, quantity }]) => {
								if (quantity == 0) return null;
								return (
									<Text key={unit_ordered}>
										{unit_ordered}: {quantity}
									</Text>
								);
							}
						)}
					</View>
				</View>
			</View>
		</TouchableCard>
	);
};

export default OrderProductCard;

const styles = StyleSheet.create({
	cardStyle: {
		flex: 1,
		padding: 10,
		flexDirection: "row",
	},
});
