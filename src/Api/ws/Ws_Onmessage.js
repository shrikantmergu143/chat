/* eslint-disable array-callback-return */
/* eslint-disable no-fallthrough */
import { contactList,clearMessage, mainTabChange,setUpdateMessagesList, setDetailsBroadcastList, setMyProfile, getBlockContacts,RemoveMembersFromRooms,GetStoreOldMessage,RemoveGroupsFromRooms, savedMessages, createNewGroup,SetMessagesDelivered,  SetFilterChatMessagesList, deleteMessage, newMessageSend, setMessages, getGroupsList, getSelectRoomsDetails, getMessageList, SetUpdateGroupListFilter, SetMembersListSeenMessages, GetStoreLimitMessage, CallLogoutUser, setRegisterdDevice, setAddGroupCreated, setGoBackFromSelect, AddChatInMessageList, setAddChatInMessageList, SetUpdateMessagesSeenDelivered, setAddBroadCastGroup, setSelectedBroadCastList, setAddMessagesListBroadcast, removeSaveMessageList, setUserTypeing, setSaveChatList, setSaveMessageInList, setNewMessageSave, setUpdateContactList, UpdateMediaFiles, SetMessageSeenByUser, setGroupCreatedUser, updateBroadcastGroupList, SetBroadcastMessagesUpdate, SetDetailsList, setUsersDetailsList, selectRoom, setStoreGetChatsHistory, deleteStoreGetChatsHistory, setReplaySaveChatMessages, SetUpdateChatMessagesList, setStoreUserTypes, setAddSystemGroup, setRegisterdSystem } from "../../redux/actions";
import wsSend_request from "./ws_request";
import { SendNotificationAPI } from "../SendNotification";
import GetUpdateContact from "../UpdateContact";
import { SetNotificationListManage } from "../../firebase/notification";
export const GetSeenAndUnseenMSGs = (NewGetChatList, location_id, chat_type, userLogin, ws, MsgScrollDown) =>{
    const Add_seen_delivered = [];
    const Add_seen = [];
    NewGetChatList?.map((item)=>{
        if(item?.group_id === undefined){
            if(item?.from_id !== userLogin?.user_id){
                if(item?.seen_at === "None"){
                    Add_seen?.push(item?.id);
                }
            }
        }else if(item?.group_id !== undefined){
            if(item?.seen_by){
                let seen_by = JSON.parse(item?.seen_by);
                if(seen_by[userLogin?.user_id] === undefined){
                    Add_seen?.push(item?.id);
                }
            }
        }
    });

    if(Add_seen.length > 0) {
        const param = {
            "transmit":"broadcast", 
            "url": "add_seen",
            "request":{
                "to_id": location_id,
                "chat_id": Add_seen.toString(), 
                "chat_type":chat_type // ws_onmessage?.request?.chat_type === "group"?"group":"single"
            }
        }
        // console.log("MessageList==========>", param)
        wsSend_request(ws, param);
    }
    MsgScrollDown(100);
}
export const CommanSeenAndDelivered = ( to_id, msg_id, location_id, ws, type )=>{
    if(to_id === location_id){
        const Add_seenDelivered = {
            "transmit":"broadcast",
            "url":"add_seen_delivered",
            "request":{
                "to_id":to_id, //ws_onmessage?.response?.message?.group_id,
                "chat_ids":msg_id, //ws_onmessage?.response?.message?.id,
                "chat_type":type
            }
        }
        wsSend_request(ws, Add_seenDelivered);
    }else{
        const Add_seenDelivered = {
            "transmit":"broadcast",
            "url":"add_delivered",
            "request":{
                "to_id":to_id, //ws_onmessage?.response?.message?.group_id,
                "chat_id":msg_id, //ws_onmessage?.response?.message?.id,
                "chat_type":type
            }
        }
        wsSend_request(ws, Add_seenDelivered);
    }
}
export const CommanGetdetails = (ws, to_id, chat_type) =>{
    wsSend_request(ws, {
        "transmit":"single", 
        "url":"get_detail",
        "request":{
            "to_id":to_id, 
            "chat_type":chat_type
        }
    })
}
export const CommanGetLimitChats = (ws, to_id, chat_type, user_type) =>{
    return(async (dispatch, getState) => {
        const Payload = {
            "transmit":"single",
            "url":user_type,
            "request": {
                "to_id": to_id,
                "updated_at": "",
                "is_limit":5000
            }
        }
        if(to_id){
            Payload.request.to_id = to_id
        }
        if(user_type){
            Payload.url = user_type
        }
        if(chat_type){
            Payload.request.chat_type = chat_type
        }
    
        dispatch(setStoreGetChatsHistory(Payload))
    })
}
export const CallCommanGetchatBroadcast = (to_id, id_type, type)=>{
    return(async (dispatch, getState) => {
        let param = {
            "transmit":"single",
            "url":type,
            "request":{
                [id_type]:to_id,
                "updated_at":"",
                "is_limit":5000
            }
        }
        dispatch(setStoreGetChatsHistory(param))

        // wsSend_request(websocket, param);
    })
}
export const CallGetChats = ( ws, to_id, chat_type, updated_at ) =>{
    let param = {
        "transmit":"single",
        "url":"get_chats",
        "request": {
            "chat_type": chat_type,
            "to_id": to_id, 
            "updated_at": updated_at,
        }
    }
    wsSend_request(ws, param);
}
export const Ws_Omessage = ({evt, ws}) =>{
    // const navigate = useNavigate()
    return(async (dispatch, getState) => {
        const ws_onmessage = JSON.parse(evt.data);
        let url = window.location.pathname;
        let location_id = url.substring(url.lastIndexOf('/') + 1);
        const device_id = localStorage.getItem("device_id");
        const { Rooms, SavedMessages, registration_ids, registration_id, MessageList, access_token, BroadcastList, scroll_chat_id, UserDetails, MainTabsSelected, DetailsList,  Contacts,qr_token,SaveChatList, SelectedRoom, MyProfile, userLogin, user_id } = getState()?.allReducers;

        // message scroll down fucntion
        const MsgScrollDown = (time) => {
            if(scroll_chat_id?.to_id !== location_id){
                setTimeout(() => {
                    var element = document.getElementById("chatPanelScroll");
                    element?.scrollIntoView({ block: 'end' });
                }, time);
            }
        }
        // console.log("ws_onmessage", ws_onmessage, userLogin)

        // Sw notification setup
        switch(ws_onmessage.url){
            case "get_contacts":
                dispatch(contactList(ws_onmessage?.response));
                ws_onmessage?.response?.map((item)=>{
                    if(!MessageList[item?.id]){
                        dispatch(CommanGetLimitChats(ws, item?.id, "single", "get_chats"));
                    }
                    const checkAvailable = UserDetails[item?.id];
                    if(checkAvailable){

                    }else{
                        CommanGetdetails(ws, item?.id, "single");
                    }
                });
                break;
            case "get_block_contacts":
                dispatch(getBlockContacts(ws_onmessage?.response));
                break;
            case "block_user":
                dispatch(setUpdateContactList(ws_onmessage?.request))
                wsSend_request(ws, {"transmit":"single", "url":"get_block_contacts"})
                if(location_id === ws_onmessage?.request?.to_id){
                    CommanGetdetails(ws, location_id, "single");
                }
               if(ws_onmessage?.response?.notification_id)
                await SendNotificationAPI(access_token, ws_onmessage?.response?.notification_id)
                // wsSend_request(ws, {"transmit":"single", "url":"get_groups"});
                // wsSend_request(ws, {"transmit":"single", "url":"get_contacts"});
                break;
            case "get_save_message_all":
                const list = ws_onmessage?.response?.map((item)=>{
                        if(item?.chat){
                            let users = []
                            if(item?.chat?.reply_id){
                                // let param = {
                                //     "transmit":"single",
                                //     "url":"chat_detail",
                                //     "request": {
                                //         "chat_type":item?.chat_type,
                                //         "chat_id":msgs?.reply_id,
                                //         "to_id":users?.to_id
                                //     }
                                // }
                                // wsSend_request(websocket, param);
                                if(!MessageList[item?.to_id]){
                                    // console.log("item", item)
                                    if(item?.chat?.updated_at){
                                        CallGetChats(ws, item?.to_id, item?.chat_type, item?.chat?.updated_at)
                                    }else{
                                        CallGetChats(ws, item?.to_id, item?.chat_type, "")
                                    }
                                }
                            }
                            if(item?.chat_type === "broadcast"){
                                if(BroadcastList[item?.chat?.broadcast_group_id]){
                                    const broadcastData = BroadcastList[item?.chat?.broadcast_group_id]; // Rooms?.filter((items) =>items?.id === item?.chat?.broadcast_group_id);
                                    users = [{
                                        ...broadcastData,
                                        group_name:broadcastData?.broadcast_name
                                    }]
                                }
                            }else if(item?.chat_type === "single"){
                                const Check_contact = Contacts?.filter((items) =>{
                                    if(item?.chat?.to_id === item?.user_id){
                                        return items?.id === item?.chat?.from_id 
                                    }else{
                                        return items?.id === item?.chat?.to_id;
                                    }
                                })
                                if(Check_contact?.length === 0){
                                    if(item?.chat?.to_id === item?.user_id){
                                        if(UserDetails[item?.chat?.from_id ]){
                                            users = [UserDetails[item?.chat?.from_id ]]
                                        }else if(UserDetails[item?.chat?.to_id ]){
                                            users = [UserDetails[item?.chat?.to_id ]]
                                        }
                                    }
                                    // users = Rooms?.filter((items) =>{
                                    //     if(item?.chat?.to_id === item?.user_id){
                                    //         return items?.id === item?.chat?.from_id 
                                    //     }else{
                                    //         return items?.id === item?.chat?.to_id;
                                    //     }
                                    // })
                                }else{
                                    users = Check_contact
                                }
                            }else{
                                if(DetailsList[item?.chat?.group_id]){
                                    users =[DetailsList[item?.chat?.group_id]];
                                }else{
                                    if(item?.chat?.from_id){
                                        if(item?.chat?.from_id !== userLogin?.user_id){
                                            if((UserDetails[item?.chat?.from_id])){
                                                users =[{
                                                    group_name:item?.group_name,
                                                    users:[UserDetails[item?.chat?.from_id]],
                                                }];
                                            }else{
                                                CommanGetdetails(ws, item?.chat?.from_id, "single");
                                                users =[{
                                                    group_name:item?.group_name,
                                                    users:[],
                                                }];
                                            }
                                           
                                        }else{
                                            users =[{
                                                group_name:item?.group_name,
                                                users:[userLogin],
                                            }];
                                        }
                                    }else{
                                        console.log("DetailsList",item)
    
                                    }
                                }
                            }
                            // console.log("listlists",users, item,  item?.chat?.from_id,  item?.chat?.to_id, )
                            return{
                                ...item,
                                toDetails:users,
                                ext:item.chat?.message_type === 'file'?item.chat?.file?.name.split('.').pop():null
                            }
                        }else{
                            wsSend_request(ws, {
                                "transmit":"broadcast",
                                "url":"remove_save_message",
                                "request":{
                                    "to_id":item?.to_id,
                                    "chat_id":item?.chat_id,
                                    "chat_type":item?.chat_type
                                }
                            })
                        }
                    });
                    const listFilter = list?.filter((item)=>{
                        return item?.toDetails?.length
                    } )
                    dispatch(savedMessages(listFilter));
                    break;
            case "get_groups":
                if(Contacts?.length === 0){
                    wsSend_request(ws, {"transmit":"single", "url":"get_contacts"});
                }

                dispatch(getGroupsList(ws_onmessage?.response));
                
                ws_onmessage?.response?.map((item)=>{
                    const result = DetailsList[item?.id];
                    if(DetailsList){
                        const oldUsers = result?.users;
                        const newUsers = item.user_ids?.split(',');
                        if(result?.users!== undefined && (oldUsers?.length === newUsers?.length)){

                        }else
                            CommanGetdetails(ws, item?.id, "group");
                    }else{
                        CommanGetdetails(ws, item?.id, "group");
                    }
                    if(!MessageList[item?.id]){
                        dispatch(CommanGetLimitChats(ws, item?.id, "group", "get_chats"));
                    }
                })
                // console.log("UserDetails", UserDetails)
                break;
            case "add_group":
                if(userLogin?.user_id === ws_onmessage?.response?.created_by){
                    CommanGetdetails(ws, ws_onmessage?.response?.id, "group");
                    await SendNotificationAPI(access_token, ws_onmessage?.response?.notification_id)
                }else{
                    CommanGetdetails(ws, ws_onmessage?.response?.id, "group")
                    dispatch(setAddGroupCreated(ws_onmessage?.response));
                }
                
                // wsSend_request(ws, {"transmit":"single", "url":"get_groups"});
                break;
            case "get_system_chat":
                dispatch(deleteStoreGetChatsHistory({id:ws_onmessage?.request?.to_id}));
                const NewGetChatList1 = ws_onmessage?.response?.map((item)=>{
                    if(item?.broadcast_chat_id && item?.from_id === userLogin?.user_id){
                        return {
                            ...item,
                            id:item?.id
                        }
                    }else{
                        return item;
                    }
                })
                const payload1 = {
                    id: ws_onmessage?.request?.to_id,
                    Messages: NewGetChatList1,
                }
                
                // console.log("ws_onmessage=========>", ws_onmessage?.response);
                dispatch(setMessages(NewGetChatList1));
                dispatch(getMessageList(payload1));
                MsgScrollDown(10);
                break;
            case "get_chats":
                const OLDMessagesList = MessageList[ws_onmessage?.request?.to_id];
                const NewGetChatLists =[];
                if(OLDMessagesList){
                    OLDMessagesList?.map((item)=>NewGetChatLists?.push(item));
                    // console.log("OLDMessagesList", OLDMessagesList?.filter((item)=>(item?.reply_id)))
                }
                const NewGetChatList = ws_onmessage?.response
                const payload = {
                    id: ws_onmessage?.request?.to_id,
                    Messages: NewGetChatList,
                }
               
                // console.log("ws_onmessage=========>", ws_onmessage?.response);
                dispatch(getMessageList(payload));
                if(ws_onmessage?.request?.to_id === location_id){
                    GetSeenAndUnseenMSGs(NewGetChatList,location_id, ws_onmessage?.request?.chat_type, userLogin, ws, MsgScrollDown);
                    if(NewGetChatLists){
                        GetSeenAndUnseenMSGs(NewGetChatLists,location_id, ws_onmessage?.request?.chat_type, userLogin, ws, MsgScrollDown);
                    }
                }
                dispatch(deleteStoreGetChatsHistory({id:ws_onmessage?.request?.to_id}))
                MsgScrollDown(10);
                // if( ws_onmessage?.request?.is_limit){
                //     console.log("Hiiii")
                //     dispatch(GetStoreLimitMessage(payload));
                // }else if( ws_onmessage?.request?.is_reverse){
                //     console.log("gemsa", payload)
                //     dispatch(GetStoreOldMessage(payload));
                // }
                break;
            case "clear_chat":
                if(SelectedRoom?.id === location_id)
                    dispatch(clearMessage(ws_onmessage?.response));
                    dispatch(UpdateMediaFiles(SelectedRoom))
                break;
            case "get_broadcast_chats":
                // console.log("ws_onmessage=========>", ws_onmessage?.response);
                // dispatch(setMessages(ws_onmessage?.response));
                dispatch(getMessageList({id: ws_onmessage?.request?.broadcast_id,Messages: ws_onmessage?.response,}));
                dispatch(deleteStoreGetChatsHistory({id:ws_onmessage?.request?.broadcast_id}))

                MsgScrollDown(100);
                break;
            case "add_broadcast":
                // console.log("ws_onmessage=========>", ws_onmessage?.response);
                // dispatch(setMessages(ws_onmessage?.response));
                const checkINRooms = Rooms?.filter((item)=>item.id === ws_onmessage?.request?.broadcast_id);
                if(checkINRooms?.length > 0){
                    const to_ids = checkINRooms[0]?.user_ids.split(',')?.filter((item)=>item!==userLogin?.user_id);
                    
                    to_ids?.map((item)=>{
                        dispatch(SetFilterChatMessagesList({
                            ...ws_onmessage?.response,
                            id:ws_onmessage?.response?.broadcast_chat_id,
                            to_id:item
                        }));
                    })
                }
                if(ws_onmessage?.request?.broadcast_id !== location_id && checkINRooms?.length > 0){
                    dispatch(SetFilterChatMessagesList({
                        ...ws_onmessage?.response,
                        id:ws_onmessage?.response?.broadcast_chat_id,
                        to_id:ws_onmessage?.request?.broadcast_id
                    }));
                }
                if(ws_onmessage?.request?.broadcast_id === location_id){
                    dispatch(setAddMessagesListBroadcast({
                        id: ws_onmessage?.request?.broadcast_id,
                        Messages: {
                            ...ws_onmessage?.response,
                            id:ws_onmessage?.response?.broadcast_chat_id,
                            broadcast_group_id:location_id
                        }
                    }));
                    MsgScrollDown(10);
                }else if(ws_onmessage?.response?.from_id === location_id){
                    // const seendelivered = {
                    //     "transmit":"broadcast",
                    //     "url":"add_seen_delivered",
                    //     "request":{
                    //         "to_id":ws_onmessage?.response?.from_id,
                    //         "chat_ids":ws_onmessage?.response?.id,
                    //         "chat_type":"single"
                    //     }
                    // }
                    // if(seendelivered !== null){
                    //     wsSend_request(ws, seendelivered);
                    // }
                    CommanSeenAndDelivered(ws_onmessage?.response?.from_id, ws_onmessage?.response?.id, location_id, ws, "single");
                    dispatch(SetFilterChatMessagesList({
                        ...ws_onmessage?.response,
                        id:ws_onmessage?.response?.id
                    }));
                    const payload = {
                        id: ws_onmessage?.request?.from_id,
                        Messages: [ws_onmessage?.response],
                    }
                    dispatch(setAddMessagesListBroadcast({
                        id: ws_onmessage?.response?.from_id,
                        Messages: {
                            ...ws_onmessage?.response,
                            id:ws_onmessage?.response?.id
                        }
                    }));
                    MsgScrollDown(10);
                }else if(ws_onmessage?.response?.from_id !== userLogin?.user_id){
                    const CheckRoom = Rooms?.filter((item)=>item?.id === ws_onmessage?.response?.from_id);
                    if(CheckRoom?.length === 0){
                        CommanGetdetails(ws, ws_onmessage?.response?.from_id, "single");
                    }
                    // let add_deliver = null;
                    // add_deliver = {
                    //     "transmit":"broadcast",
                    //     "url":"add_delivered",
                    //     "request":{
                    //         "to_id":ws_onmessage?.response?.from_id,
                    //         "chat_id":ws_onmessage?.response?.id,
                    //         "chat_type":"single"
                    //     }
                    // }
                    // if(add_deliver !== null){
                    //     wsSend_request(ws, add_deliver);
                    // }
                    CommanSeenAndDelivered(ws_onmessage?.response?.from_id, ws_onmessage?.response?.id, location_id, ws, "single");
                    dispatch(SetFilterChatMessagesList({
                            ...ws_onmessage?.response,
                            id:ws_onmessage?.response?.broadcast_chat_id
                    }));
                    if(ws_onmessage?.response?.from_id === userLogin?.user_id){
                        alert()
                        dispatch(setAddMessagesListBroadcast({
                            id: ws_onmessage?.response?.from_id,
                            Messages: {
                                ...ws_onmessage?.response,
                                id:ws_onmessage?.response?.broadcast_chat_id
                            }
                        }));
                    }
                }
                const checkBroadcastList = Rooms?.filter((item)=>item?.id ===ws_onmessage?.request?.broadcast_id);
                if(checkBroadcastList?.length === 1){
                    const resultLocation = checkBroadcastList[0]?.user_ids?.split(",")?.filter(item =>item === location_id);
                    if(resultLocation?.length === 1){
                        const lastMessages = MessageList[resultLocation[0]];
                        if(lastMessages){
                            CallGetChats(ws, resultLocation[0], "single", lastMessages[lastMessages?.length - 1]?.created_at)
                        }
                    }
                }
                if(SelectedRoom?.id === location_id)
                    dispatch(UpdateMediaFiles(SelectedRoom))
                break;
            case "add_delivered":
                const Splite_msgDelivered = ws_onmessage?.response?.map((item)=>{
                    if(item?.broadcast_chat_id){
                        // console.log("add_delivereds", item)
                        if(item?.broadcast_id){
                            dispatch(SetBroadcastMessagesUpdate({
                                ...item,
                                id:item?.broadcast_chat_id
                            }));
                        }
                        return{
                            ...item,
                            id:item?.broadcast_chat_id,
                        }
                    }else{
                    // console.log("add_delivereds", item)
                    return item
                    }
                })
                if(ws_onmessage?.response?.length>0 && (
                    ws_onmessage?.user_id === location_id
                )){
                    // console.log("add_delivereds", Splite_msgDelivered)
                    dispatch(SetMessagesDelivered({response:Splite_msgDelivered, request:{...ws_onmessage?.request, to_id:ws_onmessage?.user_id}}))
                } if(ws_onmessage?.response?.length>0 && (
                    ws_onmessage?.request?.to_id === location_id
                )){
                    // console.log("add_delivereds", Splite_msgDelivered)
                    dispatch(SetMessagesDelivered({response:Splite_msgDelivered, request:{...ws_onmessage?.request, to_id:ws_onmessage?.request?.to_id}}))
                }else {
                    dispatch(SetFilterChatMessagesList(Splite_msgDelivered));
                }
                break;
            case "add_chat":
                let data = [];
                let recevied_id = "";
                // console.log("add_delivered", userLogin?.user_id, ws_onmessage?.response);
                // console.log("ws_onmessage====>", ws_onmessage)
                // edit message

                if(ws_onmessage?.response?.is_edited === true) {
                    if(ws_onmessage?.request?.to_id === location_id)
                    dispatch(newMessageSend(ws_onmessage?.response));

                    dispatch(SetFilterChatMessagesList(ws_onmessage?.response));
                }
                // dispatch(setUserTypeing(ws_onmessage?.response))
                if(ws_onmessage?.request?.chat_type === "single"){
                    if(ws_onmessage?.response?.from_id === userLogin?.user_id){
                        const isContact = userLogin?.Contacts?.filter((item)=>item.id === ws_onmessage?.response?.to_id)?.length===0?true:false
                        const isRooms = Rooms?.filter((item)=>item.id === ws_onmessage?.response?.to_id)?.length===0?true:false
                        // console.log("check_contact", ws_onmessage?.response?.to_id, isContact, isRooms)
                        if(isContact&&isRooms)
                        CommanGetdetails(ws, ws_onmessage?.response?.to_id, "single");

                    }else{
                        const isContact = userLogin?.Contacts?.filter((item)=>item.id === ws_onmessage?.response?.from_id)?.length===0?true:false
                        const isRooms = Rooms?.filter((item)=>item.id === ws_onmessage?.response?.from_id)?.length===0?true:false
                        // console.log("check_contact", ws_onmessage?.response?.from_id, isContact, isRooms)
                        if(isContact&&isRooms)
                        CommanGetdetails(ws, ws_onmessage?.response?.from_id, "single");
                    }
                }else{
                    if(ws_onmessage?.response?.from_id === userLogin?.user_id){
                        const isContact = userLogin?.Contacts?.filter((item)=>item.id === ws_onmessage?.response?.group_id)?.length===0?true:false
                        const isRooms = Rooms?.filter((item)=>item.id === ws_onmessage?.response?.group_id)?.length===0?true:false
                        // console.log("check_contact", ws_onmessage?.response?.group_id, isContact, isRooms)
                        if(isContact&&isRooms)
                        CommanGetdetails(ws, ws_onmessage?.response?.group_id, "group");
                    }else{
                        const isContact = userLogin?.Contacts?.filter((item)=>item.id === ws_onmessage?.response?.from_id)?.length===0?true:false
                        const isRooms = Rooms?.filter((item)=>item.id === ws_onmessage?.response?.from_id)?.length===0?true:false
                        // console.log("check_contact", ws_onmessage?.response?.from_id, isContact, isRooms)
                        if(isContact&&isRooms)
                        CommanGetdetails(ws, ws_onmessage?.response?.from_id, "group");
                    }
                }
                if(ws_onmessage?.response?.group_id === undefined){
                    if(ws_onmessage?.response?.to_id === userLogin?.user_id){
                        data = MessageList[ws_onmessage?.response?.from_id];
                        if(ws_onmessage?.response?.is_edited !== true){
                            // console.log("check_contact", ws_onmessage)
                            dispatch(setAddChatInMessageList({
                                request:{...ws_onmessage?.request, to_id:ws_onmessage?.response?.from_id},
                                response:ws_onmessage?.response,
                            }));
                            if(ws_onmessage?.response?.from_id === location_id)
                            MsgScrollDown(10);
                        }
                    }else{
                        data = MessageList[ws_onmessage?.response?.to_id]
                        if(ws_onmessage?.response?.is_edited !== true){
                            // console.log("check_contact", ws_onmessage)
                            dispatch(setAddChatInMessageList({
                                request:{...ws_onmessage?.request, to_id:ws_onmessage?.response?.to_id},
                                response:ws_onmessage?.response,
                            }));
                            if(ws_onmessage?.response?.to_id === location_id)
                            MsgScrollDown(10);
                        }
                    }
                    recevied_id = ws_onmessage?.response?.to_id
                }else{
                    if(ws_onmessage?.response?.from_id === userLogin?.user_id){
                        data = MessageList[ws_onmessage?.response?.from_id];
                        // console.log("check_contact", ws_onmessage)
                        if(ws_onmessage?.response?.is_edited !== true){
                            dispatch(setAddChatInMessageList({
                                request:{...ws_onmessage?.request, to_id:ws_onmessage?.response?.group_id},
                                response:ws_onmessage?.response,
                            }));
                            MsgScrollDown(10);
                        }
                    }else{
                        data = MessageList[ws_onmessage?.response?.group_id]
                        // console.log("check_contact", ws_onmessage)
                        if(ws_onmessage?.response?.is_edited !== true){
                            dispatch(setAddChatInMessageList({
                                request:{...ws_onmessage?.request, to_id:ws_onmessage?.response?.group_id},
                                response:ws_onmessage?.response,
                            }));
                            if(ws_onmessage?.response?.group_id === location_id)
                            MsgScrollDown(10);
                        }
                    }
                    recevied_id = ws_onmessage?.response?.group_id
                }
                if(ws_onmessage?.response?.from_id === SelectedRoom?.id && SelectedRoom?.userTyping?.status){
                    if(ws_onmessage?.response?.group_id){
                        dispatch(setUserTypeing({
                            user_id:SelectedRoom?.userTyping?.user_id,
                            status:0,
                            to_id:SelectedRoom?.userTyping?.to_id
                        }))
                    }else{
                        dispatch(setUserTypeing({
                            user_id:SelectedRoom?.id,
                            status:0,
                        }))
                    }
                }else if(ws_onmessage?.response?.from_id === SelectedRoom?.userTyping?.user_id && SelectedRoom?.userTyping?.status){
                    if(ws_onmessage?.response?.group_id){
                        dispatch(setUserTypeing({
                            user_id:SelectedRoom?.userTyping?.user_id,
                            status:0,
                            to_id:SelectedRoom?.userTyping?.to_id
                        }))
                    }else{
                        dispatch(setUserTypeing({
                            user_id:SelectedRoom?.id,
                            status:0,
                        }))
                    }
                }
                if(ws_onmessage?.response?.is_edited !== true ){
                    dispatch(SetFilterChatMessagesList({
                        ...ws_onmessage?.response,
                        id:ws_onmessage?.response?.id
                    }));
                }

                let last_update = ""
                if(data?.length>0){
                    last_update = data[data?.length - 1]?.updated_at;
                }

                if(
                    location_id === ws_onmessage?.response?.group_id ||
                    (ws_onmessage?.request?.chat_type === "single" && userLogin?.user_id === ws_onmessage?.response?.to_id && ws_onmessage?.response?.from_id===location_id )
                ){
                    if(ws_onmessage?.response?.group_id !== undefined){
                        if(ws_onmessage?.response?.from_id !== userLogin?.user_id)
                        CommanSeenAndDelivered(ws_onmessage?.response?.group_id, ws_onmessage?.response?.id, location_id, ws, "group");
                    }else if((ws_onmessage?.request?.chat_type === "single" && userLogin?.user_id === ws_onmessage?.response?.to_id && ws_onmessage?.response?.from_id===location_id )){
                        CommanSeenAndDelivered(ws_onmessage?.response?.from_id, ws_onmessage?.response?.id, location_id, ws, "single");
                    }else if(ws_onmessage?.response?.from_id === userLogin?.user_id){
                        CommanSeenAndDelivered(ws_onmessage?.response?.from_id, ws_onmessage?.response?.id, location_id, ws, "single");
                    }
                }else if(userLogin?.user_id !== ws_onmessage?.response?.from_id){
                    if(ws_onmessage?.response?.group_id !== undefined){
                        if(ws_onmessage?.response?.from_id !== userLogin?.user_id)
                        CommanSeenAndDelivered(ws_onmessage?.response?.group_id, ws_onmessage?.response?.id, location_id, ws, "group");
                    }else{
                        CommanSeenAndDelivered(ws_onmessage?.response?.from_id, ws_onmessage?.response?.id, location_id, ws, "single");
                    }
                }else{
                    if(
                        ws_onmessage?.response?.group_id !== undefined &&
                        ws_onmessage?.response?.group_id ===location_id &&
                        ws_onmessage?.response?.from_id !== userLogin?.user_id
                    ){
                        let add_deliver = {
                            "transmit":"broadcast",
                            "url":"add_seen_delivered",
                            "request":{
                                "to_id":ws_onmessage?.response?.group_id,
                                "chat_ids":ws_onmessage?.response?.id,
                                "chat_type":"group"
                            }
                        }
                        wsSend_request(ws, add_deliver);
                    }
                }
                if(SelectedRoom?.id === location_id)
                    dispatch(UpdateMediaFiles(SelectedRoom))

                if(ws_onmessage?.response?.from_id === userLogin?.user_id){
                    await SendNotificationAPI(access_token, ws_onmessage?.response?.notification_id);
                }
                // Calling comman getchats
                if(ws_onmessage?.response?.from_id !== userLogin?.user_id){
                    if(ws_onmessage?.request?.chat_type === "single"){
                        if(MessageList[ws_onmessage?.response?.from_id]){
                            const lastmessages = MessageList[ws_onmessage?.response?.from_id];
                            const Updated_at = lastmessages[lastmessages?.length - 1];
                            if( ws_onmessage?.response?.from_id !== location_id)
                            CallGetChats( ws,ws_onmessage?.response?.from_id, ws_onmessage?.request?.chat_type, Updated_at?.updated_at);
                        }else{
                            if( ws_onmessage?.response?.from_id !== location_id)
                            CallGetChats( ws, ws_onmessage?.response?.from_id, ws_onmessage?.request?.chat_type, "");
                        }
                    }else if(ws_onmessage?.request?.chat_type === "group"){
                        if(MessageList[ws_onmessage?.response?.group_id]){
                            const lastmessages = MessageList[ws_onmessage?.response?.group_id];
                            const Updated_at = lastmessages[lastmessages?.length - 1];
                            if( ws_onmessage?.response?.group_id !== location_id)
                            CallGetChats( ws, ws_onmessage?.response?.group_id, "group", Updated_at?.updated_at);
                        }else{
                            if( ws_onmessage?.response?.group_id !== location_id)
                            CallGetChats( ws, ws_onmessage?.response?.group_id, "group", "");
                        }
                    }
                }
                // MsgScrollDown();
                break;
            case "get_detail":
                if(ws_onmessage?.response === {}){
                    dispatch(setGoBackFromSelect(true));
                }else{
                    const isContact = userLogin?.Contacts?.filter((item)=>item.id === ws_onmessage?.response?.id)?.length===0?true:false
                    const isRooms = Rooms?.filter((item)=>item.id === ws_onmessage?.response?.id)?.length===0?true:false

                    if(location_id === ws_onmessage?.response?.id && (isContact === false && isRooms === false)){
                        dispatch(getSelectRoomsDetails(ws_onmessage?.response));
                        if(ws_onmessage?.request?.chat_type === "group")
                            dispatch(SetDetailsList(ws_onmessage?.response));

                    }else{
                        if(location_id === ws_onmessage?.response?.id){
                            dispatch(getSelectRoomsDetails(ws_onmessage?.response));
                        }
                        dispatch(setUpdateMessagesList(ws_onmessage?.response));

                        // if(isContact){
                        //     wsSend_request(ws, {"transmit":"single", "url":"get_contacts"});
                        // }
                    }
                    if(ws_onmessage?.response?.id === location_id &&  ws_onmessage?.response?.admin_ids){
                        if(SelectedRoom?.createdUser === undefined){
                            const checkIn_contact = Contacts?.filter((item)=>ws_onmessage?.response?.created_by === item?.id);
                            const CheckGroup = SelectedRoom?.users?.filter((item)=>ws_onmessage?.response?.created_by === item?.id);
                            if(checkIn_contact?.length === 0 && CheckGroup?.length === 0){
                                // console.log("currectUser")
                                CommanGetdetails(ws, ws_onmessage?.response?.created_by, "single");
                            }
                        }
                    }else if(ws_onmessage?.response?.groups && location_id === SelectedRoom?.id){
                            if(SelectedRoom?.created_by === ws_onmessage?.response?.id){
                                // console.log("currectUser")
                                dispatch(setGroupCreatedUser(ws_onmessage?.response));
                            }
                    }
                    if(ws_onmessage?.request?.chat_type === "group"){
                        dispatch(SetDetailsList(ws_onmessage?.response));
                    }

                    if(ws_onmessage?.request?.chat_type === "single"){
                        dispatch(setUsersDetailsList(ws_onmessage?.response));
                    }

                        dispatch(setGoBackFromSelect(false));
                }
                if(ws_onmessage?.request?.chat_type === "single" && ws_onmessage?.request?.to_id === location_id){
                    wsSend_request(ws, {"transmit":"single", "url":"online_status", "request":{"user_id":ws_onmessage?.request?.to_id}})
                }
                break;
            case "delete_message":
                const CheckSaved = SavedMessages?.filter((item)=>item?.chat_id === ws_onmessage?.request?.chat_id);
                if(CheckSaved?.length>0){
                    dispatch(removeSaveMessageList({id:ws_onmessage?.request?.chat_id}));
                }

                    dispatch(SetUpdateChatMessagesList({
                        ...ws_onmessage?.response,
                        id:ws_onmessage?.response?.id
                    }));
                if(SelectedRoom?.id === location_id){
                    dispatch(deleteMessage(ws_onmessage?.response));
                    dispatch(UpdateMediaFiles(SelectedRoom))
                }
                break;
            case "unsubscribe_group":
                if(ws_onmessage?.response?.id === location_id){
                    // console.log("subscribe_group", ws_onmessage)
                    if(ws_onmessage?.response?.message?.is_edited !== true ){
                        dispatch(setAddChatInMessageList({
                            request:{...ws_onmessage?.request, to_id:ws_onmessage?.response?.id},
                            response:ws_onmessage?.response?.message,
                        }));
                        MsgScrollDown(10);
                    }
                }
                if(ws_onmessage?.request?.unsubscribe_id === userLogin?.user_id){
                    dispatch(RemoveGroupsFromRooms(ws_onmessage?.response));
                    // console.log("left_group", ws_onmessage?.response)
                    // navigate("/Chat")
                    if(location_id === ws_onmessage?.response?.id ){
                        dispatch(getSelectRoomsDetails({}))
                        dispatch(mainTabChange("Chat"))
                        dispatch(setGoBackFromSelect(true));
                    }
                }else{
                    dispatch(SetFilterChatMessagesList({
                        ...ws_onmessage?.response?.message,
                        id:ws_onmessage?.response?.message?.id
                    }));
                }


                // const Add_seenDelivered = null;
                // if(ws_onmessage?.response?.id === location_id){
                //     const Add_seenDelivered = {
                //         "transmit":"broadcast",
                //         "url":"add_seen_delivered",
                //         "request":{
                //             "to_id":ws_onmessage?.response?.message?.group_id,
                //             "chat_ids":ws_onmessage?.response?.message?.id,
                //             "chat_type":"group"
                //         }
                //     }
                //     wsSend_request(ws, Add_seenDelivered);
                // }else{
                //     const Add_seenDelivered = {
                //         "transmit":"broadcast",
                //         "url":"add_delivered",
                //         "request":{
                //             "to_id":ws_onmessage?.response?.message?.group_id,
                //             "chat_id":ws_onmessage?.response?.message?.id,
                //             "chat_type":"group"
                //         }
                //     }
                //     wsSend_request(ws, Add_seenDelivered);
                // }
                CommanSeenAndDelivered(ws_onmessage?.response?.id, ws_onmessage?.response?.message?.id, location_id, ws, "group");

                CommanGetdetails(ws, ws_onmessage?.request?.group_id, "group");

                // wsSend_request(ws, {"transmit":"single", "url":"get_groups"});
                await SendNotificationAPI(access_token, ws_onmessage?.response?.notification_id);
                break;
            case "subscribe_group":
                if(ws_onmessage?.response?.id === location_id){
                // console.log("subscribe_group", ws_onmessage)
                    if(ws_onmessage?.response?.message?.is_edited !== true ){
                        dispatch(setAddChatInMessageList({
                            request:{...ws_onmessage?.request, to_id:ws_onmessage?.response?.id},
                            response:ws_onmessage?.response?.message,
                        }));
                        MsgScrollDown(10);
                    }
                }
                dispatch(SetFilterChatMessagesList({
                    ...ws_onmessage?.response?.message,
                    id:ws_onmessage?.response?.message?.id
                }));
                // Command seen and delivered function
                CommanSeenAndDelivered(ws_onmessage?.response?.id, ws_onmessage?.response?.message?.id, location_id, ws, "group");


                CommanGetdetails(ws, ws_onmessage?.request?.group_id, "group");

                // wsSend_request(ws, {"transmit":"single", "url":"get_groups"});
                await SendNotificationAPI(access_token, ws_onmessage?.response?.notification_id)
                break;
            case "update_group":
                CommanGetdetails(ws, ws_onmessage?.request?.group_id, "group");
                dispatch(SetUpdateGroupListFilter(ws_onmessage?.response));
                if(ws_onmessage?.response?.id === location_id){
                // console.log("subscribe_group", ws_onmessage)
                    if(ws_onmessage?.response?.message?.is_edited !== true ){
                        dispatch(setAddChatInMessageList({
                            request:{...ws_onmessage?.request, to_id:ws_onmessage?.response?.id},
                            response:ws_onmessage?.response?.message,
                        }));
                        MsgScrollDown(10);
                    }
                }
                await SendNotificationAPI(access_token, ws_onmessage?.response?.notification_id)
                break;
            case "update_broadcast_group":
                wsSend_request(ws, {"transmit":"single", "url":"get_broadcast_detail","request":{"broadcast_id":ws_onmessage?.request?.broadcast_id}});
                dispatch(SetUpdateGroupListFilter(ws_onmessage?.response))
                // await SendNotificationAPI(access_token, ws_onmessage?.response?.notification_id)
                break;
            case "add_seen_delivered":
                const Splite_msg = ws_onmessage?.response?.map((item)=>{
                    if(item?.broadcast_id){
                        dispatch(SetBroadcastMessagesUpdate({
                            ...item,
                            id:item?.broadcast_chat_id
                        }));
                    }
                    if(item?.broadcast_chat_id && item?.from_id === userLogin?.user_id){
                        return{
                            ...item,
                            id:item?.broadcast_chat_id,
                        }
                    }else{
                        return item
                    }
                })
                // console.log("add_delivereds", Splite_msg, ws_onmessage)
                if(ws_onmessage?.response?.length>0 && (
                    ws_onmessage?.user_id === location_id
                )){
                    // console.log("add_delivereds", Splite_msg, ws_onmessage)
                    if(ws_onmessage?.request?.chat_type === "group"){
                        if(ws_onmessage?.request?.to_id === location_id){
                            // console.log("add_delivereds", Splite_msg, ws_onmessage)
                            dispatch(SetMembersListSeenMessages({response:Splite_msg, request:{...ws_onmessage?.request,to_id:ws_onmessage?.request?.to_id}}))
                        }
                    }else{
                            // console.log("add_delivereds", Splite_msg, ws_onmessage)
                            dispatch(SetMembersListSeenMessages({response:Splite_msg, request:{...ws_onmessage?.request,to_id:ws_onmessage?.user_id}}))
                    }
                }else if(ws_onmessage?.response?.length>0 && (
                    ws_onmessage?.request?.to_id === location_id
                )){
                    // console.log("add_delivereds", Splite_msg, ws_onmessage)
                        dispatch(SetMembersListSeenMessages({response:Splite_msg, request:{...ws_onmessage?.request,to_id:ws_onmessage?.request?.to_id}}))
                    // dispatch(SetUpdateMessagesSeenDelivered({response:Splite_msg, request:ws_onmessage?.request}))
                }else{
                    if(ws_onmessage?.response?.from_id === userLogin?.user_id){
                        // console.log("add_delivereds", Splite_msg, ws_onmessage);
                        dispatch(SetUpdateMessagesSeenDelivered({response:Splite_msg, request:ws_onmessage?.request}))
                    }
                }
                if(userLogin?.user_id === ws_onmessage?.user_id && ws_onmessage?.request?.to_id !== location_id){
                    dispatch(SetMessageSeenByUser({response:Splite_msg, request:ws_onmessage?.request, to_id:ws_onmessage?.request?.to_id}))
                }
                break;
            case "add_seen":
                const Splite_msg12 = ws_onmessage?.response?.map((item)=>{
                    if(item?.broadcast_chat_id && item?.from_id === userLogin?.user_id){
                        if(item?.broadcast_id){
                            dispatch(SetBroadcastMessagesUpdate({
                                ...item,
                                id:item?.broadcast_chat_id
                            }));
                        }
                        return{
                            ...item,
                            id:item?.broadcast_chat_id,
                        }
                    }else{
                        return item
                    }
                })
                // console.log("add_delivereds", Splite_msg12, ws_onmessage)
                if(ws_onmessage?.response?.length>0 && (
                    ws_onmessage?.user_id === location_id
                )){
                    if(ws_onmessage?.request?.chat_type === "group"){
                        if(ws_onmessage?.request?.to_id === location_id){
                            // console.log("add_delivereds", Splite_msg12, ws_onmessage)
                            dispatch(SetMembersListSeenMessages({response:Splite_msg12, request:{...ws_onmessage?.request,to_id:ws_onmessage?.request?.to_id}}))
                        }
                    }else{
                        // console.log("add_delivereds", Splite_msg12, ws_onmessage)
                        dispatch(SetMembersListSeenMessages({response:Splite_msg12, request:{...ws_onmessage?.request,to_id:ws_onmessage?.user_id}}))
                    }
                }else if(ws_onmessage?.response?.length>0 && (
                    ws_onmessage?.request?.to_id === location_id
                )){
                    // console.log("add_delivereds", Splite_msg12, ws_onmessage)
                        dispatch(SetMembersListSeenMessages({response:Splite_msg12, request:{...ws_onmessage?.request,to_id:ws_onmessage?.request?.to_id}}))
                    // dispatch(SetUpdateMessagesSeenDelivered({response:Splite_msg, request:ws_onmessage?.request}))
                }else{
                    if(ws_onmessage?.response?.from_id === userLogin?.user_id){
                        // console.log("add_delivereds", Splite_msg12, ws_onmessage);
                        dispatch(SetUpdateMessagesSeenDelivered({response:Splite_msg12, request:ws_onmessage?.request}))
                    }
                }
                if(userLogin?.user_id === ws_onmessage?.user_id && ws_onmessage?.request?.to_id !== location_id){
                    dispatch(SetMessageSeenByUser({response:Splite_msg12, request:ws_onmessage?.request, to_id:ws_onmessage?.request?.to_id}))
                }
                break;
            case "left_group":
                if(ws_onmessage?.user_id === userLogin?.user_id && (ws_onmessage?.response?.id === SelectedRoom?.id || ws_onmessage?.response?.id === location_id)){
                    dispatch(RemoveGroupsFromRooms(ws_onmessage?.response));
                    // console.log("left_group", ws_onmessage?.response)
                    // navigate("/Chat")
                    dispatch(getSelectRoomsDetails( {}))
                    dispatch(mainTabChange("Chat"))
                    if(location_id === ws_onmessage?.response?.id ){
                        dispatch(setGoBackFromSelect(true));
                    }
                    await SendNotificationAPI(access_token, ws_onmessage?.response?.notification_id);
                    wsSend_request(ws, {"transmit":"single", "url":"get_groups"});
                }else{
                    if(ws_onmessage?.request?.group_id === location_id){
                        dispatch(setAddChatInMessageList({
                            request:{...ws_onmessage?.request, to_id:ws_onmessage?.response?.message?.group_id},
                            response:ws_onmessage?.response?.message,
                        }));
                        CallGetChats(ws, ws_onmessage?.response?.message?.group_id, "group", ws_onmessage?.response?.message?.created_at)

                        
                    }
                    dispatch(SetFilterChatMessagesList({
                        ...ws_onmessage?.response?.message,
                        id:ws_onmessage?.response?.message?.id
                    }));

                    CommanGetdetails(ws, ws_onmessage?.request?.group_id, "group");
                }
                // wsSend_request(ws, {"transmit":"single", "url":"get_contacts"});
                break;
            case "save_message":
                if(MainTabsSelected === "savedmessage" ){
                    wsSend_request(ws,  {"transmit":"single", "url":"get_save_message_all","request":{"updated_at":""}});
                }
                if(ws_onmessage?.request?.to_id === location_id){
                    let paramS = {
                        "transmit":"single",
                        "url":"get_save_message",
                        "request":{
                            "to_id":ws_onmessage?.request?.to_id,
                            "chat_type":ws_onmessage?.request?.chat_type,
                        }
                    }
                    
                    wsSend_request(ws, paramS);
                }
                // dispatch(setNewMessageSave({
                //     id:ws_onmessage?.response?.to_id,
                //     response:ws_onmessage?.response
                // }))

                // wsSend_request(ws,  {"transmit":"single", "url":"get_save_message_all","request":{"updated_at":""}});
                break;
            case "remove_save_message":
                    // dispatch(removeSaveMessageList({id:ws_onmessage?.request?.chat_id}));
                    if(MainTabsSelected === "savedmessage" ){
                        wsSend_request(ws,  {"transmit":"single", "url":"get_save_message_all","request":{"updated_at":""}});
                    }
                    if(ws_onmessage?.request?.to_id === location_id){
                        let ParamS = {
                            "transmit":"single",
                            "url":"get_save_message",
                            "request":{
                                "to_id":ws_onmessage?.request?.to_id,
                                "chat_type":ws_onmessage?.request?.chat_type,
                            }
                        }
                        
                        wsSend_request(ws, ParamS);
                    }
                break;
            case "user_update" :
                if(ws_onmessage?.response?.id === userLogin?.user_id ) {
                    dispatch(setMyProfile(ws_onmessage?.response));
                }else{
                    
                }
                break;
            case "user_update_device":
                dispatch(setRegisterdDevice(ws_onmessage?.request?.registration_id));
                break;
            case "user_logout":
                if(userLogin?.token_id === ws_onmessage?.token_id){
                    dispatch(CallLogoutUser());
                }
                break;
            case "add_broadcast_group":
                wsSend_request(ws,{"transmit":"single", "url":"get_broadcast_groups"});
                break;
            case "get_broadcast_groups":
                // console.log("ws_onmessage?.request", ws_onmessage?.request)
                dispatch(setAddBroadCastGroup(ws_onmessage?.response));
                ws_onmessage?.response?.map((item)=>{
                    if(!MessageList[item?.id]){
                        dispatch(CallCommanGetchatBroadcast(item?.id, "broadcast_id", "get_broadcast_chats"));
                    }
                    const checkAvailable = BroadcastList[item?.id];
                    if(checkAvailable){

                    }else{
                        wsSend_request(ws,{"transmit":"single", "url":"get_broadcast_detail","request":{"broadcast_id": item?.id}});
                    }
                })
                break;
            case "add_system_chat": 
                // dispatch(setAddSystemGroup(ws_onmessage?.response));
                // console.log("system message =========>", ws_onmessage?.response, location_id)
                // dispatch(newMessageSend(ws_onmessage?.response));
                // wsSend_request(ws,{"transmit":"single", "url":"get_chat"});
                if (ws_onmessage?.request?.to_id === location_id) {
                    dispatch(setAddChatInMessageList({
                        request:{...ws_onmessage?.request, to_id:ws_onmessage?.response?.system_group_id},
                        response:ws_onmessage?.response,
                    }));
                    MsgScrollDown(10);
                };
                
                break;
            case "get_system_groups":
                // console.log("ws_onmessage?.request", registration_id)
                dispatch(setAddSystemGroup(ws_onmessage?.response));
                ws_onmessage?.response?.map((item)=>{
                    dispatch(SetDetailsList(item));
                    if(!MessageList[item?.id]){
                        dispatch(CallCommanGetchatBroadcast(item?.id, "to_id", "get_system_chat"));
                    }
                });
                break;
            case "get_broadcast_detail":
                // console.log("ws_onmessage?.request", ws_onmessage?.request);
                // console.log("ws_onmessage?.response", ws_onmessage?.response)
                dispatch(setDetailsBroadcastList(ws_onmessage?.response));
                if(ws_onmessage?.request?.broadcast_id === location_id)
                dispatch(setSelectedBroadCastList( ws_onmessage?.response))
                else{
                    dispatch(updateBroadcastGroupList(ws_onmessage?.response));
                }
                break;
            case "unsubscribe_broadcast_group":
                wsSend_request(ws,{"transmit":"single", "url":"get_broadcast_detail","request":{"broadcast_id": ws_onmessage?.request?.broadcast_id}});
                break;
            case "subscribe_broadcast_group":
                wsSend_request(ws,{"transmit":"single", "url":"get_broadcast_detail","request":{"broadcast_id": ws_onmessage?.request?.broadcast_id}});
                break;
            case "delete_broadcast_group":
                dispatch(RemoveGroupsFromRooms(ws_onmessage?.response));
                // console.log("left_group", ws_onmessage?.response)

                if(location_id === ws_onmessage?.response?.id ){
                    dispatch(setGoBackFromSelect(true));
                    dispatch(getSelectRoomsDetails( {}))
                    dispatch(mainTabChange("Chat"))
                }
                break;
            case "typing":
                // console.log("ws_onmessage?.request?.url", ws_onmessage?.user_id, userLogin?.user_id);
                if(ws_onmessage?.user_id !== userLogin?.user_id){
                    // console.log("ws_onmessage?.request?.url", ws_onmessage?.request?.response);
                    if(ws_onmessage?.request?.chat_type === "group"){
                        if(UserDetails[ws_onmessage?.user_id]){
                            dispatch(setUserTypeing({
                                to_id:ws_onmessage?.request?.to_id,
                                user_id:ws_onmessage?.user_id,
                                status:1
                            }));
                        }else{
                            CommanGetdetails(ws, ws_onmessage?.user_id, "single")
                        }
                    }else{
                        // console.log("ws_onmessage?.request?.url", ws_onmessage, userLogin?.user_id);
                        dispatch(setUserTypeing({
                            user_id:ws_onmessage?.user_id,
                            to_id:undefined,
                            status:1
                        }));
                    }
                    MsgScrollDown(10)
                }
                break;
            case "get_save_message":
                    dispatch(setSaveChatList({
                        id:ws_onmessage?.request?.to_id,
                        response:ws_onmessage?.response
                    }))
                break;
            case "online_status":
                if(ws_onmessage?.request?.user_id === location_id && SelectedRoom?.id === ws_onmessage?.request?.user_id){
                    if(SelectedRoom?.online !== ws_onmessage?.response?.login_count){
                        dispatch(selectRoom({
                            ...SelectedRoom,
                            online:ws_onmessage?.response?.login_count
                        }))
                    }
                }
                break;
            case "add_contacts":
                setTimeout(()=>{
                    dispatch(GetUpdateContact(access_token))
                    setTimeout(()=> wsSend_request(ws, {"transmit":"single", "url":"get_contacts"}), 100)
                }, 4000)
                break;
            case "chat_detail":
                 dispatch(setReplaySaveChatMessages(ws_onmessage?.response));
                break;
            case "user_types":
                dispatch(setStoreUserTypes(ws_onmessage?.response));
                break;
            case "logout":
                dispatch(CallLogoutUser());
                break;
            default:
                return;
        }
    })
}