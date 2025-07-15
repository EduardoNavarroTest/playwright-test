import { useEffect, useRef, useState } from "react";
import ChatbotIcon from "./ChatbotIcon.jsx";
import ChatForm from "./ChatForm.jsx";
import ChatMessage from "./ChatMessage.jsx";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { getUserLogged } from "../services/whoamiService.js";
import { getAIResponseChat } from "../services/aiService.js";
import SupportAgentIcon from '../assets/chatbot.png';

const ChatBot = () => {
    const chatBodyRef = useRef();
    const [showChatbot, setShowChatbot] = useState(false);
    const [user, setUser] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);

    useEffect(() => {
        getUserLogged()
            .then(data => setUser(data.name))
            .catch(err => console.error("Error obteniendo usuario:", err));
    }, []);

    const generateBotResponse = async (history) => {
        const updateHistory = (text, isError = false) => {
            setChatHistory(prev =>
                [...prev.filter(msg => msg.text !== "Pensando..."), { role: "model", text, isError }]
            );
        };

        const formattedHistory = history.map(({ role, text }) => ({ role, text }));

        try {
            const apiResponseText = await getAIResponseChat(formattedHistory);
            console.log("Texto IA recibido:", apiResponseText);
            updateHistory(apiResponseText);
        } catch (error) {
            updateHistory(error.message, true);
        }
    };

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleClearConversation = () => {
        setChatHistory([]);
    };

    return (
        <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
            <button onClick={() => setShowChatbot(prev => !prev)} id="chatbot-toggler">
                {showChatbot ? <CloseIcon /> : <img src={SupportAgentIcon} alt="Abrir chatbot" style={{ width: 32, height: 32 }} />}
            </button>

            <div className="chatbot-popup">
                {/* Chatbot Header */}
                <div className="chat-header">
                    <div className="header-info">
                        <ChatbotIcon />
                        <h2 className="logo-text">Chatbot</h2>
                    </div>
                    <div className="header-buttons">
                        <button className="icon-button" title="Limpiar conversación" onClick={handleClearConversation}>
                            <DeleteOutlineIcon />
                        </button>
                        <button className="icon-button" title="Minimizar" onClick={() => setShowChatbot(prev => !prev)}>
                            <KeyboardArrowDownIcon />
                        </button>
                    </div>
                </div>

                {/* Chatbot Body */}
                <div ref={chatBodyRef} className="chat-body">
                    <div className="message bot-message">
                        <ChatbotIcon />
                        <p className="message-text">
                            ¡Hola {user || "Eduardo"}!<br />
                            Bienvenido al asistente virtual.<br />
                            ¿En qué puedo ayudarte?
                        </p>
                    </div>

                    {/* Render chat messages */}
                    {chatHistory.map((chat, index) => (
                        <ChatMessage key={index} chat={chat} />
                    ))}
                </div>

                {/* Chatbot Footer */}
                <div className="chat-footer">
                    <ChatForm
                        chatHistory={chatHistory}
                        setChatHistory={setChatHistory}
                        generateBotResponse={generateBotResponse}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
