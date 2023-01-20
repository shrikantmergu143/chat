/* eslint-disable */
import React, { useState, useRef } from "react";
import MessageCompose from './MessageCompose';
import FileUploadPreview from "./FileUploadPreview";
import { ButtonGroup, Dropdown, Image, Button } from 'react-bootstrap';
import ChatDropDownMenu from '../common/ChatDropDownMenu';
import PreviewPopup from "../common/PreviewPopup";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import PlayButton from "../../assets/img/videoplaybtn.svg";
import ForwordMessage from "../../assets/img/Fordwardmessgae.png";
import BroadcastMessage from "../../assets/img/BroadcastMessage.svg";
import { AudioPlayerControlSprite, Audio } from 'react-audio-player-pro';
import DocFilesPreview from "../common/DocFilesPreview";
import DownloadFile from "../../Api/DownloadFile";
import GetViewFilesAPI from "../../Api/Viewfiles";
import FileAuthPreview from "./FileAuthPreview";
import DummyImage from '../../assets/img/profile/dummyimage.png';
import AudioImage from "../../assets/img/audio_icon.png";
import AudioImageMain from "../../assets/img/sidebar/last_audio.svg";
import MessageStatus from "./MessageStatus";
import wsSend_request from "../../Api/ws/ws_request";
import { setMessagesTabCounts, setScrollToChatid, SetUpdatepaginationList, setUserTypeing } from "../../redux/actions";
import CommanTyping from "./CommanTyping";
import { useEffect } from "react";
import { checkExtension, getFileName } from "./SearchChat/MessagesPanel";
import { IsUUID } from "../../Api/UUID";
import { CommanGetdetails } from "../../Api/ws/Ws_Onmessage";
import { PaginationList } from "./Index";
// import { MessagesListLoader } from "../common/sidebar/RighSideLoader";

// const MONTH_NAMES = [
//     'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
//     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
// ];
// function getFormattedDate(date, prefomattedDate = false, hideYear = false) {
//     const day = date.getDate();
//     const month = MONTH_NAMES[date.getMonth()];
//     const year = date.getFullYear();
//     const hours = date.getHours();
//     let minutes = date.getMinutes();
  
//     if (minutes < 10) {
//       // Adding leading zero to minutes
//       minutes = `0${ minutes }`;
//     }
  
//     if (prefomattedDate) {
//       // Today at 10:20
//       // Yesterday at 10:20
//       return `${ prefomattedDate }`;
//     }
  
//     if (hideYear) {
//       // 10. January at 10:20
//       return `${ day } ${ month }`;
//     }
  
//     // 10. January 2017. at 10:20
//     return `${ day } ${ month } ${ year }`;
//   }
export const GotoMainPageMessage = (messageinfo) => {
    var messagegoid = document.getElementById("messageid" + messageinfo);
    messagegoid?.scrollIntoView({ block: "start", inline: "center" });
    messagegoid?.classList?.add("activereplymessagepages")
    setTimeout(() => {
        messagegoid?.classList?.remove("activereplymessagepages");
    }, 1000);
}
export const timeSince = (dateParam)=> {
    if (!dateParam) {
        return null;
      }
    
      const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
      const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
      const today = new Date();
      const yesterday = new Date(today - DAY_IN_MS);
      const seconds = Math.round((today - date) / 1000);
      const minutes = Math.round(seconds / 60);
      const isToday = today.toDateString() === date.toDateString();
      const isYesterday = yesterday.toDateString() === date.toDateString();
      const isThisYear = today.getFullYear() === date.getFullYear();
    
    
      if (seconds < 5) {
        return 'Today';
      } else if (seconds < 60) {
        return `Today`;
      } else if (seconds < 90) {
        return 'Today';
      } else if (minutes < 60) {
        return `Today`;
      } else if (isToday) {
        return 'Today'; // Today at 10:20
      } else if (isYesterday) {
        return 'Yesterday'; // Yesterday at 10:20
      } else if (isThisYear) {
        //   console.log("dateParam", moment.utc(dateParam)..format('MMM d, YYYY'))
        return moment.utc(dateParam).local().format('MMM D, YYYY'); // 10. January at 10:20
      }
    
      return moment.utc(dateParam).local().format('MMM D, YYYY'); // 10. January 2017. at 10:20
}
// Location Share box messages
export const MessagesLocationBox = (props)=>{
    const {msg} = props
    const lat = msg?.message?.split('[|]')[0];
    const lng = msg?.message?.split('[|]')[1];
    const Address = msg?.message?.split('[|]')[2];
    const MAP_KEY = process.env.REACT_APP_GOOGLE_MAP_API;
    const center = {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
    };
    // console.log("MAP_KEY", MAP_KEY)
    const StaticImage = `https://maps.googleapis.com/maps/api/staticmap?center=${center?.lat},${center?.lng}&zoom=14&size=300x200&key=${MAP_KEY}&markers=${center?.lat},${center?.lng}&scale=1`;
    const StaticImageMini = `https://maps.googleapis.com/maps/api/staticmap?center=${center?.lat},${center?.lng}&zoom=14&size=100x100&key=${MAP_KEY}&markers=${center?.lat},${center?.lng}&scale=1`;
    const RedirectMap = `https://www.google.com/maps/search/?api=1&query=${center?.lat},${center?.lng}`;
    return props?.reply_msg?(
        <div className="imageUplodedGroupsWrap reply_messages">            
            <div className="imageUplodedGroups" >
                <img  onClick={()=>window.open(RedirectMap, "_blank")}  src={StaticImageMini} alt={StaticImageMini}/>
            </div>
            Location
        </div>
    ):(
        <div className="imageUplodedGroupsWrap">            
            <div className="imageUplodedGroups" >
                <img  onClick={()=>window.open(RedirectMap, "_blank")}  src={StaticImage} alt={StaticImage}/>
                {Address && <p className="Address">{Address}</p>}
            </div>
        </div>
    )
}
const ChatMessagesPanel = (props) => {
    const {
            MessagesAllList,
            pagination,
            SendMessageFun, 
            isOpenFireFoxBrowser,
            setHeightManage,
            SendImagesFunction,
            heightManage, 
            picker, 
            setpicker, 
            SendMessageOnchange,
            editMessageFn,
            RemoveUplodedImage,
            setImageUploads,
            imageUploads,
            ReplyMessage,
            replySelectMessage,
            RemoveReplyMessageFnt,
            saveMessageFun,
            UserId,
            accessToken,
            Contacts,
            CallBackChatList,
            isMessageEmpty,
            setIsMessageEmpty,
            callUnBlockContact,
            setuploadfileBox,
            uploadfileBox,
            callUserTypeingStatus,
            roomId,
            setGroupInfoSidebar,
            groupInfoSidebar,
            setMessagesInfoSidebar,
            MessageInfoSidebar,
            callMessageInfo,
            setIsEditing,
            ws,
            dispatch,
            selectId,
            setSelectId,
            onEnterAddBreakdown,
        } = props;
    const styleData = screen.width > 1590 ? "100vh - 128px" : "100vh - 88px";
    const [PreviewImageVideo, setPreviewImageVideo] = useState(false);
    const access_token = useSelector((state) =>state?.allReducers?.access_token);
    const [CurrentVideoImage, setCurrentVideoImage] = useState("");
    const userLogin = useSelector((state) => state.allReducers.userLogin);
    const SelectedRoom = useSelector((state) => state.allReducers.SelectedRoom);
    const SaveChatList = useSelector((state) => state?.allReducers?.SaveChatList[roomId]);
    const DetailsList = useSelector((state) => state?.allReducers?.DetailsList);
    const replySaveChat = useSelector((state) => state?.allReducers?.replySaveChat);
    const UserDetails = useSelector((state) => state?.allReducers?.UserDetails);
    const Messages = useSelector((state) => state?.allReducers?.pagination?.page_data);
    const { scroll_chat_id } = useSelector((state) => state?.allReducers);
    const [ MessageScrollLimit, setMessageScrollLimit ] = useState(-25);
    const [Loader, SetLoader] = useState(false)
    // Regular expression to match emoji
    useEffect(()=>{
        if(scroll_chat_id === undefined){
            dispatch(setScrollToChatid({msg_id:"", to_id:""}))
        }
    },[]);
    useEffect(()=>{
        if(scroll_chat_id?.to_id === SelectedRoom?.id){
            setTimeout(()=>{
                GotoMainMessage(scroll_chat_id?.msg_id)
                setTimeout(()=>dispatch(setScrollToChatid({msg_id:"", to_id:""})), 2000)
            }, 100)
        }
    },[ scroll_chat_id?.to_id  === SelectedRoom?.id]);


    const regexExp = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
    const [ DocFilePopupOpen, setDocFilePopupOpen ] = useState(false);
    const [ selectDocsFile, setSelectDocsFile ] = useState({
        name: "",
        id: "",
        url: "",
    })
    const [heightScroll, setHeightScroll] = useState(false);

    // Media gallery filter
    function getExtension(path) {
        var basename = path.split(/[\\/]/).pop(),  // extract file name from full path ...
                                                   // (supports `\\` and `/` separators)
            pos = basename.lastIndexOf(".");       // get last position of `.`
    
        if (basename === "" || pos < 1)            // if file name is empty or ...
            return "";                             //  `.` not found (-1) or comes first (0)
    
        return basename.slice(pos + 1);            // extract extension ignoring `.`
    }
    let countFile = [];
    const PushMessage = [];
    // file authanticate popup open fucntion
    // const FileAuthPreview =async (message) => {
    //     const responce = await GetViewFilesAPI(message?.file?.view_file_url, access_token,message, roomId);
    //     return responce;
    // }

    // useEffect(() => {
    //     var ChatScrollMessage = document.getElementById("CHatcustomscrollid");
    //     ChatScrollMessage.scrollIntoView({ block: 'end' });
    // }, [Messages]);

    Messages?.map(async (firstMsg, i)=>{
        let msg = {...firstMsg, is_save:false};
        if(SaveChatList){
            const save = SaveChatList?.filter((item)=>item.chat_id === firstMsg?.id);
            if(save?.length >0){
                msg = {...firstMsg, is_save:true}
            }
        }
        if(((firstMsg?.group_id!==null || firstMsg?.seen_by!==null) && firstMsg?.delivered_by) || (firstMsg?.broadcast_group_id === roomId && (firstMsg?.seen_by!==null || firstMsg?.delivered_by!==null))){
            let seen_by = JSON.parse(firstMsg?.seen_by)
            let delivered_by = JSON.parse(firstMsg?.delivered_by)

            let DeliveredLength = Object?.keys(delivered_by)?.map((key) => {
                return {user_id:key, date:delivered_by[key]}
            });

            if(seen_by !== null){
                let SeenLength =Object.keys(seen_by)?.map((key) => {
                    return {user_id:key, date:seen_by[key]}
                });
                msg = {
                    ...firstMsg,
                    seen_by:seen_by,
                    seen_bylength:SeenLength,
                    delivered_by:delivered_by,
                    delivered_bylength:DeliveredLength,
                    is_save:msg?.is_save
                }
            }
            msg = {
                ...firstMsg,
                ...msg,
                delivered_by:delivered_by,
                delivered_bylength:DeliveredLength,
                is_save:msg?.is_save
            }
        }
        else {
            msg = {
                ...firstMsg,
                is_save:msg?.is_save
            }
        }
        const nextUsr = Messages[i+1]?.group_id ||   Messages[i+1]?.broadcast_group_id === roomId?{
            ...Messages[i+1],
            seen_by:JSON.parse(Messages[i+1]?.seen_by),
            delivered_by:JSON.parse(Messages[i+1]?.seen_by),
        }:{
            ...Messages[i+1],
        }
        if(msg?.message_type === "file"){
            countFile.push(msg)
            if(nextUsr?.message_type === "file" && nextUsr?.message_type!==undefined){
                if(
                     getExtension(msg?.file?.name) === "jpeg"|| 
                     getExtension(msg?.file?.name) === "png" ||
                     getExtension(msg?.file?.name) === "jpg" || 
                    //  getExtension(msg?.file?.name) === "webp"||
                     getExtension(msg?.file?.name) === "mp4" ||
                     getExtension(msg?.file?.name) === "mov" ||
                     getExtension(msg?.file?.name) === "3gp" 
                    //  getExtension(msg?.file?.name) === "webm" 
                ){
                    if(nextUsr?.from_id === msg?.from_id){
                        // console.log("countFile",countFile, msg)
                    }else{
                        if(countFile?.length>1){
                            PushMessage?.push({
                                'imagegallery':countFile,
                                'updated_at': msg.updated_at,
                                'from_id': msg.from_id,
                                'id': msg.id,
                                'created_at': msg.created_at,
                            })
                        }else{
                            countFile?.map((item1)=>PushMessage.push(item1))
                        }
                        
                    countFile = []
                    }
                }else{
                    const FilterCountList = countFile?.filter((item)=>
                    item?.id !== msg?.id && (getExtension(item?.file?.name) === "jpeg"|| 
                    getExtension(item?.file?.name) === "png" || 
                    getExtension(item?.file?.name) === "jpg" || 
                    // getExtension(item?.file?.name) === "webp"||
                    getExtension(item?.file?.name) === "mp4" ||
                    getExtension(item?.file?.name) === "mov" ||
                    getExtension(item?.file?.name) === "3gp"
                    // getExtension(item?.file?.name) === "webm" 
                    ));
                    if(FilterCountList?.length>1){
                        PushMessage?.push({
                            'imagegallery':FilterCountList,
                            'updated_at': FilterCountList[FilterCountList?.length -1]?.updated_at,
                            'from_id': FilterCountList[FilterCountList?.length -1]?.from_id,
                            'created_at': FilterCountList[FilterCountList?.length -1]?.created_at,
                            'id': FilterCountList[FilterCountList?.length -1]?.id,
                        })
                    }
                    if(FilterCountList?.length !== countFile?.length){
                        countFile?.map((item)=>{
                            if(getExtension(item?.file?.name) !== "jpeg"&&
                            getExtension(item?.file?.name) !== "png" &&
                            getExtension(item?.file?.name) !== "jpg" &&
                            // getExtension(item?.file?.name) !== "webp"&&
                            getExtension(item?.file?.name) !== "mp4" &&
                            getExtension(item?.file?.name) !== "mov" &&
                            getExtension(item?.file?.name) !== "3gp"
                            // getExtension(item?.file?.name) !== "webm" 
                            ){
                                PushMessage.push(item)
                            }
                        });
                    }
                    // PushMessage?.map((items))
                    countFile = []
                }
            }else{
                if(
                    getExtension(msg?.file?.name) === "jpeg"|| 
                    getExtension(msg?.file?.name) === "png" || 
                    getExtension(msg?.file?.name) === "jpg" || 
                    // getExtension(msg?.file?.name) === "webp"||
                    getExtension(msg?.file?.name) === "mp4" ||
                    getExtension(msg?.file?.name) === "mov" ||
                    getExtension(msg?.file?.name) === "3gp"
                    // getExtension(msg?.file?.name) === "webm" 
                ){
                    if(nextUsr?.message_type===undefined){
                        if(countFile?.length>1){
                            PushMessage?.push({
                                'imagegallery':countFile,
                                'updated_at': msg.updated_at,
                                'from_id': msg.from_id,
                                'created_at': msg.created_at,
                                'id': msg.id,
                            })
                        }else{
                            countFile?.map((item1)=>PushMessage.push(item1))
                        }
                        countFile = []
                    }else if(nextUsr?.message_type === "file"){

                    }else{
                        if(countFile?.length>1){
                            PushMessage?.push({
                                'imagegallery':countFile,
                                'updated_at': msg.updated_at,
                                'from_id': msg.from_id,
                                'created_at': msg.created_at,
                                'id': msg.id,
                            })
                        }else{
                            countFile?.map((item1)=>PushMessage.push(item1))

                        }
                        countFile = []
                    }
                }else{
                    if(countFile?.length>=2){
                        const filter = countFile?.filter((items1)=>items1?.id!==msg?.id)
                        PushMessage?.push({
                            'imagegallery':filter,
                            'updated_at': filter[filter?.length-1].updated_at,
                            'from_id': filter[filter?.length-1].from_id,
                            'created_at': filter[filter?.length-1].created_at,
                            'id': filter[filter?.length-1].id,
                        })
                        PushMessage.push(msg)
                    }else{
                        countFile?.map((item1)=>PushMessage.push(item1))
                        
                    }
                    countFile = []
                }
            }
        }else{
            countFile = []
            return PushMessage.push(msg);
        }
    });

    // messages and url anchor creating function
    const MessageGetUrl = (Message) => {
        var patternurl = /(\b(https?|ftp|file):\/\/[\-A-Z0-9+&@#\/%?=~_|!:,.;]*[\-A-Z09+&@#\/%=~_|])/img;
        var patternemojiUrl = /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/ug;
        var result = "";
        var text = Message;
        var patternFlagemojiUrl = /\p{Emoji}+/gu;

        var split = require('emoji-aware').split;
        var FlagEmojiCodes = split(Message);

        if(patternurl.test(text) === true) {
            return result = text?.replace(patternurl, '<a href="$1" class="messageUrllink" target="_blank">$1</a>');
        } else if(patternemojiUrl.test(text) === true) {
            var MessageReplcae = FlagEmojiCodes.map((emoji) => {
                return emoji.replace(patternFlagemojiUrl, "<div class='emojiTodoStyle'  contenteditable='false' >" + emoji + "</div>");
            });
            return result = MessageReplcae.join("");
        } else {
            return result = text;
        }        
        return result;
    }

    

    // file authanticate download file
    const FileAuthPreviewDownload =async (message) => {
        const url = await GetViewFilesAPI(message?.file?.view_file_url, access_token,message, roomId);
		var tempEl = document.createElement("a");
        tempEl.href = url;
        tempEl.download = message?.file?.name;
        tempEl.click();
        window.URL.revokeObjectURL(url);
    }
    // file preview popup open fucntion
    const VideoImagesShowFnt =async (message) => {
        setPreviewImageVideo(!PreviewImageVideo);
        setCurrentVideoImage(message);
    }

    // get message note 
    const GetMessageIntro = ({msg}) => {    
        let MessageList = [];
        const splitUserId = msg?.message?.substring(0, msg.message.indexOf(' '));
        const splitUserIdGet = splitUserId?.split(",");
        const splitmsglast = msg?.message?.substring(msg.message.indexOf(' ') + 1);
        const splitmsglastLast = splitmsglast?.split(" ");
        
        splitUserIdGet?.filter((elm) => {
            if(elm === UserId) {
                MessageList.push("You");
            } else {
                if(Contacts?.filter((user) => elm === user?.id).length > 0) {
                    Contacts?.filter((user) => {
                        if(elm === user?.id) {
                            // console.log("splitmsglast", elm, user)
                            MessageList.push(user?.name);        
                        }
                    })
                } else {
                    if(DetailsList[msg?.id]){
                        const groupDetails = DetailsList[msg?.id]?.users?.filter(item=>item?.id === elm);
                        if(groupDetails?.length>0){
                            MessageList.push(groupDetails[0]?.name);
                        }else if(UserDetails[elm]){
                            MessageList.push(UserDetails[elm]?.name);
                        }
                    }else if(UserDetails[elm]){
                        MessageList.push(UserDetails[elm]?.name);
                    }else if(IsUUID(elm)){
                        console.log("elm", elm)
                    }
                }
            }
        })
        splitmsglastLast?.map((elm, index) => {
            const elms = elm?.split(',');
            let lets = "";
            elms?.map((items, indexs)=>{
                if(items === UserId) {
                    if(lets === ""){
                        lets = "You"
                    }else
                        lets = lets + ", You";
                }else {
                    if(UserDetails[items]){
                        if(lets === ""){
                            lets = UserDetails[items]?.name
                        }else
                        lets = lets +", " + UserDetails[items]?.name
                    }else if(IsUUID(elm)){
                        console.log("elm", elm)
                        CommanGetdetails(ws, elm, "single")
                    }
                }
            })
            if(lets!==""){
                splitmsglastLast[index] = lets
            }
        })
        return (<div className="messageNotes">{MessageList.join(', ').toString() + " " + splitmsglastLast.join(' ').toString()}</div>)
        
    }

    
    // saved message marks show
    const MessageIsSavedOrNot = (msg) => {
        // console.log("SvedMessageMark", SvedMessageMark)
        return (<React.Fragment>
            {!(msg.deleted_at) && <div className="savedMessageMarkwrapper"><small className="savedMessageMark"><div className="loveIcon"></div></small></div>}
        </React.Fragment>);
    }

    // broadcast message marks show
    const MessageIsBroadcastOrNot = (msg) => {
        // console.log("SvedMessageMark", SvedMessageMark)
        return (<React.Fragment>
            {!(msg.deleted_at) && (msg.from_id === userLogin?.user_id) && <div className="broadCastMarkwrapper"><small className="broadcastMessageMark"><div className="loveIcon"></div></small></div>}
        </React.Fragment>);
    }


    // creating message date time wise groups  //;
    // console.log("groupArraysMessage", PushMessage)
    // console.log("PushMessage", PushMessage?.filter((item)=>item?.deleted_at!==null));
    // const MessagesData = PushMessage && PushMessage?.reverse();
    // console.log("MessagesData", MessagesData)
    const MessageUpdateDate = PushMessage && PushMessage?.sort(( a, b )=> {
                return  moment.utc(a.created_at) -  moment.utc(b.created_at)
        }).reduce((groups, files) => {
        const date = moment.utc(files.created_at).local().format('DD MMMM YYYY');
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
    // go to message reply functions
    const GotoMainMessage = (messageinfo) => {
        var messagegoid = document.getElementById("messageid" + messageinfo);
        messagegoid?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        messagegoid?.classList?.add("activereplymessage")
        setTimeout(() => {
            messagegoid?.classList?.remove("activereplymessage");
            dispatch(setScrollToChatid({msg_id:"", to_id:""}))
        }, 1000);
    }
    const ReplayChatComponent = ({Replaymsg, users}) =>{
        return(
            <div className={Replaymsg?.message_type === "contact" ? "replymessgaBox ContactReplymessgaBox" :Replaymsg?.message_type === "location"? "replymessgaBox Location": "replymessgaBox"}>
                <div className="replywithmember">{users}</div>
                <div className="replywithmemberMessgae" onClick={() => GotoMainMessage(Replaymsg?.id)}>
                    {
                        Replaymsg?.message_type === "text"&&
                        <div
                            className={Replaymsg?.message?.replaceAll(' ', '')?.length > 2000 ? "messagtitle messageHideLimit" : Replaymsg?.message?.replaceAll(' ', '')?.length > 500 ? "messagtitle alignTextSet" : Replaymsg?.message?.replaceAll(' ', '')?.length <= 25 ? "messagtitle smalltextallign" : "messagtitle"} 
                        >{Replaymsg?.message}</div>
                    }
                    {Replaymsg?.message_type === "contact" && <ShareContactMessage msg={Replaymsg}/> }
                    {Replaymsg?.message_type === "file" &&
                        ((Replaymsg?.file?.name?.split('.').pop() === "jpg" || Replaymsg?.file?.name?.split('.').pop() === "jpeg" || Replaymsg?.file?.name?.split('.').pop() === "png" || Replaymsg?.file?.name?.split('.').pop() === "webp" || Replaymsg?.file?.name?.split('.').pop() === "mp4" || Replaymsg?.file?.name?.split('.').pop() === "webm") ? 
                        (<div className="replyFileWrapper">
                            {(Replaymsg?.file?.name?.split('.').pop() === "jpg" || Replaymsg?.file?.name?.split('.').pop() === "jpeg" || Replaymsg?.file?.name?.split('.').pop() === "png" || Replaymsg?.file?.name?.split('.').pop() === "webp") ? (
                                <React.Fragment>
                                    <FileAuthPreview message={Replaymsg} url={Replaymsg?.file?.view_thumbnail_url} alt={Replaymsg?.file?.name}  />
                                    <h4>Photo</h4>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <div className="replyfilesVideoPreviw">
                                        <FileAuthPreview message={Replaymsg} url={Replaymsg?.file?.view_thumbnail_url} alt={Replaymsg?.file?.name}  />
                                        <Image src={PlayButton} className="videoPLybtn" alt="play button" />
                                    </div>
                                    <h4>Video</h4>
                                </React.Fragment>
                            )}
                            
                        </div>) : 
                        (<div className="replyFileWrapper">
                            {(Replaymsg?.file?.name?.split('.').pop() === "mp3" || Replaymsg?.file?.name?.split('.').pop() === "m4a" || Replaymsg?.file?.name?.split('.').pop() === "ogg" || Replaymsg?.file?.name?.split('.').pop() === "wav" || Replaymsg?.file?.name?.split('.').pop() === "mpeg") && (<React.Fragment>
                                <div className="audioimagereply">
                                    <Image src={AudioImageMain} alt={Replaymsg?.file?.name} />
                                </div>
                                <h4>Audio</h4>
                            </React.Fragment>)} 
                            {( checkExtension(Replaymsg?.file?.name) ) && (<React.Fragment>
                                <div className="audioimagereply">
                                <div className={getFileName(Replaymsg?.file?.name, "fileUplodedImageMode")}></div>
                                </div>
                                <h4>{Replaymsg?.file?.name?.split('.').pop()}</h4>
                            </React.Fragment>)}
                        </div>))
                    }
                    {
                        Replaymsg?.message_type === "location" && MessagesLocationBox({msg:Replaymsg,  reply_msg:true})
                    }
                    {Replaymsg?.message_type === "text delete"&&(
                        <div
                        className={"messagtitle"} 
                    >{Replaymsg?.message}</div>
                    )}
                </div>    
            </div>
        )
    }
    // reply message function
    const ReplayMessages = ({msgs, }) =>{
        // const message = Messages?.filter((item)=>item?.id===msgs?.reply_id);
        const Replaymsg=replySaveChat[msgs?.reply_id]
        if(replySaveChat[msgs?.reply_id]){
            let users = "";
            if(SelectedRoom?.admin_ids){
                const sendUser = SelectedRoom?.users?.filter(item =>item?.id === Replaymsg?.from_id);
                if(sendUser){
                    if(sendUser[0]?.id === userLogin?.user_id){
                        users = "You"
                    }else{
                        users = sendUser[0]?.name
                    }
                }
            }else if(Replaymsg?.from_id === userLogin?.user_id){
                users = "You"
            }else{
                users = SelectedRoom?.name
            }
            return ReplayChatComponent({Replaymsg:Replaymsg, users:users})

        }else{
            const ResultReplaymsg = MessagesAllList?.filter((item)=>item?.id===msgs?.reply_id);
            if(ResultReplaymsg){
                const Replaymsg = ResultReplaymsg[0];
                let users = "";
                if(SelectedRoom?.admin_ids){
                    const sendUser = SelectedRoom?.users?.filter(item =>item?.id === Replaymsg?.from_id);
                    if(sendUser){
                        if(sendUser[0]?.id === userLogin?.user_id){
                            users = "You"
                        }else{
                            users = sendUser[0]?.name
                        }
                    }
                }else if(Replaymsg?.from_id === userLogin?.user_id){
                    users = "You"
                }else{
                    users = SelectedRoom?.name
                }
                return ReplayChatComponent({Replaymsg:Replaymsg, users:users})
            }else{
                if(SelectedRoom?.admin_ids){
                    let param = {
                        "transmit":"single",
                        "url":"chat_detail",
                        "request": {
                            "chat_type":"group",
                            "chat_id":msgs?.reply_id,
                            "to_id":SelectedRoom?.id
                        }
                    }
                    wsSend_request(ws, param);
                }else{
                        let param = {
                            "transmit":"single",
                            "url":"chat_detail",
                            "request": {
                                "chat_type":"single",
                                "chat_id":msgs?.reply_id,
                                "to_id":SelectedRoom?.id
                            }
                        }
                        wsSend_request(ws, param);
                }
            }
        }
    }
    
    // Display UserName function
    const DisplayUserName = ({msg, }) =>{
        const users = SelectedRoom?.users?.filter((item) =>item.id === msg?.from_id)
        let username;
        if(users?.length>0){
            username = users[0]?.name;
            // console.log("MessagesMessages", message, SelectedRoom, Replaymsg?.from_id)
        }else{
            username = ""
        }
        return(
            <small className="groupusername_display">
                {username}
            </small>
        )
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

    // docs file preview function
    const DocsFilePreviewFnt = (files) => {
        // console.log("files321======>",files);
        setDocFilePopupOpen(true);
        setSelectDocsFile({...selectDocsFile, file: files,name: files.name, id: files.id, url: files.url,});
    }

    // get video time set
    const GetVideoTime = (msg) => {
        const TimeOfVideo = msg.file.duration.split(".")[0].split(":");
        let HrsTimeVideo = "";
        if(TimeOfVideo[0] > 0) {
            HrsTimeVideo = TimeOfVideo[0] + ":" + TimeOfVideo[1];
        } else {
            HrsTimeVideo = TimeOfVideo[1] + ":" + TimeOfVideo[2];
        }

        return(<React.Fragment>
            <div className="videoTimeGet">{HrsTimeVideo}</div>
        </React.Fragment>)
    };
    
    // image video files show function
    const ImageVideoFileCreateGroups = (msg) => {     

        return msg?.imagegallery !== undefined? 
        <div className={msg.imagegallery?.length > 3 ? "imageUplodedGroupsWrap gallery_div" : "imageUplodedGroupsWrap"}>
            {msg?.imagegallery?.slice(0, 4)?.map((msg1, index) => (
                <React.Fragment key={index}>
                    {(
                        msg1?.file?.name?.split('.').pop() === "jpg" || 
                        msg1?.file?.name?.split('.').pop() === "jpeg" || 
                        msg1?.file?.name?.split('.').pop() === "png" || 
                        msg1?.file?.name?.split('.').pop() === "webp"
                    ) && (
                        <div className="imageUplodedGroups filesGroups" >
                            {/* <Image src={msg1?.file?.name} alt={msg1?.file?.name} onClick={() => VideoImagesShowFnt(msg1)}/> */}
                            <FileAuthPreview message={msg1} url={msg1?.file?.view_thumbnail_url} alt={msg1?.file?.name} onClick={()=>VideoImagesShowFnt(msg1)} />
                            {/* <div className="imagegroupDate">
                                {moment.utc(msg1?.created_at).local().format('hh:mm a')}
                            </div> */}
                            {msg?.imagegallery.length > 4 && (index === 3 && (
                                <div 
                                    className="imageGroupcount" 
                                    onClick={() => VideoImagesShowFnt(msg1)}
                                    >+ {msg?.imagegallery.length - 4}
                            </div>))}
                        </div>
                    )}

                    {(msg1?.file?.name?.split('.').pop() === "mp4" || msg1?.file?.name?.split('.').pop() === "mov" || msg1?.file?.name?.split('.').pop() === "3gp") && (
                        <div className="VideoUploadGroups filesGroups" onClick={() => VideoImagesShowFnt(msg1)}>
                            <Image src={PlayButton} className="videoPLybtn" alt="play button" />
                            {/* <Image src={msg1?.file?.name}  alt="video poster image" /> */}
                            <FileAuthPreview message={msg1} className="videoposterimage" url={msg1?.file?.view_thumbnail_url} alt={msg1?.file?.name} />
                            {/* <div className="imagegroupDate">
                                {moment.utc(msg1?.created_at).local().format('hh:mm a')}
                            </div> */}
                            {msg?.imagegallery.length > 4 && (index === 3 && (
                                <div 
                                    className="imageGroupcount" 
                                    onClick={() => VideoImagesShowFnt(msg1)}
                                    >+ {msg?.imagegallery.length - 4}
                            </div>))}
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
        :
        (<div className="imageUplodedGroupsWrap">            
            {(msg?.file?.name?.split('.').pop() === "jpg" || msg?.file?.name?.split('.').pop() === "jpeg" || msg?.file?.name?.split('.').pop() === "png" || msg?.file?.name?.split('.').pop() === "webp") && (
                <div className="imageUplodedGroups" >
                    {/* :window.URL.createObjectURL(msg?.blob?.url) */}
                    {/* <Image src={msg?.file?.name} alt={msg?.file?.name} onClick={() => VideoImagesShowFnt(msg)}/> */}
                    <FileAuthPreview message={msg} onClick={() => VideoImagesShowFnt(msg)} url={msg?.file?.view_thumbnail_url} alt={msg?.file?.name} />

                </div>
            )}

            {(msg?.file?.name?.split('.').pop() === "mp4" || msg?.file?.name?.split('.').pop() === "mov" || msg?.file?.name?.split('.').pop() === "3gp") && (
                <div className="VideoUploadGroups" onClick={() => VideoImagesShowFnt(msg)}>
                    <div className="videosizeset">
                        {formatFileSize(msg?.file?.size)}
                    </div>
                    <Image src={PlayButton} className="videoPLybtn" alt="play button" />
                    {/* <Image src={msg?.file?.name} className="videoposterimage" alt="video poster image" /> */}
                    <FileAuthPreview message={msg} className="videoposterimage" url={msg?.file?.view_thumbnail_url} alt={msg?.file?.name} />
                    {GetVideoTime(msg)}
                </div>
            )}

            {/* all files groups */}
            {(checkExtension(msg?.file?.name)) && (<div 
                className="filesUplodedUIwrappser"
            >
                <div 
                    className="filedetailswrapps"
                    onClick={() => {
                        (msg?.file?.name?.split('.').pop() === "pdf") && DocsFilePreviewFnt(msg?.file);                    
                    }}
                >
                    <div className={getFileName(msg?.file?.name, "fileUplodedImageMode")}></div>
                    <div className="filedetails">
                        <h4>{msg?.file?.name}</h4>
                        {/* {console.log("msg======>", msg)} */}
                        <span>
                            {formatFileSize(msg?.file?.size)} &nbsp;
                            <small>
                                    <MessageStatus SelectedRoom={SelectedRoom} msg={msg} />
                                    <span className="d-inline w-auto messageTimeset">
                                        {msg?.is_save === true && MessageIsSavedOrNot(msg)}
                                        {(msg?.is_broadcast === true && msg.broadcast_group_id === undefined) && MessageIsBroadcastOrNot(msg)}
                                        {moment.utc(msg?.created_at).local().format('hh:mm a')}
                                    </span>
                            </small>
                        </span>
                    </div>
                </div>
                <button onClick={() => FileAuthPreviewDownload(msg)}>Download</button>
            </div>)}
            
            {/* Audio files here */}
            {(msg?.file?.name?.split('.').pop() === "mp3" || msg?.file?.name?.split('.').pop() === "m4a" || msg?.file?.name?.split('.').pop() === "ogg" || msg?.file?.name?.split('.').pop() === "wav" || msg?.file?.name?.split('.').pop() === "mpeg") && (<div className="audioUploadGroups" >
                <FileAuthPreview 
                    message={msg} 
                    url={msg?.file?.view_file_url} 
                    Type={"Audio"}
                />
                {/* {console.log("msg======>", msg)} */}
                {/* <div className="file_sizeset">{formatFileSize(msg?.file?.size)}</div> */}
                {/* <div className="file_sizeset">{moment.utc(new Date(msg?.updated_at)).format('hh:mm a')}</div> */}
                {/* <span> */}
                    {/* {formatFileSize(msg?.file?.size)} &nbsp; */}
                    <small className="delivSeenmsg">
                            <MessageStatus SelectedRoom={SelectedRoom} msg={msg} />
                            <span className="d-inline w-auto messageTimeset">
                                {msg?.is_save === true && MessageIsSavedOrNot(msg)}
                                {(msg?.is_broadcast === true && msg.broadcast_group_id === undefined) && MessageIsBroadcastOrNot(msg)}
                                {moment.utc(msg?.created_at).local().format('hh:mm a')}
                            </span>
                    </small>
                {/* </span> */}
            </div>)}
        </div>)
    }

    // remore btn show function
    const showMoreFunt = (msg) => {
        var MessageId = document.getElementById("msg_id_" + msg);
        var MessageReadMoreId = document.getElementById("showbtnmsg_id_" + msg);
        MessageId.classList.toggle("showfulltext");
        MessageReadMoreId.classList.toggle("hideReadMorebtn");
    }

    {/* scroll bottom to top get height function */}
    const onScroll = (e) => {
        const scrollTop = e.target.scrollTop
        const scrollHeight = e.target.scrollHeight;
        let min_height = 290;
        if(screen.height>1000){
            min_height = 522;
        }else if(screen.height>960){
            min_height = 500;
        }else if(screen.height>840){
            min_height = 420;
        }else if(screen.height>750){
            min_height = 290;
        }
        const maxScrollTop = scrollHeight - scrollTop - min_height;
        if(maxScrollTop > 440) {
            setHeightScroll(true);
        }
         else {
            setHeightScroll(false);
        }
        if(scrollTop === 0 && Loader !== true){
                    // SetLoader(true);
                const Data = PaginationList(MessagesAllList, 50, pagination?.page_number+1);
                if(Data?.length){
                    SetLoader(true);
                    dispatch(SetUpdatepaginationList(Data?.reverse()));
                    setTimeout(()=>GotoMainPageMessage(Data[Data?.length - 1]?.id), 1000)
                    setTimeout(()=>SetLoader(false), 2000)
                }
        }
        // console.log("scrollTop", Pagination)
    }

    {/* scroll top to bottom function */}
    const ScrollTopPage = () => {
        var ChatScrollMessage = document.getElementById("CHatcustomscrollid");
        ChatScrollMessage.scrollIntoView({ block: 'end' });
    }

    // dropdown outside close
    const ToggleOutSideClose = (id) => {
        if(selectId === id) {
            if(selectId === "") {
                setSelectId(id); 
            } else {
                setSelectId(""); 
            }
        } else {
            setSelectId(id); 
        }
    };

    // contact share box message
    const ShareContactMessage = ({msg}) => {
        var splitedNameNmber = msg?.message.split('[|]');
        var GetName = splitedNameNmber[0];
        var GetNumber = splitedNameNmber[1];

        return(<div className="contactSharedDemo">
            <Image src={DummyImage} alt="shared profile" />
            <div className="contactNameDeta">
                <h4>{GetName}</h4>
                {/* <p>{"+ " + GetNumber}</p> */}
                <p>{GetNumber.includes("+") ? GetNumber : `+ ${GetNumber}`}</p>
            </div>
        </div>)
    };

    // const [ scrollMessageUpdate, setScrollMessageUpdate ] = useState(25);
    // const [ MessagesArray, setMessagesArray ] = useState([]);
    // // const [ Messageheight, setMessageheight ] = useState(0);
    // // const ref = useRef(null)
    // const CurrentMessageLength = PushMessage.length - PushMessage.slice(PushMessage.length - scrollMessageUpdate).length;
    // let UpdatedMessages = [...MessagesArray];

    // useEffect(() => {
    //     setMessagesArray(PushMessage.slice(PushMessage.length - scrollMessageUpdate));
    //     // setMessageheight(Messageheight * 10);
    // }, [ PushMessage, scrollMessageUpdate, CurrentMessageLength ]);

    // useEffect(() => {
    //     setScrollMessageUpdate(25);
    // }, [ UserId ]);

    // const handleScroll = (e) => {
    //     const ScrollBottomTop = e.target.scrollTop === 0;
    //     if(ScrollBottomTop === true) {
    //         if(CurrentMessageLength < 15) {
    //             setScrollMessageUpdate(PushMessage.length);
    //         } else {
    //             setScrollMessageUpdate(scrollMessageUpdate + 10);
    //         };
    //     };
    // };

    // console.log(`Message Height:${Messageheight}`,`Current Message:${CurrentMessageLength} /`, `All Message:${Messages.length} /`, `Message Update:${scrollMessageUpdate}`);

    return(
        <div onClick={(e)=>{
            e.stopPropagation();
            setuploadfileBox(false);
            setSelectId("");
        }} className="chatpannelwrapper">
            <div
                className="CHatcustomscroll"
                id={"CHatcustomscroll"}
                style={{
                    overflow: "auto",
                    display: "grid",
                    height: `calc(${styleData} - ${heightManage}px)`,
                }}
                onScroll={(e) => onScroll(e)}
            >   
            {/* {Loader && <MessagesListLoader className={"chat_messages_loader"} isShow={true}/>} */}
                <ul
                    id="CHatcustomscrollid"
                    style={{
                        display: "flex", 
                        justifyContent: "flex-end",
                        alignItems: "end",
                        flexDirection: "column",
                    }}
                >
                    {groupArraysMessage && groupArraysMessage?.map((elms, index) => 
                        <React.Fragment key={index}>
                            <div className="datetimemessage">
                                <div className="timelabel">{timeSince(new Date(elms?.date))}</div>
                            </div>
                            
                                {elms?.MessageLists?.map((msg, index) => <React.Fragment key={index}>
                                {/* show={msg?.id === selectId ? true : false} */}
                                {(msg.message_type === "text" || msg.message_type === "file" || msg.message_type === "contact" || msg.message_type === "location" || msg.message_type === "text delete"|| msg.imagegallery !== undefined) ? (
                                    <Dropdown show={msg?.id === selectId ? true : false} as={ButtonGroup} >
                                        <li className={msg?.from_id === UserId ? "chatMessageList Me" : "chatMessageList"} id={"messageid" + msg?.id} >
                                            <div className={msg.deleted_at !== null && msg.deleted_at !== undefined ? "chatMsg DeletedMessage" : 
                                                            !msg?.reply_id && msg?.message_type === "file" ? "chatMsg files" :  
                                                            msg?.message_type === "contact" ? "chatMsg contactShared" : 
                                                            msg?.reply_id !== null ? "chatMsg replyMessage_set" :
                                                            !msg?.reply_id && msg?.message_type === "file" ? "chatMsg files replyMessage_set" :
                                                            msg?.message_type === "location" ?  "chatMsg files location" : "chatMsg"}>
                                            {/* message forword note */}
                                            {msg.deleted_at === null && (<React.Fragment>{msg?.is_forward === true && (<div className="messageForwordSet"><Image src={ForwordMessage} alt="forword message"/> Forwarded</div>)}</React.Fragment>)}

                                            {(msg?.group_id !==undefined && msg?.from_id !== UserId) &&
                                                (msg?.message_type === "file" || msg?.message_type === "text" || msg?.message_type === "contact" || msg?.message_type === "location") &&
                                                <DisplayUserName msg={msg}  />
                                            }
                                            {/* <div className={msg?.message_type === "file" ? "chatMsg files" : "chatMsg"} > */}
                                                {/* sended message  */}
                                                {/* {((msg.deleted_at === null|| msg.deleted_at === undefined)  && msg?.reply_id) && <ReplayMessages msgs={msg} />} */}
                                                {((msg.deleted_at === null|| msg.deleted_at === undefined)  && msg?.reply_id) && ReplayMessages({msgs:msg})}

                                                {/* contact share box message */}
                                                {msg?.message_type === "contact" && <ShareContactMessage msg={msg}/>}

                                                {/* Location share box messages */}
                                                {msg?.message_type === "location" && (
                                                    <React.Fragment>
                                                        {MessagesLocationBox({msg})}
                                                    </React.Fragment>
                                                )}

                                                {/* get messages with url link */}
                                                {(msg?.message_type !== "file" && msg?.message_type !== "contact" && msg.message_type !== "location" &&  msg?.imagegallery === undefined )&& (msg?.Message !== ""  && (
                                                    <div 
                                                        className={msg?.message?.replaceAll(' ', '')?.length > 2000 ? "messagtitle messageHideLimit" : msg?.message?.replaceAll(' ', '')?.length > 500 ? "messagtitle alignTextSet" : msg?.message?.replaceAll(' ', '')?.length <= 25 ? "messagtitle smalltextallign" : "messagtitle"} 
                                                        id={`msg_id_${msg.id}`}
                                                        dangerouslySetInnerHTML={
                                                            {__html: MessageGetUrl(msg?.message)}
                                                        }>
                                                    </div>
                                                ))}
                                                {(msg?.message_type === "file" || msg?.imagegallery !== undefined) && ImageVideoFileCreateGroups(msg)}

                                                {/* message seen and message time */}
                                                {(msg?.message_type === "text" || msg?.message_type === "contact" || msg?.message_type === "location" || msg?.message_type === "text delete" || msg?.file?.name?.split('.').pop() === "jpg" || msg?.file?.name?.split('.').pop() === "jpeg" || msg?.file?.name?.split('.').pop() === "png" || msg?.file?.name?.split('.').pop() === "webp" || msg?.file?.name?.split('.').pop() === "mp4" || msg?.file?.name?.split('.').pop() === "mov" || msg?.file?.name?.split('.').pop() === "3gp" || msg?.file?.name?.split('.').pop() === "webm") && (<small className="msgdelivered">
                                                    {/* message saved note */}
                                                    {(msg?.message?.replaceAll(' ', '')?.length > 2000) && (
                                                    <div
                                                        id={`showbtnmsg_id_${msg.id}`}
                                                        className="mesgshowBtn" 
                                                        onClick={() => {
                                                            showMoreFunt(msg.id);
                                                        }}
                                                    >Show More</div>)}    
                                                    
                                                    {msg?.deleted_at === null && (msg?.is_edited === true ? "edit " : null)}
                                                    {/* {console.log("msg", msg)} */}
                                                    <MessageStatus SelectedRoom={SelectedRoom} msg={msg} />
                                                    <span className="d-inline w-auto messageTimeset">
                                                        {msg?.is_save === true && MessageIsSavedOrNot(msg)}
                                                        {(msg?.is_broadcast === true && msg.broadcast_group_id === undefined) && MessageIsBroadcastOrNot(msg)}
                                                        {moment.utc(msg?.created_at).local().format('hh:mm a')}
                                                    </span>
                                                </small>)}
                                                {msg?.imagegallery !== undefined ?
                                                msg?.imagegallery?.length >0 && 
                                                (<small className="msgdelivered">
                                                    {moment.utc(msg?.created_at).local().format('hh:mm a')}
                                                    <MessageStatus msg={msg?.imagegallery[msg?.imagegallery?.length-1]} SelectedRoom={SelectedRoom} />
                                                </small>)
                                                :<React.Fragment></React.Fragment>}
                                                {/* chat message dropdown button here */}
                                                {msg?.deleted_at === null && msg?.imagegallery === undefined && (<Dropdown.Toggle onClick={(e) => {
                                                    e.stopPropagation();
                                                    ToggleOutSideClose(msg?.id)
                                                }} variant="default" id={`dropdown-${msg?.id}`}></Dropdown.Toggle>)}
                                            </div>
                                        </li>

                                        {/* chat message dropdown  */}
                                        <ChatDropDownMenu 
                                            setSelectId={setSelectId}
                                            msg={msg} 
                                            editMessageFn={editMessageFn} 
                                            ReplyMessage={ReplyMessage}
                                            saveMessageFun={saveMessageFun}
                                            SelectedRoom={SelectedRoom}
                                            is_save={msg?.is_save}
                                            setMessagesInfoSidebar={setMessagesInfoSidebar}
                                            MessageInfoSidebar={MessageInfoSidebar}
                                            groupInfoSidebar={groupInfoSidebar}
                                            setGroupInfoSidebar={setGroupInfoSidebar}
                                            callMessageInfo={callMessageInfo}
                                            FileAuthPreviewDownload={FileAuthPreviewDownload}
                                            setIsEditing={setIsEditing}
                                            DocsFilePreviewFnt={DocsFilePreviewFnt}
                                        /> 
                                            
                                    </Dropdown>
                                ) : (<li className="messagenoteWraps"  id={"messageid" + msg?.id}>
                                        {<GetMessageIntro msg={msg}/>}
                                </li>)}
                                
                            </React.Fragment>
                            )}
                            
                        </React.Fragment>
                    )}
                    
                    {SelectedRoom?.userTyping !== undefined&&(SelectedRoom?.userTyping?.status === 1&&
                    <CommanTyping type={"boc"} SelectedRoom={SelectedRoom} user_id={SelectedRoom?.userTyping?.user_id} />
                    // <Dropdown as={c} >
                    //     <li className={"chatMessageList"} >
                    //         <div className="typeing_main_div">
                    //             <div class="chat-bubble">
                    //                 <div class="typing">
                    //                     <div class="dot"></div>
                    //                     <div class="dot"></div>
                    //                     <div class="dot"></div>
                    //                 </div>
                    //             </div>
                    //         </div>
                    //     </li>
                    // </Dropdown>
                    )}
                    <div id="chatPanelScroll" />
                </ul>
            </div>

            {/* image and video preview modal */}
            {PreviewImageVideo === true && (<PreviewPopup UserId={UserId} callMessageInfo={callMessageInfo} Contacts={Contacts} setPreviewImageVideo={setPreviewImageVideo} CurrentVideoImage={CurrentVideoImage} Messages={Messages} />)}
            {/* doc file preview  */}
            {DocFilePopupOpen === true && (<DocFilesPreview selectDocsFile={selectDocsFile} setSelectDocsFile={setSelectDocsFile} setDocFilePopupOpen={setDocFilePopupOpen} />)}
            {/* message composer filed here */}
            {SelectedRoom?.is_block ===true&&
                <div className="block_info">
                    <Button variant="outline-danger" onClick={()=>callUnBlockContact()}>
                        You block this contact. Tap to Unblock
                    </Button>
                    
                </div>}
            {SelectedRoom?.group_type &&  <div className="block_info">
                <Button disabled variant="outline-info" >
                    You can`t send messages here
                </Button>
            </div>}
            <MessageCompose 
                isOpenFireFoxBrowser={isOpenFireFoxBrowser}
                Messages={Messages}
                onEnterAddBreakdown={onEnterAddBreakdown}
                setHeightManage={setHeightManage} 
                heightManage={heightManage}
                SendMessageFun={SendMessageFun}
                SendImagesFunction={SendImagesFunction}
                picker={picker} 
                setpicker={setpicker}
                SendMessageOnchange={SendMessageOnchange}
                imageUploads={imageUploads}
                setImageUploads={setImageUploads}
                RemoveUplodedImage={RemoveUplodedImage}
                replySelectMessage={replySelectMessage}
                RemoveReplyMessageFnt={RemoveReplyMessageFnt}
                isMessageEmpty={isMessageEmpty}
                setIsMessageEmpty={setIsMessageEmpty}
                className={(SelectedRoom?.is_block === true || SelectedRoom?.group_type)? "d-none":"d-block"}
                setuploadfileBox={setuploadfileBox}
                uploadfileBox={uploadfileBox}
                callUserTypeingStatus={callUserTypeingStatus}
            />
            {/* scroll bottom to top button */}
            {heightScroll === true && (<Button className="scrollbottom" id="scrollbottoms" onClick={() => ScrollTopPage()}>
                <span className="imgdiv"></span>
            </Button>)}
        </div>
    )
}

export default ChatMessagesPanel;
