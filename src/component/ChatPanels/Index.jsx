/* eslint-disable */
import React, { useEffect, useState, useContext } from "react";
import Header from "./Header";
import ChatMessagesPanel from "./ChatMessagesPanel";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { selectRoom, setMessages, newMessageSend, saveMessage, SetSeenAtMessages, GetAllUsersList, contactList, setOpenModalPopup, setGoBackFromSelect, setSelectedBroadCastList, getSelectRoomsDetails, SetPaginationList } from "../../redux/actions";
import wsSend_request from "../../Api/ws/ws_request";
import { WebSocketContext } from "../Index";
import moment from "moment";

export function PaginationList(array, page_size, page_number) {
    if(array){
        return array?.sort(( a, b )=> {
            return  moment.utc(b.created_at) -  moment.utc(a.created_at)
    })?.slice((page_number - 1) * page_size, page_number * page_size);
    }else{
        return [];
    }
}

const Index = (props) => {
    const { 
        setGroupInfoSidebar,
        groupInfoSidebar,
        setMessagesInfoSidebar,
        MessageInfoSidebar,
        callMessageInfo,
        SetUserOnlinestatus,
        userOnlinestatus
    } = props;
    const { roomId } = useParams();
    const memberslist = useSelector((state) => state.allReducers.Rooms);
    const DetailsList = useSelector((state) => state.allReducers.DetailsList);
    const MessageList = useSelector((state) => state.allReducers.MessageList);
    const Contacts = useSelector((state) => state.allReducers.Contacts);
    const UserId = useSelector((state) => state.allReducers.userLogin.user_id);
    const userLogin = useSelector((state) => state.allReducers.userLogin);
    const accessToken = useSelector((state) => state.allReducers.access_token);
    const GoBackToHome = useSelector((state) => state.allReducers?.GoBackToHome);
    const pagination = useSelector((state) => state.allReducers?.pagination);
    const [ selectId, setSelectId ] = useState("");
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const MessagesAllList = useSelector((state) => state?.allReducers?.MessageList[roomId]);
    // console.log("roomId==========>", roomId)
    // const Messages = PaginationList(MessagesAllList, pagination?.page_size, pagination?.page_number);
    const [ heightManage, setHeightManage ] = useState('50');
    const [ picker, setpicker ] = useState(false);
    const [ MessageStatus, setMessageStatus ] = useState({
        payload: {},
        event_url: "new_msg"
    })
    const [ imageUploads, setImageUploads ] = useState("");
    const [ replySelectMessage, setReplySelectMessage ] = useState({
        id: ""
    });
    let imageUploadList = [...imageUploads];
    const { websocket } = useContext(WebSocketContext);
    const [ MessageToId, setMessageToId ] = useState({
        to_id: "",
        Message_id: "",
    });
    const [ isMessageEmpty, setIsMessageEmpty ] = useState({
        emojiIstrue: false,
        messageIstrue: false,
        dropdownIstrue: false,
    });
    const [ editMessageUpdate, setEditMessageUpdate ] = useState({
        id: "",
        message: "",
    });
    const [ uploadfileBox, setuploadfileBox ] = useState(false);
    const isOpenFireFoxBrowser = navigator.userAgent.indexOf("Firefox") != -1;
    const [ isEditing, setIsEditing ] = useState(false);
    const { scroll_chat_id, SelectedRoom } = useSelector((state) => state?.allReducers);
    useEffect(()=>{
        MainTainPaginationList();
        return()=>{
            dispatch(SetPaginationList({
                page_data:[],
                page_size:50,
                page_number:1
            }))
        }
    }, [roomId]);

    const MainTainPaginationList = () =>{
        if(pagination){
            const DataList = PaginationList(MessagesAllList, 50, 1);
            if(DataList){
                dispatch(SetPaginationList({
                    page_data:DataList?.reverse(),
                    page_size:50,
                    page_number:1
                }))
            }
        }else{
            dispatch(SetPaginationList({
                page_data:[],
                page_size:50,
                page_number:1
            }))
        }
    }
    // scroll message down function
    // const ScrollDownMessage = () => {
    //     var ChatScrollMessage = document.getElementById("CHatcustomscrollid");
    //     ChatScrollMessage.scrollIntoView({ block: 'end' });
    // }
    
    // useEffect(() => {
    //     console.log("isMessageEmpty", isMessageEmpty);
    //     if(isMessageEmpty.messageIstrue !== true && isMessageEmpty.emojiIstrue !== true){
    //         ScrollDownMessage();
    //     }
    // }, [ ScrollDownMessage ]);
    const MsgScrollDown = (time) => {
        if(scroll_chat_id?.to_id !== roomId){
            setTimeout(() => {
                var element = document.getElementById("chatPanelScroll");
                element?.scrollIntoView({ block: 'end' });
            }, time);
        }
    }
    const EditDeleteStopScrolling = () => {
        console.log("isEditing", isEditing)
        if(isEditing !== true) {
            MsgScrollDown(10);
        }
    }

    // // Get All user list
    // let AllUserList = [];
    // memberslist?.filter((usecheck) => {
    //     if(usecheck.id !== undefined) {
    //         DetailsList[usecheck?.id]?.users?.filter((user) => {
    //             AllUserList.push(user);
    //             dispatch(GetAllUsersList(AllUserList));
    //         })
    //     }
    // })

    // Edit or Delete type use only
    // useEffect(() => {
    //     // EditDeleteStopScrolling();
    //  }, [Messages]);

    // get current room details data
    const fetchSelectedRooms = () => {
        if(roomId !== SelectedRoom?.id){
            props?.setSideBarLoader(true)
            let elm = [];
            elm = memberslist?.filter((item) => {
                if(item?.id === roomId) {
                    return item;
                }
            })
            if(elm?.length===0){
                elm = Contacts.filter((item) => {
                    if(item?.id === roomId) {
                        return item;
                    }
                })
            }
            let param = null;
            if(elm?.length>0){
                if(elm[0]?.group_type){
                    dispatch(getSelectRoomsDetails(elm[0]));
                    param = null
                }else if(elm[0]?.admin_ids){
                 param = {"transmit":"single", "url":"get_detail","request":{"to_id":elm[0]?.id, "chat_type":elm[0]?.admin_ids === undefined?"single":"group"}}
                }else if(elm[0]?.admin_id){
                    // console.log("elm", elm)
                    // dispatch(setSelectedBroadCastList(elm[0]))
                    param = {"transmit":"single", "url":"get_broadcast_detail","request":{"broadcast_id": elm[0]?.id}}
                }else if(elm[0]?.name){
                    param = {"transmit":"single", "url":"get_detail","request":{"to_id":elm[0]?.id, "chat_type":"single"}}
                }
            }else{
                // console.log("elm", elm)
                param = {"transmit":"single", "url":"get_detail","request":{"to_id":roomId, "chat_type":"single"}}
            }
            if(param!==null){
                wsSend_request(websocket, param);
                setTimeout(()=>dispatch(selectRoom(elm)), 100)
            }
            RemoveReplyMessageFnt();
        }
        setTimeout(()=>props?.setSideBarLoader(false), 1000)
        // dispatch(setMessages(ChatData));
    };
    const CallSelectdetails = () => {
            let elm = {};
            elm = memberslist?.filter((item) => {
                if(item?.id === roomId) {
                    return item;
                }
            })
            if(elm?.length===0){
                elm = Contacts.filter((item) => {
                    if(item?.id === roomId) {
                        return item;
                    }
                })
            }
            const param = {"transmit":"single", "url":"get_detail","request":{"to_id":SelectedRoom?.id, "chat_type":SelectedRoom?.admin_ids === undefined?"single":"group"}}
            wsSend_request(websocket, param);
            dispatch(selectRoom(elm));
            RemoveReplyMessageFnt();
        // dispatch(setMessages(ChatData));
    };

    // shift inter insertLineBreak and only enter send message function
    const RemovedEnterSpaceTextfield = () => {
        var input = document.getElementById("messagFieldID");
        input.addEventListener('keypress', (e) => {
            if (e.which === 13) e.preventDefault();   
            if (e.shiftkey && e.which === 13 ) document.execCommand('insertLineBreak');
            if (e.altKey && e.which === 13 ) document.execCommand('insertLineBreak');
        });
    };

    const onEnterAddBreakdown = (e) => {
        const commentMsgEditMSGID = document.getElementById('messagFieldID');
        const keyCode = e.which || e.keyCode;
        if(keyCode === 13 && e.shiftKey || keyCode === 13 && e.altKey) {
            if(isOpenFireFoxBrowser !== true) {
                e.preventDefault();
                document.execCommand('insertLineBreak');
                MsgScrollDown(10);
            } else {
                e.preventDefault();
                document.execCommand("insertHtml", false, " ");
                document.execCommand('insertParagraph',false, ''); 
                MsgScrollDown(10);
            } 
            if(e.target.clientHeight > 227) {
                commentMsgEditMSGID.scrollTop = heightManage + 500;           
            }
        }
    };
    
    // get chat messages 
    const getChat = () => {
        if(SelectedRoom?.id === roomId){
            const old = MessageList[roomId]
            let update_at = ""
            if(old?.length>0){
                update_at = old[old?.length - 1]?.updated_at
            }
            if(SelectedRoom?.group_type){
                if( old?.length>0){
                    let param = {
                        "transmit":"single",
                        "url":"get_system_chat",
                        "request":{
                            "to_id":roomId,
                            "updated_at":update_at
                        }
                    }
                    
                    wsSend_request(websocket, param);
                }else{
                    let param = {
                        "transmit":"single",
                        "url":"get_system_chat",
                        "request":{
                            "to_id":roomId,
                            "updated_at":"",
                            "is_limit":500
                        }
                    }
                    
                    wsSend_request(websocket, param);
                }
            }else{
                if(SelectedRoom?.isBroadCast===true && old?.length>0){
                    let param = {
                        "transmit":"single",
                        "url":"get_broadcast_chats",
                        "request":{
                            "broadcast_id":roomId,
                            "updated_at":update_at
                        }
                    }
                    wsSend_request(websocket, param);
                }else if(old?.length>0){
                    let param = {
                        "transmit":"single", 
                        "url":"get_chats",
                        "request": {
                            "chat_type": SelectedRoom?.admin_ids === undefined ? "single" : "group",
                            "to_id": roomId, 
                            "updated_at": update_at,
                        }
                    }
                    wsSend_request(websocket, param);
                }else{
                    if(SelectedRoom?.isBroadCast===true){
                        let param = {
                            "transmit":"single",
                            "url":"get_broadcast_chats",
                            "request":{
                                "broadcast_id":roomId,
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
                                "chat_type": SelectedRoom?.admin_ids === undefined ? "single" : "group",
                                "to_id": roomId, 
                                "updated_at": "",
                                "is_limit":500
                            }
                        }
                        wsSend_request(websocket, param);
                    }
                }
            }
            // MsgScrollDown(10);
        }
        
    }
    useEffect(() => {
        getSaveChat();
        MsgScrollDown(300)
    }, []);
    // call list back function
    const CallBackChatList = (msg) =>{
        const param = {
            "transmit":"single",
            "url":"get_chats",
            "request":{
                "chat_type": SelectedRoom?.admin_ids === undefined ? "single" : "group",
                "to_id":roomId,
                "updated_at":msg?.updated_at,
                "is_reverse":1
            }
        }
        // console.log("msg", param)
        wsSend_request(websocket, param);
    }
    useEffect(()=>{
            fetchSelectedRooms();
        // getChat();
    },[roomId, SelectedRoom])

    useEffect(()=>{
        getChat();
        // console.log("MessageList",Messages)
    },[SelectedRoom?.id])
    useEffect(() => {
        setuploadfileBox(false);

    }, [ SelectedRoom ]);

    
    useEffect(() => {
        // fetchSelectedRooms();
        RemovedEnterSpaceTextfield();
    }, [ roomId, memberslist, SelectedRoom ]);

    useEffect(()=>{
        if(SelectedRoom?.id === roomId){
            if((SelectedRoom?.admin_ids === undefined || SelectedRoom?.admin_ids === null) && (SelectedRoom?.admin_id  === undefined || SelectedRoom?.admin_id === null)){
                SetUserOnlinestatus(roomId);
            }else{
                SetUserOnlinestatus("");
            }
        }
        // getChat();
    },[roomId, SelectedRoom])
    // new message and edit message main function
    const SendMessageFun = () => {
        var currentmsghtml = document.getElementById("messagFieldID")?.innerHTML;
        var currentmsgtext = document.getElementById("messagFieldID")?.innerText;
        var currentmsghtmls = currentmsgtext !== ""  && currentmsghtml.replace(/<br>/g, '\n').trim();
        var currentmsgtexts = currentmsgtext.trim();
        
        if(currentmsghtmls !== "" ) {
            let payload = {};
            
            // new message condition 
            if(MessageStatus?.event_url == "new_msg" && (!SelectedRoom?.group_type)) {
                payload = {
                    "transmit":"broadcast", 
                    "url":SelectedRoom?.isBroadCast === undefined?"add_chat":"add_broadcast", 
                    "request":SelectedRoom?.isBroadCast === undefined?{
                        "chat_type":SelectedRoom?.admin_ids!==undefined?"group":"single",
                        "message": currentmsgtexts, 
                        "message_type":"text", 
                        "sender_name":SelectedRoom?.admin_ids!==undefined?SelectedRoom?.group_name:userLogin?.users_detail?.phone,
                        "to_id": SelectedRoom?.id
                    }:{
                        "chat_type":"single",
                        "message": currentmsgtexts, 
                        "message_type":"text", 
                        "broadcast_id": SelectedRoom?.id
                    }
                };
                wsSend_request(websocket, payload);
                setMessageStatus({...MessageStatus, event_url: "new_msg"});
                MsgScrollDown(10);
                TextFieldMessageClear();
            }else if ((MessageStatus?.event_url == "reply_msg"&& SelectedRoom?.isBroadCast === undefined && replySelectMessage?.id!=="") && (!SelectedRoom?.group_type)) {
                payload = {
                    "transmit":"broadcast", 
                    "url":SelectedRoom?.isBroadCast === undefined?"add_chat":"add_broadcast", 
                    "request":SelectedRoom?.isBroadCast === undefined?{
                        "chat_type":SelectedRoom?.admin_ids!==undefined?"group":"single",
                        "sender_name":SelectedRoom?.admin_ids!==undefined?SelectedRoom?.group_name:userLogin?.users_detail?.phone,
                        "message": currentmsgtexts, 
                        "message_type":"text", 
                        "reply_id":replySelectMessage?.id,
                        "to_id": replySelectMessage?.selectRoom
                    }:{
                        "chat_type":"single",
                        "message": currentmsgtexts, 
                        "message_type":"text", 
                        "reply_id":replySelectMessage?.id,
                        "to_id": replySelectMessage?.selectRoom
                    }
                };
                wsSend_request(websocket, payload);
                setMessageStatus({...MessageStatus, event_url: "new_msg"});
                MsgScrollDown(10);
                TextFieldMessageClear();
            } else if(MessageStatus?.event_url == "edit_msg" && SelectedRoom?.isBroadCast === undefined){
                // edit new message condition 
                // console.log("editMessageUpdate", editMessageUpdate, MessageStatus)
                payload = {
                    "transmit":"broadcast", 
                    "url":"add_chat", 
                    "request":{
                        "chat_type": SelectedRoom?.admin_ids!==undefined?"group":"single",
                        "message": currentmsgtexts, 
                        "message_type":"text", 
                        "sender_name":SelectedRoom?.admin_ids!==undefined?SelectedRoom?.group_name:userLogin?.users_detail?.phone,
                        "edit_id": editMessageUpdate?.id,
                        "to_id":editMessageUpdate?.to_id
                    }
                }

                wsSend_request(websocket, payload);
                setMessageStatus({...MessageStatus, event_url: "new_msg"});
                // MsgScrollDown(100);
                TextFieldMessageClear();
            }
            setpicker(false);
        }
        // MsgScrollDown(100);

    };

    // send file function
    const SendImagesFunction = (file_id) => {
        let payload = {};
        console.log("MessageStatus?.event_url", MessageStatus?.event_url)
        // new message condition 
        if(MessageStatus?.event_url == "new_msg"&& (!SelectedRoom?.group_type)) {
            payload = {
                "transmit":"broadcast", 
                "url":SelectedRoom?.isBroadCast === undefined?"add_chat":"add_broadcast", 
                "request":SelectedRoom?.isBroadCast === undefined?{
                    "chat_type":SelectedRoom?.admin_ids!==undefined?"group":"single",
                    "message": file_id, 
                    "sender_name":SelectedRoom?.admin_ids!==undefined?SelectedRoom?.group_name:userLogin?.users_detail?.phone,
                    "message_type":"file", 
                    "to_id": SelectedRoom?.id
                }:{
                    "chat_type":"single",
                    "message": file_id,
                    "message_type":"file", 
                    "broadcast_id": SelectedRoom?.id
                }
            };
            wsSend_request(websocket, payload);
            setMessageStatus({...MessageStatus, event_url: "new_msg"});
            MsgScrollDown(10);
        } else if ((MessageStatus?.event_url == "reply_msg" && SelectedRoom?.isBroadCast === undefined && replySelectMessage?.id!=="") && (!SelectedRoom?.group_type) ) {
            payload = {
                "transmit":"broadcast", 
                "url":"add_chat", 
                "request":{
                    "chat_type":SelectedRoom?.admin_ids!==undefined?"group":"single",
                    "message": file_id, 
                    "sender_name":SelectedRoom?.admin_ids!==undefined?SelectedRoom?.group_name:userLogin?.users_detail?.phone,
                    "message_type":"file", 
                    "reply_id":replySelectMessage?.id,
                    "to_id": replySelectMessage?.selectRoom
                }
            };
            wsSend_request(websocket, payload);
            setMessageStatus({...MessageStatus, event_url: "new_msg"});
            MsgScrollDown(10);
            TextFieldMessageClear();
        } 
    };
    const callUnBlockContact =() =>{
        if(SelectedRoom?.block_by === userLogin?.user_id){
            const payload = {
                Title:``,
                Description:`Unblock ${SelectedRoom?.name||SelectedRoom?.group_name} to send a message`,
                IsShow:true,
                Id:roomId,
                ActionType: {"transmit":"broadcast", "url":"block_user","request":{"is_block":0, "to_id":roomId}},
                callBackList:ActionUnBlockContact,
                ButtonSuccess:"UNBLOCK"
            }
            dispatch(setOpenModalPopup(payload))
        }
    }
    const ActionUnBlockContact =() =>{
        // console.log("Se")
        // wsSend_request(websocket, {"transmit":"broadcast", "url":"block_user","request":{"is_block":0, "to_id":roomId}})
        CallSelectdetails();
        // getChat();
    }
    // useEffect(() => {
    //     if(roomId === SelectedRoom?.id){
    //         if(SelectedRoom?.admin_ids !== undefined){
    //             setTimeout(()=>{
    //                 GetGroupMessagesSeen()
    //             }, 7000)
    //         }else{
    //             setTimeout(()=>{
    //                 GetMessageDelivery();
    //             }, 7000)
    //         }
    //     }
    // }, [SelectedRoom, Messages]);

    // edit message function
    const editMessageFn = (edit_msg) => {
        var currentmsg = document.getElementById("messagFieldID");
        currentmsg.classList.add("whitspaceTextField");
        setTimeout(() => {
            currentmsg.innerHTML = edit_msg?.message; 
            currentmsg.scrollTop = heightManage + 500; 
            // cursor focus contenteditable div
            const el = document.getElementById('messagFieldID');
            const selection = window.getSelection();
            const range = document.createRange();
            selection.removeAllRanges();
            range.selectNodeContents(el);
            range.collapse(false);
            selection.addRange(range);
            el.focus();
            setIsMessageEmpty({...isMessageEmpty, emojiIstrue: false, messageIstrue: true})
        }, 200);
        if(edit_msg?.group_id === undefined){
            setEditMessageUpdate({...editMessageUpdate, id: edit_msg?.id, message: edit_msg?.message, to_id: edit_msg?.to_id})
        }else{
            setEditMessageUpdate({...editMessageUpdate, id: edit_msg?.id, message: edit_msg?.message, to_id: edit_msg?.group_id})
        }
        setIsEditing(true);
        setMessageStatus({...MessageStatus, event_url: "edit_msg", payload: edit_msg});
    }

    // on enter message send fucntion
    const SendMessageOnchange = (e) => {
        const code = e.keycode || e.which;
        let cmntMsg = document.getElementById('messagFieldID').innerHTML;
        let textMsg = document.getElementById('messagFieldID').innerText;
        let cmntMsg_ = document.getElementById('messagFieldID');
        let textMsg_ = textMsg.trim(); //trim text input

        if (code === 13) {
            if (
              (cmntMsg != '' && textMsg_ == '') ||
              (cmntMsg == '' && textMsg_ != '')
            ) {
           // console.log("code", e, cmntMsg);
              SendMessageFun();
              TextFieldMessageClear();
            } else if (cmntMsg != '' && textMsg_ != '') {
            //console.log("code", e, cmntMsg);
            SendMessageFun();
              TextFieldMessageClear();
            } else {
                setTimeout(() => {
                  var child = cmntMsg_.lastElementChild;
                  while (child) {
                    cmntMsg_.removeChild(child);
                    child = cmntMsg_.lastElementChild;
                  }
                }, 100);
            }
        }

    }

    // removed uploaded image function
    const RemoveUplodedImage = (id) => {
        const removeUpdate = imageUploadList.filter((data_) => {
            if(data_.id !== id) {
                return data_;
            }
        })
        setImageUploads(removeUpdate);
    }

    // reply message function
    const ReplyMessage = (message) => {
        
        let displayname = ""
        if(SelectedRoom?.admin_ids !== undefined){
            const check_length =  SelectedRoom?.users?.filter((item)=>item?.id === message?.from_id);
            if(check_length?.length>0){
                displayname = check_length[0]?.name || check_length[0]?.phone
            }
        }else{
            displayname = SelectedRoom?.name || SelectedRoom?.phone
        }
        setReplySelectMessage({
            ...message,
            name: displayname,
            selectRoom:SelectedRoom?.id
        })
        setMessageStatus({...MessageStatus, event_url: "reply_msg"})
        // cursor focus contenteditable div
        const el = document.getElementById('messagFieldID');
        const selection = window.getSelection();
        const range = document.createRange();
        selection.removeAllRanges();
        range.selectNodeContents(el);
        range.collapse(false);
        selection.addRange(range);
        el.focus();
    }

    // removed reply message
    const RemoveReplyMessageFnt = () => {
        setReplySelectMessage({id:"" })
    }

    // send message textfield clear function
    const TextFieldMessageClear = () => {
        // var currentmsg = document.getElementById("messagFieldID");
        // currentmsg.innerHTML = "";
        // setImageUploads("");
        // setMessageStatus({...MessageStatus, event_url: "new_msg"})
        // setHeightManage(50);
        // setIsMessageEmpty({...isMessageEmpty, emojiIstrue: false, messageIstrue: false});
        // RemoveReplyMessageFnt();

        let cmntMsg = document.getElementById('messagFieldID');
        cmntMsg.innerHTML = null;
        setImageUploads("");
        setMessageStatus({...MessageStatus, event_url: "new_msg"})
        setHeightManage(50);
        setIsMessageEmpty({...isMessageEmpty, emojiIstrue: false, messageIstrue: false});
        RemoveReplyMessageFnt();
        setTimeout(() => {
            var child = cmntMsg.lastElementChild;
            while (child) {
                cmntMsg.removeChild(child);
                child = cmntMsg.lastElementChild;
            }
        }, 100);
    };
    const callUserTypeingStatus = (status) =>{
        if(SelectedRoom?.admin_ids === undefined){
            const param = {
                "transmit":"broadcast",
                "url":"typing",
                "request":{
                    "to_id":roomId,
                    "url":"typing",
                    "chat_type":"single",
                    // "response":{"user_id":userLogin?.user_id, "status":status}
                }
            }
            wsSend_request(websocket, param)
        }else if(SelectedRoom?.admin_ids !== undefined){
            const param = {
                "transmit":"broadcast",
                "url":"typing",
                "request":{
                    "to_id":roomId,
                    "url":"typing",
                    "chat_type":"group",
                    // "response":{"user_id":userLogin?.user_id, "status":status, "to_id":roomId}
                }
            }
            wsSend_request(websocket, param)
        }
    }
    // save message functions
    const saveMessageFun = (message, type) => {
        let param = null
        if(message?.system_group_id !== undefined){
            param = {
                "transmit":"broadcast",
                "url":type,
                "request":{
                    "to_id":message?.system_group_id,
                    "chat_id":message?.id,
                    "chat_type":"system_group"
                }
            }
        }else if(message?.broadcast_group_id !== undefined){
            param = {
                "transmit":"broadcast",
                "url":type,
                "request":{
                    "to_id":roomId,
                    "chat_id":message?.id,
                    "chat_type":"broadcast"
                }
            }
        }else{
            param = {
                "transmit":"broadcast",
                "url":type,
                "request":{
                    "to_id":roomId,
                    "chat_id":message?.id,
                    "chat_type":message?.group_id === undefined?"single":"group"
                }
            }
        }
        if(param !== null){
            wsSend_request(websocket, param);
        }
        // dispatch(saveMessage(payload));
    }
    const getSaveChat = () =>{
        if(SelectedRoom?.id === roomId){
            if(SelectedRoom?.group_type){
                let param = {
                    "transmit":"single",
                    "url":"get_save_message",
                    "request":{
                        "to_id":roomId,
                        "chat_type":"system_group",
                    }
                }
                wsSend_request(websocket, param);
            }else{
                if(SelectedRoom?.isBroadCast===true){
                    let param = {
                        "transmit":"single",
                        "url":"get_save_message",
                        "request":{
                            "to_id":roomId,
                            "chat_type":"broadcast",
                        }
                    }
                    
                    wsSend_request(websocket, param);
                }else{
                    let param = {
                        "transmit":"single",
                        "url":"get_save_message",
                        "request": {
                            "chat_type": SelectedRoom?.admin_ids === undefined ? "single" : "group",
                            "to_id": roomId, 
                        }
                    }
                    wsSend_request(websocket, param);
                }
            }
        }
    }
    useEffect(() => {
        if(GoBackToHome  === true){
            dispatch(setGoBackFromSelect(false))
            navigate("../../");
        }
    }, [ GoBackToHome ]);
    return(
        <div className="ChatPannelsWrapper">
            {/* {console.log("memberslist", memberslist)} */}
            {/* channel header */}
            <Header 
                groupInfoSidebar={groupInfoSidebar}
                setGroupInfoSidebar={setGroupInfoSidebar}
                setMessagesInfoSidebar={setMessagesInfoSidebar}
                MessageInfoSidebar={MessageInfoSidebar}
                callMessageInfo={callMessageInfo}
            />

            {/* channel message */}
            <ChatMessagesPanel 
                UserId={userLogin?.user_id}
                isOpenFireFoxBrowser={isOpenFireFoxBrowser}
                Messages={pagination?.page_data}
                MessagesAllList={MessagesAllList}
                pagination={pagination}
                accessToken={accessToken}
                SendMessageFun={SendMessageFun}
                SendImagesFunction={SendImagesFunction}
                setHeightManage={setHeightManage}
                heightManage={heightManage}
                picker={picker} 
                setpicker={setpicker}
                SendMessageOnchange={SendMessageOnchange}
                editMessageFn={editMessageFn}
                imageUploads={imageUploads}
                setImageUploads={setImageUploads}
                RemoveUplodedImage={RemoveUplodedImage}
                ReplyMessage={ReplyMessage}
                replySelectMessage={replySelectMessage}
                RemoveReplyMessageFnt={RemoveReplyMessageFnt}
                saveMessageFun={saveMessageFun}
                Contacts={Contacts}
                CallBackChatList={CallBackChatList}
                isMessageEmpty={isMessageEmpty}
                setIsMessageEmpty={setIsMessageEmpty}
                MessageList={MessageList}
                callUnBlockContact={callUnBlockContact}
                setuploadfileBox={setuploadfileBox}
                uploadfileBox={uploadfileBox}
                callUserTypeingStatus={callUserTypeingStatus}
                roomId={roomId}
                setMessagesInfoSidebar={setMessagesInfoSidebar}
                MessageInfoSidebar={MessageInfoSidebar}
                groupInfoSidebar={groupInfoSidebar}
                setGroupInfoSidebar={setGroupInfoSidebar}
                callMessageInfo={callMessageInfo}
                setIsEditing={setIsEditing}
                ws={websocket}
                dispatch={dispatch}
                selectId={selectId}
                setSelectId={setSelectId}
                onEnterAddBreakdown={onEnterAddBreakdown}
            />
        </div>
    )
}

export default Index;