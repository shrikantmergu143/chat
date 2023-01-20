/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable no-useless-concat */
/* eslint-disable no-const-assign */
/* eslint-disable new-parens */
/* eslint-disable no-undef */
/* eslint-disable */
/* eslint-disable-next-line */
import firebase from "firebase/compat/app";
import "firebase/compat/messaging";
import { checkExtension } from "../component/ChatPanels/SearchChat/MessagesPanel";
import { getSelectRoomsDetails, mainTabChange, RemoveGroupsFromRooms, setGoBackFromSelect } from "../redux/actions";
// import { getMessaging } from "firebase/messaging/sw";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyCAl3fF4CWO2755f_3DFK6Ox8RcVAfDqcM",
    authDomain: "chatapp-62c82.firebaseapp.com",
    projectId: "chatapp-62c82",
    storageBucket: "chatapp-62c82.appspot.com",
    messagingSenderId: "470692440840",
    appId: "1:470692440840:web:6b68226eb7195f4d639abd",
    measurementId: "G-RWQQC6XR9P"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
// Subscribe Topic
export const SubscribeTokenToTopic = async (token, topic, Type)  => {
  if(token){
      const data =  await fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`, {
          method: Type,
          headers: new Headers({
          Authorization: `key=${process.env.REACT_APP_FIREBASE_API_KEY}`
          })
      })
      .then((response) => {
      if (response.status < 200 || response.status >= 400) {
          console.log(response.status, response);
      }
      console.log(`"${topic}" is subscribed`);
      })
      .catch((error) => {
      console.error(error.result);
      });
      return data;
  }
}

export const getToken = async (global_group) => {
  let currentToken = "";
  try {
    currentToken = await messaging.getToken({
      vapidKey: "BBEeMbvxBJbsBvPupC9PjFP29JTI87Xgb0Gj569zTTdpOjhWE2_-47O7f-n8AAkRx5Yythl-pARSS3MzCIZdg74",
    }).then(async (item)=>{
      // messaging.subscribeToTopic(item, global_group)
      // .then(response=> {
      //   console.log('Successfully subscribing to topic:',JSON.stringify(response));
      // })
      // .catch(function(error) {
      //   console.log('Error subscribing to topic:', error);
      // });
      // await SubscribToken([item], global_group)
      return item;
    });
  } catch (error) {
    // console.log("An error occurred while retrieving token.", error);
  }
  return currentToken;
};

export const callGetFCMToken =async (global_group) =>{
    const responce = Notification.requestPermission().then(async(premission)=>{
        if(premission==="granted"){
            const token = await getToken(global_group);
            return token;
        }
        if (Notification.permission === "denied") {
            // alert("Notifications blocked. Please enable them in your browser.");
            return undefined;
        }
    }).catch((error)=>{
        // console.log("Please allow notification", error);
        return null;
    })
    return responce
}

export const onMessageListener = (ws) =>{
  return((dispatch, getState)=>{
    new Promise((resolve) => {
      messaging.onMessage((payload) => {
        let url = window.location.pathname;
        let location_id = url.substring(url.lastIndexOf('/') + 1);
      const NotificationList = getState()?.allReducers?.Notification;
      const Reducers = getState()?.allReducers;
      let {Rooms, NotiVisible,Contacts, user_id, userLogin} = getState()?.allReducers;
      // console.log("NotiVisible", NotiVisible)
        var  title = payload?.notification?.title;
        var options ={
          body: payload?.notification.body,
          icon:"https://nww.appristine.in/static/media/logo.f65026fd3099e67e961e2974b56f9522.svg",
          silent:false
        };
        const innerData = payload?.data;
        const n_payload = JSON.parse(payload?.data?.n_payload);
        let path_url = window.location.origin;
        // console.log("ListenerMessage", Reducers, n_payload,payload);
        if("add_group" === payload?.data?.n_action){
          title = n_payload?.group_name;
          path_url = window.location.origin +`/Chat/${n_payload?.id}`
          const msg = n_payload?.message
          let MessageList = [];
          const splitUserId = msg?.message?.substring(0, msg.message.indexOf(' '));
          const splitUserIdGet = splitUserId?.split(",");
          const splitmsglast = msg?.message?.substring(msg.message.indexOf(' ') + 1);
          splitUserIdGet?.filter((data) => {
            if(data === user_id){
              MessageList?.push("You");
            }else {
              Contacts?.filter((elm) => {
                if(elm.id === data) {
                    MessageList?.push(elm.name);
                }
              })
            }
          })
          options.body = ( MessageList.length > 0 ? MessageList.join(', ').toString() : "You" )+" "+ splitmsglast
        }
        if(payload?.data?.n_action === "update_group"|| payload?.data?.n_action === "unsubscribe_group"){
            title = n_payload?.group_name;
            path_url = window.location.origin +`/Chat/${n_payload?.id}`
            const msg = n_payload?.message
            let MessageList = [];
            const splitUserId = msg?.message?.substring(0, msg.message.indexOf(' '));
            const splitUserIdGet = splitUserId?.split(",");
            const splitmsglast = msg?.message?.substring(msg.message.indexOf(' ') + 1);
            splitUserIdGet?.filter((data) => {
              if(data === user_id){
                MessageList?.push("You");
              }else {
                Contacts?.filter((elm) => {
                  if(elm.id === data) {
                      MessageList?.push(elm.name);
                  }
                })
              }
            })
            // console.log("n_payload?.from_id", n_payload?.from_id)
            if(n_payload?.from_id === userLogin?.user_id){
              NotiVisible = true
            }
            options.body = ( MessageList.length > 0 ? MessageList.join(', ').toString() : "You" )+" "+ splitmsglast
          }
        if("add_chat" === payload?.data?.n_action || "add_system_chat" === payload?.data?.n_action){
          if(innerData?.chat_type === "group"){
            const groupName = DetailsList[innerData?.group_id];
            title = groupName[0]?.group_name;
            const id = groupName[0]?.id;
            path_url = window.location.origin +`/Chat/${id}`
          }else if(innerData?.chat_type === "single"){
            const users  = innerData?.from_id === user_id? [{id:user_id, name:"You"}] : Rooms?.filter((item)=>item?.id === innerData?.from_id)
            title = users[0]?.name;
            const id = users[0]?.id;
            path_url = window.location.origin +`/Chat/${id}`
          }
          if(n_payload?.message_type === "file"){
            if(
              n_payload?.file?.name?.split('.').pop() ===   "zip"  ||
              n_payload?.file?.name?.split('.').pop() ===   "psd"  ||
              n_payload?.file?.name?.split('.').pop() ===   "ppt"  ||
              n_payload?.file?.name?.split('.').pop() ===   "txt"  ||
              n_payload?.file?.name?.split('.').pop() ===   "rar"  ||
              n_payload?.file?.name?.split('.').pop() ===   "doc"  ||
              n_payload?.file?.name?.split('.').pop() ===   "docx" ||
              n_payload?.file?.name?.split('.').pop() ===   "xls"  ||
              n_payload?.file?.name?.split('.').pop() ===   "ods"  ||
              n_payload?.file?.name?.split('.').pop() ===   "deb"  ||
              n_payload?.file?.name?.split('.').pop() ===   "xlsx" ||
              n_payload?.file?.name?.split('.').pop() ===   "tif"  ||
              n_payload?.file?.name?.split('.').pop() ===   "dll"  ||
              n_payload?.file?.name?.split('.').pop() ===   "sav"  ||
              n_payload?.file?.name?.split('.').pop() ===   "dat"  ||
              n_payload?.file?.name?.split('.').pop() ===   "dbf"  ||
              n_payload?.file?.name?.split('.').pop() ===   "excel"||
              n_payload?.file?.name?.split('.').pop() ===   "avi"  ||
              n_payload?.file?.name?.split('.').pop() ===   "mkv"  ||
              n_payload?.file?.name?.split('.').pop() ===   "wmv"
            ){
                options.body = "📂 Document";
            }
            if(n_payload?.message_type === "file"&&(n_payload?.file?.name?.split('.').pop() === "m4a" || n_payload?.file?.name?.split('.').pop() === "mp3" || n_payload?.file?.name?.split('.').pop() === "ogg" || n_payload?.file?.name?.split('.').pop() === "wav" || n_payload?.file?.name?.split('.').pop() === "mpeg")){
              options.body ="🎧 Audio";
            }
            if(n_payload?.message_type === "file"&& (n_payload?.file?.name?.split('.').pop() === "mp4" || n_payload?.file?.name?.split('.').pop() === "webm")){
              options.body = "🎥 Video";
            }
             
            if(n_payload?.message_type === "file"&&(n_payload?.file?.name?.split('.').pop() === "jpg" || n_payload?.file?.name?.split('.').pop() === "jpeg" || n_payload?.file?.name?.split('.').pop() === "png" || n_payload?.file?.name?.split('.').pop() === "webp")){
                options.image = "📸 Photo";
            }
             
          }else if(n_payload?.message_type === "text"){
            options.body = n_payload?.message
          }
          if(n_payload?.message_type === "contact"){
            options.body = "📞 Contact"
          }
          if(n_payload?.message_type === "location"){
            options.body = "📍 location";
          }
          // console.log("n_payload?.from_id", n_payload?.from_id)
          if(n_payload?.from_id === userLogin?.user_id){
            NotiVisible = true
          }
          // options.body = n_payload?.message
        }
        if("add_call"  === payload?.data?.n_action || "update_call_status" === payload?.data?.n_action){
          NotiVisible = true
        }
        if("unsubscribe_group" === payload?.data?.n_action){
          if(n_payload?.from_id === userLogin?.user_id){
            NotiVisible = true
          }else if(n_payload?.to_id === userLogin?.user_id){
            dispatch(RemoveGroupsFromRooms(n_payload));
            if(location_id ===  n_payload?.message?.group_id ){
              dispatch(getSelectRoomsDetails( {}))
              dispatch(mainTabChange("Chat"))
              dispatch(setGoBackFromSelect(true));
            }
            NotiVisible = false
          }
        }


        navigator?.serviceWorker?.ready.then(function(serviceWorker) {
          // if(serviceWorker?.showNotification){
          //   resolve(serviceWorker?.showNotification(title,options));
          // }else{
            console.log("NotiVisible", NotiVisible)
          if(NotiVisible === false ){
            const notification = new Notification(title,options);
            notification.onclick = (e) =>{
              e.preventDefault();
              window.open(path_url, '_blank');
            }
          }
          // }
          // eslint-disable-next-line no-restricted-globals
          // self.onnotificationclick = function(event) {
          //     console.log('On notification click: ', event.notification.tag);
          //     event.notification.close();
            
          //     // This looks to see if the current is already open and
          //     // focuses if it is
          //     event.waitUntil(clients.matchAll({
          //       type: "window"
          //     }).then(function(clientList) {
          //       for (var i = 0; i < clientList.length; i++) {
          //         var client = clientList[i];
          //         if (client.url === '/' && 'focus' in client)
          //           return client.focus();
          //       }
          //       if (clients.openWindow)
          //         return clients.openWindow('/');
          //     }));
          // };

        });
        resolve(payload);
      });
  });
  
  })
}