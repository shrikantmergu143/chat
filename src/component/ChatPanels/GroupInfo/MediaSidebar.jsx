/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Image } from 'react-bootstrap';
import VideoPoster from "../../../assets/img/videoPoster.png";
import AudioImage from "../../../assets/img/audio_icon.png";
import PlayButton from "../../../assets/img/video_play_button.png";
import moment from "moment";
import { Scrollbars } from 'react-custom-scrollbars-2';
import PreviewPopup from '../../common/PreviewPopup';
import DownloadFile from '../../../Api/DownloadFile';
import Tooltip from '../../common/tooltip';
import Nomedia from "./../../../assets/img/sidebar/no_media.svg"
import No_linkes from "./../../../assets/img/sidebar/No_linkes.svg"
import no_files from "./../../../assets/img/sidebar/no_files.svg"
import GetViewFilesAPI from '../../../Api/Viewfiles';
import { useSelector } from 'react-redux';
import FileAuthPreview from '../FileAuthPreview';
import NoDataFound from '../../common/NoDataFound';
import { checkExtension, getFileName } from '../SearchChat/MessagesPanel';

const MediaSidebar = (props) => {
    const { open, fileListArray, linkListArray, Messages, VideoImagesShowFnt,DocsFilePreviewFnt, setCurrentVideoImage, setPreviewImageVideo, CurrentVideoImage, PreviewImageVideo } = props;
    const [ mediaTabSelected, setmediaTabSelected ] = useState("Media");
    var httpRegexG = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/g;
    const access_token = useSelector((state) =>state?.allReducers?.access_token);

    // this gives an object with dates as keys
    const groups = fileListArray && fileListArray.reduce((groups, files) => {
        if(files?.files !== undefined) {
            const date = moment.utc(files.MessageTime).format('MMM YYYY');
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(files);
        }
        return groups;
    }, {});
    
    const groupsFile = fileListArray && fileListArray?.reduce((groups, files) => {
        if(files?.file !== undefined) {
            const date = moment.utc(files.created_at).format('MMM YYYY');
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(files);
        }
        return groups;
    }, {});

    const groupMediaFile = groups && Object?.keys(groups).map((date) => {
        return {
          date,
          filesList: groups[date]
        };
    });

    const groupArraysFiles =groupsFile&&  Object?.keys(groupsFile).map((date) => {
        return {
          date,
          filesList: groupsFile[date]
        };
    });

    const groupsLinks = linkListArray &&  linkListArray?.reduce((groups, files) => {
        // console.log("groups", files)
        if(files?.message !== undefined && files?.message !== "") {
            const date = moment.utc(files.created_at).format('MMM YYYY');
            if (!groups[date]) {
                groups[date] = [];
            }
            if(files?.message?.match(httpRegexG)!== null){
                groups[date]?.push(files?.message?.match(httpRegexG)[0]);
            }
        }
        return groups;
    }, {});

    const groupArraysLinkes =groupsLinks &&  Object?.keys(groupsLinks).map((date) => {
        return {
          date,
          LinksList: groupsLinks[date]
        };
    });

    // file authanticate download file
    const FileAuthPreviewDownload =async (message) => {
        const url = await GetViewFilesAPI(message?.file?.view_file_url, access_token);
        var tempEl = document.createElement("a");
        tempEl.href = url;
        tempEl.download = message?.file?.name;
        tempEl.click();
        window.URL.revokeObjectURL(url);
    };

    const arrayFiles = []
    groupArraysFiles?.filter((item)=>{
        const data = item?.filesList?.filter((files)=>{
            if( checkExtension(files?.file?.name) ){
                return files;
            }
            return null;
        })
        if(data?.length > 0){
            arrayFiles?.push({filesList:data, date:item?.date})
        }else{
            return null;
        }
    });

    // get video time set
    const GetVideoTime = (msg) => {
        const TimeOfVideo = msg.file.duration.split(".")[0].split(":");
        let HrsTimeVideo = "";
        if(TimeOfVideo[0] > 0) {
            HrsTimeVideo = TimeOfVideo[0] + ":" + TimeOfVideo[1];
        } else {
            HrsTimeVideo = TimeOfVideo[1] + ":" + TimeOfVideo[2];
        }

        return(<span className="videoDuration">{HrsTimeVideo}</span>)
    };

    return (
        <div className={open === true ? "mainMediaSidebar open" : "mainMediaSidebar"}>
            <div className="mainMdiaTabs">         
                <h4 className={mediaTabSelected === 'Media' ? "active" : null} onClick={() => setmediaTabSelected("Media")}>
                    Media
                </h4>
                <h4 className={mediaTabSelected === 'Links' ? "active" : null} onClick={() => setmediaTabSelected("Links")}>
                    Links
                </h4>
                <h4 className={mediaTabSelected === 'Files' ? "active" : null} onClick={() => setmediaTabSelected("Files")}>
                    Files
                </h4>
            </div>
            <div className="allMediawrapper">
                {mediaTabSelected === 'Media' && (<div className="allMediawrapperContent">
                    <Scrollbars 
                        renderTrackVertical={props => <div {...props} className="track-vertical"/>}
                        renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
                        renderView={props => <div {...props} className="view"/>}
                        className="scrollararea"
                        style={{
                            minHeight: "calc(100vh - 115px)"
                        }}
                    >
                        {groupArraysFiles?.reverse()?.map((elm, index) => (
                            <React.Fragment key={index}>
                                <h4 className="filesDateMonthLabel">{elm?.date}</h4>
                                <div className="allMediawrappeSet">
                                    {elm?.filesList?.reverse()?.map((msg, index) => {
                                        if(
                                            msg?.file?.name?.includes("jpg") === true || 
                                            msg?.file?.name?.includes("jpeg") === true || 
                                            msg?.file?.name?.includes("png") === true || 
                                            msg?.file?.name?.includes("svg") === true || 
                                            msg?.file?.name?.includes("ico") === true || 
                                            msg?.file?.name?.includes("webp") === true || 
                                            msg?.file?.name?.includes("webm") === true
                                        ) {
                                            return (
                                                <div className='fileshowBlog allmediaImages ' key={index} onClick={() => VideoImagesShowFnt(msg)}>
                                                    <div className='file_components'>
                                                        {/* <Image onClick={()=>VideoImagesShowFnt(msg)} src={msg?.file?.name} alt={msg?.file?.name} /> */}
                                                        <FileAuthPreview message={msg} onClick={() => VideoImagesShowFnt(msg)} url={msg?.file?.view_thumbnail_url} alt={msg?.file?.name} />
                                                    </div>
                                                </div>
                                            )
                                        } else if (msg?.file?.name?.includes("m4a") === true || msg?.file?.name?.includes("mp3") === true || msg?.file?.name?.includes("ogg") === true || msg?.file?.name?.includes("wav") === true || msg?.file?.name?.includes("mpeg") === true) {
                                            return (
                                                <div className='fileshowBlog allmediaaudio  ' key={index} onClick={() => VideoImagesShowFnt(msg)}>
                                                    <div className='file_components'>
                                                    <FileAuthPreview message={msg} src={AudioImage} />
                                                    </div>
                                                </div>
                                            )
                                        } else if (msg?.file?.name?.includes("mp4") === true || msg?.file?.name?.includes("mov") === true || msg?.file?.name?.includes("3gp") === true) {
                                            return (
                                                <div className='fileshowBlog allmediavideo  ' key={index} onClick={() => VideoImagesShowFnt(msg)}>
                                                    <div className='file_components'>
                                                        <div className="videoovrlay"></div>
                                                        <video src={msg?.file?.name} id={`videoid_${msg?.id}`} style={{ display: "none" }}></video>
                                                        <Image onClick={()=>VideoImagesShowFnt(msg)} src={PlayButton} className="videoPlaybtn" alt="play button" />
                                                        {/* <Image src={msg?.file?.thumbnail} className="videoPoster" alt={msg?.file?.name} /> */}
                                                        <FileAuthPreview message={msg} className="videoposterimage" url={msg?.file?.view_thumbnail_url} alt={msg?.file?.name} />
                                                        {GetVideoTime(msg)}
                                                    </div>
                                                </div>
                                            )
                                        }
                                    })}
                                </div>
                            </React.Fragment>
                        ))}
                        {groupArraysFiles?.length === 0 &&// <h4 className='notdatafound'>No Files</h4>
                        <NoDataFound title={"No Files"} src={Nomedia} className={"No_data_div  mt-5"} />
                        }
                    </Scrollbars>
                </div>)}
                {mediaTabSelected === 'Links' && (<div className="allMediawrapperContent">
                    <Scrollbars 
                        renderTrackVertical={props => <div {...props} className="track-vertical"/>}
                        renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
                        renderView={props => <div {...props} className="view"/>}
                        className="scrollararea"
                        style={{
                            minHeight: "calc(100vh - 115px)"
                        }}
                    >
                        {groupArraysLinkes?.reverse()?.map((links, index) => {
                            return (<React.Fragment key={index}>
                                <h4 className="filesDateMonthLabel">{links.date}</h4>
                                <ul>
                                {links.LinksList.reverse()?.map((elm, index) => {
                                    return(
                                        <li key={index}>
                                            <a href={elm} target="_blank" className="customUrl">
                                                <Image src={`http://www.google.com/s2/favicons?domain=${elm.split('/')[2]}&size=30`} alt=""/>
                                                <span className='urlset'>{elm}</span>
                                            </a>
                                        </li>
                                    )
                                })}
                                </ul>
                            </React.Fragment>
                        )})}
                        {groupArraysLinkes?.length === 0 && //<h4 className='notdatafound'>No Links</h4>
                         <NoDataFound title={"No Links"} src={No_linkes} className={"No_data_div  mt-5"} />
                         }
                    </Scrollbars>
                </div>)}
                {mediaTabSelected === 'Files' && (<div className="allMediawrapperContent">
                    <Scrollbars 
                        renderTrackVertical={props => <div {...props} className="track-vertical"/>}
                        renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
                        renderView={props => <div {...props} className="view"/>}
                        className="scrollararea"
                        style={{
                            minHeight: "calc(100vh - 115px)"
                        }}
                    >
                        {arrayFiles?.reverse()?.map((elm, index) => {
                            return (<React.Fragment key={index}>
                            <h4 className="filesDateMonthLabel">{elm?.date}</h4>
                            <div className="allMediawrappeSet fileSetup">
                                {elm?.filesList?.map((files, index) => {
                                    if(files?.file?.name?.includes("image") !== true &&
                                    files?.file?.name?.includes("audio") !== true && 
                                    files?.file?.name?.includes("mp4") !== true &&
                                    files?.file?.name?.includes("webm") !== true) {
                                        return(
                                            <div className='fileUplodeSHOW' key={index} onClick={() => (files?.file?.name?.split('.').pop() === "pdf") && DocsFilePreviewFnt(files?.file)}>
                                                <div
                                                className={ getFileName(files?.file?.name, "filesUploads") }
                                                ></div>
                                                <div className="filesDetails">
                                                    <h4>{files?.file?.name}</h4>
                                                    <span>{files.size}</span>
                                                </div>
                                                <Tooltip content="Download" direction="bottom">
                                                    <button 
                                                        className="fileDonwload"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            FileAuthPreviewDownload(files);
                                                        }}
                                                    ><span></span></button>
                                                </Tooltip>
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        </React.Fragment>)})}
                        {arrayFiles?.length === 0 && //<h4 className='notdatafound'>No Files</h4>
                         <NoDataFound title={"No Files"} src={no_files} className={"No_data_div  mt-5"} />
                        }
                    </Scrollbars>
                </div>)}
            </div>
        </div>
    )
}

export default MediaSidebar; 