/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import PlayButton from "../../assets/img/videoplaybtn.svg";
import { AudioPlayerControlSprite, Audio } from 'react-audio-player-pro';
import moment from "moment";
import { baseURL } from "../../constant/url";
import DocFilesPreview from "../common/DocFilesPreview";
import { checkExtension, getFileName } from "./SearchChat/MessagesPanel";

const FileUploadPreview = (props) => {
    const { files, isMessageEmpty, accessToken, filesDate } = props;
    const [ FilesArray, setFilesArray ] = useState({});
    const [ DocFilePopupOpen, setDocFilePopupOpen ] = useState(false);
    const [ selectDocsFile, setSelectDocsFile ] = useState({
        name: "",
        id: "",
        url: "",
    })
   
    // download file function
    const DownloadFile = (files) => {
        const Url = files?.url;

        fetch(Url)
            .then((response) => response.blob())
            .then((blob) => {
                const blobUrl = URL.createObjectURL(blob);
                const tempAnchor = document.createElement("a");
                tempAnchor.download = files?.name;
                tempAnchor.href = blobUrl;
                document.body.appendChild(tempAnchor);
                tempAnchor.click();
                tempAnchor.remove();
        });
    }

    // get files function
    const GetFileConvertFnt = () => {
        // console.log("files==========>", files)
        window.axios.get(`${process.env.REACT_APP_BASE_URL}/upload/url/${files}`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization':`Bearer ${accessToken}`
        }}).then(function (result) {
            setFilesArray(result.data);
        });
    }

    useEffect(() => {
        GetFileConvertFnt();
    }, []);

    // // image filter array function
    // const ImageFilter = FilesArrayList && FilesArrayList.filter((file) => {
    //     if(file.name.includes("jpeg") === true ||
    //       file.name.includes("png") === true ||
    //       file.name.includes("webp") === true) {
    //         return file;
    //     }
    // })

    // // video filter array function
    // const VideoFilter = files && files.filter((file) => {
    //     if(file.type.includes("mp4") === true || file.type.includes("webm") === true) {
    //         return file;
    //     }
    // })

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
        setSelectDocsFile({...selectDocsFile, file:files, name: files.name, id: files.id, url: files.url,});
    }

    return(
        <div className={isMessageEmpty !== "" ? "imageUplodedGroupsWrap styleadded" : "imageUplodedGroupsWrap"}>
            {/* image group gallery */}
            {(FilesArray?.name?.split('.').pop() === "jpg" || FilesArray?.name?.split('.').pop() === "jpeg" || FilesArray?.name?.split('.').pop() === "png" || FilesArray?.name?.split('.').pop() === "webp") && (
                <div className="imageMainGroup">
                    <div className="imageUplodedGroups" >
                        <Image src={FilesArray?.url} alt={FilesArray?.name} />
                    </div>
                </div>
            )}

            {/* video group gallery */}
            {(FilesArray?.name?.split('.').pop() === "mp4" || FilesArray?.name?.split('.').pop() === "mov" || FilesArray?.name?.split('.').pop() === "3gp") && (
                <div className="VideoUploadGroups">
                    <Image src={PlayButton} className="videoPLybtn" alt="play button" />
                    <Image src={FilesArray?.thumbnail} className="videoposterimage" alt="video poster image" />
                </div>
            )}

            {/* all files groups */}
            {( checkExtension(FilesArray?.name) ) && (<div 
                className="filesUplodedUIwrappser"
              >
                <div 
                    className="filedetailswrapps"
                    onClick={() => { 
                        (FilesArray?.name?.split('.').pop() === "pdf") && DocsFilePreviewFnt(FilesArray);                    
                    }}
                >
                    <div className={ getFileName(FilesArray?.name, "fileUplodedImageMode")}></div>
                    <div className="filedetails">
                        <h4>{FilesArray?.name}</h4>
                        <span>
                            {formatFileSize(FilesArray?.size)} &nbsp;
                            <small>
                            {filesDate!=="None" &&moment.utc(new Date(filesDate)).format('hh:mm a')}
                                {/* {(msgStatus.Member === "self" && Messages.slice(-1).pop().id === msgStatus.id) ? 
                                    <div className="messageNotSeen"></div> : 
                                    <div className="seenMessage"></div>
                                } */}
                            </small>
                        </span>
                    </div>
                </div>
                <button onClick={() => DownloadFile(FilesArray, accessToken)}>Download</button>
            </div>)}

            {(FilesArray?.name?.split('.').pop() === "mp3" || FilesArray?.name?.split('.').pop() === "m4a" || FilesArray?.name?.split('.').pop() === "ogg" || FilesArray?.name?.split('.').pop() === "wav" || FilesArray?.name?.split('.').pop() === "mpeg") && (<div className="audioUploadGroups" >
                <AudioPlayerControlSprite/>
                <Audio
                    src={FilesArray?.url}
                    preload="auto"
                    duration={100}
                    className="audioUpload"
                    downloadFileName={FilesArray?.name}
                    useRepeatButton={false}
                />
                <div className="file_sizeset">{formatFileSize(FilesArray?.size)}</div>
            </div>)}

            {/* {console.log("DocFilePopupOpen========>", FilesArray)} */}
            {/* {ImageFilter?.length !== 0 && (<div className={ImageFilter?.length > 4 ? "imageMainGroup imageMainGroupActive" : "imageMainGroup"}>
                {ImageFilter && ImageFilter?.slice(0, 4).map((elms, index) => {
                    return(
                        <div className="imageUplodedGroups" key={index}>
                            <Image src={elms?.url} alt={elms?.name} onClick={() => VideoImagesShowFnt(elms)} />
                            {ImageFilter.length > 4 && (index === 3 && (
                                <div 
                                    className="imageGroupcount" 
                                    onClick={() => VideoImagesShowFnt(elms)}
                                    >+ {ImageFilter.length - 4}
                            </div>))}
                        </div>
                    )
                })}
            </div>)} */}

            {/* video group gallery */} 
            {/* {VideoFilter.length !== 0 && (<div className={VideoFilter.length > 4 ? "imageMainGroup imageMainGroupActive" : "imageMainGroup"}>
                {VideoFilter && VideoFilter?.slice(0, 4).map((elms, index) => {
                    return (<div className="VideoUploadGroups" key={index} onClick={() => VideoImagesShowFnt(elms)}>
                        <Image src={PlayButton} className="videoPLybtn" alt="play button" />
                        <Image src={VideoPoster} className="videoposterimage" alt="video poster image" />
                        {VideoFilter.length > 4 && (index === 3 && (
                            <div 
                                className="imageGroupcount" 
                                onClick={() => VideoImagesShowFnt(elms)}
                            > + {VideoFilter.length - 4}</div>
                        ))}
                    </div>)
                })}
            </div>)} */}

            {/* files all design */}
            {/* {files && files?.map((file, index) => {
                if (file.type.includes("audio") === true) { // audio upload 
                    return (<div className="audioUploadGroups" key={index}>
                        <AudioPlayerControlSprite/>
                        <Audio
                            src={file?.base64}
                            preload="auto"
                            duration={100}
                            className="audioUpload"
                            downloadFileName={file?.name}
                            useRepeatButton={false}
                        />
                        <div className="file_sizeset">{file?.size}</div>
                    </div>)
                } else if (
                        file.type.includes("image") !== true && 
                        file.type.includes("mp4") !== true &&
                        file.type.includes("webm") !== true
                    ) {
                    return ( // file upload design
                        <div className="filesUplodedUIwrappser" key={index}>
                            <div className="filedetailswrapps">
                                <div className={file.name.split('.').pop() === "pdf" ? "fileUplodedImageMode Pdf" :
                                    file.name.split('.').pop() === "zip" ? "fileUplodedImageMode Zip" : 
                                    file.name.split('.').pop() === "psd" ? "fileUplodedImageMode Psd" :
                                    file.name.split('.').pop() === "ppt" ? "fileUplodedImageMode Ppt" :
                                    file.name.split('.').pop() === "txt" ? "fileUplodedImageMode Text" :
                                    file.name.split('.').pop() === "rar" ? "fileUplodedImageMode Rar" :
                                    file.name.split('.').pop() === "doc" ? "fileUplodedImageMode Doc" :
                                    file.name.split('.').pop() ==="docx" ? "fileUplodedImageMode Docx" :
                                    file.name.split('.').pop() === "xls" ? "fileUplodedImageMode Xls" :
                                    file.name.split('.').pop() === "ods" ? "fileUplodedImageMode Ods" :
                                    file.name.split('.').pop() === "deb" ? "fileUplodedImageMode Deb" :
                                    file.name.split('.').pop() ==="xlsx" ? "fileUplodedImageMode Xlsx" :
                                    file.name.split('.').pop() === "tif" ? "fileUplodedImageMode Tif" :
                                    file.name.split('.').pop() === "dll" ? "fileUplodedImageMode Dll" :
                                    file.name.split('.').pop() === "sav" ? "fileUplodedImageMode Sav" :
                                    file.name.split('.').pop() === "dat" ? "fileUplodedImageMode Dat" :
                                    file.name.split('.').pop() === "dbf" ? "fileUplodedImageMode Dbf" :
                                    file.name.split('.').pop() === "excel" ? "fileUplodedImageMode Excel" :
                                    file.name.split('.').pop() === "avi" ? "fileUplodedImageMode Avi" :
                                    file.name.split('.').pop() === "mkv" ? "fileUplodedImageMode Mkv" :
                                    file.name.split('.').pop() === "wmv" ? "fileUplodedImageMode Wmv" :
                                    file.name.split('.').pop() === "mov" ? "fileUplodedImageMode Mov" :
                                    "fileUplodedImageMode"}></div>
                                <div className="filedetails">
                                    <h4>{file?.name}</h4>
                                    <span>
                                        {file?.size} &nbsp;  */}
                                        {/* {moment.utc(msgStatus.MessageTime).format('hh:mm a')} */}
                                        {/* <small>
                                            {(msgStatus.Member === "self" && Messages.slice(-1).pop().id === msgStatus.id) ? 
                                                <div className="messageNotSeen"></div> : 
                                                <div className="seenMessage"></div>
                                            }
                                        </small> */}
                                    {/* </span>
                                </div>
                            </div>
                            <button onClick={() => DownloadFile(file)}>Download</button>
                        </div>
                    )
                }
            })} */}

            {DocFilePopupOpen === true && (<DocFilesPreview selectDocsFile={selectDocsFile} setSelectDocsFile={setSelectDocsFile} setDocFilePopupOpen={setDocFilePopupOpen} />)}
        </div>
    )
}

export default FileUploadPreview;