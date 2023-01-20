/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import { Col } from 'react-bootstrap';
import Index from './ChatPanels/Index';
import IndexGroupInfo from './ChatPanels/GroupInfo/Index';
import IndexMessageInfo from './ChatPanels/MessageInfo/Index';
import { useDispatch, useSelector } from 'react-redux';
import wsSend_request from '../Api/ws/ws_request';
import { WebSocketContext } from './Index';
import { UpdateMediaFiles } from '../redux/actions';
import { useParams } from 'react-router-dom';

const Main = () => {
  const [ groupInfoSidebar, setGroupInfoSidebar ] = useState(false);
  const [userOnlinestatus, SetUserOnlinestatus] = useState("");
  const { websocket } = useContext(WebSocketContext);
  const dispatch = useDispatch()
  const MessageList = useSelector((state) => state.allReducers.MessageList);
  const SelectedRoom = useSelector((state) => state.allReducers.SelectedRoom);
  const { roomId } = useParams();
  const UserLogin = useSelector((state) => state.allReducers.userLogin);
  const [ MessageInfoSidebar, setMessagesInfoSidebar ] = useState({
    show:false,
    Messages:[],
  });
  const [sideBarLoader, setSideBarLoader] = useState(false);

  const UpdateUserOnlineStatus = async () =>{
    if(userOnlinestatus!==""){
      wsSend_request(websocket, {"transmit":"single", "url":"online_status", "request":{"user_id":userOnlinestatus}})
    }
  }
  useEffect(()=>{
    if (userOnlinestatus === "") {
        return;
    }
    const minutes15 = setInterval(UpdateUserOnlineStatus, 4000);
    return () => {
      SetUserOnlinestatus("");
      clearInterval(minutes15);
    };
  },[userOnlinestatus]);

  useEffect(() => {
    setMessagesInfoSidebar({
      show:false,
      Messages:[],
    })
    return () => {
      setMessagesInfoSidebar({
        show:false,
        Messages:[],
      })
    };
  }, [SelectedRoom?.id]);

  useEffect(()=>{
    if(MessageInfoSidebar?.show){
      dispatch(UpdateMediaFiles(SelectedRoom))
    }
  }, [MessageList[SelectedRoom?.id]])

  const callMessageInfo = (msg) =>{
      setGroupInfoSidebar(false);
      setMessagesInfoSidebar({
          show:true,
          Messages:[{...msg}]
      });

      // dispatch(UpdateMediaFiles(SelectedRoom))
  }
  return (<React.Fragment>
      <Col className={true === groupInfoSidebar || MessageInfoSidebar?.show ? "ChatPannelBoxGridCol OpenSidebarInfo" : "ChatPannelBoxGridCol"} sm={9} xs={9} style={{ width: "73%" }}>
        {/* User chat panel start here */}
        <Index 
          setGroupInfoSidebar={setGroupInfoSidebar} 
          groupInfoSidebar={groupInfoSidebar}
          setMessagesInfoSidebar={setMessagesInfoSidebar}
          MessageInfoSidebar={MessageInfoSidebar}
          setSideBarLoader={setSideBarLoader}
          callMessageInfo={callMessageInfo}
          SetUserOnlinestatus={SetUserOnlinestatus}
          userOnlinestatus={userOnlinestatus}
        />

        {/* group info sidebar start here */}
        {groupInfoSidebar === true && (<IndexGroupInfo callMessageInfo={callMessageInfo} setGroupInfoSidebar={setGroupInfoSidebar} sideBarLoader={sideBarLoader} />)}
        {MessageInfoSidebar?.show === true && (<IndexMessageInfo callMessageInfo={callMessageInfo} setMessagesInfoSidebar={setMessagesInfoSidebar} MessageInfoSidebar={MessageInfoSidebar} sideBarLoader={sideBarLoader} />)}
      </Col>
    </React.Fragment>);
}

export default Main;