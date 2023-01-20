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

export default function ImageGridView({msg, chatDetails, access_token, userLogin, DetailsList, UserDetails, setOpenModalBox }) {
    return(
    <React.Fragment key={msg?.id}>
        <div className="me-auto message_info" >
            {/* <img alt={msg?.file?.view_thumbnail_url} src={msg?.file?.view_thumbnail_url} /> */}
            <FileAuthPreview onClick={()=>setOpenModalBox(msg)} message={msg} className="images_preview" url={msg?.file?.view_file_url} alt={msg?.file?.name} />
        </div>
    </React.Fragment>
    )
}
