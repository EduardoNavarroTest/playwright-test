import chatbotImg from '../assets/ai.webp'; // ajusta la ruta según tu estructura

const ChatbotIcon = () => {
  return (
    <img
      src={chatbotImg}
      alt="Chatbot Icon"
      style={{
        width: 35,
        height: 35,
        cursor: "pointer",
        transition: "transform 0.3s ease",
        borderRadius: "50%", 
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1.0)")}
    />
  );
};

export default ChatbotIcon;
