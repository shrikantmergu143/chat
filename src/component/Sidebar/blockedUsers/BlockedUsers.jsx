import React from "react";
import ListGroup from 'react-bootstrap/ListGroup';
import { Scrollbars } from 'react-custom-scrollbars-2';
import Avatar from '../../common/Avatar';
import { Button } from 'react-bootstrap';
import block_user from "../../../assets/img/sidebar/block_user.svg";
import NoDataFound from "../../common/NoDataFound";
import DummyImage from '../../../assets/img/profile/dummyimage.png'; 
import ProfileAuthPreview from "../../ChatPanels/ProfileAuthPreview";

const BlockedUsers = (props) => {
    const { BlockedUserList } = props;
    
    return (
        <div className="ChatMemberList">
            <ListGroup>
                <Scrollbars 
                    renderTrackVertical={props => <div {...props} className="track-vertical"/>}
                    renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
                    renderView={props => <div {...props} className="view"/>}
                    style={{
                        height: "calc(100vh - 113px)"
                    }}
                    className="scrollararea"
                >
                    {BlockedUserList && BlockedUserList.map((user, index) => 
                        <ListGroup.Item key={index}>
                            {/* <Avatar profile={user?.avatar_url} title={user?.name} /> */}
                            <ProfileAuthPreview 
                                url={user?.view_thumbnail_url}
                                className={"avatarImage"}
                                avatar={user}
                                defultIcon={DummyImage}
                            />
                            <div className="ChatMemberDetails unblockednamesUser">
                                <h4>{user?.name}</h4>
                                {user?.phone !== "" ? <p>{user?.phone}</p> : null}
                            </div>
                            <div className="rightbtnsidebars unblockedbtn">
                                <Button variant="outline-danger" onClick={()=>props?.callUnBlockContact(user)}>UnBlock</Button>
                            </div>
                        </ListGroup.Item>
                    )}
                    {BlockedUserList && BlockedUserList.length === 0 ?// <h4 className="noresultfound">No Result Found</h4> 
                            <NoDataFound centered={true} title={"Empty Block Users"} src={block_user} className={"No_data_div"} />
                    : null}
                </Scrollbars>
            </ListGroup>
        </div>
    )
}

export default BlockedUsers;