import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import AppContext from '../../context/AppContext';
import './LandingPage.css'

const LandingPage = () => {
	const { user } = useContext(AppContext);
	const navigate = useNavigate();

	useEffect(() => {
		user ? navigate('/') : null;
	}, [user, navigate]);

	return (

		<div className="hero">
			<div className="hero-content text-center bg-gray-700 w-[550px] h-[450px] rounded-3xl">
				< div className="max-w-md" >
					<h1 className="text-5xl font-bold text-purple-400" style={{ fontFamily: 'Rockwell, sans-serif' }}>Welcome to Chatter!</h1>
					<p className="py-6 text-gray-200">Join the conversation, meet new people, and build connections in a single spot!</p>
					<Link to='/sign-in'>
						<button style={{ fontFamily: 'Rockwell, sans-serif' }} className="btn bg-purple-400 border-none hover:bg-purple-600 mr-5">Sign in</button>
					</Link>
					<Link to='/sign-up'>
						<button className="btn bg-purple-400 border-none hover:bg-purple-600" style={{ fontFamily: 'Rockwell, sans-serif' }}>Sign up</button>
					</Link>
				</div >
			</div >
		</div >
	)
}

export default LandingPage

//min-h-screen bg-gray-900" style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }} 