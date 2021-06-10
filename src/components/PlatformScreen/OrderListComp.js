import React from "react";
import { FlatList } from "react-native";
import OrderProductCard from "./OrderProductCard";

const renderOrderProduct = ({ item }) => (
	<OrderProductCard
		orderProduct={item}
		showImage={false}
		style={{ backgroundColor: "#222" }}
	/>
);

const OrderListComp = ({ orderList }) => {
	return (
		<FlatList
			style={{ flex: 1 }}
			contentContainerStyle={{ width: "100%", borderRadius: 5 }}
			data={Object.values(orderList)}
			keyExtractor={(item) => item.product._id}
			renderItem={renderOrderProduct}
		/>
	);
};

export default OrderListComp;
