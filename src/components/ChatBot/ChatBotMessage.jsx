import { useContext, useState } from "react";
import chatBotAvatar from '../../assets/chatbot-avatar.png';
import AppContext from "../../context/AppContext";

const ChatBotMessage = ({ message }) => {

  const { userData } = useContext(AppContext);
  const [sender, setSender] = useState(message.sender === userData.handle ? userData.handle : 'vBuddy');
  const [ariaLabel, setAriaLabel] = useState(`chat bubble from ${sender} that reads ${message.message}`);

  return (
    <>
      <div className={message.sender !== userData.handle ? "chat chat-start" : "chat chat-end"} aria-label={ariaLabel}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img alt="Tailwind CSS chat bubble component" src={message.sender === userData.handle ? userData.photoURL : chatBotAvatar} className="cursor-pointer w-10 h-10 rounded-3xl mr-3" />
          </div>
        </div>
        <div className="chat-header flex items-center mb-1">
          <span className='font-bold text-[13pt] text-red-300 cursor-pointer hover:underline'>{sender}</span>
        </div>
        <div className="chat-bubble">{message.message}</div>
      </div>
    </>
  );
};

export default ChatBotMessage;
