import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import AppContext from '../../context/AppContext';

const LandingPage = () => {
	const { user } = useContext(AppContext);
	const navigate = useNavigate();

	useEffect(() => {
		user ? navigate('/') : null;
	}, [user, navigate]);

	return (
		<div className="hero min-h-screen bg-gray-900">
			<div className="hero-content text-center">
				<div className="max-w-md">
					<h1 className="text-5xl font-bold text-purple-400" style={{ fontFamily: 'Rockwell, sans-serif' }}>Welcome to Chatter!</h1>
					<p className="py-6 text-gray-200">Join the conversation, meet new people, and build connections in a single spot!</p>
					<Link to='/sign-in'>
						<button style={{ fontFamily: 'Rockwell, sans-serif' }} className="btn btn-primary mr-5">Sign in</button>
					</Link>
					<Link to='/sign-up'>
						<button className=" btn btn-primary" style={{ fontFamily: 'Rockwell, sans-serif' }}>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default LandingPage