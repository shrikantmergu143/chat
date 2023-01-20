/* eslint-disable no-useless-escape */
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import moment from "moment";
import { AudioPlayerControlSprite, Audio} from 'react-audio-player-pro';
import PlayButton from "../../../assets/img/videoplaybtn.svg";
import DummyImage from '../../../assets/img/profile/dummyimage.png';
import { Image } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars-2';
import AudioImageMain from "../../../assets/img/sidebar/last_audio.svg";
import DownloadFile from "../../../Api/DownloadFile";
import ForwordMessage from "../../../assets/img/Fordwardmessgae.png";
import FileAuthPreview from '../FileAuthPreview';
import MessageStatus from '../MessageStatus';
import { checkExtension, getFileName } from '../SearchChat/MessagesPanel';
import { MessagesLocationBox } from '../ChatMessagesPanel';
import PreviewPopup from '../../common/PreviewPopup';

// contact share box message
export const ShareContactMessage = ({msg}) => {
    var splitedNameNmber = msg?.message.split('[|]');
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
            
        </div>
    )
};
export const ReplayMessageChat = ({Replaymsg, users}) =>{
    
    return(
            <div className={Replaymsg?.message_type === "contact" ? "replymessgaBox ContactReplymessgaBox" :Replaymsg?.message_type === "location"? "replymessgaBox Location":  "replymessgaBox"}>
                <div className="replywithmember">{users}</div>
                <div className="replywithmemberMessgae" >
                    {
                        Replaymsg?.message_type === "text"&&
                        <div className={Replaymsg?.message?.replaceAll(' ', '')?.length > 2000 ? "messagtitle messageHideLimit" : Replaymsg?.message?.replaceAll(' ', '')?.length > 500 ? "messagtitle alignTextSet" : Replaymsg?.message?.replaceAll(' ', '')?.length <= 25 ? "messagtitle smalltextallign" : "messagtitle"} >{Replaymsg?.message}</div>
                    }
                    {Replaymsg?.message_type === "contact" && <ShareContactMessage msg={Replaymsg}/> }
                    {Replaymsg?.message_type === "file" &&
                        ((Replaymsg?.file?.name?.split('.').pop() === "jpg" || Replaymsg?.file?.name?.split('.').pop() === "jpeg" || Replaymsg?.file?.name?.split('.').pop() === "png" || Replaymsg?.file?.name?.split('.').pop() === "webp" || Replaymsg?.file?.name?.split('.').pop() === "mp4" || Replaymsg?.file?.name?.split('.').pop() === "webm") ? 
                        (<div className="replyFileWrapper">
                            {(Replaymsg?.file?.name?.split('.').pop() === "jpg" || Replaymsg?.file?.name?.split('.').pop() === "jpeg" || Replaymsg?.file?.name?.split('.').pop() === "png" || Replaymsg?.file?.name?.split('.').pop() === "webp") ? (
                                <React.Fragment>
                                    <FileAuthPreview message={Replaymsg} url={Replaymsg?.file?.view_thumbnail_url} alt={Replaymsg?.file?.name} />
                                    <h4>Photo</h4>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <div className="replyfilesVideoPreviw">
                                        <FileAuthPreview message={Replaymsg} url={Replaymsg?.file?.view_thumbnail_url} alt={Replaymsg?.file?.name} />
                                        <Image src={PlayButton} className="videoPLybtn" alt="play button" />
                                    </div>
                                    <h4>Video</h4>
                                </React.Fragment>
                            )}
                            
                        </div>) : 
                        (
                        <div className="replyFileWrapper">
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
                        Replaymsg?.message_type === "location" && MessagesLocationBox({msg:Replaymsg, reply_msg:true})
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
export default function MessagePanel(props) {
    const SelectedRoom = useSelector((state) => state.allReducers.SelectedRoom);
    const access_token = useSelector((state)=>state?.allReducers?.access_token)
    const Messages = useSelector((state) => state.allReducers.MessageList[SelectedRoom?.id]);
    const userLogin = useSelector((state) => state.allReducers.userLogin);
    const replySaveChat = useSelector((state) => state.allReducers.replySaveChat);
    const UserID = useSelector((state) => state.allReducers.userLogin.user_id);
    const Contacts = useSelector((state) => state?.allReducers?.Contacts);
    const [PreviewImageVideo, setPreviewImageVideo] = useState(false);
    const [CurrentVideoImage, setCurrentVideoImage] = useState("");
    const [ MessageInfoSidebar, setMessagesInfoSidebar ] = useState({
        show:false,
        Messages:[],
      });

    const {msg} = props;

    const ReplayMessages = ({msgs, }) =>{
        const ReplaymsgFilter = Messages?.filter((item)=>item?.id===msgs?.reply_id);
        if(ReplaymsgFilter){
            const Replaymsg = ReplaymsgFilter[0];
            let users = "";
            if(SelectedRoom?.isGroups){
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
            return ReplayMessageChat({Replaymsg:Replaymsg, users:users})
        }else{
            const ResultReplaymsg = replySaveChat[msgs?.reply_id];
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
                return ReplayMessageChat({Replaymsg:Replaymsg, users:users})
            }
        }
    }

    // file preview popup open fucntion
    const VideoImagesShowFnt =async (message) => {
        setPreviewImageVideo(!PreviewImageVideo);
        setCurrentVideoImage(message);
    }

    const callMessageInfo = (msg) =>{
        setMessagesInfoSidebar({
            show:true,
            Messages:[{...msg}]
        });
  
        // dispatch(UpdateMediaFiles(SelectedRoom))
    }

    const showMoreFunt = (msg) => {
        var MessageId = document.getElementById("msg_id_" + msg);
        var MessageReadMoreId = document.getElementById("showbtnmsg_id_" + msg);
        MessageId.classList.toggle("showfulltext");
        MessageReadMoreId.classList.toggle("hideReadMorebtn");
    }

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
        // return result;
    }
    
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
    }
    const messageIsSavedOrNot = (msg) => {
        // console.log("SvedMessageMark", SvedMessageMark)
        return (<React.Fragment>
            {!(msg?.deleted_at) && <div className="savedMessageMarkwrapper"><small className="savedMessageMark"><div className="loveIcon"></div></small></div>}
        </React.Fragment>);
    }
    const formatFileSize = (bytes,decimalPoint) => {
        // eslint-disable-next-line eqeqeq
        if(bytes == 0) return '0 Bytes';
        var k = 1000,
            dm = decimalPoint || 2,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
        // image video files show function
    const ImageVideoFileCreateGroups = (msg) => {     

        return (<div className="imageUplodedGroupsWrap">            
            {(msg?.file?.name?.split('.').pop() === "jpg" || msg?.file?.name?.split('.').pop() === "jpeg" || msg?.file?.name?.split('.').pop() === "png" || msg?.file?.name?.split('.').pop() === "webp") && (
                <div className="imageUplodedGroups" onClick={() => VideoImagesShowFnt(msg)}>
                    <FileAuthPreview message={msg} url={msg?.file?.view_thumbnail_url} alt={msg?.file?.name} />
                </div>
            )}

            {(msg?.file?.name?.split('.').pop() === "mp4" || msg?.file?.name?.split('.').pop() === "mov" || msg?.file?.name?.split('.').pop() === "3gp") && (
                <div className="VideoUploadGroups"
                 onClick={() => VideoImagesShowFnt(msg)}
                >
                    <Image src={PlayButton} className="videoPLybtn" alt="play button" />
                    {/* <Image src={msg?.file?.thumbnail} className="videoposterimage" alt="video poster image" /> */}
                    <FileAuthPreview message={msg} className="videoposterimage" url={msg?.file?.view_thumbnail_url} alt={msg?.file?.name} />

                    {GetVideoTime(msg)}
                </div>
            )}

            {/* all files groups */}
            { (checkExtension(msg?.file?.name) ) && (
            <div 
                className="filesUplodedUIwrappser"
            >
                <div className="filedetailswrapps">
                    <div className={getFileName(msg?.file?.name, "fileUplodedImageMode")}></div>
                    <div className="filedetails">
                        <h4>{msg?.file?.name}</h4>
                        {/* {console.log("msg======>", msg)} */}
                        <span>
                            {formatFileSize(msg?.file?.size)} &nbsp;
                            <small>
                                <MessageStatus msg={msg} SelectedRoom={SelectedRoom} />
                                    <span className="d-inline w-auto">
                                        {msg?.is_save === true && messageIsSavedOrNot(msg)}
                                        {(msg?.is_broadcast === true && msg?.broadcast_group_id === undefined) && MessageIsBroadcastOrNot(msg)}
                                        {moment.utc(msg?.created_at).local().format('hh:mm a')}
                                    </span>
                            </small>
                        </span>
                    </div>
                </div>
                <button onClick={() => DownloadFile(msg?.file, access_token)}>Download</button>
            </div>)}
            
            {/* Audio files here */}
            {(msg?.file?.name?.split('.').pop() === "mp3" || msg?.file?.name?.split('.').pop() === "m4a" || msg?.file?.name?.split('.').pop() === "ogg" || msg?.file?.name?.split('.').pop() === "wav" || msg?.file?.name?.split('.').pop() === "mpeg") && (<div className="audioUploadGroups" >
                <FileAuthPreview 
                    message={msg} 
                    url={msg?.file?.view_file_url} 
                    Type={"Audio"}
                    onClick={()=>VideoImagesShowFnt(msg)}
                />
                    <small className="delivSeenmsg">
                        <MessageStatus msg={msg} SelectedRoom={SelectedRoom} />
                        <span className="d-inline w-auto">
                            {msg?.is_save === true && messageIsSavedOrNot(msg)}
                            {(msg?.is_broadcast === true && msg?.broadcast_group_id === undefined) && MessageIsBroadcastOrNot(msg)}
                            {moment.utc(msg?.created_at).local().format('hh:mm a')}
                        </span>
                    </small>
            </div>)}
        </div>)
    }
    const MessageIsBroadcastOrNot = (msg) => {
        // console.log("SvedMessageMark", SvedMessageMark)
        return (<React.Fragment>
            {!(msg?.deleted_at) && (msg?.from_id === userLogin?.user_id) && <div className="broadCastMarkwrapper"><small className="broadcastMessageMark"><div className="loveIcon"></div></small></div>}
        </React.Fragment>);
    }
  return (
    <ul  id="CHatcustomscrollid"
    style={{
        display: "flex", 
        justifyContent: "flex-end",
        alignItems: "end",
        flexDirection: "column",
        maxHeight:240,
    }}
    >
    <Scrollbars
        renderTrackVertical={props => <div {...props} className="track-vertical"/>}
        renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
        renderView={props => <div {...props} className="view"/>}
        style={{
            height: "240px",
            marginBottom:"20px",
            overflow:"none"
        }}
        className="scrollararea"
    >
            <li className={"chatMessageList Me"} id={props?.id} key={props?.id} >
                <div className={msg?.deleted_at !== null && msg?.deleted_at !== undefined ? "chatMsg DeletedMessage" : 
                    !msg?.reply_id && msg?.message_type === "file" ? "chatMsg files" :  
                    msg?.reply_id !== null ? "chatMsg replyMessage_set" : 
                    msg?.message_type === "location" ?  "chatMsg files location" :"chatMsg"}
                >
                    {msg?.forward_id && (<div className="messageForwordSet"><Image src={ForwordMessage} alt="forword message"/> Forwarded</div>)}
                    {/* {msg?.is_forward === true && (<div className="messageForwordSet"><Image src={ForwordMessage} alt="forword message"/> Forwarded</div>)} */}
                    {msg?.reply_id && ReplayMessages({msgs:msg})}
                    {/* Location share box messages */}
                    {msg?.message_type === "location" && (
                        <React.Fragment>
                            {MessagesLocationBox({msg})}
                        </React.Fragment>
                    )}
                    {(msg?.message_type !== "file" && msg?.message_type !== "contact" && msg?.message_type !== "location"  && msg?.imagegallery === undefined )&& (msg?.Message !== ""  && (
                            <div 
                                className={msg?.message?.replaceAll(' ', '')?.length > 2000 ? "messagtitle messageHideLimit" : msg?.message?.replaceAll(' ', '')?.length > 500 ? "messagtitle alignTextSet" : msg?.message?.replaceAll(' ', '')?.length <= 25 ? "messagtitle smalltextallign" : "messagtitle"} 
                                id={`msg_id_${msg?.id}`}
                                dangerouslySetInnerHTML={
                                    {__html: MessageGetUrl(msg?.message)}
                                }>
                            </div>
                        ))}
                        {(msg?.message_type === "file" || msg?.imagegallery !== undefined) && ImageVideoFileCreateGroups(msg)}
                        {(msg?.message?.replaceAll(' ', '')?.length > 2000) && (
                        <div
                            id={`showbtnmsg_id_${msg?.id}`}
                            className="mesgshowBtn" 
                            onClick={() => {
                                showMoreFunt(msg?.id);
                            }}
                        >Show More</div>)}
                    {(msg?.message_type === "text" || msg?.message_type === "location" ||
                    msg?.message_type === "text delete" ||
                    msg?.file?.name?.split('.').pop() === "jpg" || msg?.file?.name?.split('.').pop() === "jpeg" || msg?.file?.name?.split('.').pop() === "png" || msg?.file?.name?.split('.').pop() === "webp" || msg?.file?.name?.split('.').pop() === "mp4" || msg?.file?.name?.split('.').pop() === "mov" || msg?.file?.name?.split('.').pop() === "3gp" || msg?.file?.name?.split('.').pop() === "webm") && (
                    <small className="msgdelivered">
                        {/* message saved note */}  
                        
                        {msg?.msgType !== "Delete" && (msg?.is_edited === true ? "edit " : null)}
                        {/* {console.log("msg", msg)} */}
                        <MessageStatus msg={msg} SelectedRoom={SelectedRoom} />
                        <span className="d-inline w-auto">
                            {msg?.is_save === true && messageIsSavedOrNot(msg)}
                            {(msg?.is_broadcast === true && msg?.broadcast_group_id === undefined) && MessageIsBroadcastOrNot(msg)}
                            {moment.utc(msg?.created_at).local().format('hh:mm a')}
                        </span>
                    </small>)}
                    {msg?.message_type === "contact" && (
                        <React.Fragment>
                            <ShareContactMessage msg={msg}/>
                            <small className="msgdelivered">
                                {/* message saved note */}  
                                
                                {msg?.msgType !== "Delete" && (msg?.is_edited === true ? "edit " : null)}
                                {/* {console.log("msg", msg)} */}
                                <MessageStatus msg={msg} SelectedRoom={SelectedRoom} />
                                <span className="d-inline w-auto">
                                    {msg?.is_save === true && messageIsSavedOrNot(msg)}
                                    {(msg?.is_broadcast === true && msg?.broadcast_group_id === undefined) && MessageIsBroadcastOrNot(msg)}
                                    {moment.utc(msg?.created_at).local().format('hh:mm a')}
                                </span>
                            </small>
                        </React.Fragment>
                    )}
                </div>
            </li>
    </Scrollbars>

    {/* image and video preview modal */}
    {PreviewImageVideo === true && (<PreviewPopup UserId={UserID} callMessageInfo={callMessageInfo} Contacts={Contacts} setPreviewImageVideo={setPreviewImageVideo} CurrentVideoImage={CurrentVideoImage} Messages={Messages} />)}
    </ul>
  )
}
