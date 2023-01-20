import { baseURL_WS_Socket } from '../../constant/url';
import { contactList } from '../../redux/actions';

const getUserProfileAPI = (accessToken) => {
   return((dispatch)=>{
      // Let us open a web socket
      var ws = new WebSocket(`${process.env.REACT_APP_SERVICE_URL}/${accessToken}/`);
      ws.onopen = function() {
         const param = {"transmit":"single", "url":"user"}
         // Web Socket is connected, send data using send()
         ws.send(JSON.stringify(param));
         //  alert("Message is sent...");
      };
      ws.onmessage = function (evt) {
         var received_msg = JSON.parse(evt.data);
         //    return evt.data;
         //  dispatch(contactList(received_msg?.response));
         ws.close();
      };
   })
};

export default getUserProfileAPI;
