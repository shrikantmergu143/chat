/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect }  from "react";
import { Col, Image } from 'react-bootstrap';
import { useSelector } from "react-redux";
import wsSend_request from "../Api/ws/ws_request";
import HomeImage from "../assets/img/home-icon.png";
import { callGetFCMToken } from "../firebase/firebaseInit";
import { WebSocketContext } from "./Index";

const Home = () => {
  const registration_id = useSelector((state) => state.allReducers.registration_id);
  const dsaasd = useSelector((state) => state.allReducers.MessageList);
  const users = useSelector((state)=>state?.allReducers?.userLogin);
  const {websocket} = useContext(WebSocketContext)
  useEffect(()=>{
      callRegisterdDevice();
  },[!registration_id])

  const callRegisterdDevice = async ()=>{
      if(!registration_id){
        const data = await callToken()
        // console.log("data",  data)
        if(data){
          const params = {"transmit":"single", "url":"user_update_device","request":{"registration_id":data,"device_type":"web"}}
          // websocket.send(JSON.stringify(params))
          wsSend_request(websocket, params);
        }
      }
  }
  const callToken = async (  ) =>{
    const data = await callGetFCMToken(users?.users_detail?.global_group);
    return data;
  }
    return (
    <Col className="ChatPannelBoxGridCol" sm={9} xs={9} style={{ width: "73%" }}>
      {/* User chat panel start here */}
      <div className="homepagecss" >
        <Image src={HomeImage} alt="home"/>
        <h4>Nationwide Desktop</h4>
        <p>Begin your chat. Click here to see who are in your contacts.</p>
      </div>
    </Col>
  )
}

export default Home;