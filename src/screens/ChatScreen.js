import React, { useEffect, useState, useCallback } from "react";
import { View } from "react-native";
import Text from "../components/UI/CustomText";
import axios from "../customAxios";
import LoadingScreen from "../components/UI/LoadingScreen";
import ErrorScreen from "../components/UI/ErrorScreen";
import appSettings from "../constants/appSettings";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

const { backendDomain, messengerDomain, messengerDomainWebsocket } =
	appSettings;

const fetchRoomData = async (chat_room_id) => {
	const url = `${messengerDomain}/chat-room/${chat_room_id}`;
	const response = await axios.get(url);
	return response.data;
};

const fetchUsersData = async (participants) => {
	const url = `${backendDomain}/users/chat-participants`;
	const response = await axios.post(url, participants);
	return response.data;
};

const createWebSocket = ({ user_id, chat_room_id }) => {
	const socket = new WebSocket(
		`${messengerDomainWebsocket}/chat-room/${chat_room_id}/chat?user_id=${user_id}`
	);
	return socket;
};
const renderBubble = (props) => {
	const username = props.currentMessage.user.name;
	const color = getColor(username);
	return (
		<Bubble
			{...props}
			textStyle={{
				right: {
					color: "white",
				},
				left: {
					color: "white",
				},
			}}
			wrapperStyle={{
				left: {
					backgroundColor: color,
				},
			}}
		/>
	);
};

function getColor(username) {
	let sumChars = 0;
	for (let i = 0; i < username.length; i++) {
		sumChars += username.charCodeAt(i);
	}

	const colors = [
		"#2ecc71", // emerald
		"#3498db", // peter river
		"#8e44ad", // wisteria
		"#e74c3c", // alizarin
		"#1abc9c", // turquoise
		"#2c3e50", // midnight blue
		"#e67e22", // carrot
	];
	return colors[sumChars % colors.length];
}

const ChatScreen = ({ navigation, route }) => {
	const { chat_room_id } = route.params;
	const [loading, setLoading] = useState(true);
	const [reqErr, setReqErr] = useState(false);
	const [currentUserData, setCurrentUserData] = useState(null);

	const [participants, setParticipants] = useState([]);
	const [messages, setMessages] = useState([]);
	const [socket, setSocket] = useState(null);

	const checkNewMessage = useCallback(
		(event) => {
			const messageData = JSON.parse(event.data);

			if (Array.isArray(messageData)) {
				for (let i = 0; i < messageData.length; i++) {
					messageData[i].user = participants.find(
						(obj) => obj._id.toString() == messageData[i].user
					);
					messageData[i].createdAt = new Date(
						messageData[i].time * 1000
					);
				}
				messageData.reverse();
				setMessages(messageData);
			} else if (messageData.user !== currentUserData._id) {
				messageData.user = participants.find(
					(obj) => obj._id.toString() == messageData.user
				);

				setMessages((currentMessages) => [
					...currentMessages,
					messageData,
				]);
			}
		},
		[setMessages, participants]
	);
	useEffect(() => {
		fetchRoomData(chat_room_id)
			.then(async (roomData) => {
				if (!roomData.participants.includes(roomData.admin)) {
					roomData.participants.push(roomData.admin);
				}
				let users_data = await fetchUsersData({
					participants: roomData.participants,
				});
				setCurrentUserData(users_data.current_user_data);
				setParticipants(users_data.participant_data);

				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
				setReqErr(true);
			});
	}, [setCurrentUserData, setParticipants, setLoading]);

	useEffect(() => {
		let newSocket = null;
		if (participants.length > 0) {
			newSocket = createWebSocket({
				user_id: currentUserData._id,
				chat_room_id,
			});
			newSocket.onmessage = checkNewMessage;
			setSocket(newSocket);
		}
		return () => {
			if (newSocket) {
				newSocket.close();
			}
		};
	}, [checkNewMessage, participants, setSocket]);

	const onSend = useCallback(
		(messages = []) => {
			socket.send(
				JSON.stringify({ text: messages[0].text, time: Date.now() })
			);
			setMessages((previousMessages) =>
				GiftedChat.append(previousMessages, messages)
			);
		},
		[socket]
	);

	return loading ? (
		<LoadingScreen />
	) : reqErr ? (
		<ErrorScreen msg="There seems to be an error!" />
	) : (
		<GiftedChat
			alwaysShowSend
			scrollToBottom
			renderBubble={renderBubble}
			messages={messages}
			onSend={(messages) => onSend(messages)}
			user={currentUserData}
		/>
	);
};

export default ChatScreen;
