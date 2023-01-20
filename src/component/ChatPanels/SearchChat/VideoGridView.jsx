/* eslint-disable no-useless-escape */
import React from 'react'
import { useSelector } from 'react-redux';
import moment from "moment";
import { AudioPlayerControlSprite, Audio} from 'react-audio-player-pro';
import PlayButton from "../../../assets/img/videoplaybtn.svg";
import { Badge, Image, ListGroupItem } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars-2';
import DownloadFile from "../../../Api/DownloadFile";
import ForwordMessage from "../../../assets/img/Fordwardmessgae.png";
import FileAuthPreview from '../FileAuthPreview';
import MessageStatus from '../MessageStatus';
import GetViewFilesAPI from '../../../Api/Viewfiles';
import Tooltip from '../../common/tooltip';
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
export default function VideoGridView({msg, chatDetails, access_token, userLogin, DetailsList, UserDetails, setOpenModalBox }) {
 
    return(
    <React.Fragment key={msg?.id}>
        <div className="me-auto message_info">
            <div className="VideoUploadGroups" onClick={()=>setOpenModalBox(msg)}>
                <Image src={PlayButton} className="videoPLybtn" alt="play button" />
                {/* <img alt={msg?.file?.view_thumbnail_url} src={msg?.file?.view_thumbnail_url} /> */}
                <FileAuthPreview message={msg} className="videoposterimage" url={msg?.file?.view_thumbnail_url} alt={msg?.file?.name} />
                {GetVideoTime(msg)}
            </div>
        </div>
    </React.Fragment>
    )
}
