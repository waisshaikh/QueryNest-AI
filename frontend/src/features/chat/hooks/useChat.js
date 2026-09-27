import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api";
import {
  setChats,
  setCurrentChatId,
  setError,
  setLoading,
  createNewChat,
  addNewMessage,
  addMessages,
  removeChat,
} from "../chat.slice";
import { useDispatch, useSelector } from "react-redux";

export const useChat = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const isLoading = useSelector((state) => state.chat.isLoading);
  const error = useSelector((state) => state.chat.error);

  async function handleSendMessage({ message, chatId }) {
    const targetChatId = chatId || currentChatId;
    if (!message || !message.trim()) return;

    dispatch(setLoading(true));
    dispatch(setError(null));

    // If chat already exists, optimistically add user message to Redux
    if (targetChatId) {
      dispatch(
        addNewMessage({
          chatId: targetChatId,
          content: message,
          role: "user",
        })
      );
    }

    try {
      const data = await sendMessage({ message, chatId: targetChatId });
      const { tittle, chat, userMessage, aiMessage } = data;
      const activeChatId = targetChatId || chat?._id;

      // Handle newly created chat from backend
      if (!targetChatId && chat) {
        dispatch(
          createNewChat({
            chatId: chat._id,
            title: tittle || chat.tittle || chat.title || "New Chat",
          })
        );
        dispatch(
          addNewMessage({
            chatId: chat._id,
            content: message,
            role: "user",
            id: userMessage?._id,
            createdAt: userMessage?.createdAt,
          })
        );
      }

      // Add AI response message
      if (aiMessage && activeChatId) {
        dispatch(
          addNewMessage({
            chatId: activeChatId,
            content: aiMessage.content,
            role: aiMessage.role || "ai",
            id: aiMessage._id,
            createdAt: aiMessage.createdAt,
          })
        );
      }

      if (activeChatId) {
        dispatch(setCurrentChatId(activeChatId));
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      dispatch(setError(err.response?.data?.message || err.message || "Failed to send message"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetChats() {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await getChats();
      const { chats: chatList } = data;

      const chatMap = (chatList || []).reduce((acc, chat) => {
        acc[chat._id] = {
          id: chat._id,
          title: chat.tittle || chat.title || "New Chat",
          messages: [],
          lastUpdated: chat.updatedAt || chat.createdAt,
        };
        return acc;
      }, {});

      dispatch(setChats(chatMap));
    } catch (err) {
      console.error("Failed to fetch chats:", err);
      dispatch(setError(err.response?.data?.message || err.message || "Failed to fetch chats"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleOpenChat(chatId) {
    if (!chatId) return;

    dispatch(setCurrentChatId(chatId));

    const targetChat = chats[chatId];
    if (!targetChat || !targetChat.messages || targetChat.messages.length === 0) {
      dispatch(setLoading(true));
      try {
        const data = await getMessages(chatId);
        const { messages } = data;

        const formattedMessages = (messages || []).map((msg) => ({
          id: msg._id,
          content: msg.content,
          role: msg.role,
          createdAt: msg.createdAt,
        }));

        dispatch(
          addMessages({
            chatId,
            messages: formattedMessages,
          })
        );
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        dispatch(setError(err.response?.data?.message || err.message || "Failed to fetch messages"));
      } finally {
        dispatch(setLoading(false));
      }
    }
  }

  async function handleDeleteChat(chatId) {
    if (!chatId) return;
    try {
      await deleteChat(chatId);
      dispatch(removeChat(chatId));
    } catch (err) {
      console.error("Failed to delete chat:", err);
      dispatch(setError(err.response?.data?.message || err.message || "Failed to delete chat"));
    }
  }

  function handleNewChat() {
    dispatch(setCurrentChatId(null));
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
    handleDeleteChat,
    handleNewChat,
    chats,
    currentChatId,
    isLoading,
    error,
  };
};