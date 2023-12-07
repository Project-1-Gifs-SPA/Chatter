import { useContext } from "react";
import AppContext from "../../context/AppContext";


const ChatBotMessage = ({message}) => {

const{userData} = useContext(AppContext);

return(
    <>
    <div className={message.sender!== userData.handle ? "chat chat-start": "chat chat-end"}>
  <div className="chat-bubble">{message.message}</div>
</div>

</>
)
}

export default ChatBotMessage;