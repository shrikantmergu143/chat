import React, { useContext } from "react";
import { Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { WebSocketContext } from "../../Index";

function GroupMemberMenu(props) {
    const { user, SelectedRoom, MyProfile, scrollbottomChatMesg, GroupsUserList } = props;

    return SelectedRoom?.isBroadCast === undefined ?(
        <Dropdown.Menu className="customeDropdownHere">
            <Link className="dropdown-item" to={"/Chat/" + user?.id} onClick={(e)=>scrollbottomChatMesg(e, user)} >Message {user?.displayname}</Link>
            {/* <Dropdown.Item>View Message Profile</Dropdown.Item> */}
            <Link className="dropdown-item" to={"/Chat/" + user?.id} onClick={(e)=>scrollbottomChatMesg(e, user)}  >View Message Profile</Link>
           {SelectedRoom?.isuserAdmin && (user?.id !== MyProfile?.user_id &&
           ( !user?.isAdmin ? 
                <Dropdown.Item onClick={()=>props?.callMakeAdmin(user.id, "admin", "subscribe_group", "subscribe_id")}>Make Group Admin</Dropdown.Item>
            :
                <Dropdown.Item onClick={()=>props?.callMakeAdmin(user.id, "admin", "unsubscribe_group", "unsubscribe_id")}>Remove Group Admin</Dropdown.Item>
           ))}
           {SelectedRoom?.created_by !== user?.id && SelectedRoom?.isuserAdmin ===true && (user?.id !== MyProfile?.user_id && 
           (GroupsUserList?.length>1 &&<Dropdown.Item onClick={()=>props?.callMakeAdmin(user.id,"user", "unsubscribe_group", 'unsubscribe_id')}>Remove {user?.name}</Dropdown.Item>))}
        </Dropdown.Menu>
    ):(
        <Dropdown.Menu className="customeDropdownHere">
            <Link className="dropdown-item" to={"/Chat/" + user?.id} onClick={(e)=>scrollbottomChatMesg(e, user)} >Message {user?.displayname}</Link>
            {/* <Dropdown.Item>View Message Profile</Dropdown.Item> */}
            <Link className="dropdown-item" to={"/Chat/" + user?.id} onClick={(e)=>scrollbottomChatMesg(e, user)} >View Message Profile</Link>
           {SelectedRoom?.isuserAdmin ===true && (user?.id !== MyProfile?.user_id && 
           (GroupsUserList?.length>2 &&<Dropdown.Item onClick={()=>props?.CallRemoveAndAddMembers(user.id,"unsubscribe_broadcast_group", "unsubscribe_id")}>Remove {user?.name}</Dropdown.Item>))}
        </Dropdown.Menu>
    )
} 
   
export default GroupMemberMenu;