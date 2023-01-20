/* eslint-disable no-useless-escape */
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment";
import { AudioPlayerControlSprite, Audio} from 'react-audio-player-pro';
import { Badge, Image, ListGroupItem } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars-2';
import DownloadFile from "../../../Api/DownloadFile";
import ForwordMessage from "../../../assets/img/Fordwardmessgae.png";
import FileAuthPreview from '../FileAuthPreview';
import MessageStatus from '../MessageStatus';
import GetViewFilesAPI from '../../../Api/Viewfiles';
import Tooltip from '../../common/tooltip';
import DummyImage from '../../../assets/img/profile/dummyimage.png';
import { setScrollToChatid, setSearchModalData } from '../../../redux/actions';
import { MessagesLocationBox } from '../ChatMessagesPanel';

export function getExtension(path) {
    var basename = path?.split(/[\\/]/)?.pop(),  // extract file name from full path ...
                                               // (supports `\\` and `/` separators)
        pos = basename?.lastIndexOf(".");       // get last position of `.`
    if (basename === "" || pos < 1)            // if file name is empty or ...
        return "";                             //  `.` not found (-1) or comes first (0)

    return basename.slice(pos + 1);            // extract extension ignoring `.`
}
export function checkExtension(path){
    // getExtension(msg?.file?.name) === "pdf"     ||
    // getExtension(msg?.file?.name) === "zip"     ||
    // getExtension(msg?.file?.name) === "psd"     ||
    // getExtension(msg?.file?.name) === "ppt"     ||
    // getExtension(msg?.file?.name) === "txt"     ||
    // getExtension(msg?.file?.name) === "rar"     ||
    // getExtension(msg?.file?.name) === "doc"     ||
    // getExtension(msg?.file?.name) === "docx"    ||
    // getExtension(msg?.file?.name) === "xls"     ||
    // getExtension(msg?.file?.name) === "ods"     ||
    // getExtension(msg?.file?.name) === "deb"     ||
    // getExtension(msg?.file?.name) === "xlsx"    ||
    // getExtension(msg?.file?.name) === "tif"     ||
    // getExtension(msg?.file?.name) === "dll"     ||
    // getExtension(msg?.file?.name) === "sav"     ||
    // getExtension(msg?.file?.name) === "dat"     ||
    // getExtension(msg?.file?.name) === "dbf"     ||
    // getExtension(msg?.file?.name) === "excel"   ||
    // getExtension(msg?.file?.name) === "avi"     ||
    // getExtension(msg?.file?.name) === "mkv"     ||
    // getExtension(msg?.file?.name) === "wmv"     ||
    // getExtension(msg?.file?.name) === "mov" 
    return (
        getExtension(path) === "pdf"  ||
        getExtension(path) === "zip"  ||
        getExtension(path) === "psd"  ||
        getExtension(path) === "ppt"  ||
        getExtension(path) === "txt"  ||
        getExtension(path) === "rar"  ||
        getExtension(path) === "doc"  ||
        getExtension(path) === "docx" ||
        getExtension(path) === "xls"  ||
        getExtension(path) === "ods"  ||
        getExtension(path) === "deb"  ||
        getExtension(path) === "xlsx" ||
        getExtension(path) === "tif"  ||
        getExtension(path) === "dll"  ||
        getExtension(path) === "sav"  ||
        getExtension(path) === "dat"  ||
        getExtension(path) === "dbf"  ||
        getExtension(path) === "excel"||
        getExtension(path) === "avi"  ||
        getExtension(path) === "mkv"  ||
        getExtension(path) === "wmv"  
    )
}
export function getFileName(name, Callback){
    // msg?.file?.name?.split('.').pop() === "pdf" ? "fileUplodedImageMode Pdf" :
    // msg?.file?.name?.split('.').pop() === "zip" ? "fileUplodedImageMode Zip" : 
    // msg?.file?.name?.split('.').pop() === "psd" ? "fileUplodedImageMode Psd" :
    // msg?.file?.name?.split('.').pop() === "ppt" ? "fileUplodedImageMode Ppt" :
    // msg?.file?.name?.split('.').pop() === "txt" ? "fileUplodedImageMode Text" :
    // msg?.file?.name?.split('.').pop() === "rar" ? "fileUplodedImageMode Rar" :
    // msg?.file?.name?.split('.').pop() === "doc" ? "fileUplodedImageMode Doc" :
    // msg?.file?.name?.split('.').pop() === "docx" ? "fileUplodedImageMode Docx" :
    // msg?.file?.name?.split('.').pop() === "xls" ? "fileUplodedImageMode Xls" :
    // msg?.file?.name?.split('.').pop() === "ods" ? "fileUplodedImageMode Ods" :
    // msg?.file?.name?.split('.').pop() === "deb" ? "fileUplodedImageMode Deb" :
    // msg?.file?.name?.split('.').pop() === "xlsx" ? "fileUplodedImageMode Xlsx" :
    // msg?.file?.name?.split('.').pop() === "tif" ? "fileUplodedImageMode Tif" :
    // msg?.file?.name?.split('.').pop() === "dll" ? "fileUplodedImageMode Dll" :
    // msg?.file?.name?.split('.').pop() === "sav" ? "fileUplodedImageMode Sav" :
    // msg?.file?.name?.split('.').pop() === "dat" ? "fileUplodedImageMode Dat" :
    // msg?.file?.name?.split('.').pop() === "dbf" ? "fileUplodedImageMode Dbf" :
    // msg?.file?.name?.split('.').pop() === "excel" ? "fileUplodedImageMode Excel" :
    // msg?.file?.name?.split('.').pop() === "avi" ? "fileUplodedImageMode Avi" :
    // msg?.file?.name?.split('.').pop() === "mkv" ? "fileUplodedImageMode Mkv" :
    // msg?.file?.name?.split('.').pop() === "wmv" ? "fileUplodedImageMode Wmv" :
    // msg?.file?.name?.split('.').pop() === "mov" ? "fileUplodedImageMode Mov" :
   return(  
    getExtension(name) === "pdf"    ? `${Callback} Pdf` :
    getExtension(name) === "zip"    ? `${Callback} Zip` : 
    getExtension(name) === "psd"    ? `${Callback} Psd` :
    getExtension(name) === "ppt"    ? `${Callback} Ppt` :
    getExtension(name) === "txt"    ? `${Callback} Text` :
    getExtension(name) === "rar"    ? `${Callback} Rar` :
    getExtension(name) === "doc"    ? `${Callback} Doc` :
    getExtension(name) === "docx"   ? `${Callback} Docx` :
    getExtension(name) === "xls"    ? `${Callback} Xls` :
    getExtension(name) === "ods"    ? `${Callback} Ods` :
    getExtension(name) === "deb"    ? `${Callback} Deb` :
    getExtension(name) === "xlsx"   ? `${Callback} Xlsx` :
    getExtension(name) === "tif"    ? `${Callback} Tif` :
    getExtension(name) === "dll"    ? `${Callback} Dll` :
    getExtension(name) === "sav"    ? `${Callback} Sav` :
    getExtension(name) === "dat"    ? `${Callback} Dat` :
    getExtension(name) === "dbf"    ? `${Callback} Dbf` :
    getExtension(name) === "excel"  ? `${Callback} Excel` :
    getExtension(name) === "avi"    ? `${Callback} Avi` :
    getExtension(name) === "mkv"    ? `${Callback} Mkv` :
    getExtension(name) === "wmv"    ? `${Callback} Wmv` :
    getExtension(name) === "mov"    ? `${Callback} Mov` : 
    getExtension(name) === "3gp"    ? `${Callback} Mov` :`${Callback}`
   )
}
export function ImageExtension(path){
    return (
        getExtension(path?.file?.name) === "jpg"    ||
        getExtension(path?.file?.name) === "jpeg"   ||
        getExtension(path?.file?.name) === "png"    ||
        getExtension(path?.file?.name) === "gif"    ||
        getExtension(path?.file?.name) === "webp"   ||
        getExtension(path?.file?.name) === "PNG"    || 
        getExtension(path?.file?.name) === "ico"    ||
        getExtension(path?.file?.name) === "svg"
    )
}
export default function MessagePanel({msg, chatDetails, access_token, userLogin, DetailsList, UserDetails, navigate, dispatch }) {
    const getFromUserGroup = (msg) =>{
       if(msg?.from_id === userLogin?.user_id) return  (
            `${"You: "+ msg?.message}`
        )
        let Users = chatDetails?.users?.filter((item)=>item?.id === msg?.from_id);
        if(Users?.length === 0){
            if(UserDetails[msg?.from_id]){
                Users = UserDetails[msg?.from_id];
            }
        }
        return  (
            `<span class="w-auto">${Users[0]?.name}</span> : ${msg?.message}`
        )
    }
    const getFromUser = (msg, UserList) =>{
        if(msg?.from_id === userLogin?.user_id) return  (
            "You: "
         )
         let Users = UserList?.filter((item)=>item?.id === msg?.from_id);
         if(Users?.length === 0){
             if(UserDetails[msg?.from_id]){
                 Users = UserDetails[msg?.from_id];
             }
         }
         return  (
             Users[0]?.name+": "
         )
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
    const FileAuthPreviewDownload =async (message) => {
        const url = await GetViewFilesAPI(message?.file?.view_file_url, access_token);
        var tempEl = document.createElement("a");
        tempEl.href = url;
        tempEl.download = message?.file?.name;
        tempEl.click();
        window.URL.revokeObjectURL(url);
    }
     const ImageVideoFileCreateGroups = (msg) => {     

        return (
            <div className="imageUplodedGroupsWrap">            
                {(getExtension(msg?.file?.name) === "jpg" || getExtension(msg?.file?.name) === "jpeg" || getExtension(msg?.file?.name) === "png" || getExtension(msg?.file?.name) === "webp") && (
                    <div 
                        className="filesUplodedUIwrappser"
                    >
                        <div 
                            className="filedetailswrapps"
                        >
                            <div className={getFileName(msg?.file?.name, "fileUplodedImageMode Img")}></div>
                            <div className="filedetails">
                                <h4>{msg?.file?.name}</h4>
                                <span>
                                    {formatFileSize(msg?.file?.size)}
                                </span>
                            </div>
                            <Tooltip content="Download" direction="bottom">
                                <button 
                                    className="fileDonwload"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        FileAuthPreviewDownload(msg);
                                    }}
                                ><span></span></button>
                            </Tooltip>
                        </div>
                    </div>
                )}

                {(getExtension(msg?.file?.name) === "mp4" || getExtension(msg?.file?.name) === "mov" || getExtension(msg?.file?.name) === "3gp") && (
                    <div 
                        className="filesUplodedUIwrappser"
                    >
                        <div 
                            className="filedetailswrapps"
                        >
                            <div className={getFileName(msg?.file?.name, "fileUplodedImageMode Vid")}></div>
                            <div className="filedetails">
                                <h4>{msg?.file?.name}</h4>
                                <span>
                                    {formatFileSize(msg?.file?.size)}
                                </span>
                            </div>
                            <Tooltip content="Download" direction="bottom">
                                <button 
                                    className="fileDonwload"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        FileAuthPreviewDownload(msg);
                                    }}
                                ><span></span></button>
                            </Tooltip>
                        </div>
                    </div>
                )}

                {/* all files groups */}
                {(
                    checkExtension(msg?.file?.name)
                ) && (<div 
                    className="filesUplodedUIwrappser"
                >
                    <div 
                        className="filedetailswrapps"
                    >
                        <div className={getFileName(msg?.file?.name, "fileUplodedImageMode")}></div>
                        <div className="filedetails">
                            <h4>{msg?.file?.name}</h4>
                            <span>
                                {formatFileSize(msg?.file?.size)}
                            </span>
                        </div>
                        <Tooltip content="Download" direction="bottom">
                                <button 
                                    className="fileDonwload"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        FileAuthPreviewDownload(msg);
                                    }}
                                ><span></span></button>
                            </Tooltip>
                    </div>
                </div>)}
                
                {(getExtension(msg?.file?.name) === "mp3" || getExtension(msg?.file?.name) === "m4a" || getExtension(msg?.file?.name) === "ogg" || getExtension(msg?.file?.name) === "wav" || getExtension(msg?.file?.name) === "mpeg") && (
                    <div className="filesUplodedUIwrappser">
                        <div className="filedetailswrapps">
                            <div className={getFileName(msg?.file?.name, "fileUplodedImageMode Aud")}></div>
                            <div className="filedetails">
                                <h4>{msg?.file?.name}</h4>
                                <span>
                                    {formatFileSize(msg?.file?.size)}
                                </span>
                            </div>
                            <Tooltip content="Download" direction="bottom">
                                <button 
                                    className="fileDonwload"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        FileAuthPreviewDownload(msg);
                                    }}
                                ><span></span></button>
                            </Tooltip>
                        </div>
                    </div>
                )}
            </div>
        )
    }
    const ShareContactMessage = ({msg}) => {
        var splitedNameNmber = msg?.message.split('[|]');
        var GetName = splitedNameNmber[0];
        var GetNumber = splitedNameNmber[1];
        console.log("msg", msg)
        return(<div className="contactSharedDemo">
            <Image src={DummyImage} alt="shared profile" />
            <div className="contactNameDeta">
                <h4>{GetName}</h4>
                {/* <p>{"+ " + GetNumber.replace('+', "")}</p> */}
                <p>{GetNumber.includes("+") ? GetNumber : `+ ${GetNumber}`}</p>
            </div>
        </div>)
    };
    return(
    <React.Fragment key={msg?.id}>
        <ListGroupItem onClick={(e)=>{
            e.preventDefault()
            setTimeout(()=>{
                navigate("/Chat/"+chatDetails?.id)
                dispatch(setScrollToChatid({msg_id:msg?.id, to_id:chatDetails?.id}))
                dispatch(setSearchModalData(false))
            }, 10)
        }} className={"chatMessageList"} >

            {(msg?.group_id || msg?.broadcast_group_id) && <small className='mb-1 small' >MESSAGES</small>}
            <div className="me-auto message_info" onClick={(e)=>e.preventDefault()}>
                {/* UserName */}
                    {msg?.group_id &&<h4 className='mb-2 h4' > {chatDetails?.group_name}</h4>}
                    {msg?.broadcast_group_id &&<h4 className='mb-2 h4' > {chatDetails?.broadcast_name}</h4>}
                    {(msg?.to_id && msg?.from_id) &&<h4 className='mb-2 h4' > {chatDetails?.name}</h4>}
                {/* UserName */}
                <small className='float-right'>
                    {moment.utc(msg?.created_at).local().format('DD/MM/YY')}
                </small>
                {msg?.message_type === "text"&&
                <React.Fragment>
                    {msg?.group_id &&(
                        <React.Fragment>
                            <p className='text_messages mb-2' dangerouslySetInnerHTML={{__html:getFromUserGroup(msg)}}/>
                        </React.Fragment>
                    )}
                    {((msg?.group_id === undefined || null) && (msg?.broadcast_group_id === undefined|| null)) &&(
                        <React.Fragment>
                            <p className='text_messages mb-2' dangerouslySetInnerHTML={{__html:msg?.from_id === userLogin?.user_id? "You: " +msg?.message:msg?.message}}/>
                        </React.Fragment>
                    )}
                    {(msg?.broadcast_group_id !== undefined|| null) && (
                        <React.Fragment>
                            <p className='text_messages mb-2' dangerouslySetInnerHTML={{__html:msg?.message}}/>
                        </React.Fragment>
                    )}
                </React.Fragment>}

                {msg?.message_type === "file"&&
                    <React.Fragment>
                        <div className='text_messages mb-2 locations_p'>
                            {/* <p className='text_messages mb-2' dangerouslySetInnerHTML={{__html:msg?.message}}/> */}
                            {msg?.group_id  ? getFromUser(msg, chatDetails?.users)+ msg?.file?.name :null}
                            {((msg?.group_id === undefined || null) && (msg?.broadcast_group_id === undefined|| null)) ?
                            ( msg?.from_id === userLogin?.user_id ? "You: "+msg?.file?.name:  ``)
                            :""
                            }
                        </div>
                        <div className='chatMsg files'>
                            {ImageVideoFileCreateGroups(msg)}
                        </div>
                    </React.Fragment>
                }
                 {msg?.message_type === "contact" &&
                    <React.Fragment>
                        <div className='text_messages mb-2'>
                            
                            {msg?.group_id  ? <p className='mb-2 locations_p'>{ getFromUser(msg, chatDetails?.users)}</p>:null}
                            {((msg?.group_id === undefined || null) && (msg?.broadcast_group_id === undefined|| null)) ?
                            ( msg?.from_id === userLogin?.user_id ?<p className='mb-2 locations_p'>You: </p>:  ``)
                            :""
                            }
                            
                            {ShareContactMessage({msg:msg})}
                        </div>
                    </React.Fragment>
                 }
                 {msg?.message_type === "location" &&
                    <React.Fragment>
                        <div className='text_messages mb-2' >
                            {MessagesLocationBox({msg:msg})}
                        </div>
                        <p className='mb-1 locations_p'>
                            {/* <p className='text_messages mb-2' dangerouslySetInnerHTML={{__html:msg?.message}}/> */}
                            {msg?.group_id  ? <p className='mb-2 locations_p'>{ getFromUser(msg, chatDetails?.users)}</p>:null}
                            {((msg?.group_id === undefined || null) && (msg?.broadcast_group_id === undefined|| null)) ?
                            ( msg?.from_id === userLogin?.user_id ? "You: ":  ``)
                            :""
                            } {msg?.message?.split('[|]')[2]}
                        </p>
                    </React.Fragment>
                 }
            </div>
        </ListGroupItem>
    </React.Fragment>
    )
}
