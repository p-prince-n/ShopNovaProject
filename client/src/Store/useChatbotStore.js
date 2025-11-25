import { create } from "zustand";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
axios.defaults.withCredentials = true;
const LOCAL_STORAGE_KEY = "chatbot_messages";
const MESSAGE_EXPIRY_HOURS = 24;


const loadMessages = () => {
  const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
  const now = Date.now();
  return stored.filter(
    (msg) => !msg.timestamp || now - msg.timestamp < MESSAGE_EXPIRY_HOURS * 60 * 60 * 1000
  );
};

export const useChatbotStore = create((set, get) => ({
  messages: loadMessages(),
  input: "",
  loading: false,
  error: null,

  setInput: (value) => set({ input: value }),

  addMessage: (message) => {
    set((state) => {
      const newMessage = { ...message, timestamp: Date.now() };
      const newMessages = [...state.messages, newMessage];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newMessages));
      return { messages: newMessages };
    });
  },

  clearMessages: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    set({ messages: [] });
  },

  sendMessage: async () => {
    const input = get().input.trim();
    if (!input) return;


    get().addMessage({ sender: "user", text: input });
    set({ input: "", loading: true, error: null });

    try {

      const { data } = await axios.post(`${BASE_URL}/chatbot/query`, { message: input });
      get().addMessage({ sender: "bot", ...data });
    } catch (err) {
      console.error(err);
      set({ error: "Something went wrong" });
      get().addMessage({ sender: "bot", text: "Something went wrong." });
    } finally {
      set({ loading: false });
    }
  },
}));
