/* eslint-disable react-hooks/rules-of-hooks */

const wsSend_request = (websocket, params)=>{
    if(websocket.send!==null && websocket.readyState === websocket.OPEN ){
        if(params?.request){
            const device_id = localStorage?.getItem("device_id");
            params.request.device_id = device_id
        }
        websocket?.send(JSON.stringify(params))
    }else{
        setTimeout(()=>{
            wsSend_request(websocket, params)
        },1500)
    }
}
export default wsSend_request;