/* eslint-disable */
import React, { useContext, useEffect } from "react";
import BlockedUsers from "./BlockedUsers";
import SearchBox from "../../common/SearchBox";
import { useDispatch, useSelector } from "react-redux";
import wsSend_request from "../../../Api/ws/ws_request";
import { WebSocketContext } from "../../Index";
import { setOpenModalPopup } from "../../../redux/actions";

const Index = (props) => {
    const {websocket} = useContext(WebSocketContext)
    const userLogin = useSelector((state) => state.allReducers.userLogin);
    const SelectedRoom = useSelector((state) => state.allReducers.SelectedRoom);
    const { BlockedUserList } = props;
    const dispatch = useDispatch();
    const [ filterMembers,setFilterMembers ] = React.useState("");
    useEffect(()=>{
        callBlocklistUsers();
        console.log("callUnBlockContact", websocket)
    },[websocket.send])
    // Calling Block list users
    const callBlocklistUsers = () =>{
        wsSend_request(websocket, {"transmit":"single", "url":"get_block_contacts"})
    }
    const callUnBlockContact =(user) =>{
        if(user?.block_by === userLogin?.user_id){
            const payload = {
                Title:``,
                Description:`Unblock ${user?.name||user?.group_name} to send a message`,
                IsShow:true,
                Id:user?.id,
                ActionType: {"transmit":"broadcast", "url":"block_user","request":{"is_block":0, "to_id":user?.id}},
                callBackList:callBlocklistUsers,
                ButtonSuccess:"UNBLOCK"
            }
            dispatch(setOpenModalPopup(payload))
        }
    }
    const callUnBlockContactAPI =(id) =>{
        wsSend_request(websocket, {"transmit":"broadcast", "url":"block_user","request":{"is_block":0, "to_id":id}})
        callBlocklistUsers()
    }
    // header search member array 
    const FliterArray = BlockedUserList.filter((elm) => {
        if(filterMembers == "") {
            return elm;
        } else if (
            elm?.name?.toLowerCase().includes(
                filterMembers && filterMembers.toLowerCase(),
            )
        ) {
            return elm;
        }
    })
    
    return(
        <div className="blockedUserswrapper">
            <div className="projectchatlogo">
                <div className="projectlogo">
                    <h4>Block User List</h4>
                </div>
                <SearchBox 
                    filterMembers={filterMembers} 
                    setFilterMembers={setFilterMembers} 
                />
            </div>
            <BlockedUsers 
                BlockedUserList={FliterArray}
                callUnBlockContact={callUnBlockContact}
            />
        </div>
    )
}

export default Index;