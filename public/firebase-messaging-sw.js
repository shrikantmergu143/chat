/* eslint-disable array-callback-return */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// eslint-disable-next-line
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");

importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

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

class CustomPushEvent extends Event {
  constructor(data) {
    super('push');

    Object.assign(this, data);
    this.custom = true;
  }
}
self.addEventListener('push', (e) => {
  if (e.custom) return;
  // Skip if event is our own custom event

  // Kep old event data to override
  const oldData = e.data;

  // Create a new event to dispatch, pull values from notification key and put it in data key,
  // and then remove notification key
  const newEvent = new CustomPushEvent({
    data: {
      ehheh: oldData.json(),
      json() {
        const newData = oldData.json();
        newData.data = {
          ...newData.data,
          ...newData.notification,
        };
        delete newData.notification;
        return newData;
      },
    },
    waitUntil: e.waitUntil.bind(e),
  });

  // Stop event propagation
  e.stopImmediatePropagation();
});

self.addEventListener('notificationclick', event => {
  event.waitUntil(clients.matchAll({ type: "window" }).then(function(clientList) {

    for (let i = 0; i < clientList.length; i++) {
      const client = clientList[i];
      if (client.url === '/' && 'focus' in client) {
        if (event.notification.data.route) client.href(event.notification.data.route);
        return client.focus();
      }
    }
    if (clients.openWindow)
      return clients.openWindow("../");
  }));
  event.notification.close();
});
if(messaging){

  messaging.onBackgroundMessage(function (payload) {

      const n_payload = JSON.parse(payload?.data?.n_payload);
      let NotiVisible = false
      let notificationTitle = payload.notification.title;
      var options ={
        body: payload?.notification.body,
        icon:"https://nww.appristine.in/static/media/logo.f65026fd3099e67e961e2974b56f9522.svg",
        silent:false,
        data:JSON.parse(payload?.data?.n_payload),
      };
      if("add_call" === payload?.data?.n_action || "update_call_status" === payload?.data?.n_action){
       return null;
      }
      if("add_chat" === payload?.data?.n_action || "add_system_chat" === payload?.data?.n_action){
        if(n_payload?.message_type === "text"){
          options.body = n_payload?.message
        }
        if(n_payload?.message_type === "file"){   
            let text = "";         
              if(
                n_payload?.file?.name?.split('.').pop() === "jpg"||
                n_payload?.file?.name?.split('.').pop() === "jpeg"||
                n_payload?.file?.name?.split('.').pop() === "png"||
                n_payload?.file?.name?.split('.').pop() === "gif"||
                n_payload?.file?.name?.split('.').pop() === "webp"||
                n_payload?.file?.name?.split('.').pop() === "PNG"||
                n_payload?.file?.name?.split('.').pop() === "ico"||
                n_payload?.file?.name?.split('.').pop() === "svg"
              ){
                text = "📸 Photo";
              }
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
                text = "📂 Document";
              }
              if(
                n_payload?.file?.name?.split('.').pop() ===   "mp4"  ||
                n_payload?.file?.name?.split('.').pop() ===   "mov"  ||
                n_payload?.file?.name?.split('.').pop() ===   "3gp"  
              ){
                text = "🎥 Video";
              }
              if(
                n_payload?.file?.name?.split('.').pop() ===   "mp3"  ||
                n_payload?.file?.name?.split('.').pop() ===   "m4a"  ||
                n_payload?.file?.name?.split('.').pop() ===   "m4a"  ||
                n_payload?.file?.name?.split('.').pop() ===   "ogg"  
              ){
                text = "🎧 Audio";
              }
            options.body =  text;
        }
        if(n_payload?.message_type === "contact"){
          options.body = "📞 Contact"
        }
        if(n_payload?.message_type === "location"){
          options.body = "📍 location";
        }
        if( "add_system_chat" === payload?.data?.n_action){
          notificationTitle = "NATIONWIDE"
        }else{
          if(n_payload?.sender_name!==""){
            notificationTitle = n_payload?.sender_name
          }
        }
      }
      if("add_group" === payload?.data?.n_action){
        const Admin = n_payload?.users?.filter((item) => item.id === n_payload?.admin_ids)[0]
        options.body = Admin?.name+ ' created group ' + notificationTitle
        if(n_payload?.group_avatar !== ""){
          options.logo = n_payload?.group_avatar
        }
        NotiVisible = false
      }
  
      return self.registration.showNotification(notificationTitle,options).then(function(){
        console.log("notificationTitle", notificationTitle)
          self.registration.getNotifications().then(notifications => {
              for (var i =0;i<notifications.length;i++){
                  if(notifications[i].data?.FCM_MSG)
                  {
                      //then we destroy the fake notification immedialtely !
                      notifications[i].close();
                  }
              }
          })
      });
  });
}