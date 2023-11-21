import React from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

const LandingPage = () => {

	return (
		<div className="hero min-h-screen bg-gray-900">
			<div className="hero-content text-center">
				<div className="max-w-md">
					<h1 className="text-5xl font-bold text-purple-400">Hello there!</h1>
					<p className="py-6 text-gray-200">Join the conversation, meet new people, and build connections in a single spot!</p>
					<Link to='/sign-in'>
						<button className="btn btn-primary mr-5">Sign in</button>
					</Link>
					<Link to='/sign-up'>
						<button className="btn btn-primary">Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default LandingPage