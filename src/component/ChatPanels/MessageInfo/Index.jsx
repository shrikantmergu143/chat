/* eslint-disable array-callback-return */
import React from 'react'
import { useSelector } from 'react-redux';
import Header from './Header';
import DummyImage from '../../../assets/img/profile/dummyimage.png';
import MessagePanel from './MessagePanel';
import { ListGroup, ListGroupItem, Image } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars-2';
import MembersPanel from './MembersPanel';

export default function Index(props) {
    const { setMessagesInfoSidebar, sideBarLoader, MessageInfoSidebar, callMessageInfo } = props;
  const { SelectedRoom, MyProfile, userLogin } = useSelector((state) => state.allReducers);
    // eslint-disable-next-line no-restricted-globals
    const styleData = screen.width > 1590 ? "100vh - 300px" : "100vh - 267px";
  return (
    <div className="groupInfoWrapper MessageInfo">
      <Header 
        UserType={SelectedRoom?.isGroups?false:true}
        isBroadCast={SelectedRoom?.isBroadCast === true?true:false}
        setMessagesInfoSidebar={setMessagesInfoSidebar}
        callMessageInfo={callMessageInfo}
      />
      
    {/* <RighSideLoader isShow={sideBarLoader} className={"Rside_loader"}/> */}
      <div className="chatpannelwrapper MessagesPanel">
        <div className='CHatcustomscroll'>
              {MessageInfoSidebar?.Messages?.map((item, index)=>(
                <React.Fragment key={index}>
                  <MessagePanel msg={item}/>
                  <Scrollbars
                    renderTrackVertical={props => <div {...props} className="track-vertical"/>}
                    renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
                    renderView={props => <div {...props} style={{
                      marginBottom: "0px",
                      position: "absolute",
                      inset: "0px",
                      overflow: "scroll",
                      marginRight: "-19px"
                    }} className="view"/>}
                    className="scrollararea"
                    style={{
                      minHeight: `calc(${styleData} - ${40}px)`
                    }}
                  >
                  <div className="ChatMemberList">
                    <ListGroup>
                      <MembersPanel SelectedRoom={SelectedRoom} msg={item} />
                      {/* {console.log("itemitem", setMessagesInfoSidebar)} */}
                    </ListGroup>
                  </div>
                  </Scrollbars>
                </React.Fragment>
              ))}
        </div>
      </div>
    </div>
  )
}
