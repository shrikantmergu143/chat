/* eslint-disable */
import React, { useContext } from "react";
import { ListGroup, Image } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from "react-router-dom";
import DummyImage from '../../assets/img/profile/dummyimage.png';
import ArrowForward from '../../assets/img/sidebar/arrow-forward.svg';
import { Scrollbars } from 'react-custom-scrollbars-2';
import Avatar from "../common/Avatar";
import { useSelector } from "react-redux";
import Badige from 'react-bootstrap/Badge';
import wsSend_request from "../../Api/ws/ws_request";
import { WebSocketContext } from "../Index";
import NoDataFound from "../common/NoDataFound";
import No_contacts from "../../assets/img/sidebar/No_contacts.svg";
import No_search_found from "../../assets/img/sidebar/No_search_found.svg";
import ProfileAuthPreview from "../ChatPanels/ProfileAuthPreview";
import dummyuser from "./../../assets/img/profile/dummyimage.png";

const ContactsList = (props) => {
    const { ContactsList, clearChatTextfield } = props;
    const Contacts = useSelector((state) => state.allReducers.Contacts);
    const { websocket } = useContext(WebSocketContext);
    const location = useLocation()?.pathname.split("/")[2];
    const UserID = useSelector((state) => state.allReducers.userLogin.user_id);
    const navigate = useNavigate();
    return(
        <div className="ChatMemberList">
            <ListGroup>
                <Scrollbars 
                    renderTrackVertical={props => <div {...props} className="track-vertical"/>}
                    renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
                    renderView={props => <div {...props} className="view"/>}
                    style={{
                        height: "calc(100vh - 157px)"
                    }}
                    className="scrollararea"
                >
                    {/* {ContactsList && ContactsList.sort(( a, b )=> a.name.localeCompare(b.name)).map((user, index) => */}
                    {ContactsList && ContactsList.sort(( a, b )=> a?.name?.localeCompare(b.name)).map((user, index) => 
                        <Link 
                            to={"/Chat/" + user?.id} 
                            key={index}
                        >
                            <ListGroup.Item onClick={(e) => clearChatTextfield(e, user)} className={user.id == location ? "list-group-item active" : "list-group-item"} >
                                <div className="w-auto position-relative">
                                    {/* <Avatar profile={user?.small_avatar_url} preview={user?.avatar_url} title={user?.name} /> */}
                                    <ProfileAuthPreview 
                                        url={user?.view_thumbnail_url}
                                        className={"avatarImage"}
                                        avatar={user}
                                        defultIcon={dummyuser}
                                    />
                                   {/* {user?.online>0?
                                    <Badige bg="green" className={"online_status online"}></Badige>
                                    : <Badige bg="grey" className={"online_status offline"}></Badige>
                                   } */}
                                </div>
                                <div className="ChatMemberDetails">
                                    <h4>{user.id === UserID ? "You" : user?.name === null ? user?.phone : user?.name}</h4>
                                    {user?.phone !== "" ? <p>+{user?.phone_code} {user?.phone}</p> : null}
                                </div>
                                <div className="selectarrow">
                                    <Image src={ArrowForward} alt="ArrowForward" />
                                </div>
                            </ListGroup.Item>
                        </Link>
                    )}
                    {ContactsList && ContactsList.length == 0 && Contacts?.length !== 0 ? // <h4 className="noresultfound">No Result Found</h4>
                     <NoDataFound centered={true} title={"No Data Found"} src={No_search_found} className={"No_data_div"} />
                    : Contacts?.length === 0 && ContactsList.length == 0 && <NoDataFound centered={true} title={"No Contact Empty"} src={No_contacts} className={"No_data_div"} />}
                </Scrollbars>
            </ListGroup>
        </div>
    )
}

export default ContactsList;