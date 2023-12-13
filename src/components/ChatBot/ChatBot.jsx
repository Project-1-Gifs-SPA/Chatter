import { useContext, useEffect, useRef, useState } from "react";
import { OPENAI_API_KEY } from "../../common/constants";
import AppContext from "../../context/AppContext";
import ChatBotMessage from "./ChatBotMessage";
import Typing from "./Typing";

const ChatBot = () => {

  const { userData } = useContext(AppContext);

  const [typing, setTyping] = useState(false);

  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([
    {
      message: 'Hello, I am your Virtual Buddy',
      sender: "chatGPT"
    }
  ]);

  const container = useRef(null);

  const scrollToBottom = () => {
    const chat = document.getElementById("chat");
    chat.scrollTop = chat?.scrollHeight;
  };

  const getBotResponse = (apiRequestBody, chatMessages) => {
    fetch("https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + OPENAI_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      }
    )
      .then((data) => data.json())
      .then((data) => {

        setMessages(
          [...chatMessages, {
            message: data.choices[0].message.content,
            sender: 'ChatGPT'
          }]
        );

        setTyping(false);
      })
      .then(() => scrollToBottom())
      .catch((e) => console.error(e));
  };

  const getChatBotMessage = (chatMessages) => {

    scrollToBottom();

    let apiMessages = chatMessages.map((messageObject) => {
      let role = '';

      if (messageObject.sender === 'ChatGPT') {
        role = "assistant";
      } else {
        role = `user`;
      }

      return {
        role: role,
        content: messageObject.message
      };
    });

    const systemMessage = {
      role: "system",
      content: "Speak like Saitama from One-Punch man"
    };

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    };

    getBotResponse(apiRequestBody, chatMessages);
  }

  useEffect(() => {
    if (typing) {
      getChatBotMessage(messages);
      scrollToBottom();
    }
  }, [typing]);

  const handleSend = async (e) => {
    e.preventDefault();

    const newMessage = {
      message: msg,
      sender: userData.handle,
    };
    const newMessages = [...messages, newMessage];

    setMessages(newMessages);
    setMsg('');
    setTyping(true);
  };

  return (
    <div className=" flex flex-1 flex-col items-start bg-gray-700 h-[93vh] w-[100%]">
      <div ref={container} className="flex-1 px-6 mb-[25px] h-[90vh] w-[100%] overflow-y-scroll custom-scrollbar" id='chat'>
        {messages.map((message, i) => {
          return (<ChatBotMessage key={i} message={message} />)
        })}
      </div>
      <div className="ml-2 mb-1 mr-1">{typing && <Typing />}</div>

      <form
        style={{
          backgroundColor: "gray 900",
          color: "white",
          border: "none",
          padding: "2px 20px",
          width: '95%',
          height: '70px'
        }}
        onSubmit={handleSend}
      >
        <input
          className="bg-gray-800 border-none rounded"
          style={{ padding: "15px 30px", width: "100%", outline: 'none' }}
          type="text"
          value={msg}
          placeholder={`Type something...`}
          onChange={(e) => setMsg(e.target.value)}
        />
      </form>

    </div>
  );
};

export default ChatBot;
