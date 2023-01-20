/* eslint-disable */
import React, { useContext, useEffect } from "react";
import ListGroup from 'react-bootstrap/ListGroup';
import Badige from 'react-bootstrap/Badge';
import { Scrollbars } from 'react-custom-scrollbars-2';
import Avatar from "../common/Avatar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector  } from "react-redux";
import moment from "moment";
import last_audio from "./../../assets/img/sidebar/last_audio.svg";
import last_image from "./../../assets/img/sidebar/last_image.svg";
import last_doucment from "./../../assets/img/sidebar/last_doucment.svg";
import last_location from "./../../assets/img/sidebar/location.svg";
import last_video from "./../../assets/img/sidebar/last_video.svg";
import Broadcast_dark from "./../../assets/img/Broadcast_dark.png";
import Broadcast_light from "./../../assets/img/Broadcast_light.png";
import Contact_Chat_Shared from "./../../assets/img/contact_shared.png";
import dummygroup from "./../../assets/img/profile/dummygroup.png"
import dummyuser from "./../../assets/img/profile/dummyimage.png"
import systemgroup from "./../../assets/img/profile/system.svg"
import { WebSocketContext } from "../Index";
import wsSend_request from "../../Api/ws/ws_request";
import ProfileAuthPreview from "../ChatPanels/ProfileAuthPreview";
import Empty_message from "./../../assets/img/sidebar/Empty_message.svg";
import No_search_found from "./../../assets/img/sidebar/No_search_found.svg";
import NoDataFound from "../common/NoDataFound";
import CommanTyping from "../ChatPanels/CommanTyping";
import { checkExtension } from "../ChatPanels/SearchChat/MessagesPanel";

const timeSince = (dateParam, userDate)=> {
    if (!dateParam) {
        return null;
    }
      const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
      const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
      const today = new Date();
      const yesterday = new Date(today - DAY_IN_MS);
      const seconds = Math.round((today - date) / 1000);
      const minutes = Math.round(seconds / 60);
      const isToday = today.toDateString() === date.toDateString();
      const isYesterday = yesterday.toDateString() === date.toDateString();
      const isThisYear = today.getFullYear() === date.getFullYear();
    
    
      if (seconds < 5) {
        return moment.utc(userDate).local().format('hh:mm a');
      } else if (seconds < 60) {
        return moment.utc(userDate).local().format('hh:mm a');
      } else if (seconds < 90) {
        return moment.utc(userDate).local().format('hh:mm a');
      } else if (minutes < 60) {
        return moment.utc(userDate).local().format('hh:mm a');
      } else if (isToday) {    
        return moment.utc(userDate).local().format('hh:mm a'); // Today at 10:20
      } else if (isYesterday) {
        return 'Yesterday'; // Yesterday at 10:20
      } else if (isThisYear) {
        return moment.utc(userDate).local().format('DD/MM/YYYY'); // 10. January at 10:20
      }
    
      return moment.utc(userDate).local().format('DD/MM/YYYY'); // 10. January 2017. at 10:20
}

const ChatMembers = (props) => {
    const { websocket } = useContext(WebSocketContext);
    const { memberslist, clearChatTextfield, UserFilter, user_types } = props;
    const UserID = useSelector((state) => state.allReducers.userLogin.user_id);
    const DetailsList = useSelector((state) => state.allReducers.DetailsList);
    const UserDetails = useSelector((state) => state.allReducers.UserDetails);
    const location = useLocation()?.pathname.split("/")[2];
    const Contacts = useSelector((state) => state.allReducers.Contacts);
    const Rooms = useSelector((state) => state.allReducers.Rooms);
    const MessageList = useSelector((state) => state.allReducers.MessageList);
    const UserId = useSelector((state) => state.allReducers.userLogin.user_id);
    const AllUsersList = useSelector((state) => state?.allReducers?.AllUsersList);
    const ThemeCheck = useSelector((state)=>state?.allReducers?.themeDarkLight);
    const navigate = useNavigate()
    const scrollbottomChatMesg = () => {
        setTimeout(() => {
            var element = document.getElementById("chatPanelScroll");
            element && element.scrollIntoView({ block: 'end'});
        }, 500);
    }

    // user contact list name show
    const UserContactWiseUpdate = (msg) => {
        // var ContactUsers = "";
        // Contacts && Contacts.filter((elm) => {
        //     if(elm.id === msg?.id) {
        //         ContactUsers = elm.name;
        //     }
        // });
        return msg?.name || msg?.phone;
    }

    // const [ memberslistLimit, setMemberslistlimit ] = useState(memberslist);

    // const MessageListScroll = (e) => {
    //     console.log("events======>", e.target.clientHeight, e.target.scrollTop);
    // };


    // get message note 
    const GetMessageIntro = (msg) => {
        if(msg?.last_message_type === "text" ){
            return (
                <p className="messageNotes" dangerouslySetInnerHTML={{__html: msg?.last_message}}></p>
            )
        }else if(msg?.last_message_type === "location"){
            const Locations = msg?.last_message.lastIndexOf("[|]");
            let current_location = ""
            if(Locations?.length === 3){
                current_location = msg?.last_message.substring(msg?.last_message.lastIndexOf("[|]") + 3, msg?.last_message.length)
            }else{
                current_location = "Location"
            }
            return (<p  className={"images_p"}><img src={last_location} className={"last_message_icon location"} /> {current_location}</p>)
        }else if(
            msg?.last_message_type === 'subscribe_user' ||
            msg?.last_message_type === 'subscribe_admin' ||
            msg?.last_message_type === 'unsubscribe_user' ||
            msg?.last_message_type === 'unsubscribe_admin' ||
            msg?.last_message_type === 'left_group' ||
            msg?.last_message_type === 'update_group' ||
            msg?.last_message_type === 'created_group'
        ){
            let MessageList = [];
            const splitUserId = msg?.last_message?.substring(0, msg.last_message.indexOf(' '));
            const splitUserIdGet = splitUserId?.split(",");
            const splitmsglast = msg?.last_message?.substring(msg.last_message.indexOf(' ') + 1);
            const splitmsglastLast = splitmsglast?.split(" ");
            
            splitUserIdGet?.filter((elm) => {
                if(elm === UserId) {
                    MessageList.push("You");
                } else {
                    if(Contacts?.filter((user) => elm === user?.id).length > 0) {
                        Contacts?.filter((user) => {
                            if(elm === user?.id) {
                                // console.log("splitmsglast", elm, user)
                                MessageList.push(user?.name);        
                            }
                        })
                    } else {
                        if(DetailsList[msg?.id]){
                            const groupDetails = DetailsList[msg?.id]?.users?.filter(item=>item?.id === elm);
                            if(groupDetails?.length>0){
                                MessageList.push(groupDetails[0]?.name);
                            }else if(UserDetails[elm]){
                                MessageList.push(UserDetails[elm]?.name);
                            }
                        }else if(UserDetails[elm]){
                            MessageList.push(UserDetails[elm]?.name);
                        }
                        // AllUsersList?.filter((user) => {
                        //     if(elm === user?.id) {
                        //         MessageList.push(user?.name);
                        //     }
                        // })
                    }
                }
            })
    
            splitmsglastLast?.filter((elm, index) => {
                const elms = elm?.split(',');
    
                    let lets = "";
                    elms?.map((items, indexs)=>{
                        if(items === UserId) {
                            if(lets === ""){
                                lets = "You"
                            }else
                                lets = lets + ", You";
                        }else {
                            if(UserDetails[items]){
                                if(lets === ""){
                                    lets = UserDetails[items]?.name
                                }else
                                lets = lets +", " + UserDetails[items]?.name
                            }
                        }
                    })
                    if(lets!==""){
                        splitmsglastLast[index] = lets
                    }
                    // AllUsersList?.filter((user) => {
                    //     if(elm === user?.id) {
                    //         // MessageList2.push(user?.name);
                    //         splitmsglastLast[index] = user?.name;
                    //     }
                    // })
    
    
                    // if(UserDetails[elm]){
                    //     splitmsglastLast[index] =UserDetails[elm]?.name
                    // }
    
            })
        
            return (<p className="messageNotes" dangerouslySetInnerHTML={{__html: MessageList.join(', ').toString() + " " + splitmsglastLast.join(' ').toString()}}></p>)
        }
    }

    const Typeing_Status = (user) =>{
        return user?.typing !== undefined&&(user?.typing === 1&&
                <div className="typeing_main_div small">
                  <div class="typing">
                  <span>typing</span>
                      <div class="dot"></div>
                      <div class="dot"></div>
                      <div class="dot"></div>
                  </div>
                </div>)
    }

    const ContactSharedLastMsg = (message) => {
        var splitedNameNmber = message.split('[|]');
        var GetName = splitedNameNmber[0];

        return (<p className={"images_p"}><img src={Contact_Chat_Shared} className={"last_message_icon shareIconImage"} /> {GetName}</p>)
    }
    if(UserFilter === true){
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
                     {memberslist && memberslist?.sort(( a, b )=> {
                            return new Date( (b?.last_message_at!=="None" && b?.last_message_at!=="" ) && b?.last_message_at ) - new Date( (a?.last_message_at!=="None" && a?.last_message_at!=="" ) && a?.last_message_at )
                    })?.map((user, index) =>(
                        <Link 
                            to={"/Chat/" + user?.id}
                            key={index}
                            onClick={(e) => clearChatTextfield(e,user)}
                        >
                        <ListGroup.Item key={index} className={user?.id == location ? "list-group-item active" : "list-group-item"} >
                                <div className="w-auto position-relative">
                                    {/* <Avatar profile={user?.small_avatar_url} preview={user?.avatar_url} title={user?.name} /> */}
                                    <ProfileAuthPreview 
                                        url={user.group_type !== undefined ? user?.group_avatar : user?.view_thumbnail_url}
                                        className={"avatarImage"}
                                        avatar={user}
                                        defultIcon={dummyuser}
                                    />
                                   {/* {user?.online>0 ? <Badige bg="green" className={"online_status online"}></Badige>
                                   : <Badige bg="grey" className={"online_status offline"}></Badige>
                                   } */}
                                </div>
                                <div className="ChatMemberDetails">
                                    <h4 dangerouslySetInnerHTML={{ __html: user?.id === UserID ? "You" : UserContactWiseUpdate(user)}}></h4>
                                    {user?.last_message_type === "contact" && ContactSharedLastMsg(user?.last_message)}
                                    {/* {user?.Typing !== true ? <p>{user?.currentMsg}</p> :<p className="userTyping">Typing…</p>} */}

                                    {(user?.userTyping !== undefined && user?.userTyping?.status === 1) ?  <p ><CommanTyping SelectedRoom={user} user_id={user?.userTyping?.user_id} /></p>:
                                        <React.Fragment>
                                            {(user?.last_message_type !== "file" && user?.last_message_type !== "contact" && user?.last_message_type !== "None" && user?.last_message_type !== "") &&
                                                (<p>{user?.last_message}</p>)
                                            }
                                            {(user?.last_message_type === "None" || user?.last_message_type === "") && (
                                                <p>
                                                    {user?.user_type?.replace(",", ", ")}
                                                    {/* {user?.user_type?.split(",")?.map((item, index)=>{
                                                        const Users = user_types?.filter((item1)=>item1?.key === item);
                                                        const getLength = user?.user_type?.split(",")?.length;
                                                        console.log("getLength", item)
                                                        if((getLength-1) == index){
                                                            if(Users[0]){
                                                                return (Users[0]?.value)
                                                            }
                                                        }
                                                        if(Users[0]){
                                                            return (getLength === 1 ? Users[0]?.value : Users[0]?.value +", ")
                                                        }
                                                    })} */}
                                                </p>
                                            )}
                                            {user?.last_message_type === "file"&&(
                                            (
                                                checkExtension(user?.file?.name)
                                                // user?.file?.name?.split('.').pop() === "pdf"    ||
                                                // user?.file?.name?.split('.').pop() === "zip"    ||
                                                // user?.file?.name?.split('.').pop() === "psd"    ||
                                                // user?.file?.name?.split('.').pop() === "ppt"    ||
                                                // user?.file?.name?.split('.').pop() === "txt"    ||
                                                // user?.file?.name?.split('.').pop() === "rar"    ||
                                                // user?.file?.name?.split('.').pop() === "doc"    ||
                                                // user?.file?.name?.split('.').pop() === "docx"   ||
                                                // user?.file?.name?.split('.').pop() === "xls"    ||
                                                // user?.file?.name?.split('.').pop() === "ods"    ||
                                                // user?.file?.name?.split('.').pop() === "deb"    ||
                                                // user?.file?.name?.split('.').pop() === "xlsx"   ||
                                                // user?.file?.name?.split('.').pop() === "tif"    ||
                                                // user?.file?.name?.split('.').pop() === "dll"    ||
                                                // user?.file?.name?.split('.').pop() === "sav"    ||
                                                // user?.file?.name?.split('.').pop() === "dat"    ||
                                                // user?.file?.name?.split('.').pop() === "dbf"    ||
                                                // user?.file?.name?.split('.').pop() === "excel"  ||
                                                // user?.file?.name?.split('.').pop() === "avi"    ||
                                                // user?.file?.name?.split('.').pop() === "mkv"    ||
                                                // user?.file?.name?.split('.').pop() === "wmv"    ||
                                                // user?.file?.name?.split('.').pop() === "mov"
                                            ) && (
                                                <p  className={"images_p"}><img src={last_doucment} className={"last_message_icon"} /> {user?.file?.name}</p>
                                            ))}
                                            {user?.last_message_type === "file"&&(
                                            (user?.file?.name?.split('.').pop() === "m4a" || user?.file?.name?.split('.').pop() === "mp3" || user?.file?.name?.split('.').pop() === "ogg" || user?.file?.name?.split('.').pop() === "wav" || user?.file?.name?.split('.').pop() === "mpeg") && (
                                                <p   className={"images_p"}><img src={last_audio} className={"last_message_icon"} />  Audio</p>
                                            ))}
                                            {user?.last_message_type === "file"&&
                                                (user?.file?.name?.split('.').pop() === "mp4" || user?.file?.name?.split('.').pop() === "webm")&&
                                                (<p  className={"images_p"}><img src={last_video} className={"last_message_icon"} /> Video</p>)
                                            }
                                            {user?.last_message_type === "file"&&
                                                (user?.file?.name?.split('.').pop() === "jpg" || user?.file?.name?.split('.').pop() === "jpeg" || user?.file?.name?.split('.').pop() === "png" || user?.file?.name?.split('.').pop() === "webp") &&
                                                (<p  className={"images_p"}><img src={last_image} className={"last_message_icon"} /> Photo</p>)
                                            }
                                    </React.Fragment>}
                                </div>
                                <div className="notifactionwarpps">
                                    {(user?.last_message_at !== "None" && user?.last_message_at !=="") && <span className="notiftime">{timeSince(new Date(user?.last_message_at), user?.last_message_at)}</span>}
                                    {user?.notification > 0 ? <Badige>{user?.notification}</Badige> : null}
                                   {(user?.unread_count >0 && (!user?.group_type) ) && <Badige bg="primary">{user?.unread_count}</Badige>}
                                </div>
                            </ListGroup.Item>
                        </Link>
                    ))}
                 </Scrollbars>
            </ListGroup>
            </div>
        )
    }
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
                    // onScroll={(e) => MessageListScroll(e)}
                 >
                    {memberslist && memberslist.sort(( a, b )=> {
                            return new Date( (b?.last_message_at!=="None" && b?.last_message_at!=="" ) && b?.last_message_at|| b.updated_at && b.updated_at || b.name && b.name ) - new Date( (a?.last_message_at!=="None" && a?.last_message_at!=="" ) && a?.last_message_at ||  a.updated_at && a.updated_at )
                    }).map((user, index) =>
                        <Link 
                            to={"/Chat/" + user?.id}
                            key={index}
                            onClick={(e) => clearChatTextfield(e,user)}
                        >
                            {user?.group_name !== undefined && (
                                <ListGroup.Item key={index} className={user?.id == location ? "list-group-item active" : "list-group-item"} >
                                    <div className="w-auto position-relative">
                                        {/* <Avatar profile={user?.avatar?.url} preview={user?.avatar?.url} title={user?.name} /> */}
                                        <ProfileAuthPreview 
                                            url={user.group_type !== undefined ? user?.group_avatar : user?.avatar?.view_thumbnail_url}
                                            className={"avatarImage"}
                                            avatar={user?.avatar}
                                            defultIcon={user?.group_type ? systemgroup : dummygroup}
                                        />
                                    </div>
                                    <div className="ChatMemberDetails">
                                        <h4>{user?.id === UserID ? "You" : user?.group_name}</h4>
                                        {/* {user?.Typing !== true ? <p>{user?.currentMsg}</p> :<p className="userTyping">Typing…</p>} */}
                                        {/* {user?.last_message_type !== "file" && (<p dangerouslySetInnerHTML={{__html: `${user?.last_message}`}}/>)} */}
                                        {(user?.userTyping !== undefined && user?.userTyping?.status === 1) ? <p ><CommanTyping SelectedRoom={user} user_id={user?.userTyping?.user_id} /></p>:
                                        <React.Fragment>
                                            {(user?.last_message_type !== "file" && user?.last_message_type !== "contact") && (<React.Fragment>{GetMessageIntro(user)}</React.Fragment>)}
                                            {user?.last_message_type === "contact" && ContactSharedLastMsg(user?.last_message)}
                                            {user?.last_message_type === "file"&&(
                                            (checkExtension(user?.file?.name)) && (
                                                <p  className={"images_p"}><img src={last_doucment} className={"last_message_icon"} /> {user?.file?.name}</p>
                                            ))}
                                            {user?.last_message_type === "file"&&(
                                            (user?.file?.name?.split('.').pop() === "mp3" || user?.file?.name?.split('.').pop() === "m4a"  || user?.file?.name?.split('.').pop() === "ogg" || user?.file?.name?.split('.').pop() === "wav" || user?.file?.name?.split('.').pop() === "mpeg") && (
                                                <p   className={"images_p"}><img src={last_audio} className={"last_message_icon"} />  Audio</p>
                                            ))}
                                            {user?.last_message_type === "file"&&
                                                (user?.file?.name?.split('.').pop() === "mp4" || user?.file?.name?.split('.').pop() === "webm")&&
                                                (<p  className={"images_p"}><img src={last_video} className={"last_message_icon"} /> Video</p>)
                                            }
                                            {user?.last_message_type === "file"&&
                                                (user?.file?.name?.split('.').pop() === "jpg" || user?.file?.name?.split('.').pop() === "jpeg" || user?.file?.name?.split('.').pop() === "png" || user?.file?.name?.split('.').pop() === "webp") &&
                                                (<p  className={"images_p"}><img src={last_image} className={"last_message_icon"} /> Photo</p>)
                                            }
                                        </React.Fragment>}
                                    </div>
                                    <div className="notifactionwarpps">
                                        <span className="notiftime">
                                            {(user?.last_message_type !== "None" && user?.last_message_type !== "") ? timeSince(new Date(user?.last_message_at), user?.last_message_at) : timeSince(new Date(user?.updated_at), user?.updated_at)}
                                        </span>
                                        {user?.notification > 0 ? <Badige>{user?.notification}</Badige> : null}
                                        {(user?.unread_count >0 && (!user?.group_type) ) && <Badige bg="primary">{user?.unread_count}</Badige>}
                                    </div>
                                    </ListGroup.Item>
                            )}
                            {user?.name !== undefined &&   (<ListGroup.Item key={index} className={user?.id == location ? "list-group-item active" : "list-group-item"} >
                                <div className="w-auto position-relative">
                                    {/* <Avatar profile={user?.small_avatar_url} preview={user?.avatar_url} title={user?.name} /> */}
                                    <ProfileAuthPreview 
                                        url={user?.view_thumbnail_url}
                                        className={"avatarImage"}
                                        avatar={user}
                                        defultIcon={dummyuser}
                                    />
                                   {/* {user?.online>0 ? <Badige bg="green" className={"online_status online"}></Badige>
                                   : <Badige bg="grey" className={"online_status offline"}></Badige>
                                   } */}
                                </div>
                                <div className="ChatMemberDetails">
                                    {/* <h4>{user?.id === UserID ? "You" : UserContactWiseUpdate(user)}</h4> */}
                                    <h4>{user?.id === UserID ? "You" : UserContactWiseUpdate(user)}</h4>
                                    {user?.last_message_type === "contact" && ContactSharedLastMsg(user?.last_message)}
                                    {/* {user?.Typing !== true ? <p>{user?.currentMsg}</p> :<p className="userTyping">Typing…</p>} */}

                                    {(user?.userTyping !== undefined && user?.userTyping?.status === 1) ?  <p ><CommanTyping SelectedRoom={user} user_id={user?.userTyping?.user_id} /></p>:
                                        <React.Fragment>
                                            {(user?.last_message_type !== "file" && user?.last_message_type !== "contact") && (<React.Fragment>{GetMessageIntro(user)}</React.Fragment>)}
                                            {user?.last_message_type === "file"&&(
                                            (checkExtension(user?.file?.name)) && (
                                                <p  className={"images_p"}><img src={last_doucment} className={"last_message_icon"} /> {user?.file?.name}</p>
                                            ))}
                                            {user?.last_message_type === "file"&&(
                                            (user?.file?.name?.split('.').pop() === "m4a" || user?.file?.name?.split('.').pop() === "mp3" || user?.file?.name?.split('.').pop() === "ogg" || user?.file?.name?.split('.').pop() === "wav" || user?.file?.name?.split('.').pop() === "mpeg") && (
                                                <p   className={"images_p"}><img src={last_audio} className={"last_message_icon"} />  Audio</p>
                                            ))}
                                            {user?.last_message_type === "file"&&
                                                (user?.file?.name?.split('.').pop() === "mp4" || user?.file?.name?.split('.').pop() === "webm")&&
                                                (<p  className={"images_p"}><img src={last_video} className={"last_message_icon"} /> Video</p>)
                                            }
                                            {user?.last_message_type === "file"&&
                                                (user?.file?.name?.split('.').pop() === "jpg" || user?.file?.name?.split('.').pop() === "jpeg" || user?.file?.name?.split('.').pop() === "png" || user?.file?.name?.split('.').pop() === "webp") &&
                                                (<p  className={"images_p"}><img src={last_image} className={"last_message_icon"} /> Photo</p>)
                                            }
                                    </React.Fragment>}
                                </div>
                                <div className="notifactionwarpps">
                                    {(user?.last_message_type !== "None" && user?.last_message_type !== "") && <span className="notiftime">{timeSince(new Date(user?.last_message_at), user?.last_message_at)}</span>}
                                    {user?.notification > 0 ? <Badige>{user?.notification}</Badige> : null}
                                   {(user?.unread_count >0 && (!user?.group_type) ) && <Badige bg="primary">{user?.unread_count}</Badige>}
                                </div>
                            </ListGroup.Item>)}
                            {user?.isBroadCast !== undefined &&   (
                            <ListGroup.Item key={index} className={user?.id == location ? "list-group-item active" : "list-group-item"} >
                                <div className="w-auto position-relative">
                                    <Avatar profile={ThemeCheck === "dark" ? Broadcast_dark : Broadcast_light}  preview={ThemeCheck === "dark" ? Broadcast_dark : Broadcast_light} title={user?.broadcast_name} />
                                </div>
                                <div className="ChatMemberDetails">
                                    {/* <h4>{user?.id === UserID ? "You" : user?.broadcast_name}</h4> */}
                                    <h4>{user?.id === UserID ? "You" : user?.broadcast_name}</h4>
                                    {/* {user?.Typing !== true ? <p>{user?.currentMsg}</p> :<p className="userTyping">Typing…</p>} */}
                                    {user?.last_message !== null &&
                                    <React.Fragment>
                                        {(user?.last_message_type !== "file" && user?.last_message_type !== "contact") && (<React.Fragment>{GetMessageIntro(user)}</React.Fragment>)}
                                        {user?.last_message_type === "file"&&(
                                        (checkExtension(user?.file?.name)) && (
                                            <p  className={"images_p"}><img src={last_doucment} className={"last_message_icon"} /> {user?.file?.name}</p>
                                        ))}
                                        {user?.last_message_type === "file"&&(
                                        (user?.file?.name?.split('.').pop() === "m4a" || user?.file?.name?.split('.').pop() === "mp3" || user?.file?.name?.split('.').pop() === "ogg" || user?.file?.name?.split('.').pop() === "wav" || user?.file?.name?.split('.').pop() === "mpeg") && (
                                            <p   className={"images_p"}><img src={last_audio} className={"last_message_icon"} />  Audio</p>
                                        ))}
                                        {user?.last_message_type === "file"&&
                                            (user?.file?.name?.split('.').pop() === "mp4" || user?.file?.name?.split('.').pop() === "webm")&&
                                            (<p  className={"images_p"}><img src={last_video} className={"last_message_icon"} /> Video</p>)
                                        }
                                        {user?.last_message_type === "file"&&
                                            (user?.file?.name?.split('.').pop() === "jpg" || user?.file?.name?.split('.').pop() === "jpeg" || user?.file?.name?.split('.').pop() === "png" || user?.file?.name?.split('.').pop() === "webp") &&
                                            (<p  className={"images_p"}><img src={last_image} className={"last_message_icon"} /> Photo</p>)
                                        }
                                    </React.Fragment>}
                                    {
                                        user?.last_message === null &&
                                        (
                                            <p  className={"images_p"}>
                                            Broadcast
                                            </p>
                                        )
                                    }
                                </div>
                                <div className="notifactionwarpps">
                                    <span className="notiftime">
                                        {(user?.last_message_type !== "None" && user?.last_message_type !== "") ? timeSince(new Date(user?.last_message_at), user?.last_message_at) : timeSince(new Date(user?.updated_at), user?.updated_at)}
                                    </span>
                                    {user?.notification > 0 ? <Badige>{user?.notification}</Badige> : null}
                                   {(user?.unread_count >0 && (!user?.group_type) ) && <Badige bg="primary">{user?.unread_count}</Badige>}
                                </div>
                            </ListGroup.Item>)}
                        </Link>
                    )}
                    {memberslist && memberslist.length === 0 && Rooms?.length!==0 ?// <h4 className="noresultfound">No Result Found</h4> 
                     <NoDataFound centered={true} title={"No Data Found"} src={No_search_found} className={"No_data_div"} />
                     : memberslist.length === 0 && Rooms?.length==0 &&
                     <NoDataFound centered={true} title={"No Message Yet"} src={Empty_message} className={"No_data_div"} />
                    }
                </Scrollbars>
            </ListGroup>
        </div>
    )
}

export default ChatMembers;