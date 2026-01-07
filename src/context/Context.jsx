import { createContext, useState, useRef, useCallback, useEffect } from "react";
import { runChat } from "../config/gemini";
import { useUser } from "@clerk/clerk-react";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  /* ================= CLERK ================= */
  const { user, isLoaded, isSignedIn } = useUser();

  const userName =
    isLoaded && isSignedIn
      ? user?.fullName || user?.firstName || "User"
      : "Guest";

  const userId = isLoaded && isSignedIn ? user?.id : null;

  /* ================= STATE ================= */
  const [input, setInput] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [loading, setLoading] = useState(false);

  // chat
  const [chat, setChat] = useState([]);

  // typing
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingIntervalRef = useRef(null);

  /* ================= LOAD HISTORY ================= */
  useEffect(() => {
    if (!userId) return;

    const saved = localStorage.getItem(`history_${userId}`);
    if (saved) setPrevPrompts(JSON.parse(saved));
  }, [userId]);

  /* ================= SAVE HISTORY ================= */
  useEffect(() => {
    if (userId) {
      localStorage.setItem(
        `history_${userId}`,
        JSON.stringify(prevPrompts)
      );
    }
  }, [prevPrompts, userId]);

  /* ================= CLEAR TYPING ================= */
  const clearTyping = useCallback(() => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    setTypingText("");
    setIsTyping(false);
  }, []);

  /* ================= TYPING EFFECT ================= */
  const animateTyping = useCallback(
    (fullText) => {
      clearTyping();
      setIsTyping(true);

      let index = 0;
      typingIntervalRef.current = setInterval(() => {
        index++;
        setTypingText(fullText.slice(0, index));

        if (index >= fullText.length) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
          setIsTyping(false);
          setTypingText("");

          setChat((prev) => {
            if (prev.at(-1)?.role === "bot") return prev;
            return [...prev, { role: "bot", text: fullText }];
          });
        }
      }, 15);
    },
    [clearTyping]
  );

  /* ================= SEND MESSAGE ================= */
  const onSent = useCallback(
    async (customPrompt) => {
      if (!isLoaded || !isSignedIn || loading || isTyping) return;

      const prompt = (customPrompt ?? input).trim();
      if (!prompt) return;

      setInput("");
      setLoading(true);

      setPrevPrompts((prev) =>
        prev.includes(prompt) ? prev : [...prev, prompt]
      );

      setChat((prev) => [...prev, { role: "user", text: prompt }]);

      try {
        const response = await runChat(prompt);
        setLoading(false);

        if (!response?.trim()) {
          setChat((prev) => [
            ...prev,
            { role: "bot", text: "⚠️ No response received." },
          ]);
          return;
        }

        animateTyping(response);
      } catch (err) {
        console.error(err);
        setLoading(false);
        setChat((prev) => [
          ...prev,
          { role: "bot", text: "⚠️ Something went wrong." },
        ]);
      }
    },
    [input, loading, isTyping, isLoaded, isSignedIn, animateTyping]
  );

  /* ================= HISTORY CLICK ================= */
  const handleHistoryClick = useCallback(
    (prompt) => {
      if (!prompt || isTyping || loading) return;
      onSent(prompt);
    },
    [onSent, isTyping, loading]
  );

  /* ================= ENTER KEY ================= */
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSent(input);
      }
    },
    [input, onSent]
  );

  /* ================= NEW CHAT ================= */
  const newChat = useCallback(() => {
    clearTyping();
    setChat([]);
    setInput("");
    setLoading(false);
  }, [clearTyping]);

  /* ================= CLEANUP ================= */
  useEffect(() => {
    return () => clearTyping();
  }, [clearTyping]);

  /* ================= CONTEXT ================= */
  return (
    <Context.Provider
      value={{
        userName,
        userId,

        input,
        setInput,
        prevPrompts,
        chat,
        typingText,
        isTyping,
        loading,

        onSent,
        handleKeyPress,
        handleHistoryClick,
        newChat,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
