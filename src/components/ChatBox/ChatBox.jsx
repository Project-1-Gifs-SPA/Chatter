import React, { useState, useRef, useEffect, useContext } from 'react'
import Message from '../Message/Message'
import ChatTopBar from '../ChatTopBar/ChatTopBar'
import bg from '../../assets/background.png'
import { set } from 'firebase/database'
import { getChatTest, getLiveMessages, getLiveMessagesTest, sendMessageTest } from '../../services/chat.service'
import { useParams } from 'react-router'
import AppContext from '../../context/AppContext'

const ChatBox = () => {

	// const messagesEndRef = useRef();
	const{teamId} = useParams();
	const{user, userData} = useContext(AppContext);

	// const scrollToBottom = () => {
	// 	messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
	// }


	const[msg, setMsg] = useState('');
	const[messages, setMessages] = useState([])


	const container = useRef(null)

	const Scroll = () => {
	  const { offsetHeight, scrollHeight, scrollTop } = container.current;
	  if (scrollHeight <= scrollTop + offsetHeight + 100) {
		container.current?.scrollTo(0, scrollHeight)
	  }
	}
  
	useEffect(() => {
	  Scroll()
	}, [messages])

	


	// useEffect(()=> scrollToBottom, [messages]);


	useEffect(()=> {
		console.log('live msg')
		getChatTest(teamId)
		.then(chatArr=> setMessages(chatArr))

	},[teamId])

	useEffect(()=> {
		console.log('live msg')

		const unsubscribe = getLiveMessagesTest((snapshot=>{

			setMessages(Object.values(snapshot.val()));
		
		}),teamId)

		return () => unsubscribe;

	},[teamId])




	const handleMsg =(e) =>{
		e.preventDefault();

		sendMessageTest(teamId, userData.handle, msg, userData.photoURL )
		.then(()=> setMsg(''));
	
		
	}

	return (
		<div className="flex-1 flex flex-col bg-gray-700 overflow-hidden"
		>
			{/* Top bar */}
			<ChatTopBar />
			{/* <!-- Chat messages --> */}
			<div ref={container} className="px-6 py-4 flex-1 overflow-y-scroll">
				{/* <Message />
				<Message /> */}
				{messages.length ? messages.map(message=> <Message key={message.id} message={message} />) : null}
			</div>
			<form 
			style={{backgroundColor: "black", color: "white", fontWeight: "bold", border: "none", padding: "10px 20px"}} 
			onSubmit={handleMsg}>
				<input 
				style={{padding:"10px 20px", width:"100%"}}
				type="text" 
				value={msg}
				
				onChange={(e)=>setMsg(e.target.value)}
			
				/>
				{/* <button type='submit' className='ml-50'>Send</button> */}
				</form>
		</div>
	)
}

export default ChatBox