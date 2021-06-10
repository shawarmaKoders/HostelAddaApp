import React, { useState } from "react";
import { View } from "react-native";
import Text from "../UI/CustomText";
import TextInput from "../UI/CustomTextInput";
import Button from "../UI/ModalButton";
import axios from "../../customAxios";
import appSettings from "../../constants/appSettings";
import LoadingScreen from "../UI/LoadingScreen";
const { backendDomain } = appSettings;

const checkValidityAndFetchProductData = async (platform_id, product_link) => {
	const url = `${backendDomain}/products/get-product-data?link=${product_link}&platform_id=${platform_id}`;
	const response = await axios.get(url);
	return response.data;
};

const AddProductLink = ({ platformDetail, setProductData }) => {
	const [loading, setLoading] = useState(false);
	const [invalidLink, setInvalidLink] = useState(false);
	const [reqErr, setReqErr] = useState(false);
	const [productLink, setProductLink] = useState("");

	const onCheckValidity = () => {
		setLoading(true);
		checkValidityAndFetchProductData(platformDetail._id, productLink)
			.then((fetchedProductData) => {
				setLoading(false);

				if (fetchedProductData) setProductData(fetchedProductData);
				else setInvalidLink(true);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
				setReqErr(true);
			});
	};

	const linkChangeHandler = (linkText) => {
		setProductLink(linkText);
		setInvalidLink(false);
		setReqErr(false);
	};

	return (
		<View style={{ minWidth: "80%", maxWidth: "80%", minHeight: "10%" }}>
			{loading ? (
				<LoadingScreen />
			) : (
				<>
					<Text>Paste Product Link here:</Text>
					<View style={{ marginVertical: 5 }}>
						<TextInput
							value={productLink}
							onChangeText={linkChangeHandler}
							placeholder={platformDetail.link}
						/>
					</View>
					{reqErr && (
						<Text>
							An error occurred during validity check. Please try
							again.
						</Text>
					)}
					<Button text="Check Validity" onPress={onCheckValidity} />
				</>
			)}
		</View>
	);
};

export default AddProductLink;
