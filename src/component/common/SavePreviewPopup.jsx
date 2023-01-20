/* eslint-disable */
import React, { useState, useContext, useEffect } from 'react';
import { Image } from 'react-bootstrap';
import PlayButton from "../../assets/img/videoplaybtn.svg";
import AudioImage from "../../assets/img/audio_icon.png";
import Slider from "react-slick";
import Tooltip from './tooltip';
import { deleteMessage } from "../../redux/actions";
import wsSend_request from "../../Api/ws/ws_request";
import { WebSocketContext } from "../Index";
import { useDispatch, useSelector } from 'react-redux';
import ModalCommon from "./ModalCommon";
import GetViewFilesAPI from '../../Api/Viewfiles';
import FileAuthPreview from '../ChatPanels/FileAuthPreview';
import { ImageExtension } from '../ChatPanels/SearchChat/MessagesPanel';
import CommanUsers from './CommanUsers';

export const PreviewPopupComman = ({currentSelectedFile, settings, SelectNewFile, AllImageArray}) =>{
    return(
        <React.Fragment>
            <div className="imageViewMain">
                {ImageExtension(currentSelectedFile) ? 
                    (
                        <FileAuthPreview
                            message={currentSelectedFile}
                            url={currentSelectedFile?.file?.view_file_url}
                            alt={currentSelectedFile?.name}
                        />
                    )
                    : (currentSelectedFile.name?.split('.').pop() === "mp4" || currentSelectedFile.name?.split('.').pop() === "mov" || currentSelectedFile.name?.split('.').pop() === "3gp" || currentSelectedFile.name?.split('.').pop() === "webm") ? (
                        <FileAuthPreview
                            message={currentSelectedFile}
                            url={currentSelectedFile?.file?.view_file_url}
                            alt={currentSelectedFile?.name}
                            Type={"Video"}
                        />
                    ) : (currentSelectedFile.name?.split('.').pop() === "mp3" || currentSelectedFile.name?.split('.').pop() === "m4a" || currentSelectedFile.name?.split('.').pop() === "ogg" || currentSelectedFile.name?.split('.').pop() === "aac" || currentSelectedFile.name?.split('.').pop() === "wav" || currentSelectedFile.name?.split('.').pop() === "mpeg") && (
                    <div className="audioUploadGroups" >
                        <h4>{currentSelectedFile.name}</h4>
                        {/* <AudioPlayerControlSprite/> */}
                        <FileAuthPreview 
                            message={currentSelectedFile} 
                            url={currentSelectedFile?.file?.view_file_url} 
                            Type={"Audio"}
                        />
                    </div>
                )}
            </div>
            {/* preview files tab start here */}
            <div className="imageViewsTabs">
                <Slider className='slider_box' {...settings}>
                    {AllImageArray && AllImageArray.map((elm, index) => {
                        if(
                            ImageExtension(elm)
                        ) {
                            // let CurrentIndex = AllImageArray.findIndex(elm => elm.id === currentSelectedFile.id);
                            // setGetSelectFileID(AllImageArray.findIndex(elm => elm.id === currentSelectedFile.id));
                            return (
                                <div 
                                    className={elm?.id === currentSelectedFile.id ? "imagevideoTabs active" : "imagevideoTabs"} 
                                    onClick={() => SelectNewFile(elm)}
                                    key={index.toString()}
                                >
                                     <FileAuthPreview
                                        message={elm}
                                        url={elm?.file?.view_thumbnail_url}
                                        alt={elm?.file?.name}
                                    />
                                </div>
                            )
                        } else if(elm?.file?.name?.split('.').pop() === "mp4" || elm?.file?.name?.split('.').pop() === "3gp" || elm?.file?.name?.split('.').pop() === "mov" || elm?.file?.name?.split('.').pop() === "webm") {
                            // let CurrentIndex = AllImageArray.findIndex(elm => elm.id === currentSelectedFile.id);
                            // setGetSelectFileID(AllImageArray.findIndex(elm => elm.id === currentSelectedFile.id));
                            return (
                                <div 
                                    className={elm?.id === currentSelectedFile?.id ? "imagevideoTabs active" : "imagevideoTabs"} 
                                    onClick={() => SelectNewFile(elm)}
                                    key={index.toString()}
                                >
                                    <Image src={PlayButton} className="videoPLybtn" alt="play button" />
                                   {/* <Image src={elm?.file?.thumbnail} alt="video poster image" /> */}
                                   <FileAuthPreview
                                        message={elm}
                                        url={elm?.file?.view_thumbnail_url}
                                        alt={elm?.file?.name}
                                        className="videoposterimage" 
                                    />
                                </div>
                            )
                        } else {
                            // let CurrentIndex = AllImageArray.findIndex(elm => elm.id === currentSelectedFile.id);
                            // setGetSelectFileID(AllImageArray.findIndex(elm => elm.id === currentSelectedFile.id));
                            return (
                                <div 
                                    className={elm?.id === currentSelectedFile?.id ? "AudioTabs active" : "AudioTabs"} 
                                    onClick={() => SelectNewFile(elm)}
                                    key={index.toString()}
                                >
                                    <FileAuthPreview
                                        message={elm}
                                        src={AudioImage}
                                        alt={elm?.file?.name}
                                        className="audioplayericon"
                                    />
                                </div>
                            )
                        }
                    })}
                </Slider>
            </div>
        </React.Fragment>
    )
}

const SavePreviewPopup = (props) => {
    const { CurrentVideoImage, Messages, setPreviewImageVideo, UserId, Contacts } = props;
    const access_token = useSelector((state) =>state?.allReducers?.access_token);
    const { websocket } = useContext(WebSocketContext);
    const [ currentSelectedFile, setCurrentSelectedFile ] = useState({
        ...CurrentVideoImage,
        id: CurrentVideoImage.id,
        file: CurrentVideoImage.file,
        url: CurrentVideoImage.file.url,
        name: CurrentVideoImage.file.name,
        to_id: CurrentVideoImage.to_id,
        group_id: CurrentVideoImage.group_id,
        from_id: CurrentVideoImage.from_id,
        message: CurrentVideoImage.message,
        broadcast_group_id: CurrentVideoImage.broadcast_group_id,
        forward_id: CurrentVideoImage.forward_id,
        reply_id: CurrentVideoImage.reply_id,
    }); 
    const dispatch = useDispatch();

    const [GetSelectFileID, setGetSelectFileID] = useState({
        filesIndex: "",
        imageGalleryLength: "",
    });
    const [modalShow, setModalShow] = useState(false);

    var settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 10,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
              breakpoint: 1438,
              settings: {
                slidesToShow: 7,
                slidesToScroll: 1,
                infinite: false,
                dots: false
              }
            },
            {
              breakpoint: 991,
              settings: {
                slidesToShow: 6,
                slidesToScroll: 1,
                infinite: false,
                dots: false
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
        ]
    };
    function SampleNextArrow(props) {
        const { className, onClick } = props;
        return (
          <div
            className={className}
            onClick={onClick}
          />
        );
    }
      
    function SamplePrevArrow(props) {
        const { className, onClick } = props;
        return (
            <div
            className={className}
            onClick={onClick}
            />
        );
    }

    const AllImageArray = [];
    Messages && Messages.forEach((elm) => { 
        if(elm.file !== undefined && elm.message !== "Deleted") {
            if(elm.file.name?.split('.').pop() === "jpg" || elm.file.name?.split('.').pop() === "jpeg" ||
            elm.file.name?.split('.').pop() === "png" || elm.file.name?.split('.').pop() === "gif" ||
            elm.file.name?.split('.').pop() === "webp" || elm.file.name?.split('.').pop() === "PNG" || 
            elm.file.name?.split('.').pop() === "svg" || elm.file.name?.split('.').pop() === "mp4" ||
            elm.file.name?.split('.').pop() === "webm" || elm.file.name?.split('.').pop() === "mp3"||
            elm.file.name?.split('.').pop() === "m4a" || 
            elm.file.name?.split('.').pop() === "ogg" || elm.file.name?.split('.').pop() === "wav" || 
            elm.file.name?.split('.').pop() === "mpeg") {
                AllImageArray.push(elm);
            }
        }
    }); 

        
    // tab select images aur video
    const SelectNewFile = (elm) => {
        setCurrentSelectedFile({
            ...currentSelectedFile, 
            id: elm?.id, 
            file: elm?.file, 
            url: elm?.file?.name, 
            name: elm?.file?.name,
            to_id: elm?.to_id,
            group_id: elm?.group_id,
            from_id: elm?.from_id,
            message: elm?.message,
            broadcast_group_id: elm?.broadcast_group_id,
            forward_id: elm?.forward_id,
            reply_id: elm?.reply_id,
        })
    }

    // delete file function
    const DeleteMessage = (msg) => {
        let payload = {}
        if(msg.to_id !== undefined) {
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
        wsSend_request(websocket, payload);
        dispatch(deleteMessage(msg?.id));

        if(GetSelectFileID.imageGalleryLength > 0) {
            if(GetSelectFileID.filesIndex === 0) {
                setCurrentSelectedFile({
                    ...currentSelectedFile, 
                    id: AllImageArray[0 + 1]?.id, 
                    file: AllImageArray[0 + 1]?.file, 
                    url: AllImageArray[0 + 1]?.file?.name, 
                    name: AllImageArray[0 + 1]?.file?.name,
                    to_id: AllImageArray[0 + 1]?.to_id,
                    group_id: AllImageArray[0 + 1]?.group_id,
                    from_id: AllImageArray[0 + 1]?.from_id,
                    message: AllImageArray[0 + 1]?.message,
                    broadcast_group_id:  AllImageArray[0 + 1]?.broadcast_group_id,
                    forward_id:  AllImageArray[0 + 1]?.forward_id,
                    reply_id:  AllImageArray[0 + 1]?.reply_id,
                });
            } else if (GetSelectFileID.filesIndex > 0) {
                setCurrentSelectedFile({
                    ...currentSelectedFile, 
                    id: AllImageArray[GetSelectFileID.filesIndex - 1]?.id, 
                    url: AllImageArray[GetSelectFileID.filesIndex - 1]?.file?.name, 
                    file: AllImageArray[GetSelectFileID.filesIndex - 1]?.file, 
                    name: AllImageArray[GetSelectFileID.filesIndex - 1]?.file?.name,
                    to_id: AllImageArray[GetSelectFileID.filesIndex - 1]?.to_id,
                    group_id: AllImageArray[GetSelectFileID.filesIndex - 1]?.group_id,
                    from_id:  AllImageArray[GetSelectFileID.filesIndex - 1]?.from_id,
                    message: AllImageArray[GetSelectFileID.filesIndex - 1]?.message,
                    broadcast_group_id:  AllImageArray[GetSelectFileID.filesIndex - 1]?.broadcast_group_id,
                    forward_id:  AllImageArray[GetSelectFileID.filesIndex - 1]?.forward_id,
                    reply_id:  AllImageArray[GetSelectFileID.filesIndex - 1]?.reply_id,
                });
            } 
        } 
    }  

    // Call forward message function
    const CallForwardMessage = (select_members, setSelectContact) =>{
        let param  = null
        const filter = select_members.join(",")
        if(select_members?.length === 1){
            if(currentSelectedFile?.broadcast_group_id !== undefined){
                param = {
                    "transmit":"broadcast",
                    "url":"add_chat",
                    "request":{
                        "chat_type":"single",
                        "message":currentSelectedFile?.message,
                        "message_type": "file",
                        "forward_id": currentSelectedFile?.id,
                        "forward_type": "broadcast",
                        "to_id":filter,
                    }
                }
            }else{
                param = {
                    "transmit":"broadcast",
                    "url":"add_chat",
                    "request":{
                        "chat_type":"single",
                        "message":currentSelectedFile?.message,
                        "message_type": "file",
                        "forward_id": currentSelectedFile?.id,
                        "forward_type": currentSelectedFile.group_id !== undefined ? "group" : "single",
                        "to_id":filter,
                    }
                }
            }
        }else{
            if(currentSelectedFile?.broadcast_group_id !== undefined){
                param = {
                    "transmit":"broadcast",
                    "url":"add_chat",
                    "request":{
                        "chat_type":"group",
                        "message":currentSelectedFile?.message,
                        "message_type": "file",
                        "forward_id": currentSelectedFile?.id,
                        "forward_type": "broadcast",
                        "to_id":filter,
                    }
                }
            }else{
                param = {
                    "transmit":"broadcast",
                    "url":"add_chat",
                    "request":{
                        "chat_type":"group",
                        "message":currentSelectedFile?.message,
                        "message_type": "file",
                        "forward_id": currentSelectedFile?.id,
                        "forward_type": currentSelectedFile.group_id !== undefined ? "group" : "single",
                        "to_id":filter,
                    }
                }
            }
        }
        if(param !== null){
            wsSend_request(websocket, param);
            setModalShow(false);
            setPreviewImageVideo(false);
            setSelectContact([]);
        }
    }

    // save message functions
    const saveMessageFun = (message) => {
        let param = {}
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
                "url":"remove_save_message",
                "request":{
                    "to_id":message?.broadcast_group_id,
                    "chat_id":message?.id,
                    "chat_type":"broadcast"
                }
            }
        }else{
            param = {
                "transmit":"broadcast",
                "url":"remove_save_message",
                "request":{
                    "to_id":message?.group_id === undefined ? 
                UserId === message?.from_id?message?.to_id:message?.from_id
                : message?.group_id,
                    "chat_id":message?.id,
                    "chat_type":message?.group_id === undefined?"single":"group"
                }
            }
        }
        // console.log("messagadsadsae", param)
        if(param !== {}){
            wsSend_request(websocket, param);
        }
        setPreviewImageVideo(false);
    }
    // file authanticate download file
    const FileAuthPreviewDownload =async (message) => {
        const url = await GetViewFilesAPI(message?.file?.view_file_url, access_token);
        var tempEl = document.createElement("a");
        tempEl.href = url;
        tempEl.download = message?.file?.name;
        tempEl.click();
        window.URL.revokeObjectURL(url);
    }
    return (
        <div className="ImageViewPreviewModal Files_preview Save_popup_view">
            <div className='modal_body'>
                {/* preview files control bar here */}
                <div className='controlbars'>
                    <CommanUsers to_id={currentSelectedFile.from_id} msg={currentSelectedFile}/>
                    <div>
                        <Tooltip content="Download" direction="bottom">
                            <button  onClick={() => FileAuthPreviewDownload(currentSelectedFile)} className='btn download'></button>
                        </Tooltip>
                        {props?.UnsaveButton !== false && <Tooltip content={"UnSave"} direction="bottom">
                            <button onClick={() =>saveMessageFun(currentSelectedFile, "remove_save_message")} className='btn unsave'></button>
                        </Tooltip>}
                        <Tooltip content="Close" direction="bottom">
                            <button onClick={() => setPreviewImageVideo(false)} className='btn cancel'></button>
                        </Tooltip>
                    </div>
                </div>
                <PreviewPopupComman currentSelectedFile={currentSelectedFile} settings={settings} SelectNewFile={SelectNewFile} AllImageArray={AllImageArray}/>

                {/* forward message popup */}
                <ModalCommon 
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    msg={"Forward to…"}
                    memberslist={Contacts}
                    button_title={"Forward"}
                    formSubmit={CallForwardMessage}
                    isMultiple={false}
                />
            </div>
        </div>
    )
}

export default SavePreviewPopup;