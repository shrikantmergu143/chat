/* eslint-disable */
import React, { useState, useEffect, useContext } from "react";
import ProjectLogoData from "./ProjectLogoData";
import ChatMembers from "./ChatMembers";
import ContactsList from "./ContactsList";
import { useSelector, useDispatch } from "react-redux";
import { getSelectRoomsDetails, setRoom } from "../../redux/actions";
import wsSend_request from "../../Api/ws/ws_request";
import { WebSocketContext } from "../Index";
import { useNavigate } from "react-router-dom";

const ChatSidebar = () => {
    const [ changeChatTabs, setChangechatTabs ] = useState("ChatMembersTab");
    const [ filterMembers, setFilterMembers ] = useState("");
    let url = window.location.pathname;
    const select_types = useSelector((state) => state?.allReducers?.select_types);
    let location_id = url.substring(url.lastIndexOf('/') + 1);
    const { Rooms } = useSelector((state) => state.allReducers);
    const MessageList = useSelector((state) => state.allReducers.MessageList);
    const MessagesTab = useSelector((state) => state.allReducers.MessagesTab);
    const { user_types } = useSelector((state) => state?.allReducers);
    const dispatch = useDispatch();
    const { Contacts, access_token, userLogin } = useSelector((state) => state.allReducers);
    const navigate = useNavigate()
    const { websocket } = useContext(WebSocketContext);

    useEffect(() => {
        CallContactList();
        fetchAllGroups();
        Updated_contact();
        // fetchAllRooms();
    },[changeChatTabs]);

    useEffect(() => {
        fetchAllRooms();
    },[changeChatTabs, Contacts]);
    
    const fetchAllGroups = () => {
        const param = {"transmit":"single", "url":"get_groups"}
        wsSend_request(websocket, param);
        wsSend_request(websocket,{"transmit":"single", "url":"get_broadcast_groups"});
        wsSend_request(websocket,{"transmit":"single", "url":"get_system_groups"});
    }

    const fetchAllRooms = () => {
        // const ChatMemberList = Contacts && Contacts.filter((chatActive) => {
        //     if(chatActive.last_message !== "None") {
        //         return chatActive;
        //     }
        // })
        // dispatch(setRoom(ChatMemberList));
        const FliterArrayMember = Rooms.filter((elm) => {
            if(elm?.last_message !== "None") {
                    return elm;
            }
        })
        Contacts.filter((item)=>{
            const check_list = FliterArrayMember?.filter(item1=>item1.id === item?.id)?.length;
            if(check_list === 0 && item.last_message !== "None"){
                FliterArrayMember?.push(item)
                return item
            }
        })
        // console.log("Rooms",FliterArrayMember)
        dispatch(setRoom(FliterArrayMember));
    }

    const CallContactList = () => {
        const param = {"transmit":"single", "url":"get_contacts"}
        wsSend_request(websocket, param);
    }

    const Updated_contact = () => {
        const param = {"transmit":"broadcast", "url":"user_update"}
        wsSend_request(websocket, param);
    }

    // header search member array
    const FliterArray = Contacts && Contacts?.filter((elm) => {
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

    const FliterArrayMember = Rooms && Rooms?.filter((elm) => {
        // console.log("elm", elm)
        if(elm?.name){
            if((elm?.last_message!== undefined && elm?.last_message!=="None")){
                if(filterMembers == "") {
                    return elm;
                } else if (elm?.name?.toLowerCase().includes(filterMembers && filterMembers.toLowerCase())) {
                    return elm;
                } else if (elm?.group_name?.toLowerCase().includes(filterMembers && filterMembers.toLowerCase())) {
                    return elm;
                } else if (elm?.broadcast_name?.toLowerCase().includes(filterMembers && filterMembers.toLowerCase())) {
                    return elm;
                }
            }else{
                return null;
            }
        }else{
            if(filterMembers == "") {
                return elm;
            } else if (elm?.name?.toLowerCase().includes(filterMembers && filterMembers.toLowerCase())) {
                return elm;
            } else if (elm?.group_name?.toLowerCase().includes(filterMembers && filterMembers.toLowerCase())) {
                return elm;
            } else if (elm?.broadcast_name?.toLowerCase().includes(filterMembers && filterMembers.toLowerCase())) {
                return elm;
            }
        }
    });

    const clearChatTextfield = (e, user) => {
        e.preventDefault();
        let cmntMsg = document.getElementById('messagFieldID');
        if(cmntMsg){
            cmntMsg.innerHTML = null;
            setTimeout(() => {
                var child = cmntMsg.lastElementChild;
                while (child) {
                    cmntMsg.removeChild(child);
                    child = cmntMsg.lastElementChild;
                }
            }, 500);
        }
        let param = null;
        if(user?.group_type ){
            dispatch(getSelectRoomsDetails(user));
            callGetChat(user);
            setTimeout(()=>navigate("/Chat/" + user.id), 10);
        }else if(user?.isBroadCast === true){
            param = {
                "transmit":"single",
                "url":"get_broadcast_detail",
                "request":{
                    "broadcast_id":user.id, 
                }
            }
        }else{
            param = {
                "transmit":"single",
                "url":"get_detail",
                "request":{
                    "to_id":user.id, 
                    "chat_type":user?.admin_ids === undefined?"single":"group"
                }
            }
        }
        if(param !== null && user.id !== location_id){
            wsSend_request(websocket, param);
            callGetChat(user);
            setTimeout(()=>navigate("/Chat/" + user.id), 10);
        }else{

        }
        setTimeout(()=>navigate("/Chat/" + user.id), 10);
        setTimeout(function() {
            var MessageChatPField = document.getElementById('messagFieldID');
            if(MessageChatPField){
                MessageChatPField.focus();
            }
        }, 500);
        
    }
    const callGetChat = (user) =>{
        const old = MessageList[user.id];
        let update_at = ""
        if(old?.length>0){
            update_at = old[old?.length - 1]?.updated_at
        }
        if(user?.group_type){
            if( old?.length>0){
                let param = {
                    "transmit":"single",
                    "url":"get_system_chat",
                    "request":{
                        "to_id":user?.id,
                        "updated_at":update_at
                    }
                }
                
                wsSend_request(websocket, param);
            }else{
                let param = {
                    "transmit":"single",
                    "url":"get_system_chat",
                    "request":{
                        "to_id":user?.id,
                        "updated_at":"",
                        "is_limit":500
                    }
                }
                
                wsSend_request(websocket, param);
            }
        }else{
            if(user?.isBroadCast===true && old?.length>0){
                let param = {
                    "transmit":"single",
                    "url":"get_broadcast_chats",
                    "request":{
                        "broadcast_id":user?.id,
                        "updated_at":update_at
                    }
                }
                
                wsSend_request(websocket, param);
            }else if(old?.length>0){
                let param = {
                    "transmit":"single", 
                    "url":"get_chats",
                    "request": {
                        "chat_type":user?.admin_ids === undefined?"single":"group",
                        "to_id": user?.id, 
                        "updated_at": update_at,
                    }
                }
                
                wsSend_request(websocket, param);
            }else{
                if(user?.isBroadCast===true){
                    let param = {
                        "transmit":"single",
                        "url":"get_broadcast_chats",
                        "request":{
                            "broadcast_id":user?.id,
                            "updated_at":"",
                            "is_limit":50
                        }
                    }
                    
                    wsSend_request(websocket, param);
                }else{
                    let param = {
                        "transmit":"single",
                        "url":"get_chats",
                        "request": {
                            "chat_type": user?.admin_ids === undefined?"single":"group",
                            "to_id": user?.id, 
                            "updated_at": "",
                            "is_limit":500
                        }
                    }
                    wsSend_request(websocket, param);
                }
            }
        }
        setTimeout(() => {
            var element = document.getElementById("chatPanelScroll");
            element?.scrollIntoView({ block: 'end' });
        }, 100);
    }
    const CommanChatList = Rooms?.filter((user)=>{
        if(user?.name){
            return Contacts?.filter((item)=>item.id === user.id)?.length > 0 ?user:false ;
        }
    });

    Contacts?.map((item) =>{
        const CheckUser = CommanChatList?.filter((item2)=>item2.id === item.id)
        if(CheckUser?.length === 1){
        }else{
            CommanChatList?.push(item);
        }
    });

    const CommanChat = CommanChatList?.filter((item)=>{
        if(item?.user_type){
            const Users_types = item?.user_type?.split(",");
            const Result = select_types?.filter((type) =>{
                const checkMatch = Users_types?.filter((item)=>item === type?.key);
                if(checkMatch?.length >0){
                    return type
                }
            })
            if(Result?.length>0){
                return item
            }else{
                return null;
            }
        }else{
            return null;
        }
    });

    const MessagesCountBadge = () => {
        let sum = 0;
        const Data = CommanChat?.length >0 ? CommanChat : FliterArrayMember;
        Data?.map((item)=>{
            if(!item?.group_type && item?.id){
                if(item?.unread_count >0){
                    sum = sum +1;
                }
            }
        })
        if(sum>0){
            document.title = `(${sum}) Chat`
        }else{
            document.title = `Chat`
        }
        return(<React.Fragment>{sum > 0 && (<div className="badgemessagelist">{sum}</div>)}</React.Fragment>);
    }

    return(
        <div className="chatsidebarwrapps">
            {/* project details */}
            <ProjectLogoData 
                filterMembers={filterMembers}
                setFilterMembers={setFilterMembers}
            />
            <div className="chatMemberTabsWraps">
                <div className="chatMemberTabs">
                    <ul>
                        <li 
                            className={changeChatTabs === "ChatMembersTab" ? "active" : null}
                            onClick={() => setChangechatTabs("ChatMembersTab")}
                        >
                            Messages
                            {MessagesCountBadge()}
                        </li>
                        <li 
                            className={changeChatTabs === "ContactsTab" ? "active" : null}
                            onClick={() => setChangechatTabs("ContactsTab")}
                        >
                            Contacts
                        </li>
                    </ul>
                </div>
                {changeChatTabs === "ChatMembersTab" ?
                    // project members 
                    <ChatMembers user_types={user_types} memberslist={CommanChat?.length >0 ? CommanChat : FliterArrayMember} UserFilter={CommanChat?.length >0?true:false} clearChatTextfield={clearChatTextfield} /> :
                    // ontacts list
                    <ContactsList ContactsList={FliterArray} clearChatTextfield={clearChatTextfield} />
                }
            </div>
        </div>
    )
}

export default ChatSidebar;