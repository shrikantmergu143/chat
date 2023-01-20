/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import wsSend_request from '../../Api/ws/ws_request';
import { mainTabChange, setBrowserStatus, setResetReduxStore,setRegisterdSystem } from '../../redux/actions';
import { WebSocketContext } from '../Index';
import SidebarMenu from './SidebarMenu';
import SidebarstartWrap from './SidebarstartWrap';
import RefreshContacts from '../common/RefreshContacts';
import GetUpdateContact from '../../Api/UpdateContact';
import ModalFilterCommon from '../common/ModalFilterCommon';
import { Ws_Omessage } from "../../Api/ws/Ws_Onmessage";
import { SubscribeTokenToTopic } from '../../firebase/firebaseInit';

const Index = () => { 
  const NotiVisible = useSelector((state) =>state?.allReducers?.NotiVisible);
  const access_token = useSelector((state) =>state?.allReducers?.access_token);
  const [loadState, setLoadState] = useState(false)
  const [ IsRefreshing, setIsRefreshing ] = useState(true);
  const dispatch = useDispatch()
  const { websocket } = useContext(WebSocketContext);
  const navigate = useNavigate();
  const [callGenerateToken, SetcallGenerateToken] = useState(0);
  const [OpenFilterModal, setOpenFilterModal] = useState(false);
  const select_types = useSelector((state) => state?.allReducers?.select_types);
  const registration_id = useSelector((state) =>state?.allReducers?.registration_id);
  const registration_ids = useSelector((state) =>state?.allReducers?.registration_ids);
  const Rooms = useSelector((state) =>state?.allReducers?.Rooms);
  // User online status
  const callGenerateQRcodeAPI = async () =>{
      wsSend_request(websocket, {"transmit":"single", "url":"update_online_status"})    
  }
  useEffect(()=>{
    if (callGenerateToken <= 0) {
        return;
    }
    const minutes15 = setInterval(callGenerateQRcodeAPI, 4000);
    return () => clearInterval(minutes15);
  },[callGenerateToken]);

  useEffect(()=>{
    document.addEventListener("visibilitychange", function() {
      setTimeout(()=>{
        if (document.hidden) {
          dispatch(setBrowserStatus(false));
          SetcallGenerateToken(0)
        }
        else {
          dispatch(setBrowserStatus(true))
          SetcallGenerateToken(1)
        }
      }, 100)
    });

    window.addEventListener('blur', function (event) {
        setTimeout(()=>{
          dispatch(setBrowserStatus(false));
          SetcallGenerateToken(1)
        // console.log('lost focus');
        }, 100)
    });
    window.addEventListener('focus', function (event) {
      setTimeout(()=>{
        dispatch(setBrowserStatus(true))
        SetcallGenerateToken(1)

      // console.log('lost focus');
      }, 100)
    });

    SetcallGenerateToken(1);
    return(()=>{
      SetcallGenerateToken(0)
    })
  },[]);
  useEffect(()=>{
    if(registration_id){
      callSubscribeTopics();
    }
  },[registration_id])
  const CallReloadContents = () =>{
    setLoadState(true);
    dispatch(setResetReduxStore());
    dispatch(GetUpdateContact(access_token))
    wsSend_request(websocket, {"transmit":"single", "url":"get_groups"});
    wsSend_request(websocket, {"transmit":"single", "url":"get_contacts"});
    wsSend_request(websocket, {"transmit":"single", "url":"get_system_groups"});
    wsSend_request(websocket, {"transmit":"single", "url":"get_broadcast_groups"});
    navigate("/")
    setTimeout(()=>setLoadState(false), 5000);
  }
  const callOpenFilterModal = (value) =>{
    if(value === false){
      setOpenFilterModal(value)
      dispatch(mainTabChange("Chat"))
    }else{
      setOpenFilterModal(value)
    }
  }
  const callSubscribeTopics =async () =>{
    // eslint-disable-next-line array-callback-return
    Rooms?.map(async(item)=>{
      if(item?.group_type){
        if(!registration_ids[item?.id]){
          dispatch(setRegisterdSystem(item?.id));
          await SubscribeTokenToTopic(registration_id, item?.id, "POST");
        }
      }
    })
  }
  return (
    <div className="sidebarMenuSet">
        {/* main menu option */}
        <SidebarMenu select_types={select_types} callOpenFilterModal={callOpenFilterModal} CallReloadContents={CallReloadContents} />

        {/* main chats sidebar start */}
        {OpenFilterModal === true && <ModalFilterCommon
          show={OpenFilterModal}
          callOpenFilterModal={callOpenFilterModal}
        />}
        <SidebarstartWrap/>
        {loadState && (<RefreshContacts />)}
    </div>
  );
}

export default Index;