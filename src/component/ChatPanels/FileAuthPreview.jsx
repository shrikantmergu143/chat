/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import GetViewFilesAPI from '../../Api/Viewfiles';
import PropTypes from 'prop-types';
import { Image } from 'react-bootstrap';
import { AudioPlayerControlSprite, Audio as Audios } from 'react-audio-player-pro';
import {LoaderComman} from '../common/sidebar/RighSideLoader';
import defulticon from "./../../assets/img/defult icon.svg";
import { SetStoreViewBaseURL } from '../../redux/actions';

export default function FileAuthPreview(props) {
    const access_token = useSelector((state)=>state?.allReducers?.access_token);
    const view_base_url = useSelector((state)=>state?.allReducers?.view_base_url);
    const { message, url, className, replymessage } = props;
    const [previewURL, setPreviewURL] = useState(null);
    const dispatch = useDispatch();
    const [fileLoader, setFileloader] = useState(false);
    const [duration, setDuration] = useState("");
    const [audioDuration, setAudioDuration] = useState("");
    const headers = {
        "Authorization": `Bearer ${access_token}`,
      };

    useEffect(() => {
        const data = async ()=>{
            if(url){
                // live file preview code
                // if(props?.Type === "Docs") {
                //     if(view_base_url[url]){
                //         setPreviewURL(view_base_url[url]);
                //         setFileloader(false);
                //     }else{
                //         setFileloader(true);
                //         const responce = await GetViewFilesAPI(url, access_token);
                //         dispatch(SetStoreViewBaseURL({id:url, url:responce}));
                //         setPreviewURL(responce);
                //         setFileloader(false);
                //     }
                // } else {
                    // setPreviewURL(url);
                // }

                // local file preview code 
                if(view_base_url[url]){
                    setPreviewURL(view_base_url[url]);
                    setFileloader(false);
                }else{
                    setFileloader(true);
                    const responce = await GetViewFilesAPI(url, access_token);
                    dispatch(SetStoreViewBaseURL({id:url, url:responce}));
                    setPreviewURL(responce);
                    setFileloader(false);
                }
            }else{
                setPreviewURL(props?.src);
            }
        }
        data();
    }, [url, previewURL]);

    var getDuration = function (url, next) {
        var _player = new Audio(url);
        _player.addEventListener("durationchange", function (e) {
            // eslint-disable-next-line eqeqeq
            if (this.duration!=Infinity) {
               var duration = this.duration
               _player.remove();
               next(duration);
            };
        }, false);      
        _player.load();
        _player.currentTime = 24*60*60; //fake big time
        _player.volume = 0;
        _player.play();
        //waiting...
    };

    if(fileLoader)
    return(
        <div className={"file_preview_loader_div"} >
            {props?.Type === "Audio" &&(
                <React.Fragment>
                    <AudioPlayerControlSprite/>
                    <LoaderComman className={"file_preview_loader Audio"} isShow={true}/>
                    <Audios
                        src={previewURL}
                        preload="auto"
                        duration={duration}
                        className="audioUpload"
                        downloadFileName={message?.file?.name}
                        useRepeatButton={false}
                    />
                </React.Fragment>
            )}
            {props?.Type === "Video" &&(
                    <LoaderComman className={"file_preview_loader Video"} isShow={true}/>
            )}
            {props?.Type === "Docs" &&(
                    <LoaderComman className={"file_preview_loader Docs"} isShow={true}/>
            )}
            {(  
                props?.Type !== "Video" &&
                props?.Type !==  "Audio" &&
                props?.Type !==  "Docs"
            ) && (
                <LoaderComman className={"file_preview_loader Images"} isShow={true}/>
            )}
        </div>
    );
    if(props?.Type === "Docs" && fileLoader === false){
        return(
            // <iframe src={"http://docs.google.com/gview?url="+ previewURL + "&embedded=true"} ></iframe>
                <embed className="pdfobject" src={previewURL} type="application/pdf" name={message?.file?.name} style={{height:"100%"}}  internalinstanceid="88"/>
            // <DocViewer
            //     pluginRenderers={[BMPRenderer, HTMLRenderer, ImageProxyRenderer, JPGRenderer, MSDocRenderer, MSGRenderer, PDFRenderer, PNGRenderer, TIFFRenderer, TXTRenderer,]}
            //     documents={[{uri:previewURL, fileName:message?.file?.name}]}
            //     prefetchMethod="GET"
            //     requestHeaders={headers}
                
            // />
        )
    }
    if(props?.Type === "Audio"){

        return(
            <React.Fragment>
                <AudioPlayerControlSprite/>
                <Audios
                    src={previewURL}
                    preload="auto"
                    duration={duration}
                    className="audioUpload"
                    downloadFileName={message?.file?.name}
                    useRepeatButton={false}
                />
            </React.Fragment>
        )
    }
    if(props?.Type === "Video"){
        return(
            <video 
                src={previewURL}  
                controls={true} 
                autoPlay="autoplay"
                width="100%" 
                height="100%" 
            >
                <Image
                    url={previewURL}
                    alt={message?.file?.name}
                />
                Your browser does not support HTML5 video.
            </video>
        )
    }
  return (
    <Image src={previewURL} className={className&&className} onError={(e)=>e.target.src=defulticon} alt={message?.file?.name} onClick={() =>props?.onClick && props?.onClick()}/>
  )
}
FileAuthPreview.propTypes = {
    message: PropTypes.any,
    className:PropTypes.string,
    alt:PropTypes.string,
    onClick:PropTypes.func,
    url:PropTypes.string,
    Type:PropTypes.string,
    src:PropTypes?.string
};