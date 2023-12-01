import { useEffect, useState } from "react";
import { getDMById, getLiveGroupDMsMembers } from "../../services/dms.service";
import { getUserByHandle } from "../../services/users.service";
import { useNavigate } from 'react-router';
import { BsPersonFillAdd } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
import ContextMenu from "../ContextMenu/ContextMenu";


const GroupDmTile = ({ groupDmId }) => {

	const navigate = useNavigate();

	const [partners, setPartners] = useState([]);
	const [partnersCount, setPartnersCount] = useState('')
	const [contextMenuVisible, setContextMenuVisible] = useState(false);

	useEffect(() => {
		if (groupDmId) {
			getDMById(groupDmId)
				.then(snapshot => {
					const data = snapshot.exists() ? snapshot.val() : {};
					return data.members;
				})
				.then(dmMembers => {

					const promises = Object.keys(dmMembers).map(member => {
						return getUserByHandle(member)
							.then((snapshot) => {
								return snapshot.val();
							});
					});

					Promise.all(promises)
						.then((membersData) => {
							setPartners(membersData);
						})
						.catch((error) => {
							console.error(error);
						})
				});
		}
	}, [groupDmId])


	useEffect(() => {

		const unsubscribe = getLiveGroupDMsMembers(data => {
			const promises = Object.keys(data).map(member => {
				return getUserByHandle(member)
					.then((snapshot) => {
						return snapshot.val();
					});
			});

			Promise.all(promises)
				.then((membersData) => {
					setPartners(membersData);
				})
				.catch((error) => {
					console.error(error);
				})
		}, groupDmId)

		return () => {
			unsubscribe();
		}

	}, [groupDmId])

	const handleContextMenu = (e) => {
		e.preventDefault();
		setContextMenuVisible(true);
	}

	return (
		<div className="tooltip tooltip-top" data-tip={partners.map(partner => partner.firstName)} onContextMenu={handleContextMenu}>
			<div className="flex p-3 mb-0 relative hover:bg-gray-300 cursor-pointer" onClick={() => navigate(`/dms/${groupDmId}`)}>

				<div className="w-10 rounded-full bg-green-700 mr-3">
					<IoIosPeople className="w-10 h-10" />
				</div>
				<div className="truncate">
					<div className="flex justify-left content-center">

						{partners.map(partner => {
							return (
								<div key={partner.uid} className=" pr-1  text-white ">
									<h4 className="font-semibold hidden sm:flex">{partner.firstName},</h4>
								</div>
							)
						})}
					</div>
					<span className="text-xs justify-center text-white hidden sm:flex">{partners.length} members</span>
				</div>
			</div>
			{contextMenuVisible ? <ContextMenu groupDmId={groupDmId} contextMenuVisible={contextMenuVisible} setContextMenuVisible={setContextMenuVisible} /> : null}
		</div>

	)

}


export default GroupDmTile;