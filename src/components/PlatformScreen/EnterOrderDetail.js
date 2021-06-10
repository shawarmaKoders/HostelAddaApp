import React, { useState } from "react";
import { View, Image } from "react-native";
import Text from "../UI/CustomText";
import TextInput from "../UI/CustomTextInput";
import CheckBox from "@react-native-community/checkbox";
import RNPickerSelect from "react-native-picker-select";
import Button from "../UI/ModalButton";
import { useTheme } from "@react-navigation/native";

const EnterOrderDetail = ({ productData, onSubmitOrderDetail }) => {
	const { name: productName, image: imageLink, price_quantity } = productData;
	const unit_price_array = price_quantity.map((pq) => ({
		label: `${pq.unit_quantity} - ₹${pq.price}`,
		value: pq,
	}));
	const [quantity, setQuantity] = useState("0");
	const [unit, setUnit] = useState(unit_price_array[0].value);
	const [inPrivateList, setInPrivateList] = useState(false);
	const { colors } = useTheme();

	const onSubmit = () => {
		onSubmitOrderDetail({
			quantity: parseInt(quantity),
			unit,
			inPrivateList,
		});
	};

	return (
		<View style={{ minWidth: "80%", maxWidth: "80%", minHeight: "10%" }}>
			<Image
				source={{ uri: imageLink }}
				resizeMode="contain"
				style={{ height: 100, borderRadius: 10 }}
			/>
			<Text style={{ textAlign: "center", fontWeight: "bold" }}>
				{productName}
			</Text>
			<View style={{ alignItems: "center" }}>
				<View style={{ width: 200 }}>
					<RNPickerSelect
						onValueChange={setUnit}
						items={unit_price_array}
						placeholder={{
							label: "Select unit of Product",
							value: null,
						}}
						style={{
							inputAndroid: {
								color: colors.text,
								alignItems: "center",
								justifyContent: "center",
								textAlign: "center",
								width: 200,
							},
						}}
					/>
				</View>
			</View>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Text>Quantity: </Text>
				<TextInput
					maxLength={3}
					keyboardType="number-pad"
					placeholder="0"
					value={quantity}
					onChangeText={setQuantity}
					style={{ width: 100 }}
				/>
			</View>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<CheckBox
					value={inPrivateList}
					onValueChange={setInPrivateList}
					tintColors={{ true: colors.primary, false: colors.text }}
				/>
				<Text>Add to Private List</Text>
			</View>
			<Button text="Add to my Order" onPress={onSubmit} />
		</View>
	);
};

export default EnterOrderDetail;
