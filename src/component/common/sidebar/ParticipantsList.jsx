/* eslint-disable */
import React, { useEffect, useState, useContext } from "react";
import { ListGroup, Button, Image, Alert } from 'react-bootstrap';
import DummyImage from '../../../assets/img/profile/dummyimage.png';
import CloseIcon from "../../../assets/img/closeSmall.png";
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useDispatch, useSelector } from "react-redux";
import { mainTabChange, ToasterMessageShow } from "../../../redux/actions";
import { Link } from "react-router-dom";
import wsSend_request from "../../../Api/ws/ws_request";
import { WebSocketContext } from "../../Index";
import ProfileAuthPreview from "../../ChatPanels/ProfileAuthPreview";

const ParticipantsList = (props) => {
    const { selectMember, setSelectMember, istextEmoji, grouptitle, Title, imageUploadsUrl, type } = props;
    const { access_token } = useSelector((state) => state.allReducers);
    const { websocket } = useContext(WebSocketContext);
    const dispatch = useDispatch();
    // Selected user removed function
    const RemoveUserFn = (user) => {
        const uncheckedid = document.querySelector("#userid" + user?.id);
        uncheckedid.checked = false;
        let selectMembervarnew = selectMember.filter((elm) => {
            if(elm?.id !== user?.id) {
                return elm;
            }
        })
        setSelectMember(selectMembervarnew);

        // toaster message show
        dispatch(ToasterMessageShow({
            msg: "User removed successfully",
            status: "Success", 
            show: true,
        }))
    };
    
    // create new group function
    const setcreateGroup = () => {
        var currentmsghtml = document.getElementById("GroupEditableTextField")?.innerHTML;
        var currentmsgtext = document.getElementById("GroupEditableTextField")?.innerText;
        var currentmsghtmls = currentmsgtext !== ""  && currentmsghtml.replace(/<br>/g, '\n').trim();
        var currentmsgtexts = currentmsgtext.trim();

        if(currentmsgtexts !== "") {
            const MemberListArray = [];
            selectMember.forEach(element => {
                MemberListArray.push(element.id);
            });
            
            const param = {
                "transmit":"broadcast", 
                "url": Title === "New Group" ? "add_group" : "add_broadcast_group", 
                "request":{
                    "user_ids": MemberListArray.toString(),
                    "group_name": currentmsgtexts, 
                    "group_avatar": imageUploadsUrl?.id?imageUploadsUrl?.id:"",
                }
            }
            wsSend_request(websocket, param);
 
            // toaster message show
            dispatch(ToasterMessageShow({
                msg: Title === "New Group" ? "New group created successfully" : "New Broadcast created successfully",
                status: "Success", 
                show: true,
            }))
            setTimeout(() => {
                dispatch(mainTabChange("Chat"));
            }, 500);
        } else {
            // toaster message show
            setTimeout(() => {
                dispatch(ToasterMessageShow({
                    msg: Title === "New Group" ? "Group Subject can't be empty" : "Broadcast Subject can't be empty",
                    status: "error", 
                    show: true,
                }))
            }, 500);
        }
    };

    return(
        <div className="ChatMemberList ParticipantsList">
            <div className="ParticipantsCount">
                <h4>Participants</h4>
                <span>{selectMember && selectMember.length}</span>
            </div>
            <ListGroup>
                <Scrollbars 
                    renderTrackVertical={props => <div {...props} className="track-vertical"/>}
                    renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
                    renderView={props => <div {...props} className="view"/>}
                    className="scrollararea"
                >
                    {selectMember && selectMember.map((user, index) => 
                        <ListGroup.Item key={index}>
                            {user?.view_thumbnail_url !== null && user?.view_thumbnail_url !== undefined ? 
                            // <Image 
                            //     src={user?.avatar_url} 
                            //     alt="member"
                            //     onError={(e)=>e.target.src = DummyImage}
                            // />
                            <ProfileAuthPreview 
                                url={user?.view_thumbnail_url}
                                className={"avatarImage"}
                                avatar={user}
                                defultIcon={DummyImage}
                            /> : <Image src={DummyImage} alt="dummy image" />}
                            <div className="ChatMemberDetails">
                                <h4>{user?.name}</h4>
                                <p>+{user?.phone_code} {user?.phone}</p>
                            </div>
                            <div className="removeMember">
                                <Image src={CloseIcon} onClick={() => {
                                   type ==="group" ?
                                    selectMember?.length>1 &&  RemoveUserFn(user)
                                        :
                                    selectMember?.length>2 &&  RemoveUserFn(user)
                                }} alt="CloseIcon" />
                            </div>
                        </ListGroup.Item>
                    )}
                    {selectMember && selectMember.length == 0 ? <h4 className="noresultfound">No Result Found</h4> : null}
                </Scrollbars>
                {istextEmoji && (<div className="createbuttonsbtm">
                    {/* <Link to={`/Chat/${getId}`} onClick={setcreateGroup}> */}
                        <Button onClick={setcreateGroup}>Create</Button>
                    {/* </Link> */}
                </div>)}
            </ListGroup>
        </div>
    )
}

export default ParticipantsList;