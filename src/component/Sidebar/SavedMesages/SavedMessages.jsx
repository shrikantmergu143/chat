/* eslint-disable */
import React, { useContext, useState } from "react";
import ListGroup from 'react-bootstrap/ListGroup';
import { Scrollbars } from 'react-custom-scrollbars-2';
import Avatar from '../../common/Avatar';
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PreviewPopup from "../../common/SavePreviewPopup";
import { Image } from "react-bootstrap";
import PlayButton from "../../../assets/img/videoplaybtn.svg";
import chat_save from "../../../assets/img/sidebar/chat_save.svg";
import { AudioPlayerControlSprite, Audio } from 'react-audio-player-pro';
import SaveChatMenu from "../../common/SaveChatMenu";
import wsSend_request from "../../../Api/ws/ws_request";
import { WebSocketContext } from "../../Index";
import DownloadFile from '../../../Api/DownloadFile';
import ModalCommon from "../../common/ModalCommon";
import FileAuthPreview from "../../ChatPanels/FileAuthPreview";
import NoDataFound from "../../common/NoDataFound";
import DocFilesPreview from "../../common/DocFilesPreview";
import DummyImage from '../../../assets/img/profile/dummyimage.png';
import ProfileAuthPreview from "../../ChatPanels/ProfileAuthPreview";
import { MessagesLocationBox, timeSince } from "../../ChatPanels/ChatMessagesPanel";
import { checkExtension, getFileName } from "../../ChatPanels/SearchChat/MessagesPanel";
import AudioImageMain from "../../../assets/img/sidebar/last_audio.svg";
import { ReplayMessageChat } from "../../ChatPanels/MessageInfo/MessagePanel";
import ForwordMessage from "../../../assets/img/Fordwardmessgae.png";

const SavedMessages = (props) => {
    const { getSavedMessages } = props;
    const { MyProfile } = useSelector((state) => state.allReducers);
    const access_token = useSelector((state) => state.allReducers.access_token);
    const Contacts = useSelector((state) => state.allReducers.Contacts);
    const Rooms = useSelector((state) => state.allReducers.Rooms);
    const UserId = useSelector((state) => state.allReducers.userLogin.user_id);
    const DetailsList = useSelector((state) => state?.allReducers?.DetailsList);
    const UserDetails = useSelector((state) => state?.allReducers?.UserDetails);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const Groups = Rooms?.filter((item)=>item?.admin_ids!==undefined && item?.group_type===undefined);
    const MessageList = useSelector((state) => state.allReducers.MessageList);
    const replySaveChat = useSelector((state) => state.allReducers.replySaveChat);
    const TotalGroup = [];
    Groups?.map((item)=>{
        TotalGroup?.push(item)
    })
    Contacts?.map((item)=>{
        TotalGroup?.push(item)
    })
    const [ CurrentVideoImage, setCurrentSelectedFile ] = useState({
       
    });
    const [modalShow, setModalShow] = useState(false)
    const { websocket } = useContext(WebSocketContext);
    const userLogin = useSelector((state) => state.allReducers.userLogin);
    // const UserId = localStorage.getItem("UserId");
    const [PreviewImageVideo, setPreviewImageVideo] = useState(false);
    // const [CurrentVideoImage, setCurrentSelectedFile] = useState("");
    const [ DocFilePopupOpen, setDocFilePopupOpen ] = useState(false);
    const [ selectDocsFile, setSelectDocsFile ] = useState({
        name: "",
        id: "",
        url: "",
    })

    // message scroll bottom
    const MsgScrollDown = (time) => {
        setTimeout(() => {
            var element = document.getElementById("chatPanelScroll");
            element?.scrollIntoView({ block: 'end' });
        }, time);
    }

    const MessageGetUrl = (Message) => {
        var patternurl = /(\b(https?|ftp|file):\/\/[\-A-Z0-9+&@#\/%?=~_|!:,.;]*[\-A-Z09+&@#\/%=~_|])/img;
        var result = "";
        var text = Message;

        if(patternurl.test(text) === true) {
            return result = text?.replace(patternurl, '<a href="$1" class="messageUrllink" target="_blank">$1</a>');
        } else {
            return result = text;
        }        
        return result;
    }

      // file preview popup open fucntion
    const VideoImagesShowFnt = (message) => {
        setPreviewImageVideo(!PreviewImageVideo);
        setCurrentSelectedFile(message);
    }
    // console.log("VideoImagesShowFnt", PreviewImageVideo, CurrentVideoImage)

    // get usernames functions
    const UserGet = (data_, memberlist) => {
        var UserName = [];
        UserName = data_?.users?.filter((item) =>item?.id === memberlist?.chat?.from_id)
        // console.log("created_by", UserName, data_)
        return UserName?.length>0?
        <>
                {/* <Avatar profile={UserName[0]?.avatar_url} title={data_?.name} />  */}
                <ProfileAuthPreview 
                    url={UserName[0]?.view_thumbnail_url}
                    className={"avatarImage"}
                    avatar={UserName[0]}
                    defultIcon={DummyImage}
                />
                <h4>{`${UserName[0]?.name} & ${data_?.group_name}`}</h4>
        </>:<></>;
    }

    // docs file preview function
    const DocsFilePreviewFnt = (files) => {
        // console.log("files321======>",files);
        setDocFilePopupOpen(true);
        setSelectDocsFile({...selectDocsFile, file:files, name: files?.name, id: files?.id, url: files?.url,});
    }

    // get file size function
    const formatFileSize = (bytes,decimalPoint) => {
        if(bytes == 0) return '0 Bytes';
        var k = 1000,
            dm = decimalPoint || 2,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    const savedMessageUserDetails = (memberlist) => {
        
        return (
            <div className="savedMessageUserName">
                <div className="ChatMemberDetails">
                    {/* {console.log("memberlist?.toDetails", memberlist)} */}
                    {memberlist?.toDetails?.map((data_, index) => {
                        return(
                            <React.Fragment key={index}>
                                {data_?.group_name === undefined ? (
                                    <React.Fragment>
                                       {memberlist?.chat?.from_id!== userLogin?.user_id?
                                        <React.Fragment>
                                            <div className="w-auto">
                                                {/* <Avatar profile={data_?.avatar_url} title={data_?.name} />  */}
                                                <ProfileAuthPreview 
                                                    url={data_?.view_thumbnail_url}
                                                    className={"avatarImage"}
                                                    avatar={data_}
                                                    defultIcon={DummyImage}
                                                />
                                                <h4>{`${data_?.name} & You`}</h4>
                                            </div>
                                        </React.Fragment>
                                        :
                                         <React.Fragment>
                                            <div className="w-auto">
                                                {/* <Avatar profile={MyProfile?.avatar_url} title={data_?.name} />  */}
                                                <ProfileAuthPreview
                                                    url={MyProfile?.view_thumbnail_url}
                                                    className={"avatarImage"}
                                                    avatar={MyProfile}
                                                    defultIcon={DummyImage}
                                                />
                                                <h4>{`You & ${data_?.name}`}</h4>
                                            </div>
                                        </React.Fragment>
                                        }
                                    </React.Fragment>
                                    ) : (
                                        memberlist?.chat?.from_id!== userLogin?.user_id?
                                        <React.Fragment>
                                            {
                                                UserGet(data_, memberlist)
                                            }
                                           
                                        </React.Fragment>
                                        :
                                        <React.Fragment>
                                           <div className="w-auto">
                                                {/* <Avatar profile={MyProfile?.avatar_url} title={data_?.name} />  */}
                                                <ProfileAuthPreview 
                                                    url={MyProfile?.view_thumbnail_url}
                                                    className={"avatarImage"}
                                                    avatar={MyProfile}
                                                    defultIcon={DummyImage}
                                                />
                                                <h4>{`You & ${data_?.group_name}`}</h4>
                                            </div>
                                        </React.Fragment>
                                    )}
                            </React.Fragment>
                        )
                    })}       
                </div>
            </div>
        )
    }
        // creating message date time wise groups  //
    const MessageUpdateDate = getSavedMessages && getSavedMessages.sort(( a, b )=> {
            return  moment.utc(a?.chat?.created_at) -  moment.utc(b?.chat?.created_at)
    }).reduce((groups, files) => {
        const date = timeSince(new Date(moment.utc(files?.chat?.created_at).format('DD MMMM YYYY')));
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(files);
        return groups;
    }, {});
        
    const groupArraysMessage = MessageUpdateDate && Object?.keys(MessageUpdateDate).map((date) => {
        return {
            date,
            MessageLists: MessageUpdateDate[date]
        };
    });
    const MessageReverse = [...groupArraysMessage].reverse();
    const callUnSaveMessages = (msg) =>{
        let param ={};
        // console.log("msg", msg)
        if(msg?.chat?.system_group_id !== undefined){
            param = {
                "transmit":"broadcast",
                "url":"remove_save_message",
                "request":{
                    "to_id":msg?.chat?.system_group_id,
                    "chat_id":msg?.chat?.id,
                    "chat_type":"system_group"
                }
            }
        }else if(msg?.chat?.broadcast_group_id !== undefined){
            param = {
                "transmit":"broadcast",
                "url":"remove_save_message",
                "request":{
                    "to_id":msg?.chat?.broadcast_group_id,
                    "chat_id":msg?.chat?.id,
                    "chat_type":"broadcast"
                }
            }
        }else if(msg?.chat?.group_id === undefined && msg?.chat?.broadcast_group_id === undefined){
            param = {
                "transmit":"broadcast",
                "url":"remove_save_message",
                "request":{
                    "to_id":msg?.chat?.from_id === userLogin?.user_id?msg?.chat?.to_id:msg?.chat?.from_id,
                    "chat_id":msg?.chat?.id,
                    "chat_type":"single"
                }
            }
        }else  if(msg?.chat?.group_id !== undefined  && msg?.chat?.broadcast_group_id === undefined){
            param = {
                "transmit":"broadcast",
                "url":"remove_save_message",
                "request":{
                    "to_id":msg?.chat?.group_id,
                    "chat_id":msg?.chat?.id,
                    "chat_type":"group"
                }
            }
        }
        
        if(param!=={}){
            wsSend_request(websocket, param)
        }
    }
    // const callForwardMessageAPI = (filter, type) =>{
        let param  = {}
        // const device_id = localStorage?.getItem("device_id");
        // if(CurrentVideoImage?.broadcast_group_id !== undefined){
        //     param = {
        //         "transmit":"broadcast",
        //         "url":"add_chat",
        //         "request":{
        //             "chat_type":type,
        //             "message":CurrentVideoImage?.message,
        //             "message_type": CurrentVideoImage?.message_type,
        //             "forward_id": CurrentVideoImage?.id,
        //             "forward_type": "broadcast",
        //             "to_id":filter,
        //             "device_id":device_id
        //         }
        //     }
        // }else{
        //     param = {
        //         "transmit":"broadcast",
        //         "url":"add_chat",
        //         "request":{
        //             "chat_type":type,
        //             "message":CurrentVideoImage?.message,
        //             "message_type": CurrentVideoImage?.message_type,
        //             "forward_id": CurrentVideoImage?.id,
        //             "forward_type": CurrentVideoImage.group_id !== undefined ? "group" : "single",
        //             "to_id":filter,
        //             "device_id":device_id
        //         }
        //     }
        // }
        // if(param!=={}){
        //     wsSend_request(websocket, param);
        // }
    // }

    // Call forward message function
    const callForwardMessageAPI = (filter, sender_name, type) =>{
        let param  = null
        if(CurrentVideoImage?.system_group_id){
            param = {
                "transmit":"broadcast",
                "url":"add_chat",
                "request":{
                    "chat_type":type,
                    "message":CurrentVideoImage?.message,
                    "message_type":CurrentVideoImage?.message_type,
                    "forward_id":CurrentVideoImage?.id,
                    "forward_type":"system_group",
                    "sender_name":sender_name,
                    "to_id":filter,
                }
            }
        }else if(CurrentVideoImage?.broadcast_group_id !== undefined){
            param = {
                "transmit":"broadcast",
                "url":"add_chat",
                "request":{
                    "chat_type":type,
                    "message":CurrentVideoImage?.message,
                    "message_type": CurrentVideoImage?.message_type,
                    "forward_id": CurrentVideoImage?.id,
                    "sender_name":sender_name,
                    "forward_type": "broadcast",
                    "to_id":filter,
                }
            }
        }else{
            param = {
                "transmit":"broadcast",
                "url":"add_chat",
                "request":{
                    "chat_type":type,
                    "message":CurrentVideoImage?.message,
                    "message_type": CurrentVideoImage?.message_type,
                    "forward_id": CurrentVideoImage?.id,
                    "sender_name":sender_name,
                    "forward_type": CurrentVideoImage.group_id !== undefined ? "group" : "single",
                    "to_id":filter,
                }
            }
        }
        if(param!== null){
            wsSend_request(websocket, param);
        }
    }
    // Call forward message function
    const CallForwardMessage = (select_members, setSelectContact) =>{
        // let param  = {};
        const filter = select_members.join(",")
        var ChatScrollMessage = document.getElementById("scrollbottoms");
        select_members?.map((select_id)=>{
            const selectData = TotalGroup?.filter((item)=>item?.id === select_id)[0];
            if(selectData?.admin_ids===undefined){
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
                    callForwardMessageAPI(select_id, userLogin?.users_detail?.phone, "single");
                    setTimeout(()=>navigate("/Chat/" + select_members[0]), 100);
                }
                ChatScrollMessage?.click();
                MsgScrollDown(500);
            }else{
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
                    callForwardMessageAPI(select_id, selectData?.group_name, "group");
                    setTimeout(()=>navigate("/Chat/" + select_members[0]), 100);
                }
                ChatScrollMessage?.click();
                MsgScrollDown(500);
            }
        })
        setModalShow(false);
        setPreviewImageVideo(false);
        setSelectContact([]);
        setCurrentSelectedFile({})
    }
    const setOpenModalBox = (msg) =>{
        setCurrentSelectedFile({...msg?.chat});
        setModalShow(true)
    }
    // contact share box message
    const ShareContactMessage = (msg) => {
        // console.log("msg", msg)
        var splitedNameNmber = msg?.message?.split('[|]');
        var GetName = splitedNameNmber[0];
        var GetNumber = splitedNameNmber[1];
        return(
                <div className="contactSharedDemo">
                <Image src={DummyImage} alt="shared profile" />
                <div className="contactNameDeta">
                    <h4>{GetName}</h4>
                    {/* <p>{"+ " + GetNumber}</p> */}
                    <p>{GetNumber.includes("+") ? GetNumber : `+ ${GetNumber}`}</p>
                </div>
            </div>)
    };
    const ReplayMessages = ({msgs, users}) =>{
        const Messages = MessageList[users?.to_id];
        if(Messages){
            const RPLmssages = Messages?.filter((item)=>item?.id===msgs?.reply_id);     //[replySaveChat[msgs?.reply_id]];
            let users_name = "";
            if(RPLmssages){
                const rplMessages = RPLmssages[0];
                if(users?.chat_type === "group"){
                    const sendUser = users?.toDetails[0]?.users?.filter(item =>item?.id === rplMessages?.from_id);
                    if(sendUser){
                        if(sendUser[0]?.id === userLogin?.user_id){
                            users_name = "You"
                        }else{
                            users_name = sendUser[0]?.name
                        }
                    }
                }else if(rplMessages?.from_id === userLogin?.user_id){
                    users_name = "You"
                }else {
                    if(users?.toDetails){
                        users_name = users?.toDetails[0]?.name
    
                    }else if(UserDetails[rplMessages?.from_id]){
                        users_name = UserDetails[rplMessages?.from_id]?.name;
                    }
                }
                return ReplayMessageChat({Replaymsg:rplMessages, users:users_name})
            }else{
                const ResultReplaymsg = replySaveChat[msgs?.reply_id];
                if(ResultReplaymsg){
                    let users_name=''
                    const rplMessages = ResultReplaymsg;
                    if(users?.chat_type === "group"){
                        const sendUser = users?.toDetails[0]?.users?.filter(item =>item?.id === rplMessages?.from_id);
                        if(sendUser){
                            if(sendUser[0]?.id === userLogin?.user_id){
                                users_name = "You"
                            }else{
                                users_name = sendUser[0]?.name
                            }
                        }
                    }else if(rplMessages?.from_id === userLogin?.user_id){
                        users_name = "You"
                    }else {
                        if(users?.toDetails){
                            users_name = users?.toDetails[0]?.name
        
                        }else if(UserDetails[rplMessages?.from_id]){
                            users_name = UserDetails[rplMessages?.from_id]?.name;
                        }
                    }
                    return ReplayMessageChat({Replaymsg:rplMessages, users:users_name})
                }else{
                    const ResultReplaymsg = replySaveChat[msgs?.reply_id];
                    if(ResultReplaymsg){
                        let users_name=''
                        const rplMessages = ResultReplaymsg;
                        if(users?.chat_type === "group"){
                            const sendUser = users?.toDetails[0]?.users?.filter(item =>item?.id === rplMessages?.from_id);
                            if(sendUser){
                                if(sendUser[0]?.id === userLogin?.user_id){
                                    users_name = "You"
                                }else{
                                    users_name = sendUser[0]?.name
                                }
                            }
                        }else if(rplMessages?.from_id === userLogin?.user_id){
                            users_name = "You"
                        }else {
                            if(users?.toDetails){
                                users_name = users?.toDetails[0]?.name
            
                            }else if(UserDetails[rplMessages?.from_id]){
                                users_name = UserDetails[rplMessages?.from_id]?.name;
                            }
                        }
                        return ReplayMessageChat({Replaymsg:rplMessages, users:users_name})
                    }else{
                        if(users?.chat_type === "group"){
                            let param = {
                                "transmit":"single",
                                "url":"chat_detail",
                                "request": {
                                    "chat_type":"group",
                                    "chat_id":users?.chat?.reply_id,
                                    "to_id":users?.to_id
                                }
                            }
                            wsSend_request(websocket, param);
                        }else{
                            console.log("users" ,users)
                                let param = {
                                    "transmit":"single",
                                    "url":"chat_detail",
                                    "request": {
                                        "chat_type":"single",
                                        "chat_id":users?.chat?.reply_id,
                                        "to_id":users?.to_id
                                    }
                                }
                                wsSend_request(websocket, param);
                        }
                    }
                }
                // if(users?.chat_type === "group"){
                //     let param = {
                //         "transmit":"single",
                //         "url":"chat_detail",
                //         "request": {
                //             "chat_type":"group",
                //             "chat_id":msgs?.reply_id,
                //             "to_id":users?.to_id
                //         }
                //     }
                //     wsSend_request(websocket, param);
                // }
            }
        }else{
            const ResultReplaymsg = replySaveChat[msgs?.reply_id];
            if(ResultReplaymsg){
                let users_name=''
                const rplMessages = ResultReplaymsg;
                if(users?.chat_type === "group"){
                    const sendUser = users?.toDetails[0]?.users?.filter(item =>item?.id === rplMessages?.from_id);
                    if(sendUser){
                        if(sendUser[0]?.id === userLogin?.user_id){
                            users_name = "You"
                        }else{
                            users_name = sendUser[0]?.name
                        }
                    }
                }else if(rplMessages?.from_id === userLogin?.user_id){
                    users_name = "You"
                }else {
                    if(users?.toDetails){
                        users_name = users?.toDetails[0]?.name
    
                    }else if(UserDetails[rplMessages?.from_id]){
                        users_name = UserDetails[rplMessages?.from_id]?.name;
                    }
                }
                return ReplayMessageChat({Replaymsg:rplMessages, users:users_name})
            }else{
                if(users?.chat_type === "group"){
                    let param = {
                        "transmit":"single",
                        "url":"chat_detail",
                        "request": {
                            "chat_type":"group",
                            "chat_id":users?.chat?.reply_id,
                            "to_id":users?.to_id
                        }
                    }
                    wsSend_request(websocket, param);
                }else{
                    console.log("users" ,users)
                        let param = {
                            "transmit":"single",
                            "url":"chat_detail",
                            "request": {
                                "chat_type":"single",
                                "chat_id":users?.chat?.reply_id,
                                "to_id":users?.to_id
                            }
                        }
                        wsSend_request(websocket, param);
                }
            }
        }
    }
    
    return (
        <div className="savedMessageList ">
            <ListGroup>
                <Scrollbars 
                    renderTrackVertical={props => <div {...props} className="track-vertical"/>}
                    renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
                    renderView={props => <div {...props} className="view"/>}
                    style={{
                        height: "calc(100vh - 72px)"
                    }}
                    className="scrollararea"
                >
                    {MessageReverse && MessageReverse.map((msg, index) =>  
                    <div key={index}>
                        <div className="datetimemessage"><div className="timelabel">{msg?.date}</div></div>
                       {msg?.MessageLists?.length > 0 && msg?.MessageLists?.reverse().map((user, index) =>user?.chat?.deleted_at === undefined || user?.chat?.deleted_at === null &&(
                            <React.Fragment key={index}>
                                <ListGroup.Item
                                    className={(user?.chat?.is_broadcast === true && user?.chat?.broadcast_group_id === undefined) && "broadcast_messages"}
                                >
                                    {savedMessageUserDetails(user)}
                                        <SaveChatMenu
                                            {...user?.chat}
                                            msg={user}
                                            callUnSaveMessages={callUnSaveMessages}
                                            callForwardMessageAPI={callForwardMessageAPI}
                                            CallForwardMessage={CallForwardMessage}
                                            setOpenModalBox={setOpenModalBox}
                                        />
                                        
                                    {user?.chat?.message_type === "contact" && (<div className="contactsavedwrapps">
                                        <div className={user.chat?.from_id === UserId ? "MessagaSavedher contactSharedsaved Me" : "MessagaSavedher contactSharedsaved"}>
                                            {ShareContactMessage(user.chat)}
                                        </div>
                                        <span className="messageTime">
                                            {moment.utc(new Date(user?.chat?.created_at)).local().format('hh:mm a')}
                                        </span>
                                    </div>)}
                                    {(user?.chat?.message_type === "text" || user?.chat?.message_type === "file" || user?.chat?.message_type === "location")&&
                                    <div className="MessagaSavedherWraps">
                                        <div className="Messagewrapsset">
                                            <div className={user?.chat?.message_type === "text delete" ? "chatMsg DeletedMessage" : 
                                                                    user?.chat?.reply_id ? "chatMsg replyMessage_set" : 
                                                                    user?.chat?.message_type === "file" ? "chatMsg files" : 
                                                                    user?.chat?.message_type === "location" ?  "chatMsg files location" :"chatMsg"}>
                                                {user?.chat?.message_type === "file" && (
                                                    <div className={user?.chat?.from_id === UserId ? "MessagaSavedher Me" : "MessagaSavedher"} >
                                                        {user?.chat?.deleted_at === null && (<React.Fragment>{user?.chat?.is_forward === true && (<div className="messageForwordSet"><Image src={ForwordMessage} alt="forword message"/> Forwarded</div>)}</React.Fragment>)}
                                                        {((user?.chat.deleted_at === null|| user?.chat.deleted_at === undefined)  && user?.chat?.reply_id) && ReplayMessages({msgs:user?.chat, users:user})}
                                                        <div className={user?.chat?.message !== "" ? "imageUplodedGroupsWrap styleadded" : "imageUplodedGroupsWrap"}>
                                                            {/* image group gallery */}
                                                            {(user.ext === "jpg" || user.ext === "jpeg" || user.ext === "png" || user.ext === "webp") && (
                                                                <div className="imageMainGroup">
                                                                    <div className="imageUplodedGroups" 
                                                                    onClick={() => VideoImagesShowFnt(user.chat)}
                                                                    >
                                                                        {/* <Image src={user?.chat?.file?.name} alt={user?.chat?.file?.name} /> */}
                                                                        <FileAuthPreview message={user?.chat} onClick={() => VideoImagesShowFnt(user?.chat)} url={user?.chat?.file?.view_thumbnail_url} alt={user?.chat?.file?.name} />
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* video group gallery */}
                                                            {(user.ext === "mp4" || user.ext === "mov"|| user.ext === "3gp") && (
                                                                <div className="VideoUploadGroups"
                                                                onClick={() => VideoImagesShowFnt(user.chat)}
                                                                >
                                                                    <Image src={PlayButton} className="videoPLybtn" alt="play button" />
                                                                    {/* <Image src={user?.chat?.file?.thumbnail} className="videoposterimage" alt="video poster image" /> */}
                                                                    <FileAuthPreview message={user?.chat} className="videoposterimage" url={user?.chat?.file?.view_thumbnail_url} alt={user?.chat?.file?.name} />
                                                                </div>
                                                            )}

                                                            {/* all files groups */}
                                                            {(
                                                                checkExtension(user?.chat?.file?.name) 
                                                            ) && (<div 
                                                                className="filesUplodedUIwrappser"
                                                            >
                                                                <div 
                                                                    className="filedetailswrapps"
                                                                    onClick={() => {
                                                                        (user.ext === "pdf" ) && DocsFilePreviewFnt(user?.chat?.file);                    
                                                                    }}
                                                                >
                                                                    <div className={ getFileName(user?.chat?.file?.name, "fileUplodedImageMode") }></div>
                                                                    <div className="filedetails">
                                                                        <h4>{user?.chat?.file?.name}</h4>
                                                                        <span>
                                                                            {formatFileSize(user?.chat?.file?.size)} &nbsp;
                                                                            <small>
                                                                            {moment.utc(new Date(user?.chat?.created_at)).local().format('hh:mm a')}
                                                                            </small>
                                                                        </span>
                                                                    </div>
                                                                </div> 
                                                                <button onClick={() => DownloadFile(user?.chat?.file, access_token)}>Download</button>
                                                            </div>)}

                                                            {(user.ext === "mp3" || user.ext === "m4a" || user.ext === "ogg" || user.ext === "wav" || user.ext === "mpeg") && (<div className="audioUploadGroups" >
                                                                {/* <AudioPlayerControlSprite/>
                                                                <Audio
                                                                    src={user?.chat?.file?.name}
                                                                    preload="auto"
                                                                    duration={100}
                                                                    className="audioUpload"
                                                                    downloadFileName={user?.chat?.file?.name}
                                                                    useRepeatButton={false}
                                                                /> */}
                                                                <FileAuthPreview 
                                                                    message={user?.chat} 
                                                                    url={user?.chat?.file?.view_file_url} 
                                                                    Type={"Audio"}
                                                                />
                                                                <div className="file_sizeset">{formatFileSize(user?.chat?.file?.size)}</div>
                                                            </div>)}
                                                        </div>
                                                    </div>
                                                )}
                                                {/* Location share box messages */}
                                                {user?.chat?.message_type === "location" && (
                                                    <React.Fragment>
                                                         <div className={user?.chat?.from_id === UserId ? "MessagaSavedher Me" : "MessagaSavedher"}>
                                                        {user?.chat?.deleted_at === null && (<React.Fragment>{user?.chat?.is_forward === true && (<div className="messageForwordSet"><Image src={ForwordMessage} alt="forword message"/> Forwarded</div>)}</React.Fragment>)}
                                                        {MessagesLocationBox({msg:user?.chat})}
                                                        </div>
                                                    </React.Fragment>
                                                )}
                                                {user?.chat?.message_type !== "file" && user?.chat?.message_type !== "location" && (user?.chat?.Message !== ""  && (
                                                    <div className={user?.chat?.from_id === UserId ? "MessagaSavedher Me" : "MessagaSavedher"}>
                                                        {user?.chat?.deleted_at === null && (<React.Fragment>{user?.chat?.is_forward === true && (<div className="messageForwordSet"><Image src={ForwordMessage} alt="forword message"/> Forwarded</div>)}</React.Fragment>)}
                                                    {((user?.chat.deleted_at === null|| user?.chat.deleted_at === undefined)  && user?.chat?.reply_id) && ReplayMessages({msgs:user?.chat, users:user})}
                                                    <div dangerouslySetInnerHTML={{__html: MessageGetUrl(user?.chat?.message)}}>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="messageTime">
                                                {/* {moment.utc(new Date(user?.chat?.updated_at)).local().format('hh:mm a')} */}
                                                {moment.utc(new Date(user?.chat?.created_at)).local().format('hh:mm a')}
                                            </span>
                                        </div>
                                    </div>}
                                </ListGroup.Item>
                            </React.Fragment>
                       ))
                    }
                    </div>)}
                    {getSavedMessages && getSavedMessages.length === 0 ?// <h4 className="noresultfound">No Data Found</h4>
                            <NoDataFound centered={true} title={"No Chat Save"} src={chat_save} className={"No_data_div"} />
                         : null}
                </Scrollbars>
                {PreviewImageVideo === true && (
                    <PreviewPopup TotalGroup={TotalGroup} setOpenModalBox={setOpenModalBox} setModalShow={setModalShow} callForwardMessageAPI={callForwardMessageAPI} CallForwardMessage={CallForwardMessage} UserId={UserId} Contacts={Contacts} setPreviewImageVideo={setPreviewImageVideo} CurrentVideoImage={CurrentVideoImage}  />)
                }
                {DocFilePopupOpen === true && (<DocFilesPreview selectDocsFile={selectDocsFile} setSelectDocsFile={setSelectDocsFile} setDocFilePopupOpen={setDocFilePopupOpen} />)}
                 <ModalCommon 
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    msg={"Forward to…"}
                    memberslist={TotalGroup}
                    button_title={"Forward"}
                    formSubmit={CallForwardMessage}
                    isMultiple={true}
                />
            </ListGroup>
        </div>
    )
}

export default SavedMessages;