import React from "react";
import { Dropdown } from 'react-bootstrap';
import { clearMessage, mainTabChange, UpdateMediaFiles, setOpenModalPopup, setSearchModalData } from "../../redux/actions";
import { useDispatch } from "react-redux";

function ChatHeadDownMenu(props) {
    const { setGroupInfoSidebar, SelectedRoom, groupInfoSidebar } = props;
    const dispatch = useDispatch();
    
    const callShowMenu = () => {
        dispatch(UpdateMediaFiles(SelectedRoom))
        setGroupInfoSidebar(!groupInfoSidebar);
    }
    const callShowSearchModal = () => {
        dispatch(setSearchModalData(true))
    }
    // clear chat functionality
    const ClearChatFnt = () => {
        let payload = {};
        
        if(SelectedRoom.isGroups === false && SelectedRoom?.isBroadCast === undefined) {
            payload = {
                Title:`Clear Chat`,
                Description: "Are you sure you want to clear all chat",
                IsShow:true,
                Id:SelectedRoom.id,
                ActionType: {
                    "transmit":"broadcast", 
                    "url":"clear_chat", 
                    "request":{
                        "chat_type": "single", 
                        "to_id": SelectedRoom.id,
                    }
                },
                callBackList:ClearChatFnt,
                ButtonSuccess:"CLEAR CHAT"
            }
        } else if (SelectedRoom.isGroups === true && SelectedRoom?.isBroadCast === undefined) {
            payload = {
                Title:`Clear Chat`,
                Description: "Are you sure you want to clear all chat",
                IsShow:true,
                Id:SelectedRoom.id,
                ActionType: {
                    "transmit":"broadcast", 
                    "url":"clear_chat", 
                    "request":{
                        "chat_type": "group", 
                        "to_id": SelectedRoom.id,
                    }
                },
                callBackList:ClearChatFnt,
                ButtonSuccess:"CLEAR CHAT"
            }
        } else if (SelectedRoom.isGroups === true && SelectedRoom?.isBroadCast === true) {
            payload = {
                Title:`Clear Chat`,
                Description: "Are you sure you want to clear all chat",
                IsShow:true,
                Id:SelectedRoom.id,
                ActionType: {
                    "transmit":"broadcast", 
                    "url":"clear_chat", 
                    "request":{
                    "chat_type": "broadcast", 
                    "to_id": SelectedRoom.id,
                    }
                },
                callBackList:ClearChatFnt,
                ButtonSuccess:"CLEAR CHAT"
            }
        }
        
        dispatch(setOpenModalPopup(payload))
    }

    return(
        <Dropdown.Menu className="customeDropdownHere">
            {/* <Dropdown.Item onClick={() => callShowSearchModal()} >
                Search
            </Dropdown.Item> */}
            <Dropdown.Item onClick={() => callShowMenu()} >
                {SelectedRoom?.isGroups ? "Group Info" : "Contact Info"}
            </Dropdown.Item>
            <Dropdown.Item onClick={() => dispatch(mainTabChange("savedmessage"))}>Saved Messages</Dropdown.Item>
            <Dropdown.Item disabled={SelectedRoom?.group_type?true:false} onClick={() => ClearChatFnt()}>Clear Chat</Dropdown.Item>
        </Dropdown.Menu>
    )
} 

export default ChatHeadDownMenu;