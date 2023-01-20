import { baseURL_WS_Socket } from '../constant/url';

const GetUserProfile = (accessToken) => {
    // Let us open a web socket
    var ws = new WebSocket(process.env.REACT_APP_SERVICE_URL);
				
    ws.onopen = function() {
        const param = {
            "transmit":"single", 
            "url": accessToken
        }

       // Web Socket is connected, send data using send()
       ws.send(param);
       alert("Message is sent...");
    };
     
    ws.onmessage = function (evt) { 
       var received_msg = evt.data;
       //    return evt.data;
       alert("Message is received...");
    };
     
    // ws.onclose = function() { 
                  
    //     // websocket is closed.
    //     alert("Connection is closed..."); 
    //  };
};

export default GetUserProfile;
