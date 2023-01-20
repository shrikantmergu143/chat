import { CallLogoutUser } from "../redux/actions";
import DeactiveLoginAPI from "./DeactiveLogin";
import GetUser from "./GetUser";

const GetCheckUserLoginAPI = async ( access_token) => {
    let value;
    // // Let us open a web socket
    // var ws = new WebSocket(URL);
				
    // ws.onopen = function() {
    //     const param = {"transmit":"single", "url":"user"}
    //     // Web Socket is connected, send data using send()
    //     value =  true;
    //     ws.send(JSON.stringify(param));
    //     //  alert("Message is sent...");
    // };
    // ws.onmessage = function (evt) {
    //     var received_msg = JSON.parse(evt.data);
    //     ws.close();
    // };
    // ws.onerror =async function(){
    //     value = false;
    //     // const data = await DeactiveLoginAPI(access_token, users?.token_id);
    //     // if(data?.status === 403){
    //     //   dispatch(CallLogoutUser());
    //     // }else{
    //     //   dispatch(CallLogoutUser());
    //     // }
    // }
    // return value;
    const Responce = await GetUser(access_token);
    console.log("Responce?.response", Responce)
    if(Responce?.data){
      value = true;
    }else{
      value = false
    }
    return value;
};

export default GetCheckUserLoginAPI;
