/* eslint-disable */
import React, { useState, useContext } from 'react';
import Header from './Header';
import ProfileDetails from './ProfileDetails';
import GroupMedia from './GroupMedia';
import GroupInfoAddMember from "./GroupInfoAddMember";
import { useSelector } from "react-redux";
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Button, Spinner } from 'react-bootstrap';
import MediaSidebar from './MediaSidebar';
import wsSend_request from '../../../Api/ws/ws_request';
import { useNavigate, useParams } from 'react-router-dom';
// import spinner_transferent from "./../../../assets/img/spinner_transferent.svg";
import RighSideLoader from '../../common/sidebar/RighSideLoader';
import LoaderImage from '../../../assets/img/loader_groups.gif';
import { WebSocketContext } from '../../Index';
import PreviewPopup from '../../common/PreviewPopup';
import DocFilesPreview from "../../common/DocFilesPreview";
import { useDispatch } from "react-redux";
import { setOpenModalPopup } from '../../../redux/actions';
import moment from 'moment';

const Index = (props) => {
  const { setGroupInfoSidebar, sideBarLoader, callMessageInfo } = props;
  const navigate = useNavigate()
  const { SelectedRoom, MyProfile, userLogin } = useSelector((state) => state.allReducers);
  const [showMoreFile, setshowMoreFile] = useState(false);
  const { roomId } = useParams();
  const [PreviewImageVideo, setPreviewImageVideo] = useState(false);
  const [CurrentVideoImage, setCurrentVideoImage] = useState("");
  const dispatch = useDispatch()
  const Messages = useSelector((state) => state.allReducers.MessageList[roomId]);
  const UserId = useSelector((state) => state.allReducers.userLogin.user_id);
  const Contacts = useSelector((state) => state.allReducers.Contacts);
  const { websocket } = useContext(WebSocketContext);
  const [ DocFilePopupOpen, setDocFilePopupOpen ] = useState(false);
  const [ selectDocsFile, setSelectDocsFile ] = useState({
      name: "",
      id: "",
      url: "",
  });
  let fileListArray = [];
  let linkListArray = [];
  // show only 4 files
  Messages?.forEach((list) => {
      var text = list.message;
      var pattern = /(\b(https?|ftp|file):\/\/[\-A-Z0-9+&@#\/%?=~_|!:,.;]*[\-A-Z09+&@#\/%=~_|])/img;
      

      if(list?.file !== undefined && list?.file !== null) {
        fileListArray.push(list.file);
      } 

      if(pattern.test(text) === true) {
        // console.log("text====>", text.match(httpRegexG)[0])
        // linkListArray.push(text.match(httpRegexG)[0]);
        linkListArray.push(list);
      }
  });
  
  const CallSelectdetails = () => {

    const param = {"transmit":"single", "url":"get_detail","request":{"to_id":SelectedRoom.id, "chat_type":SelectedRoom?.isGroups === undefined?"single":"group"}}
    wsSend_request(websocket, param);
  // dispatch(setMessages(ChatData));
  };
  const CallLeftGroups = (isgroups) =>{
    if(SelectedRoom?.isBroadCast === true){
      const payload = {
        Title:`Confirm`,
        Description:`Are you want to delete ${SelectedRoom?.group_name} broadcast?`,
        IsShow:true,
        Id:roomId,
        ActionType:{"transmit":"broadcast", "url":"delete_broadcast_group","request":{"broadcast_id":roomId}},
        callBackList:callBacktoHome,
        ButtonSuccess:"DELETE"
      }
      dispatch(setOpenModalPopup(payload));
    }else if(isgroups){
      // wsSend_request(websocket, {"transmit":"broadcast", "url":"left_group","request":{"group_id":roomId}})
      const payload = {
        Title:`Confirm`,
        Description:`Are you want to exit ${SelectedRoom?.group_name} group?`,
        IsShow:true,
        Id:roomId,
        ActionType:{"transmit":"broadcast", "url":"left_group","request":{"group_id":roomId}},
        callBackList:callBacktoHome,
        ButtonSuccess:"EXIT"
      }
      dispatch(setOpenModalPopup(payload));
    }else{
      // wsSend_request(websocket, {"transmit":"broadcast", "url":"block_user","request":{"is_block":SelectedRoom?.is_block?0:1, "to_id":roomId}})
      // CallSelectdetails()
        if(SelectedRoom?.is_block && SelectedRoom?.block_by === userLogin?.user_id){
          const payload = {
            Title:`Block ${SelectedRoom?.name||SelectedRoom?.group_name}`,
            Description:`Unblock ${SelectedRoom?.name||SelectedRoom?.group_name} to send a message`,
            IsShow:true,
            Id:roomId,
            ActionType:{"transmit":"broadcast", "url":"block_user","request":{"is_block":0, "to_id":roomId}},
            callBackList:CallSelectdetails,
            ButtonSuccess:"UNBLOCK"
          }
          dispatch(setOpenModalPopup(payload));
        }else if(!SelectedRoom?.is_block){
          const payload = {
            Title:`Block ${SelectedRoom?.name||SelectedRoom?.group_name}`,
            Description:`Block contacts cannot call or send you messages. This contact will not be notified?`,
            IsShow:true,
            Id:roomId,
            ActionType:{"transmit":"broadcast", "url":"block_user","request":{"is_block":1, "to_id":roomId}},
            callBackList:CallSelectdetails,
            ButtonSuccess:"BLOCK"
          }
          dispatch(setOpenModalPopup(payload));
        }      
    }
  }
  const callBacktoHome = () =>{
    navigate("../../")
  }
  // file preview popup open fucntion
  const VideoImagesShowFnt = (message) => {
      setPreviewImageVideo(!PreviewImageVideo);
      setCurrentVideoImage(message);
  }

  // docs file preview function
  const DocsFilePreviewFnt = (files) => {
      // console.log("files321======>",files);
      setDocFilePopupOpen(true);
      setSelectDocsFile({...selectDocsFile, file:files, name: files.name, id: files.id, url: files.url,});
  }
  let adminDetails = ""
  if(SelectedRoom?.isGroups!== undefined){
    const checkIn_contact = Contacts?.filter((item)=>SelectedRoom?.created_by === item?.id);
    const CheckGroup = SelectedRoom?.users?.filter((item)=>SelectedRoom?.created_by === item?.id);
    if(SelectedRoom?.created_by !== userLogin?.user_id){
      if(checkIn_contact?.length>0){
        adminDetails = checkIn_contact[0]?.name;
      }else if(CheckGroup?.length>0){
        adminDetails = CheckGroup[0]?.name;
      }else if(SelectedRoom?.createdUser !== undefined){
        adminDetails = SelectedRoom?.createdUser?.phone
      }
    }else{
      adminDetails = "You";
    }
  }
  return (
    <div className="groupInfoWrapper">
      {sideBarLoader &&(<img src={LoaderImage} className={"Rside_loader_new"} alt="loader" />)}
      {/* <RighSideLoader isShow={true} /> */}
      {/* header sidebar */}
      <Header 
        UserType={SelectedRoom?.isGroups?false:true}
        isBroadCast={SelectedRoom?.isBroadCast === true?true:false}
        close={setGroupInfoSidebar} 
        showMoreFile={showMoreFile}
        setshowMoreFile={setshowMoreFile}
      />
      {/* group and contact profile and details */}
      <ProfileDetails SelectedRoom={SelectedRoom}
        UserType={SelectedRoom?.isGroups?false:true} 
      />
      {/* {console.log("SelectedRoom?.mediaFiles", SelectedRoom?.mediaFiles)} */}
      {/* show all media sidebar */}
      <MediaSidebar 
          open={showMoreFile === true} 
          Messages={showMoreFile === true && Messages}
          fileListArray={SelectedRoom?.mediaFiles} 
          CurrentVideoImage={CurrentVideoImage}
          setPreviewImageVideo={setPreviewImageVideo}
          setCurrentVideoImage={setCurrentVideoImage}
          PreviewImageVideo={PreviewImageVideo}
          VideoImagesShowFnt={VideoImagesShowFnt}
          DocsFilePreviewFnt={DocsFilePreviewFnt}
          linkListArray={linkListArray}
      />
      {/* group info media */}
      <div className="ProfileDetailsrmation">
        <Scrollbars 
            renderTrackVertical={props => <div {...props} className="track-vertical"/>}
            renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
            renderView={props => <div {...props} className="view"/>}
            className="scrollararea"
            style={{
              minHeight: "calc(100vh - 291px)"
            }}
        >
          {SelectedRoom?.isGroups!==undefined && adminDetails!== ""  &&
          <div className="medialinksfilesWrapper pt-4 pb-2">
            <div className="medialinksfilesHeader">
              <h4>Created by {adminDetails}, {moment.utc(SelectedRoom?.created_at).format('DD/MM/YY')}</h4>
            </div>
          </div>}
          {/* {console.log("SelectedRoom?.mediaFiles", SelectedRoom?.mediaFiles)} */}
            <GroupMedia 
              fileListArray={SelectedRoom?.mediaFiles} 
              showMoreFile={showMoreFile}
              setshowMoreFile={setshowMoreFile}
              Messages={Messages}
              VideoImagesShowFnt={VideoImagesShowFnt}
              DocsFilePreviewFnt={DocsFilePreviewFnt}
              UserId={UserId}
              Contacts={Contacts}
              setPreviewImageVideo={setPreviewImageVideo}
              linkListArray={linkListArray}
            />
            <GroupInfoAddMember SelectedRoom={SelectedRoom} MyProfile = {userLogin}/>
        </Scrollbars>
        {SelectedRoom?.isBroadCast === undefined ?
        <div className='createbuttonsbtm'>
          {userLogin?.user_id !== roomId && 
            <Button
              onClick={()=>
                CallLeftGroups(SelectedRoom?.isGroups)
              }
              disabled={SelectedRoom?.group_type === undefined?false : true}
            >{SelectedRoom?.isGroups ? "Exit Group" : 
            SelectedRoom?.is_block ?"Unblock Contact":"Block Contact"
            }</Button>
          }
        </div>
        :<div className='createbuttonsbtm'>
        {userLogin?.user_id !== roomId && 
          <Button
            onClick={()=>CallLeftGroups(SelectedRoom?.isGroups)}
          >Delete Broadcast</Button>
        }
      </div>}
      </div>
      {/* image and video preview modal */}
      {PreviewImageVideo === true && (<PreviewPopup callMessageInfo={callMessageInfo} UserId={UserId} Contacts={Contacts} setPreviewImageVideo={setPreviewImageVideo} CurrentVideoImage={CurrentVideoImage} Messages={Messages} />)}
      {/* doc file preview  */}
      {DocFilePopupOpen === true && (<DocFilesPreview callMessageInfo={callMessageInfo} selectDocsFile={selectDocsFile} setSelectDocsFile={setSelectDocsFile} setDocFilePopupOpen={setDocFilePopupOpen} />)}
    </div>
  )
}

export default Index;