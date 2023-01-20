/* eslint-disable */
import React, { useContext } from 'react';
import { Button, Image, ListGroup, Dropdown, ButtonGroup } from 'react-bootstrap';
import AddMember from '../../../assets/img/addMemberbtn.svg';
import DummyImage from '../../../assets/img/profile/dummyimage.png';
import dummygroup from "./../../../assets/img/profile/dummygroup.png"
import MenuIcon from "../../../assets/img/menu.svg";
import GroupMemberMenu from './GroupMemberMenu';
import { formatPhoneNumber } from './ProfileDetails';
import wsSend_request from '../../../Api/ws/ws_request';
import ModalCommon from '../../common/ModalCommon';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { WebSocketContext } from '../../Index';
import { ToasterMessageShow } from '../../../redux/actions';
import ProfileAuthPreview from '../ProfileAuthPreview';

const GroupInfoAddMember = (props) => {
    const { SelectedRoom, MyProfile } = props;
    const {websocket} = useContext(WebSocketContext)
    const [modalShow, setModalShow] = React.useState(false);
    const {  Contacts, user_id, MessageList, userLogin } = useSelector((state) => state.allReducers);
    const { roomId } = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate();
    
    const callMakeAdmin =(user_id, type, action_type, request_type) =>{
        console.log("user_id, type, action_type, request_type, SelectedRoom", user_id, type, action_type, request_type, SelectedRoom)
        if(action_type === "unsubscribe_group" || action_type === "subscribe_group"){
            if(SelectedRoom?.created_by !== user_id){
                const param = {
                    transmit:"broadcast",
                    url:action_type,
                    request:{
                        group_id:roomId,
                        [request_type]:user_id,
                        user_type:type,
                    }
                }
                wsSend_request(websocket, param)   
            }else{
                const filter = SelectedRoom?.users?.filter((item) =>SelectedRoom?.created_by === item?.id);
                if(filter?.length>0){
                    dispatch(ToasterMessageShow({
                        msg: `You can't remove ${filter[0]?.name} because they created this group`,
                        status: "error",
                        show: true,
                    }))
                }
            }
        }
        // const device_id = localStorage?.getItem("device_id");
        // const param = {
        //     transmit:"broadcast",
        //     url:action_type,
        //     request:{
        //         group_id:roomId,
        //         [request_type]:user_id,
        //         user_type:type,
        //         device_id:device_id
        //     }
        // }
        // wsSend_request(websocket, param)
    }
    const CallRemoveAndAddMembers =(user_id, action_type, request_type) =>{
        const param = {
            transmit:"broadcast",
            url:action_type,
            request:{
                broadcast_id:roomId,
                [request_type]:user_id,
            }
        }
     wsSend_request(websocket, param)
    }
    const callAddMembers = (select_members, setSelectContact) =>{
        const filter = select_members.join(",")
        console.log("select_members", filter)
        if(SelectedRoom?.isBroadCast === undefined){
            callMakeAdmin(filter, "user", "subscribe_group", "subscribe_id");
        }else{
            CallRemoveAndAddMembers(filter, "subscribe_broadcast_group", "subscribe_id");
        }
        setSelectContact([]);
        setModalShow(false)
    }
    const FilterList = SelectedRoom?.isGroups !== undefined &&  Contacts?.filter((item)=>{
       return SelectedRoom?.user_ids?.split(',')?.filter(user => user === item.id)?.length?0:item
    })
    const scrollbottomChatMesg = (e, user) => {
        e.preventDefault();
        let param = {
                "transmit":"single",
                "url":"get_detail",
                "request":{
                    "to_id":user.id, 
                    "chat_type":"group"
                }
            }
        if(param){
            wsSend_request(websocket, param);
            callGetChat(user);
            setTimeout(()=>navigate("/Chat/" + user.id), 100)
        }
    }
    const callGetChat = (user) =>{
        const old = MessageList[user.id];
        let update_at = ""
        if(old?.length>0){
            update_at = old[old?.length - 1]?.updated_at
        }
        if(user?.isBroadCast===true && old?.length>0){
            let param = {
                "transmit":"single",
                "url":"get_broadcast_chats",
                "request":{
                    "broadcast_id":user?.id,
                    "updated_at":update_at
                }
            }
            
            wsSend_request(websocket, param);
        }else if(old?.length>0){
            let param = {
                "transmit":"single", 
                "url":"get_chats",
                "request": {
                    "chat_type":user?.admin_ids === undefined?"single":"group",
                    "to_id": user?.id, 
                    "updated_at": update_at,
                }
            }
            
            wsSend_request(websocket, param);
        }else{
            if(user?.isBroadCast===true){
                let param = {
                    "transmit":"single",
                    "url":"get_broadcast_chats",
                    "request":{
                        "broadcast_id":user?.id,
                        "updated_at":"",
                        "is_limit":50
                    }
                }
                
                wsSend_request(websocket, param);
            }else{
                let param = {
                    "transmit":"single",
                    "url":"get_chats",
                    "request": {
                        "chat_type": user?.admin_ids === undefined?"single":"group",
                        "to_id": user?.id, 
                        "updated_at": "",
                        "is_limit":500
                    }
                }
                wsSend_request(websocket, param);
            }
        }
        setTimeout(() => {
            var element = document.getElementById("chatPanelScroll");
            element?.scrollIntoView({ block: 'end' });
        }, 100);
    }

    // groups Participant List 
    const AdminAllUserSet = (SelectedRoom) => {
        var UserListUpdateMe = SelectedRoom?.users?.map((elm) => {
            if(elm.id === user_id) {
                return{
                    ...elm,
                    name: "You"
                }
            } else
            return elm;
        })
        var UserAdminArray = UserListUpdateMe?.sort(( a, b )=> a?.name?.localeCompare(b.name)).filter((elms) => {
            if(elms.isAdmin === true) {
                return elms;
            }
        });
        var withoutAdminUsers = UserListUpdateMe?.sort(( a, b )=> a?.name?.localeCompare(b.name)).filter((elms) => {
            if(elms.isAdmin === false) {
                return elms;
            }
        });
        var GroupsUserList = UserAdminArray?.concat(withoutAdminUsers);

        const GroupMembersList = (user, index) =>{
            return(
                <ListGroup.Item key={index}>
                        {/* {user?.avatar_url !== undefined && user?.avatar_url !== null ? <Image 
                            src={user?.avatar_url} 
                            alt="member"
                            onError={(e)=>e.target.src=DummyImage}
                        /> : <Image src={DummyImage} alt="dummy image" />} */}
                        <ProfileAuthPreview 
                            url={user?.view_thumbnail_url}
                            className={"avatarImage"}
                            avatar={user}
                            defultIcon={DummyImage}
                        />
                        <div className="ChatMemberDetails">
                            <h4 >{user?.id === MyProfile?.user_id ? "You" : user?.name ? user?.name : user?.phone}</h4>
                            {/* <h4>
                                {
                                    user?.id === MyProfile?.user_id ? "You" : 
                                    user?.name ? user?.name: user?.phone
                                }
                            </h4> */}
                            {user?.phone !== "" ? <p>+{user?.phone_code} {formatPhoneNumber(user?.phone)}</p> : null}
                        </div>
                        {user?.isAdmin && (<div className='groupAdminStatus'>Group Admin</div>)}
                        <Dropdown className="groupinfomemberMenu" as={ButtonGroup}>
                            {user?.id !== user_id && (
                                <Dropdown.Toggle variant="default" id="dropdown-basic">
                                    <Image src={MenuIcon} alt="option menu" />
                                </Dropdown.Toggle>)
                            }
                            <GroupMemberMenu 
                                user={user}
                                MyProfile={MyProfile} 
                                SelectedRoom={SelectedRoom}
                                callMakeAdmin={callMakeAdmin}
                                CallRemoveAndAddMembers={CallRemoveAndAddMembers}
                                scrollbottomChatMesg={scrollbottomChatMesg}
                                GroupsUserList={GroupsUserList?.filter((user, index) => user?.id !== userLogin?.user_id)}
                            />
                        </Dropdown>
                    </ListGroup.Item>
            )
        }
        return(
            <div className="ParticipantList">
                {/* {SelectedRoom?.isGroups !== undefined && SelectedRoom?.users?.filter((elm) => {
                    if(elm?.type !== "group" && elm?.type !== "broadcast") {
                        return elm;
                    }
                }) */}
                {GroupsUserList?.map((user, index) => user?.id === userLogin?.user_id && 
                    GroupMembersList(user,index)
                )}
                {GroupsUserList?.map((user, index) => user?.id !== userLogin?.user_id && 
                    GroupMembersList(user,index)
                )}
            </div>
        )
    }
    // console.log("FilterList", FilterList)
    return (<div className="addpartMembersInfo">
        {(SelectedRoom?.admin_ids === undefined && SelectedRoom?.admin_id === undefined)? (<React.Fragment> {/* Contact information */}
            { (
                <div className="Participant_counts">{SelectedRoom?.groups?.length} Group in Common</div>
            )}
            <div className="addPatyicipntWrapper">
                <div className="ParticipantList">
                    {SelectedRoom?.groups?.sort(( a, b )=> a?.group_name?.localeCompare(b.group_name)).map((user, index) => 
                        <ListGroup.Item key={index} onClick={(e)=>scrollbottomChatMesg(e, user)}>
                            {/* {user?.avatar?.url !== undefined && user?.avatar?.url !== null ? <Image 
                                src={user?.avatar?.url} 
                                alt="member"
                                onError={(e)=>e.target.src=dummygroup}
                            /> : <Image src={dummygroup} alt="dummy image" />} */}
                            <ProfileAuthPreview
                                url={user?.avatar?.view_thumbnail_url}
                                className={""}
                                avatar={user?.avatar}
                                defultIcon={dummygroup}
                                outerDiv={true}
                                click={false}
                            />
                            <div className="ChatMemberDetails groupInmemebr">
                                <h4>{user?.group_name}</h4>
                                <p>{user?.members?.map((users, ind) => <span key={ind}> 
                                    {users?.name} {user?.members?.length - 1 !== ind ? "," : ""} 
                                </span>)}</p>
                            </div>
                        </ListGroup.Item>
                    )}
                </div>
            </div>
        </React.Fragment>) : (<React.Fragment> {/* Group information */}
            <div className="Participant_counts">{SelectedRoom?.users?.length} Participants</div>
            <div className="addPatyicipntWrapper">        
               {SelectedRoom?.isuserAdmin && <div className="addParticientWrapper">
                    <Button onClick={()=>setModalShow(true)} className="addParticipant">
                        <Image src={AddMember} alt="add member" />
                        Add participants
                    </Button>
                </div>}
                {AdminAllUserSet(SelectedRoom)}
                
            </div>
        </React.Fragment>)}
        <ModalCommon 
            show={modalShow}
            onHide={() => setModalShow(false)}
            memberslist={FilterList}
            msg={"Add participants"}
            button_title={"Add participants"}
            formSubmit={callAddMembers}
            isMultiple={true}
        />
    </div>)
}

export default GroupInfoAddMember;