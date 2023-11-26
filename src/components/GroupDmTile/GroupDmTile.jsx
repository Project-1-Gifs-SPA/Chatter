import { useEffect, useState } from "react";
import { getDMById } from "../../services/dms.service";
import { getUserByHandle } from "../../services/users.service";
import { useNavigate} from 'react-router';
import { BsPersonFillAdd } from "react-icons/bs";


const GroupDmTile = ({groupDmId}) => {

    const navigate = useNavigate();

    const [partners, setPartners] = useState([]);

    useEffect(() => {
		if (groupDmId) {
			getDMById(groupDmId)
			.then(snapshot=>{
				const data = snapshot.exists() ? snapshot.val() : {};
				return data.members;
			})
			.then(dmMembers => {
			const promises = dmMembers.map(member => {
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


    return (
        <>
        <div className="flex p-3 relative truncate" onClick={()=> navigate(`/dms/${groupDmId}`)}>
        <div className="w-10 rounded-full">
        <BsPersonFillAdd />			
		</div>
        
         {partners.map(partner=>{
        <div className="leading-4 pl-3 text-white">
        <h4 className="font-semibold hidden sm:flex">{partner.firstName}{partner.lastName}</h4>
        </div>  
                    
         })}   
         <span className="text-xs text-white hidden sm:flex">{partners.length} members</span>
        </div>
        </>
    )



}


export default GroupDmTile;