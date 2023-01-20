/* eslint-disable array-callback-return */
import React, { useContext, useState } from "react";
import { Dropdown } from 'react-bootstrap';
import ModalCommon from "./ModalCommon";
import { useDispatch, useSelector } from "react-redux";
import { deleteMessage, setOpenModalPopup } from "../../redux/actions";
import wsSend_request from "../../Api/ws/ws_request";
import { WebSocketContext } from "../Index";
import DownloadFile from "../../Api/DownloadFile";
import { useNavigate } from "react-router-dom";

function ChatDropDownMenu(props) {
    const {
        setSelectId, msg, editMessageFn, ReplyMessage, saveMessageFun, is_save,
        setGroupInfoSidebar,
        groupInfoSidebar,
        setMessagesInfoSidebar,
        MessageInfoSidebar,
        callMessageInfo,
        FileAuthPreviewDownload,
        setIsEditing,
        DocsFilePreviewFnt
    } = props;
    const UserID = useSelector((state) => state.allReducers.userLogin.user_id);
    const userLogin = useSelector((state) => state.allReducers.userLogin);
    const accessToken = useSelector((state) => state.allReducers.access_token);
    const {  Contacts, Rooms } = useSelector((state) => state.allReducers);
    const [modalShow, setModalShow] = React.useState(false);
    const SelectedRoom = useSelector((state) => state.allReducers.SelectedRoom);
    const dispatch = useDispatch();
    const [selectContact, setSelectContact] = useState([]);
    const { websocket } = useContext(WebSocketContext);
    const Groups = Rooms?.filter((item)=>item?.admin_ids!==undefined && item?.group_type===undefined);
    let navigate = useNavigate();
    const TotalGroup = [];
    Groups?.map((item)=>{
        TotalGroup?.push(item)
    })
    Contacts?.map((item)=>{
        TotalGroup?.push(item) 

    })

    // message scroll bottom
    const MsgScrollDown = (time) => {
        setTimeout(() => {
            var element = document.getElementById("chatPanelScroll");
            element?.scrollIntoView({ block: 'end' });
        }, time);
    }
    // const callMakeAdmin =(user_id, type, action_type, request_type) =>{
    //     const device_id = localStorage?.getItem("device_id");
    //     const param = {
    //         transmit:"broadcast",
    //         url:action_type,
    //         request:{
    //             group_id:roomId,
    //             [request_type]:user_id,
    //             user_type:type,
    //             device_id:device_id
    //         }
    //     }
    //  wsSend_request(websocket, param)
    // }
    const callForwardMessageAPI = (filter, sender_name, type) =>{
        let param  = null
        
        if(msg?.system_group_id){
            param = {
                "transmit":"broadcast",
                "url":"add_chat",
                "request":{
                    "chat_type":type,
                    "message":msg?.message,
                    "message_type":msg?.message_type,
                    "forward_id":msg?.id,
                    "forward_type":"system_group",
                    "sender_name":sender_name,
                    "to_id":filter,
                }
            }
        }else{
            if(SelectedRoom?.isBroadCast === true){
                param = {
                    "transmit":"broadcast",
                    "url":"add_chat",
                    "request":{
                        "chat_type":type,
                        "message":msg?.message,
                        "message_type":msg?.message_type,
                        "forward_id":msg?.id,
                        "forward_type":"broadcast",
                        "sender_name":sender_name,
                        "to_id":filter,
                    }
                }
            }else{
                param = {
                    "transmit":"broadcast",
                    "url":"add_chat",
                    "request":{
                        "chat_type":type,
                        "message":msg?.message,
                        "message_type":msg?.message_type,
                        "forward_id":msg?.id,
                        "sender_name":sender_name,
                        "forward_type":SelectedRoom?.admin_ids?"group":"single",
                        "to_id":filter,
                    }
                }
            }
        }
        if(param!==null){
            wsSend_request(websocket, param);
        }
    }
    const CallForwardMessage = (select_members, setSelectContact) =>{
        let param  = {};
        const filter = select_members.join(",")
        var ChatScrollMessage = document.getElementById("chatPanelScroll");
        select_members?.map((select_id)=>{
            const selectData = TotalGroup?.filter((item)=>item?.id === select_id)[0];
            
            if(selectData?.admin_ids===undefined){
                callForwardMessageAPI(select_id, userLogin?.users_detail?.phone, "single");
                let param = {
                    "transmit":"single",
                    "url":"get_detail",
                    "request":{
                        "to_id": selectData.id, 
                        "chat_type": "single"
                    }
                }
                if(param){
                    wsSend_request(websocket, param);
                    setTimeout(()=>navigate("/Chat/" + selectData.id), 100);
                }
                MsgScrollDown(500);
            }else{
                callForwardMessageAPI(select_id, selectData?.group_name, "group");
                let param = {
                    "transmit":"single",
                    "url":"get_detail",
                    "request":{
                        "to_id": selectData.id, 
                        "chat_type": "group"
                    }
                }
                if(param){
                    wsSend_request(websocket, param);
                    setTimeout(()=>navigate("/Chat/" + selectData.id), 100);
                }
                MsgScrollDown(500);
            }
        })
        setModalShow(false)
        setSelectContact([]);
    }
    const DeleteMessage = (msg) => {
        let payload = {}
        if(msg.broadcast_group_id !== undefined){
            payload = {
                "transmit":"broadcast", 
                "url":"delete_message",
                "request":{
                    "to_id": msg.broadcast_group_id,
                    "chat_id": msg?.id, 
                    "chat_type": "broadcast"
                }
            }
        }else if(msg.to_id !== undefined) {
            payload = {
                "transmit":"broadcast", 
                "url":"delete_message",
                "request":{
                    "to_id": msg.to_id,
                    "chat_id": msg?.id, 
                    "chat_type": "single"
                }
            }
        } else {
            payload = {
                "transmit":"broadcast", 
                "url":"delete_message",
                "request":{
                    "to_id": msg.group_id,
                    "chat_id": msg?.id, 
                    "chat_type": "group"
                }
            }
        }
        const payload2 = {
            Title:`Delete Message`,
            Description:`Are you sure you want to delete this messages?`,
            IsShow:true,
            Id: msg?.id,
            ActionType: payload,
            callBackList:DeleteMesages,
            ButtonSuccess:"DELETE"
        }
        dispatch(setOpenModalPopup(payload2))
        // wsSend_request(websocket, payload);
        // dispatch(deleteMessage(msg?.id));
        setIsEditing(true);
    }    
    const DeleteMesages = (id) =>{
        dispatch(deleteMessage(id))
    }

    return(<React.Fragment>
        {/* chat dropdown menu */}
        <Dropdown.Menu className="customeDropdownHere" >
            { msg?.file?.name?.split('.').pop() === "pdf" &&<Dropdown.Item 
                onClick={() => {
                    DocsFilePreviewFnt(msg?.file);
                    setSelectId("");
                }}
             >Open File</Dropdown.Item>}
            {msg?.file?.name !== undefined && (
                msg?.file?.name?.split('.').pop() === "jpg" || msg?.file?.name?.split('.').pop() === "jpeg" || 
                msg?.file?.name?.split('.').pop() === "png" || msg?.file?.name?.split('.').pop() === "webp" ||
                msg?.file?.name?.split('.').pop() === "mp4" || msg?.file?.name?.split('.').pop() === "webm" ||
                msg?.file?.name?.split('.').pop() === "mp3" || msg?.file?.name?.split('.').pop() === "ogg" ||
                msg?.file?.name?.split('.').pop() === "m4a" || msg?.file?.name?.split('.').pop() === "m4a" ||
                msg?.file?.name?.split('.').pop() === "wav" || msg?.file?.name?.split('.').pop() === "mpeg"|| 
                msg?.file?.name?.split('.').pop() === "zip" || msg?.file?.name?.split('.').pop() === "psd" ||
                msg?.file?.name?.split('.').pop() === "ppt" || msg?.file?.name?.split('.').pop() === "txt" || 
                msg?.file?.name?.split('.').pop() === "rar" || msg?.file?.name?.split('.').pop() === "doc" || 
                msg?.file?.name?.split('.').pop() === "docx" || msg?.file?.name?.split('.').pop() === "xls" ||
                msg?.file?.name?.split('.').pop() === "ods" || msg?.file?.name?.split('.').pop() === "deb" || 
                msg?.file?.name?.split('.').pop() === "xlsx" || msg?.file?.name?.split('.').pop() === "tif" ||
                msg?.file?.name?.split('.').pop() === "dll" || msg?.file?.name?.split('.').pop() === "sav" ||
                msg?.file?.name?.split('.').pop() === "dat" || msg?.file?.name?.split('.').pop() === "dbf" || 
                msg?.file?.name?.split('.').pop() === "excel" || msg?.file?.name?.split('.').pop() === "avi" || 
                msg?.file?.name?.split('.').pop() === "mkv" || msg?.file?.name?.split('.').pop() === "wmv" || 
                msg?.file?.name?.split('.').pop() === "mov" 
             ) && 
             <Dropdown.Item 
                onClick={() => {
                    FileAuthPreviewDownload(msg);
                    setSelectId("");
                }}
             >Download</Dropdown.Item>}
             {(msg?.from_id === UserID)
                &&
             <Dropdown.Item 
                disabled={msg?.system_group_id === undefined ?false:true}
                onClick={() => {
                    if( (!msg?.system_group_id)){
                        callMessageInfo(msg);
                        setSelectId("");
                    }
                }}
             >Message Info</Dropdown.Item>
            }
            {
            //     (msg.message_type === "text"&& SelectedRoom?.isBroadCast === undefined && msg?.from_id === UserID) && <Dropdown.Item onClick={() => {
            //     editMessageFn(msg);
            //     setSelectId("");
            // }}>Edit Message</Dropdown.Item>
            }
            <Dropdown.Item 
                onClick={() => {
                    setModalShow(true);
                    setSelectId("");
                }}>Forward Message</Dropdown.Item>
            <Dropdown.Item 
                disabled={msg?.system_group_id === undefined ?false:true}
                onClick={() => {
                    if( (!msg?.system_group_id)){
                        ReplyMessage(msg);
                        setSelectId("");
                    }
                }}>Reply Message</Dropdown.Item>
            {(msg?.deleted_at === null ||msg?.deleted_at === undefined ) && (is_save === true?
                <Dropdown.Item 
                    onClick={() => {
                        saveMessageFun(msg, "remove_save_message");
                        setSelectId("");
                    }}
                >UnSave Message</Dropdown.Item>
                :
                <Dropdown.Item onClick={() => {
                        saveMessageFun(msg, "save_message");
                        setSelectId("");
                }}>Save Message</Dropdown.Item>
            )}
            {(msg?.deleted_at === null ||msg?.deleted_at === undefined ) && msg?.from_id === UserID && 
            <Dropdown.Item 
                disabled={msg?.system_group_id === undefined ?false:true}
                onClick={() =>{
                    if( (!msg?.system_group_id)){
                        DeleteMessage(msg);
                        setSelectId("");
                    }
                }}>Delete Message</Dropdown.Item>}
        </Dropdown.Menu>

        {/* forward message popup */}
        <ModalCommon 
            show={modalShow}
            onHide={() => setModalShow(false)}
            msg={"Forward to…"}
            memberslist={TotalGroup}
            button_title={"Forward"}
            formSubmit={CallForwardMessage}
            isMultiple={true}
        />
    </React.Fragment>
    )
} 

export default ChatDropDownMenu;