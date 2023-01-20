/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-debugger, no-console */
import React, {createContext, useEffect, useState} from "react";
import Home from "./Home";
import Main from "./Main";
import Sidebar from './Sidebar';
import { Col } from 'react-bootstrap';
import { connect, useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {  onMessageListener} from "../firebase/firebaseInit";
import axios from "axios";
import { baseURL_WS_Socket } from "../constant/url";
import { Ws_Omessage } from "../Api/ws/Ws_Onmessage";
import { CallLogoutUser, CallOnline, CleanViewBaseURL } from "../redux/actions";
import DeactiveLoginAPI from "../Api/DeactiveLogin";
import { uuidv4 } from "../Api/UploadFile";
import ModalConfirmPopup from "./common/ModalConfirmPopup";
import GetUpdateContact from "../Api/UpdateContact";
import { SetNotificationListManage } from "../firebase/notification";
import ModalSearchBox from "./ChatPanels/SearchChat/ModalSearchBox.jsx"
export const WebSocketContext = createContext();

window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

function App(props) {
  const {access_token} = props;
  const dispatch = useDispatch();
  // console.log("registration_id", registration_id)
  const ws = new WebSocket(`${process.env.REACT_APP_SERVICE_URL}/${access_token}/`);

  // get all groups list
  useEffect(() => {
    ws.onmessage = function (evt) {
      dispatch(SetNotificationListManage(ws,  JSON.parse(evt.data)));
      dispatch(Ws_Omessage({evt:evt, ws:ws }))
      const ws_onmessage = JSON.parse(evt.data);
      if(ws_onmessage?.url === "reconnect"){
        props?.callRender(`${process.env.REACT_APP_SERVICE_URL}/${access_token}/`, access_token)

      }
    }
    ws.onclose = async function (evt){
      console.log("evt", evt)
      if(navigator.onLine === false){
        
      }else{
          props?.callRender(`${process.env.REACT_APP_SERVICE_URL}/${access_token}/`, access_token)
      }
    }
    window.addEventListener('online', () => {
      dispatch(CallOnline(true));
      window.location.reload()
    });
    window.addEventListener("offline",()=>{
      dispatch(CallOnline(false));
    });
    const device_id = localStorage?.getItem("device_id");
      if(!device_id){
        localStorage?.setItem("device_id", uuidv4());
      }
    dispatch(GetUpdateContact(access_token))
    dispatch(CleanViewBaseURL())

    return () => {
      ws.close()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(()=>{
    dispatch(onMessageListener(ws))
  });

    return (
      <WebSocketContext.Provider value={{websocket:ws}}>
        <div className="wrapper">
          <div className="wrapper_Main">
            <div className="wrapper_second">
              <BrowserRouter>
                <Col className="sidebarGridCol" sm={3} xs={3} style={{ padding: "0px",width: "27%" }}>
                  <Sidebar />
                </Col>
                <Routes> 
                  <Route path="/" element={<Home />}>
                    <Route index path="/Home" element={<Home />} />
                  </Route>
                  <Route path={'/Chat/:roomId'} element={<Main />} />
                </Routes>
                <ModalSearchBox/>
              </BrowserRouter>
            </div>
          </div>
        </div>
        <ModalConfirmPopup/>
      </WebSocketContext.Provider>
    );
}
const mapStateToProps = (state) =>({
  access_token:state.allReducers.access_token
})
export default connect(mapStateToProps)(App);