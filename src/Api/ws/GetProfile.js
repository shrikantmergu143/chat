import { baseURL_WS_Socket } from '../../constant/url';
import { setMyProfile, userIdGet } from '../../redux/actions';

const GetProfile = (accessToken) => {
    return((dispatch)=>{
      // Let us open a web socket
      var ws = new WebSocket(`${process.env.REACT_APP_SERVICE_URL}/${accessToken}/`);
      ws.onopen = function() {
        const param = {
            "transmit":"single", 
            "url":"user"
        }
        // Web Socket is connected, send data using send()
        ws.send(JSON.stringify(param));
        //  alert("Message is sent...");
      };
      ws.onmessage = function (evt) {
         var received_msg = JSON.parse(evt.data);
         dispatch(userIdGet(received_msg.user_id));
        //  console.log("received_msg", received_msg)
         dispatch(setMyProfile({
          ...received_msg?.response,
          user_id:received_msg?.user_id
         }));
         ws.close();
      };
    })
};

export default GetProfile;
