/* eslint-disable */
import React, { useState } from 'react';
import { Image } from 'react-bootstrap';
import VideoPoster from "../../../assets/img/videoPoster.png";
import AudioImage from "../../../assets/img/audio_icon.png";
import PlayButton from "../../../assets/img/play_dark.svg";
import PreviewPopup from "./../../common/PreviewPopup";
import FileAuthPreview from '../FileAuthPreview';
import Nomedia from "./../../../assets/img/sidebar/no_media.svg"
import NoDataFound from '../../common/NoDataFound';
import { checkExtension, getFileName, ImageExtension } from '../SearchChat/MessagesPanel';

const GroupMedia = (props) => {
    const { UserId, linkListArray, Contacts, fileListArray, showMoreFile, setshowMoreFile,VideoImagesShowFnt, DocsFilePreviewFnt, PreviewImageVideo, CurrentVideoImage, setPreviewImageVideo } = props;
    const FileandLinkMergeArray = fileListArray?.concat(linkListArray).sort((a,b)=> a?.created_at?.localeCompare(b.created_at));
    var pattern = /(\b(https?|ftp|file):\/\/[\-A-Z0-9+&@#\/%?=~_|!:,.;]*[\-A-Z09+&@#\/%=~_|])/img;
    var httpRegexG = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/g;

    return (<div className="medialinksfilesWrapper">
            <div className="medialinksfilesHeader">
                <h4>Media, Links, Files</h4>
                {FileandLinkMergeArray?.length > 0 && (<div 
                    className="mediasviewalllink"
                    onClick={() => setshowMoreFile(!showMoreFile)}
                >View All</div>)}
            </div>
            <div className="medialinksfilesDetails">
                {FileandLinkMergeArray?.length === 0 && 
                    (
                        <NoDataFound title={"No Media"} src={Nomedia} className={"No_data_div"} />
                    )
                }
                {FileandLinkMergeArray && FileandLinkMergeArray.slice(-4).reverse().map((msg, index) => {
                    if( msg?.message_type === "file" && ImageExtension(msg) ) { // image display condition
                        return(<div className="mediaList" key={index} onClick={() => VideoImagesShowFnt(msg)}>
                            <FileAuthPreview message={msg} url={msg?.file?.view_thumbnail_url} alt={msg?.file?.name} />
                            {/* <Image src={msg?.file?.name} alt={msg?.file?.thumbnail}  /> */}
                        </div>)
                    } else if( msg?.message_type === "file" &&msg?.file?.name?.includes("mp3") === true ||msg?.file?.name?.includes("m4a") === true || msg?.file?.name?.includes("ogg") === true || msg?.file?.name?.includes("wav") === true || msg?.file?.name?.includes("mpeg") === true) { // audio condition
                        return(<div className="mediaList audiomediallist" key={index} onClick={() => VideoImagesShowFnt(msg)}>
                            <FileAuthPreview message={msg} src={AudioImage} />
                            {/* <Image src={AudioImage} alt={msg?.file?.name} /> */}
                        </div>)
                    } else if ( msg?.message_type === "file" &&msg?.file?.name?.includes("mp4") === true || msg?.file?.name?.includes("mov") === true || msg?.file?.name?.includes("3gp") === true) { 
                        // video condition
                        return(<div className="mediaList video_plylist" key={index} onClick={() => VideoImagesShowFnt(msg)}>
                            <Image src={PlayButton} className="videoPLybtn" alt="play button" />
                            {/* <Image src={msg?.file?.thumbnail} className="videoposterimage" alt="video poster image" /> */}
                            <FileAuthPreview message={msg} className="videoposterimage" url={msg?.file?.view_thumbnail_url} alt={msg?.file?.name} />
                        </div>)
                    } else if (msg?.message_type === "file" && checkExtension(msg?.file?.name)) { // all files condition
                        return(<div className="mediaList filesextnsUplodeshow" key={index} onClick={() => (msg?.file?.name?.split('.').pop() === "pdf") && DocsFilePreviewFnt(msg?.file)}> 
                            <div 
                                className={getFileName(msg?.file?.name, "filesUploads")}
                            ></div>
                        </div>)
                    } else {
                        return(<div className="mediaList linkList" key={index}>
                            {msg.message.match(httpRegexG) !== null && 
                                <a href={msg.message.match(httpRegexG)[0]} target="_blank" className="customUrl">
                                    <Image src={`http://www.google.com/s2/favicons?domain=${msg.message.match(httpRegexG)[0]}&size=30`} className="linkWrapperSet" alt="links" />
                                </a>
                            }
                      </div>
                    )}})}
            </div>
            {/* {PreviewImageVideo === true && (<PreviewPopup Contacts={Contacts} UserId={UserId} CurrentVideoImage={CurrentVideoImage} setPreviewImageVideo={setPreviewImageVideo} />)} */}
    </div>)
}

export default GroupMedia;