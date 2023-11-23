import React, { useState, useEffect } from 'react'
import { GoChevronDown, GoChevronUp } from "react-icons/go";

import { getLiveTeamInfo } from '../../services/teams.service';
import { useLocation, useParams } from "react-router"

import ProfileBar from '../ProfileBar/ProfileBar';



const MyServers = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [currentTeam, setCurrentTeam] = useState({});

	const { teamId } = useParams();

	useEffect(() => {
		console.log('get team info')

		const unsubscribe = getLiveTeamInfo(data => {

			setCurrentTeam({ ...data })

		}, teamId)
		return () => {
			unsubscribe();
		}

	}, [teamId])

	// const toggleAccordion = () => {
	// 	setIsOpen(!isOpen);
	// };
	return (
		<div className="bg-gray-800 h-screen text-purple-lighter flex-none w-64 pb-6 hidden md:block">

			<div className="flex flex-col h-screen">
				<div className="text-white mb-2 mt-3 px-4 flex justify-between border-b border-gray-600 py-1 shadow-xl">
					<div className="flex-auto">
						<h1 className="font-semibold text-xl leading-tight mb-1 truncate">{teamId ? `${currentTeam.name}` : 'Direct Messages'}</h1>
					</div>
					{/* <div>
						{isOpen ? (
							<GoChevronUp onClick={toggleAccordion} className="h-6 w-6 cursor-pointer" />
						) : (
							<GoChevronDown onClick={toggleAccordion} className="h-6 w-6 cursor-pointer" />
						)}
					</div> */}
				</div>
				{/* {isOpen && ( */}
				{/* <div className="flex flex-col gap-4 w-52 opacity-10 mt-5 ml-4">
						{/* Skeleton content */}
				{/* <div className="skeleton h-20 w-full"></div>
						<div className="skeleton h-4 w-full"></div>
						<div className="skeleton h-4 w-full"></div>
						<div className="skeleton h-4 w-full"></div>
						<div className="skeleton h-4 w-full"></div>
						<div className="skeleton h-4 w-full"></div>
						<div className="skeleton h-4 w-full"></div>
					</div>  */}
				{/* )} */}
				<div className="flex-grow"></div>
				<ProfileBar />
			</div>
		</div>
	)
}

export default MyServers;
