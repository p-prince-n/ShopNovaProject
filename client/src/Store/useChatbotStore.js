import { create } from "zustand";
import axios from "axios";

const LOCAL_STORAGE_KEY = "chatbot_messages"; // same key for all users
const MESSAGE_EXPIRY_HOURS = 24; // messages older than this will be cleared
axios.defaults.withCredentials = true;
// Load messages from localStorage if not expired
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

    // Add user message
    get().addMessage({ sender: "user", text: input });
    set({ input: "", loading: true, error: null });

    try {
      // Replace with your chatbot API
      const { data } = await axios.post("https://shopnovaproject.onrender.com/chatbot/query", { message: input });
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
