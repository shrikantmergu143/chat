/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import UploadFileBox from "./UploadFileBox";
import Tooltip from "../common/tooltip";
import { ButtonGroup, Dropdown, Image, Button } from 'react-bootstrap';
import CloseIcon from "../../assets/img/cancel_icon.svg";
import RemoveReplyMessage from "../../assets/img/reply_message_remove.svg";
import SendMessageIcon from "../../assets/img/SendMessage.svg";
import RecordingIcon from "../../assets/img/message_recording.svg";
import RecordingPause from "../../assets/img/pause.png";
import { useSelector } from "react-redux";
import CameraTakePhoto from "./CameraTakePhoto";
import { UploadFileAPI } from "../../Api/UploadFile";
import { baseURL } from "../../constant/url";
import { AudioPlayerControlSprite, Audio } from 'react-audio-player-pro';
import ReomveRecordIcon from "../../assets/img/cancel_icon.svg";
import GetViewFilesAPI from "../../Api/Viewfiles";
import moment from 'moment';
import vmsg from "vmsg";
import last_location from "./../../assets/img/sidebar/location.svg";
import EmojiPicker from "../common/emojiCustom/EmojiPicker";

const recorder = new vmsg.Recorder({
    wasmURL: "https://unpkg.com/vmsg@0.3.0/vmsg.wasm"
});

const MessageCompose = (props) => {
    const { setHeightManage, 
            heightManage,
            isOpenFireFoxBrowser,
            SendMessageFun,
            SendImagesFunction,
            picker, 
            setpicker, 
            SendMessageOnchange,
            RemoveUplodedImage,
            imageUploads,
            setImageUploads,
            replySelectMessage,
            RemoveReplyMessageFnt,
            isMessageEmpty,
            setIsMessageEmpty,
            className,
            setuploadfileBox,
            uploadfileBox,
            callUserTypeingStatus,
            onEnterAddBreakdown
        } = props;
    const SelectedRoom = useSelector((state) => state.allReducers.SelectedRoom);
    const access_token = useSelector((state) => state.allReducers.access_token);
    const [ recordingCallShow, setRecordingCallShow ] = useState(false);
    const [ OpenCamera, setOpenCamera ] = useState(false);
    const [ isRecording, setisRecording ] = useState([]);
    const [ RecordingURLBlob, setRecordingURLBlob ] = useState("");
    // const [ BlobUrl, setBlobUrl ] = useState("");
    const [ isBlocked, setIsBlocked ] = useState(false);
    const [currentCount, setCount] = useState(0);
    const timer = () => {
        setCount(0)
        // callUserTypeingStatus(0);
    };
    const [cout, setcout] = React.useState(1);
    const countRef = React.useRef(null);
    const inputRef = React.useRef(null);

    const [ isLoadingRecord, setIsLoadingRecord ] = useState(false);
    const [ isRecordingRecord, setIsRecordingRecord ] = useState(false);

    useEffect(() => {
        inputRef.current.focus();
    }, [inputRef]);
    
    const record = async () => {
        setIsLoadingRecord(true);
        setcout(0);
        clearInterval(countRef.current);
        if (isRecordingRecord) {
            const blob = await recorder.stopRecording();
            blob.name = "demo.mp3";
            setIsLoadingRecord(false);
            setIsRecordingRecord(false);
            const responce = await UploadFileAPI(access_token, blob);
            if(responce?.data){
                const url = await GetViewFilesAPI(responce?.data?.view_file_url, access_token);
                setRecordingURLBlob(url);
                setisRecording([{...responce?.data}]);
            }
        } else {
        //   setcout(0);
          try {
            // setcout(0);
            let count =0;
            countRef.current = setInterval(() => {
                count++;
                setcout(count);
            }, 1300);
            
            await recorder.initAudio();
            await recorder.initWorker();
            recorder.startRecording();
            setIsLoadingRecord(false);
            setIsRecordingRecord(true);
          } catch (e) {
            // console.error(e);
            setIsLoadingRecord(false);
            // setcout(0);
            clearInterval(countRef.current);
          }
        }
    };

    useEffect(() => {
        if (currentCount <= 0) {
            return;
        }
        const id = setInterval(timer, 4000);
        return () => clearInterval(id);
    },[currentCount]); 

    const SendRordingMessage = () => {
        if(isRecording.length !== 0){
            // const responce = await UploadFileAPI(access_token, imgSrc[0]);
            SendImagesFunction(isRecording[0].id);            
        }
        setisRecording([]);
        setRecordingURLBlob("");
    }

    const RemoveRecordingAudio = () => {
        setisRecording([]);
        setRecordingURLBlob("");
    }

    const CameraOpenClickPhoto = () => {
        setOpenCamera(!OpenCamera);
    }

    const getadata = (e) => {
        setHeightManage(e.target.offsetHeight);  
        
        if(isOpenFireFoxBrowser === true) {
            var lastContent = document.getElementById("messagFieldID");
            if(e.target.innerHTML.length === 4) {
                setTimeout(() => {
                    var child = lastContent.lastElementChild;
                    while (child) {
                        lastContent.removeChild(child);
                        child = lastContent.lastElementChild;
                    }
                }, 100);
            }
            const LastElementSet = document.getElementById("messagFieldID").childNodes[document.getElementById("messagFieldID").childNodes.length - 1].innerText;
            if(LastElementSet !== "") {
                document.getElementById("messagFieldID").classList.add("fireBoxCursorNode");
            } else {
                document.getElementById("messagFieldID").classList.remove("fireBoxCursorNode");
            }
        }
    }   

    const MessageOnchange = (e) => {
        // console.log("e.target.innerText",e.target.innerText)
        if((SelectedRoom?.admin_id === undefined || SelectedRoom?.admin_id === null)){
            if(currentCount === 0){
                callUserTypeingStatus(1);
            }
            setCount(1);
        }   
        if(e.target.innerText !== "") {
            setIsMessageEmpty({...isMessageEmpty, emojiIstrue: false, messageIstrue: true});
        } else {
            setIsMessageEmpty({...isMessageEmpty, emojiIstrue: false, messageIstrue: false});
        }
    }
    useState(()=>{
        setuploadfileBox(false);
    },[SelectedRoom])
    
    const reCordCallFnt = async () => {
        setRecordingCallShow(!recordingCallShow);
    }
    
    useEffect(() => {
        document.querySelector("div[contenteditable]").addEventListener("paste", function(e) {
            e.preventDefault();
            var text = e.clipboardData.getData("text/plain");
            document.execCommand("insertHTML", false, text);
        });
    },[]);

    const CloseInput = () =>{
        // callUserTypeingStatus(0)
        setCount(0);
    }

    // edit function get height
    const getHeightFnct = (e) => {
        setHeightManage(e.target.offsetHeight); 
        // setTimeout(() => {
        //     var element = document.getElementById("chatPanelScroll");
        //     element?.scrollIntoView({ block: 'end' });
        // }, 200); 
    } 
    const getLatLngLink = (message) =>{
        var splitedNameNmber = message.split('[|]');
        var GetName = splitedNameNmber[2];

        return (<p className={"images_p"}><img src={last_location} className={"last_message_icon location"} alt={""}/> {GetName}</p>)
    }
    return (
        <div className={`messageComposeWrapper ${className}`} >
            {/* selected images bar */}
            {imageUploads.length > 0 && (<div className="fileuplodeView">
                {imageUploads.map((elm, index) => {
                    return( 
                        <div className="fileUplodImage" key={index}>
                            {/* remove selected image */}
                            <Image src={CloseIcon} className="closeIcon" onClick={() => RemoveUplodedImage(elm?.id)} alt="close" />

                            {/* uploaded images list */}
                            <Image src={elm?.base64} className="uplodselectImage" alt={elm?.name}/>
                        </div>
                    )
                })}
            </div>)}

            {/* selected for reply Message bar */}
            {replySelectMessage.id !== "" && (<div className="replymessageBox">
                    <Image src={RemoveReplyMessage} className={"remove_message"} onClick={RemoveReplyMessageFnt} alt="remove message" />
                    <span>{replySelectMessage?.name}</span>
                    <h4>
                        {replySelectMessage?.message_type === "text" ?
                        replySelectMessage?.message: 
                        replySelectMessage?.message_type === "contact" ?
                        replySelectMessage?.message?.replace("[|]", " : "): 
                        replySelectMessage?.message_type === "location" ?
                        getLatLngLink(replySelectMessage?.message):
                        replySelectMessage?.file.name}
                   </h4>
                </div>
            )}
            <div className="messageFieldWraps">
                <div 
                    contentEditable="true"
                    className={heightManage === 228 ? "messagField messagFieldRadius" : "messagField"} 
                    id="messagFieldID" 
                    placeholder="Type here…"
                    onInput={(e) =>setTimeout(()=> getadata(e),100)}
                    onKeyPress={(e) =>setTimeout(()=> SendMessageOnchange(e), 10)}
                    onKeyUp={(e) =>setTimeout(()=> MessageOnchange(e), 10)}
                    onFocus={(e) =>setTimeout(()=>{
                        getHeightFnct(e);
                        setuploadfileBox(false)
                    }, 100)}
                    onKeyDown={(e) => onEnterAddBreakdown(e)}
                    onBlur={()=>setTimeout(()=>CloseInput(),100)}
                    ref={inputRef}
                    data-text="Type here…"
                ></div>
                <div className="messagSetemojifiles"
                onClick={(e) =>{e.stopPropagation()} }>
                    <Tooltip content="Send Emoji" direction="top">
                        <div 
                            className="emojibtn" 
                            onClick={() => setpicker(!picker)}
                        ></div>
                    </Tooltip>
                    <Dropdown show={uploadfileBox} className="uploadfilesboxdrop" as={ButtonGroup} >
                        <Dropdown.Toggle variant="default" id="dropdown-basic">
                            <Tooltip content="Upload Files" direction="top">
                                <div 
                                    className={uploadfileBox === true ? "uploadfilebtn cross" : "uploadfilebtn"}
                                    onClick={(e) =>{
                                        e.stopPropagation();
                                        setuploadfileBox(!uploadfileBox)
                                    } }
                                ></div>
                            </Tooltip>
                        </Dropdown.Toggle>

                        {/* upload files box */}
                        <UploadFileBox 
                            setuploadfileBox={setuploadfileBox}
                            uploadfileBox={uploadfileBox} 
                            setImageUploads={setImageUploads}
                            SendImagesFunction={SendImagesFunction}
                            CameraOpenClickPhoto={CameraOpenClickPhoto}
                        />
                    </Dropdown>
                </div>
            </div>
            <div className="sendMessagIconwraps">
                {(isMessageEmpty.emojiIstrue === true || isMessageEmpty.messageIstrue === true) ? (
                <Tooltip content="Send" direction="top">
                    <Image src={SendMessageIcon} className="sendMessagIcon" onClick={SendMessageFun} alt="send message"  />
                </Tooltip>) : 
                (<React.Fragment>
                    {isRecording.length === 0 ? <React.Fragment>
                        {isRecordingRecord === true ? (<div className={isRecordingRecord === true ? "recordingCallAudo Recordactivated" : "recordingCallAudo"}>
                            <span>00:{cout}</span>
                            <h4>Recording...</h4>
                            <Tooltip content="Stop" direction="top">
                                <Image src={RecordingPause} onClick={record} alt="record pause message" />
                            </Tooltip>
                        </div>) : 
                        (<div className="recordingCallAudo">
                            <Tooltip content="Record Call" direction="top">
                                <Image src={RecordingIcon} onClick={record} alt="record message" />
                            </Tooltip>
                        </div>)}
                    </React.Fragment> :
                    <div className="audioUploadGroups" id="recordAudioMain">
                        <AudioPlayerControlSprite/>
                        <Audio
                            src={RecordingURLBlob}
                            preload="auto"
                            // duration={100}
                            className="audioUpload"
                            downloadFileName={isRecording[0].name}
                            useRepeatButton={false}
                            id={"audioUpload"}
                        />
                        <Image src={ReomveRecordIcon} className="closeRecordingimg" alt="remove" onClick={RemoveRecordingAudio} />
                        <Tooltip content="Send" direction="top">
                            <Image src={SendMessageIcon} className="sendMessagIcon" onClick={SendRordingMessage} alt="send message"  />
                        </Tooltip>
                    </div>}
                </React.Fragment>)
                }
            </div>
            {picker === true && (<EmojiPicker isMessageEmpty={isMessageEmpty} setIsMessageEmpty={setIsMessageEmpty} id={"messagFieldID"} />)}
            {OpenCamera === true && (<CameraTakePhoto SendImagesFunction={SendImagesFunction} setOpenCamera={setOpenCamera} />)}
        </div>
    )
}

export default MessageCompose;