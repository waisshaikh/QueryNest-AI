import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: {},
    currentChatId: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    createNewChat: (state, action) => {
      const { chatId, title } = action.payload;
      if (chatId && !state.chats[chatId]) {
        state.chats[chatId] = {
          id: chatId,
          title: title || "New Chat",
          messages: [],
          lastUpdated: new Date().toISOString(),
        };
      }
    },
    addNewMessage: (state, action) => {
      const { chatId, content, role, id, createdAt } = action.payload;
      if (chatId) {
        if (!state.chats[chatId]) {
          state.chats[chatId] = {
            id: chatId,
            title: "New Chat",
            messages: [],
            lastUpdated: new Date().toISOString(),
          };
        }
        // Avoid duplicate message push if already exists
        const exists = state.chats[chatId].messages.some(
          (m) => (id && m.id === id) || (m.content === content && m.role === role && Math.abs(new Date(m.createdAt) - new Date(createdAt || Date.now())) < 2000)
        );
        if (!exists) {
          state.chats[chatId].messages.push({
            id: id || `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            content,
            role,
            createdAt: createdAt || new Date().toISOString(),
          });
        }
        state.chats[chatId].lastUpdated = new Date().toISOString();
      }
    },
    addMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      if (chatId && state.chats[chatId]) {
        state.chats[chatId].messages = messages || [];
      }
    },
    removeChat: (state, action) => {
      const chatId = action.payload;
      delete state.chats[chatId];
      if (state.currentChatId === chatId) {
        state.currentChatId = null;
      }
    },
  },
});

export const {
  setChats,
  setCurrentChatId,
  setLoading,
  setError,
  createNewChat,
  addNewMessage,
  addMessages,
  removeChat,
} = chatSlice.actions;

export default chatSlice.reducer;

