import { useRef } from "react";
import SendIcon from "@mui/icons-material/Send";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";

    setChatHistory((history) => [...history, { role: "user", text: userMessage }]);

    setTimeout(() => {
      setChatHistory((history) => [...history, { role: "model", text: "Pensando..." }]);

      generateBotResponse([...chatHistory, { role: "user", text: userMessage }]);
    }, 1000);
  };

  return (
    <form onSubmit={handleFormSubmit} className="chat-form">
      <input ref={inputRef} placeholder="Escribe tu solicitud" className="message-input" required />
      <button type="submit" id="send-message" className="icon-button">
        <SendIcon />
      </button>
    </form>
  );
};

export default ChatForm;
