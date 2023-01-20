import React, { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import wsSend_request from "../../../Api/ws/ws_request";
import { WebSocketContext } from "../../Index";
import SavedMessages from "./SavedMessages";

const Index = (props) => {
    const { websocket } = useContext(WebSocketContext)
    const UserDetails = useSelector((state) => state.allReducers.UserDetails);
    const SavedMessagess = useSelector((state) => state.allReducers.SavedMessages);
    const MessageList = useSelector((state) => state.allReducers.MessageList);
    const sidebarLinks = useSelector((state) => state.allReducers.MainTabsSelected);
    const { roomId } = useParams();
    const navigate = useNavigate();
    useEffect(()=>{
        callSaveMessage()
    // eslint-disable-next-line
    },[sidebarLinks, UserDetails])
    const callSaveMessage = () =>{
        wsSend_request(websocket, {"transmit":"single", "url":"get_save_message_all","request":{"updated_at":""}})
    }
    const callGetSaveMessage = (msg) =>{
        // navigate("/Chat/"+msg.to_id)
        // var ele = document.getElementById(msg.chat.id);   
        // window.scrollTo(ele.offsetLeft,ele.offsetTop);
        // // const param = {
        // //     "transmit":"single",
        // //     "url":"get_save_message",
        // //     "request":{
        // //         "to_id":msg?.to_id,
        // //         "chat_type":msg?.chat_type
        // //     }
        // // }
        // // wsSend_request(websocket, param)
    }
    return(
        <div className="blockedUserswrapper savedMessageWrapper">
            <div className="projectchatlogo">
                <div className="projectlogo">
                    <h4>Saved Message</h4>
                </div>
            </div>
            <SavedMessages 
                getSavedMessages={SavedMessagess}
                callGetSaveMessage={callGetSaveMessage}
            />
        </div>
    )
}

export default Index;