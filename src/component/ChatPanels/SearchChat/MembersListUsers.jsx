/* eslint-disable no-useless-escape */
import React from 'react'
import { useSelector } from 'react-redux';
import moment from "moment";
import { AudioPlayerControlSprite, Audio} from 'react-audio-player-pro';
import PlayButton from "../../../assets/img/videoplaybtn.svg";
import { Badge, Image, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars-2';
import DownloadFile from "../../../Api/DownloadFile";
import ForwordMessage from "../../../assets/img/Fordwardmessgae.png";
import FileAuthPreview from '../FileAuthPreview';
import MessageStatus from '../MessageStatus';
import GetViewFilesAPI from '../../../Api/Viewfiles';
import Tooltip from '../../common/tooltip';
import dummygroup from "../../../assets/img/profile/dummygroup.png"
import dummyuser from "../../../assets/img/profile/dummyimage.png"
import ProfileAuthPreview from '../ProfileAuthPreview';
import { setSearchModalData } from '../../../redux/actions';

export default function MembersListUsers({user, chatDetails, access_token, userLogin, DetailsList, navigate, dispatch }) {
 
    return(
    <React.Fragment key={user?.id}>
       <ListGroup.Item onClick={()=>{
           navigate("Chat/"+user?.id)
           dispatch(setSearchModalData(false))
        }} className={"list-group-item"} >
        <div className="w-auto position-relative message_info py-1">
            {(user?.name || user?.phone) && 
            <React.Fragment>
                <ProfileAuthPreview 
                    url={user?.view_thumbnail_url}
                    className={"avatarImage"}
                    avatar={user}
                    defultIcon={dummyuser}
                />
                <div className="ChatMemberDetails">
                    <h4  className='mb-2 h4'>{user.id === userLogin?.user_id ? "You" : user?.name === null ? user?.phone : user?.name}</h4>
                    {user?.phone !== "" ? <p className='text_messages mb-0'>+{user?.phone_code} {user?.phone}</p> : null}
                </div>
            </React.Fragment>
            }
            {(user?.admin_ids ) && 
            <React.Fragment>
                <ProfileAuthPreview 
                    url={user?.avatar?.view_thumbnail_url}
                    className={"avatarImage"}
                    avatar={user}
                    defultIcon={dummygroup}
                />
                <div className="ChatMemberDetails">
                    {user?.group_name? user?.group_name: user?.group_name}
                    {/* {user?.phone !== "" ? <p className='text_messages mb-0'>+{user?.phone_code} {user?.phone}</p> : null} */}
                </div>
            </React.Fragment>
            }
            {(user?.admin_id ) && 
            <React.Fragment>
                <ProfileAuthPreview 
                    url={user?.avatar?.view_thumbnail_url}
                    className={"avatarImage"}
                    avatar={user}
                    defultIcon={dummygroup}
                />
                <div className="ChatMemberDetails">
                    <h4  className='mb-2 h4' >{user?.group_name? user?.group_name: user?.broadcast_name}</h4>
                    {/* {user?.phone !== "" ? <p className='text_messages mb-0'>+{user?.phone_code} {user?.phone}</p> : null} */}
                </div>
            </React.Fragment>
            }
        </div>
        
    </ListGroup.Item>
    </React.Fragment>
    )
}
