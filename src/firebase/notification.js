/* eslint-disable no-undef */
/* eslint-disable */
/* eslint-disable-next-line */
import GetViewFilesAPI from '../Api/Viewfiles';
import { setAddNotificationList } from '../redux/actions';
import system from './../assets/img/profile/system.svg';
export const getSystemDetails = async (id, DetailsList, access_token) =>{
  const groupName = DetailsList[id];
  return {group_name:groupName?.group_name, avatar:system};
}
export const getGroupName = async (id, DetailsList, access_token) =>{
  const groupName = DetailsList[id];
  const avatar = await GetViewFilesAPI(groupName?.avatar?.view_thumbnail_url, access_token);
  return {group_name:groupName?.group_name, avatar:avatar};
}
export const getUsersName = async (id, UserDetails, access_token) =>{
  const groupName = UserDetails[id];
  const avatar = await GetViewFilesAPI(groupName?.view_thumbnail_url, access_token);
  return {name:groupName?.name, avatar:avatar};
}
const callDispatchNotification = ({payload, notification}) => {
  return((dispatch, getState)=>{
    const { SelectedRoom } = getState()?.allReducers;
    let url = window.location.pathname;
    let location_id = url.substring(url.lastIndexOf('/') + 1);
    if(payload?.id === location_id || payload?.message?.id === location_id){
      dispatch(setAddNotificationList({
        ...payload,
        notification:{
          ...notification,
          silent:false,
          show:false
        }
      }))
    }else{
      dispatch(setAddNotificationList({
        ...payload,
        notification:{
          ...notification,
          silent:false,
        }
      }))
    }
  })
}
const GetMessageIntro = (msg, Contacts, DetailsList, UserDetails, UserId) => {
  let MessageList = [];
  let splitUserId = msg?.substring(0, msg.indexOf(' '));
  let splitUserIdGet = splitUserId?.split(",");
  let splitmsglast = msg?.substring(msg.indexOf(' ') + 1);
  let splitmsglastLast = splitmsglast?.split(" ");
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
  });
  return MessageList?.join(', ')?.toString() + " " + splitmsglastLast?.join(' ')?.toString()
};
const getFileType = (msg) =>{
  let text = "";
  if(msg?.message_type === "text"){
    text = msg?.message;
  }
  if(msg?.message_type === "contact"){
    text = "📞 Contact"
  }
  if(msg?.message_type === "location"){
    text = "📍 location";
  }
  if(msg?.message_type === "file"){
    if(
      msg?.file?.name?.split('.').pop() === "jpg"||
      msg?.file?.name?.split('.').pop() === "jpeg"||
      msg?.file?.name?.split('.').pop() === "png"||
      msg?.file?.name?.split('.').pop() === "gif"||
      msg?.file?.name?.split('.').pop() === "webp"||
      msg?.file?.name?.split('.').pop() === "PNG"||
      msg?.file?.name?.split('.').pop() === "ico"||
      msg?.file?.name?.split('.').pop() === "svg"
    ){
      text = "📸 Photo";
    }
    if(
      msg?.file?.name?.split('.').pop() ===   "zip"  ||
      msg?.file?.name?.split('.').pop() ===   "psd"  ||
      msg?.file?.name?.split('.').pop() ===   "ppt"  ||
      msg?.file?.name?.split('.').pop() ===   "txt"  ||
      msg?.file?.name?.split('.').pop() ===   "rar"  ||
      msg?.file?.name?.split('.').pop() ===   "doc"  ||
      msg?.file?.name?.split('.').pop() ===   "docx" ||
      msg?.file?.name?.split('.').pop() ===   "xls"  ||
      msg?.file?.name?.split('.').pop() ===   "ods"  ||
      msg?.file?.name?.split('.').pop() ===   "deb"  ||
      msg?.file?.name?.split('.').pop() ===   "xlsx" ||
      msg?.file?.name?.split('.').pop() ===   "tif"  ||
      msg?.file?.name?.split('.').pop() ===   "dll"  ||
      msg?.file?.name?.split('.').pop() ===   "sav"  ||
      msg?.file?.name?.split('.').pop() ===   "dat"  ||
      msg?.file?.name?.split('.').pop() ===   "dbf"  ||
      msg?.file?.name?.split('.').pop() ===   "excel"||
      msg?.file?.name?.split('.').pop() ===   "avi"  ||
      msg?.file?.name?.split('.').pop() ===   "mkv"  ||
      msg?.file?.name?.split('.').pop() ===   "wmv"  
    ){
      text = "📂 Document";
    }
    if(
      msg?.file?.name?.split('.').pop() ===   "mp4"  ||
      msg?.file?.name?.split('.').pop() ===   "mov"  ||
      msg?.file?.name?.split('.').pop() ===   "3gp"  
    ){
      text = "🎥 Video";
    }
    if(
      msg?.file?.name?.split('.').pop() ===   "mp3"  ||
      msg?.file?.name?.split('.').pop() ===   "m4a"  ||
      msg?.file?.name?.split('.').pop() ===   "m4a"  ||
      msg?.file?.name?.split('.').pop() ===   "ogg"  
    ){
      text = "🎧 Audio";
    }
  }
  return text;
}

export const SetNotificationListManage = (ws, payload) =>{
  return(async(dispatch, getState)=>{
      
      const { Rooms, SavedMessages, MessageList, access_token, Notification, UserDetails, MainTabsSelected, DetailsList,  Contacts,qr_token,SaveChatList, SelectedRoom, MyProfile, userLogin, user_id } = getState()?.allReducers;
      const { response, request } = payload;
        if(payload?.url == "add_system_chat"){
          const GroupName =await getSystemDetails(response?.system_group_id, DetailsList, access_token);
          const messages = getFileType(response)
          dispatch(callDispatchNotification({
            payload:response,
            notification:{
              title:GroupName?.group_name,
              options:{
                body:messages,
                icon:GroupName?.avatar,
              },
              path_url:window.location.origin +`/Chat/${response?.system_group_id}`,
              show:true
            }
          }))
        }else if(payload?.url === "add_broadcast"){
          if(response?.message?.to_id === userLogin?.user_id){
            console.log("add_broadcast", response)
            const UserName =await getUsersName(response?.from_id, UserDetails, access_token);
            const messages = getFileType(response);
            dispatch(callDispatchNotification({
              response:response,
              notification:{
                title:UserName?.name,
                options:{
                  body:messages,
                  icon:UserName?.avatar
                },
                path_url:window.location.origin +`/Chat/${response?.to_id}`,
                show:true
              }
            }))
          }else{
            dispatch(callDispatchNotification({
              payload:response,
              notification:{
                show:false
              }
            }))
          }
        }else if(payload?.url ==="add_system_chat"){
            const messages = GetMessageIntro(response?.message?.message, Contacts, DetailsList, UserDetails, userLogin?.user_id);
            const avatar = response?.avatar?.view_thumbnail_url ? await GetViewFilesAPI(response?.avatar?.view_thumbnail_url, access_token) : null;
            dispatch(callDispatchNotification({
              payload:response?.message,
              notification:{
                title:response?.group_name,
                options:{
                  body:messages,
                  icon:avatar
                },
                path_url:window.location.origin +`/Chat/${response?.id}`,
                show:true
              }
            }))
        }else if(payload?.url === "add_group" || payload?.url === "update_group" || payload?.url === "unsubscribe_group" || payload?.url === "subscribe_group"){
          if(response?.message?.from_id !== userLogin?.user_id){
            const messages = GetMessageIntro(response?.message?.message, Contacts, DetailsList, UserDetails, userLogin?.user_id);
            const avatar = response?.avatar?.view_thumbnail_url ? await GetViewFilesAPI(response?.avatar?.view_thumbnail_url, access_token) : null;
            dispatch(callDispatchNotification({
              payload:response?.message,
              notification:{
                title:response?.group_name,
                options:{
                  body:messages,
                  icon:avatar
                },
                path_url:window.location.origin +`/Chat/${response?.id}`,
                show:true
              }
            }))
          }else{
            dispatch(callDispatchNotification({
              payload:response,
              notification:{
                show:false
              }
            }))
          }
        }else if(payload?.url === "add_chat" && response?.from_id !== userLogin?.user_id){
          if(request?.chat_type === "group"){
            const GroupName =await getGroupName(response?.group_id, DetailsList, access_token);
            const messages = getFileType(response)
            dispatch(callDispatchNotification({
              payload:response,
              notification:{
                title:GroupName?.group_name,
                options:{
                  body:messages,
                  icon:GroupName?.avatar,
                },
                path_url:window.location.origin +`/Chat/${response?.group_id}`,
                show:true
              }
            }))
          }else if(request?.chat_type === "single"){
              const UserName =await getUsersName(response?.from_id, UserDetails, access_token);
              const messages = getFileType(response)
              dispatch(callDispatchNotification({
                response:response,
                notification:{
                  title:UserName?.name,
                  options:{
                    body:messages,
                    icon:UserName?.avatar
                  },
                  path_url:window.location.origin +`/Chat/${response?.to_id}`,
                  show:true
                }
              }))
          }
          // const titie = 
          // setAddNotificationList({
          //   ...response,
          //   notification:titie
          // })
        }else if(payload?.url === "add_chat" && response?.from_id === userLogin?.user_id){
          dispatch(callDispatchNotification({
            response:response,
            notification:{
              show:false
            }
          }))
        }else if(payload?.url  === ""){
          dispatch(callDispatchNotification({
            response:response,
            notification:{
              show:false
            }
          }))
        }
  })
}