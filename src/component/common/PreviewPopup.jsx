/* eslint-disable */
import React, { useState, useContext, useEffect } from 'react';
import Tooltip from './tooltip';
import { deleteMessage } from "../../redux/actions";
import wsSend_request from "../../Api/ws/ws_request";
import { WebSocketContext } from "../Index";
import { useDispatch, useSelector } from 'react-redux';
import ModalCommon from "../common/ModalCommon";
import GetViewFilesAPI from '../../Api/Viewfiles';
import { PreviewPopupComman } from './SavePreviewPopup';
import CommanUsers from './CommanUsers';

const PreviewPopup = (props) => {
    const { CurrentVideoImage, Messages, setPreviewImageVideo, UserId, callMessageInfo } = props;
    const userLogin = useSelector((state) => state.allReducers.userLogin);
    // console.log("CurrentVideoImage", CurrentVideoImage);
    const {  Contacts, Rooms } = useSelector((state) => state.allReducers);
    const access_token = useSelector((state) =>state?.allReducers?.access_token);
    const Groups = Rooms?.filter((item)=>item?.admin_ids!==undefined && item?.group_type===undefined);
    const { websocket } = useContext(WebSocketContext);
    // const navigate = useNavigate();
    const TotalGroup = [];
    Groups?.map((item)=>{
        TotalGroup?.push(item)
    })
    Contacts?.map((item)=>{
        TotalGroup?.push(item)

    })
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
        message_type: CurrentVideoImage.message_type,
        broadcast_group_id: CurrentVideoImage.broadcast_group_id,
        forward_id: CurrentVideoImage.forward_id,
        reply_id: CurrentVideoImage.reply_id,
        is_save: CurrentVideoImage.is_save,
    });
    const dispatch = useDispatch();

    const [GetSelectFileID, setGetSelectFileID] = useState({
        filesIndex: "",
        imageGalleryLength: "",
    });
    const [modalShow, setModalShow] = useState(false);
    
    // message scroll bottom
    const MsgScrollDown = (time) => {
        setTimeout(() => {
            var element = document.getElementById("chatPanelScroll");
            element?.scrollIntoView({ block: 'end' });
        }, time);
    }

    var settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 10,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        dotsClass:"Slider_boxs",
        className:"Slider_boxs",
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
            elm.file.name?.split('.').pop() === "3gp" || elm.file.name?.split('.').pop() === "mov" ||
            elm.file.name?.split('.').pop() === "webm" || elm.file.name?.split('.').pop() === "mp3"||
            elm.file.name?.split('.').pop() === "m4a" || elm.file.name?.split('.').pop() === "aac" ||
            elm.file.name?.split('.').pop() === "ogg" || elm.file.name?.split('.').pop() === "wav" || 
            elm.file.name?.split('.').pop() === "mpeg") {
                let msg = {...elm, is_save:false};
                if((elm?.group_id && elm?.seen_by && elm?.delivered_by) || (elm?.broadcast_group_id && elm?.seen_by && elm?.delivered_by)){
                let seen_by = JSON.parse(elm?.seen_by)
                    let delivered_by = JSON.parse(elm?.delivered_by)
                    let DeliveredLength = Object.keys(delivered_by)?.map((key) => {
                        return {user_id:key, date:delivered_by[key]}
                    });
                    if(seen_by !== null){
                        let SeenLength =Object.keys(seen_by)?.map((key) => {
                            return {user_id:key, date:seen_by[key]}
                        });
                        msg = {
                            ...elm,
                            seen_by:seen_by,
                            seen_bylength:SeenLength,
                            delivered_by:delivered_by,
                            delivered_bylength:DeliveredLength,
                            is_save:msg?.is_save
                        }
                    }
                    msg = {
                        ...msg,
                        ...elm,
                        delivered_by:delivered_by,
                        delivered_bylength:DeliveredLength,
                        is_save:msg?.is_save
                    }
                }
                AllImageArray.push(msg);
            }
        }
    }); 
 
    useEffect(() => {
        setTimeout(() => {
            var CureentFile = AllImageArray.findIndex(elm => elm.id === currentSelectedFile.id);
            setGetSelectFileID({
                filesIndex: CureentFile,
                imageGalleryLength: AllImageArray.length,
            });
            if(GetSelectFileID.imageGalleryLength === 0 || GetSelectFileID.filesIndex === -1) {
                setPreviewImageVideo(false);
            }
        }, 500);
    }, [currentSelectedFile])
        
    // tab select images aur video
    const SelectNewFile = (elm) => {
        setCurrentSelectedFile({
            ...elm, 
            id: elm?.id, 
            file: elm?.file,
            url: elm?.file?.name, 
            name: elm?.file?.name,
            to_id: elm?.to_id,
            group_id: elm?.group_id,
            from_id: elm?.from_id,
            message: elm?.message,
            message_type:elm?.message_type,
            broadcast_group_id: elm?.broadcast_group_id,
            forward_id: elm?.forward_id,
            reply_id: elm?.reply_id,
            is_save: elm?.is_save,
        })
    }

    // delete file function
    const DeleteMessage = (msg) => {
        let payload = {}
        if(msg?.broadcast_group_id !== undefined){
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
        wsSend_request(websocket, payload);
        dispatch(deleteMessage(msg?.id));

        if(GetSelectFileID.imageGalleryLength > 0) {
            if(GetSelectFileID.filesIndex === 0) {
                setCurrentSelectedFile({
                    ...AllImageArray[0 + 1], 
                    id: AllImageArray[0 + 1]?.id, 
                    file: AllImageArray[0 + 1]?.file, 
                    url: AllImageArray[0 + 1]?.file?.name, 
                    name: AllImageArray[0 + 1]?.file?.name,
                    to_id: AllImageArray[0 + 1]?.to_id,
                    group_id: AllImageArray[0 + 1]?.group_id,
                    from_id: AllImageArray[0 + 1]?.from_id,
                    message: AllImageArray[0 + 1]?.message,
                    message_type: AllImageArray[0 + 1]?.message_type,
                    broadcast_group_id:  AllImageArray[0 + 1]?.broadcast_group_id,
                    forward_id:  AllImageArray[0 + 1]?.forward_id,
                    reply_id:  AllImageArray[0 + 1]?.reply_id,
                    is_save:  AllImageArray[0 + 1]?.is_save,
                });
            } else if (GetSelectFileID.filesIndex > 0) {
                setCurrentSelectedFile({
                    ...AllImageArray[GetSelectFileID.filesIndex - 1], 
                    id: AllImageArray[GetSelectFileID.filesIndex - 1]?.id, 
                    file: AllImageArray[GetSelectFileID.filesIndex - 1]?.file, 
                    url: AllImageArray[GetSelectFileID.filesIndex - 1]?.file?.name, 
                    name: AllImageArray[GetSelectFileID.filesIndex - 1]?.file?.name,
                    to_id: AllImageArray[GetSelectFileID.filesIndex - 1]?.to_id,
                    group_id: AllImageArray[GetSelectFileID.filesIndex - 1]?.group_id,
                    from_id:  AllImageArray[GetSelectFileID.filesIndex - 1]?.from_id,
                    message: AllImageArray[GetSelectFileID.filesIndex - 1]?.message,
                    message_type: AllImageArray[GetSelectFileID.filesIndex - 1]?.message_type,
                    broadcast_group_id:  AllImageArray[GetSelectFileID.filesIndex - 1]?.broadcast_group_id,
                    forward_id:  AllImageArray[GetSelectFileID.filesIndex - 1]?.forward_id,
                    reply_id:  AllImageArray[GetSelectFileID.filesIndex - 1]?.reply_id,
                    is_save:  AllImageArray[GetSelectFileID.filesIndex - 1]?.is_save,
                });
            } 
        } 
    }  
    const callForwardMessageAPI = (filter, sender_name, type) =>{
        let param  = null
        if(currentSelectedFile?.system_group_id){
            param = {
                "transmit":"broadcast",
                "url":"add_chat",
                "request":{
                    "chat_type":type,
                    "message":currentSelectedFile?.message,
                    "message_type":currentSelectedFile?.message_type,
                    "forward_id":currentSelectedFile?.id,
                    "forward_type":"system_group",
                    "sender_name":sender_name,
                    "to_id":filter,
                }
            }
        }else if(currentSelectedFile?.broadcast_group_id !== undefined){
            param = {
                "transmit":"broadcast",
                "url":"add_chat",
                "request":{
                    "chat_type":type,
                    "message":currentSelectedFile?.message,
                    "message_type": currentSelectedFile?.message_type,
                    "forward_id": currentSelectedFile?.id,
                    "forward_type": "broadcast",
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
                    "message":currentSelectedFile?.message,
                    "message_type": currentSelectedFile?.message_type,
                    "forward_id": currentSelectedFile?.id,
                    "forward_type": currentSelectedFile.group_id !== undefined ? "group" : "single",
                    "sender_name":sender_name,
                    "to_id":filter,
                }
            }
        }
        if(param!==null){
            wsSend_request(websocket, param);
        }
    }
    // Call forward message function
    const CallForwardMessage = (select_members, setSelectContact) =>{
        let param  = {};
        const filter = select_members.join(",")
        var ChatScrollMessage = document.getElementById("chatPanelScroll");
        select_members?.map((select_id)=>{
            const selectData = TotalGroup?.filter((item)=>item?.id === select_id)[0];
            if(selectData?.admin_ids===undefined){
                callForwardMessageAPI(select_id, userLogin?.users_detail?.phone, "single");
                // setTimeout(()=>navigate("/Chat/" + selectData.id), 100);
                MsgScrollDown(500);
            }else{
                callForwardMessageAPI(select_id, selectData?.group_name, "group");
                // setTimeout(()=>navigate("/Chat/" + selectData.id), 100);
                MsgScrollDown(500);
            }

        })
        setModalShow(false);
        setPreviewImageVideo(false);
        setSelectContact([]);
    }

    // save message functions
    const saveMessageFun = (message, type) => {
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
                "url":type,
                "request":{
                    "to_id":message?.broadcast_group_id,
                    "chat_id":message?.id,
                    "chat_type":"broadcast"
                }
            }
        }else{
            param = {
                "transmit":"broadcast",
                "url":type,
                "request":{
                    "to_id":message?.group_id === undefined ? 
                UserId === message?.from_id?message?.to_id:message?.from_id
                : message?.group_id,
                    "chat_id":message?.id,
                    "chat_type":message?.group_id === undefined?"single":"group"
                }
            }
        }
        console.log("messagadsadsae", param)
        if(param !== {}){
            wsSend_request(websocket, param);
        }
        setPreviewImageVideo(false);
    }
    // file authanticate download file
    const FileAuthPreviewDownload =async (message) => {
        const url = await GetViewFilesAPI(message?.file?.view_file_url, access_token,message);
        var tempEl = document.createElement("a");
        tempEl.href = url;
        tempEl.download = message?.file?.name;
        tempEl.click();
        window.URL.revokeObjectURL(url);
    }
    return (
        <div className="ImageViewPreviewModal Files_preview">
            <div className='modal_body'>
                {/* preview files control bar here */}
                <div className='controlbars'>
                    <CommanUsers to_id={currentSelectedFile.from_id} msg={currentSelectedFile}/>
                    <div>
                        {currentSelectedFile.from_id === UserId  && 
                        <Tooltip content="Info" direction="bottom">
                            <button onClick={() =>{
                                callMessageInfo(currentSelectedFile)
                                setPreviewImageVideo(false)
                            }}  className='btn info'></button>
                        </Tooltip>
                        }
                        <Tooltip content="Download" direction="bottom">
                            <button  onClick={() => FileAuthPreviewDownload(currentSelectedFile)} className='btn download'></button>
                        </Tooltip>
                        <Tooltip content={currentSelectedFile?.is_save?"UnSave":"Save"} direction="bottom">
                            <button onClick={() =>currentSelectedFile?.is_save === true? saveMessageFun(currentSelectedFile, "remove_save_message"): saveMessageFun(currentSelectedFile, "save_message")} className={currentSelectedFile?.is_save?"btn unsave":"btn save"} ></button>
                        </Tooltip>
                        {(!currentSelectedFile?.system_group_id )&&
                        <Tooltip content="Forword" direction="bottom">
                            <button  onClick={() => setModalShow(true)} className='btn forward'></button>
                        </Tooltip>}
                        {currentSelectedFile.from_id === UserId && (
                        <Tooltip content="Delete" direction="bottom">
                            <button  onClick={() => DeleteMessage(currentSelectedFile)} className='btn delete'></button>
                        </Tooltip>
                        )}
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
                    memberslist={TotalGroup}
                    button_title={"Forward"}
                    formSubmit={CallForwardMessage}
                    isMultiple={true}
                />
            </div>
        </div>
    )
}

export default PreviewPopup;