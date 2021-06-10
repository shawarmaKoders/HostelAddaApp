import axios from "axios";
import store from "./store/store";

const dataFn = (method) => {
	const f = async (url, data, authorize = true, extraHeaders = null) => {
		let response = null;
		if (authorize) {
			const { token } = store.getState().auth;
			let headers = { Authorization: `Bearer ${token}` };
			if (extraHeaders) headers = { ...headers, ...extraHeaders };
			response = await method(url, data, { headers });
		} else {
			response = await method(url, data);
		}
		return response;
	};
	return f;
};

const fn = (method) => {
	const f = async (url, authorize = true, extraHeaders = null) => {
		let response = null;
		if (authorize) {
			const { token } = store.getState().auth;
			let headers = { Authorization: `Bearer ${token}` };
			if (extraHeaders) headers = { ...headers, ...extraHeaders };
			response = await method(url, { headers });
		} else {
			response = await method(url);
		}
		return response;
	};
	return f;
};

const get = fn(axios.get);
const head = fn(axios.head);
const patch = dataFn(axios.patch);
const post = dataFn(axios.post);

export default { get, head, patch, post, delete: fn(axios.delete) };
