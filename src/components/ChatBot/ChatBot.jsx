import { useContext, useEffect, useState } from "react"
import ChatBotMessage from "./ChatBotMessage";
import AppContext from "../../context/AppContext";
import { OPENAI_API_KEY } from "../../common/constants";
import Typing from "./Typing";


const ChatBot = () => {


    

    const {userData} = useContext(AppContext)
    const[typing, setTyping] = useState(false);
    const[msg, setMsg] = useState('')
    const[messages, setMessages] =useState([
        {
            message: 'Hello, I am your Virtual Buddy',
            sender: "chatGPT"
        }
    ])


    const getBotResponse = (apiRequestBody, chatMessages) => {

     fetch("https://api.openai.com/v1/chat/completions",{
            method: "POST",
            headers: {
                "Authorization": "Bearer " + OPENAI_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        }).then((data)=> data.json())
            .then((data)=> {
                
            console.log(data.choices[0].message.content)
            setMessages(
                [...chatMessages, {
                message: data.choices[0].message.content,
                sender:'ChatGPT'
                }]
            )
            setTyping(false);
        
        })
            .catch(e=>console.log(e));

    }
    

    const getChatBotMessage = (chatMessages) => {

        let apiMessages = chatMessages.map((messageObject)=>{
            let role = '';
    
            if(messageObject.sender==='ChatGPT'){
                role="assistant"
            } else{
                role = `user`
            }
    
            return {
                role: role,
                content: messageObject.message
    
            }
    
        })
    
        const systemMessage = {
            role: "system",
            content: "Speak like Saitama from One-Punch man"       // set a prompt on how chatGPT can response - e.g. -"Speak like a pirate"
        }
    
        const apiRequestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                systemMessage,
                ...apiMessages
            ]
    
        }

        getBotResponse(apiRequestBody, chatMessages)
    
        // await fetch("https://api.openai.com/v1/chat/completions",{
        //     method: "POST",
        //     headers: {
        //         "Authorization": "Bearer " + OPENAI_API_KEY,
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(apiRequestBody)
        // }).then((data)=> data.json())
        //     .then((data)=> {
                
        //     console.log(data.choices[0].message.content)
        //     setMessages(
        //         [...chatMessages, {
        //         message: data.choices[0].message.content,
        //         sender:'ChatGPT'
        //         }]
        //     )
        //     setTyping(false);
        
        // })
        //     .catch(e=>console.log(e));
    
       }

    useEffect(() => {
        if(typing){

            getChatBotMessage(messages)
        
        }

    }, [typing])   

    const handleSend = async(e) => {
        e.preventDefault();

        const newMessage = {
            message: msg,
            sender: userData.handle,
        }
        const newMessages = [...messages, newMessage];

        setMessages(newMessages);
        setMsg('');
        setTyping(true);

    }

   


    return (
        <>
        <div className=" flex flex-col bg-gray-700 h ">
        <div
				className="px-6 py-4 overflow-y-scroll custom-scrollbar"
				id="chat"
			></div>
               <div>
                {messages.map((message, i)=>{

                 return (<ChatBotMessage key={i} message={message} />)

                })}
                
                </div> 
                <div className="ml-2 mb-1">{typing && <Typing />}</div>
                <div className='flex items-center bg-gray-800 rounded-md ml-4 mb-4' style={{ width: "95%", outline: 'none' }}>
					<div className='flex-grow'>
						<form
							style={{
								backgroundColor: "gray 900",
								color: "white",
								border: "none",
								padding: "2px 20px",
							}}
							onSubmit={handleSend}
						>
							<input
								className="bg-gray-800 border-none rounded"
								style={{ padding: "10px 20px", width: "100%", outline: 'none' }}
								type="text"
								value={msg}
								placeholder={`Type something...`}
								onChange={(e) => setMsg(e.target.value)}
							/>

							{/* <button type='submit' className='ml-50'>Send</button> */}

				
						</form>

					</div>
				
				</div>
                </div>
        </>

    )




}

export default ChatBot;