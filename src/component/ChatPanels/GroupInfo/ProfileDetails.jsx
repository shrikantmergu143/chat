/* eslint-disable */
import React from 'react';
import { useContext } from 'react';
import { useState, useEffect } from 'react';
import { Image } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { UploadFileAPI } from '../../../Api/UploadFile';
import wsSend_request from '../../../Api/ws/ws_request';
import UserPics from '../../../assets/img/profile/dummyimage.png';
import dummygroup from "./../../../assets/img/profile/dummygroup.png";
import dummybroadcastdarkimage from "./../../../assets/img/profile/Broadcast_dark.png"
import dummybroadcastimage from "../../../assets/img/Broadcast_light.png";
import system from "../../../assets/img/profile/system.svg";
import { image_extension } from '../../common/sidebar/CommonAvatarUpload';
import { WebSocketContext } from '../../Index';
import edit_icon from "./../../../assets/img/profile/edit_icon.svg";
import Tooltip from '../../common/tooltip';
import Avatar from '../../common/Avatar';
import ProfileAuthPreview from '../ProfileAuthPreview';
import CommonContentEditable from '../../common/CommonContentEditable';

export function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(1|)?(\d{4})(\d{2})(\d{4})$/);
    if (match) {
      var intlCode = (match[1] ? '+1 ' : '');
      return [intlCode, '(', match[2], ') ', match[3], ' ', match[4]].join('');
    }
    return null;
}
const ProfileDetails = (props) => {
    const { SelectedRoom, UserType } = props;
    const [edit_state, setEdit_state] = useState(false);
    const [groupname, setGroupName] = useState("")
    const { websocket } = useContext(WebSocketContext)
    const device_id = localStorage?.getItem("device_id");
    const access_token = useSelector((state) => state.allReducers.access_token);
    const [ istextEmoji, setIstextEmoji ] = useState(false);
    const [ CurrentValue, setCurrentValue ] = useState("");
    const ThemeCheck = useSelector((state)=>state?.allReducers?.themeDarkLight);
    
    const callEditGroupsInput = () =>{
        setEdit_state(true);
        var MessageEdit = SelectedRoom?.group_name;
        setTimeout(() => {
            document.getElementById("GroupEditTextField").innerHTML = MessageEdit;
            // cursor focus contenteditable div
            const el = document.getElementById('GroupEditTextField');
            const selection = window.getSelection();
            const range = document.createRange();
            selection.removeAllRanges();
            range.selectNodeContents(el);
            range.collapse(false);
            selection.addRange(range);
            el.focus();
        }, 200);
    }

    const updateGroupDetails = (group_key, group_value) =>{
        if(SelectedRoom?.isBroadCast === undefined){
            const param = {
                "transmit":"broadcast",
                "url":"update_group",
                "request":{
                    "group_id":SelectedRoom?.id,
                    "group_key":group_key,
                    "group_value":group_value,
                    "device_id":device_id
                }
            }
            wsSend_request(websocket, param)
        }else if(SelectedRoom?.isBroadCast === true){
            const param = {
                "transmit":"broadcast",
                "url":"update_broadcast_group",
                "request":{
                    "broadcast_id":SelectedRoom?.id,
                    "group_key":group_key,
                    "group_value":group_value,
                    "device_id":device_id
                }
            }
            wsSend_request(websocket, param)
        }
    }
    const callUpdateGroupName =async (e) =>{
        var currentmsghtml = document.getElementById("GroupEditTextField")?.innerHTML;
        var currentmsgtext = document.getElementById("GroupEditTextField")?.innerText;
        var currentmsghtmls = currentmsgtext !== ""  && currentmsghtml.replace(/<br>/g, '\n').trim();
        var currentmsgtexts = currentmsgtext.trim();

        // e.preventDefault();
        if(currentmsghtml !== SelectedRoom?.group_name){
            updateGroupDetails("name", currentmsgtext)
        }
        setEdit_state(false)
        setGroupName("")
    }
    
    const UploadAvatarImage =async (e) => {
        if(e.target.files?.length>0){
            if(image_extension.includes(e.target.files[0]?.type)){
                // console.log("e.target.files",e.target.files)
                const responce = await UploadFileAPI(access_token, e.target.files[0]);
                if(responce?.data){
                    updateGroupDetails("avatar",responce?.data?.id);
                    e.target.files = ""
                }
            }else{
                // console.log("invaild image type",e.target.files,  e.target.files[0]?.name?.substr(e.target.files[0]?.name.lastIndexOf('.') + 1))
            }
        }
    }

    const UpdateOnWorkFunct = (e) => {
        if(e?.target?.innerText.length === 25 && e.keyCode != 8) {
            e.preventDefault();
        }

        const keyCode = e.which || e.keyCode;
        if(CurrentValue !== "" && SelectedRoom?.group_name !== CurrentValue) {
            if (keyCode === 13) {
                callUpdateGroupName();
            }
        }
    }

    return (
        <div className="ProfileDetailsrmation">
            <div className="AvatarUploadImageWrps">
            
                <React.Fragment>
                    {/* // <Image onError={(e)=>e.target.src = UserPics} src={UserType?SelectedRoom?.avatar_url:SelectedRoom?.avatar?.url} className="profileinfoImage" alt="details" />  */}
                    {(((SelectedRoom?.admin_ids === undefined ||SelectedRoom?.admin_ids === null) && (SelectedRoom?.admin_id === undefined ||SelectedRoom?.admin_id === null)) &&
                        // <Avatar
                        //     profile={SelectedRoom?.avatar_url} 
                        //     preview={SelectedRoom?.avatar_url}
                        //     title={SelectedRoom?.avatar?.url}
                        //     className="profileinfoImage"
                        //     alt="details" 
                        // />
                        <ProfileAuthPreview
                            url={SelectedRoom.group_type !== undefined ? SelectedRoom?.group_avatar : SelectedRoom?.view_thumbnail_url}
                            className={"profileinfoImage"}
                            avatar={SelectedRoom}
                            defultIcon={UserPics}
                        />
                    )}
                    {(SelectedRoom?.admin_ids !== undefined || SelectedRoom?.group_type) &&(
                        <ProfileAuthPreview
                            url={SelectedRoom.group_type !== undefined ? SelectedRoom?.group_avatar : SelectedRoom?.avatar?.view_thumbnail_url}
                            className={"profileinfoImage"}
                            avatar={SelectedRoom?.avatar}
                            defultIcon={ SelectedRoom?.group_type?system: dummygroup}
                            outerDiv={true}
                        />
                    )}
                    {/* <Avatar
                        profile={SelectedRoom?.avatar_url} 
                        preview={SelectedRoom?.avatar_url}
                        title={SelectedRoom?.avatar?.url}
                        className="profileinfoImage"
                        alt="details" 
                    /> */}
                </React.Fragment>

               {SelectedRoom?.broadcast_name&& 
                    <>
                    {ThemeCheck === "light" ? <Avatar 
                        profile={SelectedRoom?.isBroadCast === undefined ? UserPics : dummybroadcastimage} 
                        className="profileinfoImage" 
                        preview={UserPics}
                        title={UserPics} 
                        /> : <Avatar 
                        profile={SelectedRoom?.isBroadCast === undefined ? UserPics : dummybroadcastdarkimage} 
                        className="profileinfoImage" 
                        preview={UserPics}
                        title={UserPics} 
                    />}
                    </>}

                {SelectedRoom?.isBroadCast === undefined && SelectedRoom?.isuserAdmin && <label className="uploadbtn">
                    <input 
                        type="file" 
                        id="uploadimage" 
                        // accept=".jpg, .jpeg, .png, .gif, .webp, .PNG, .svg"
                        accept=".jpg, .jpeg, .png"
                        onChange={(e) => UploadAvatarImage(e)}
                    />
                </label>}
            </div>
            
            <div className="ProfileDetailsInfo groupsprofileinfo">
                {!UserType?
                  edit_state ?
                  <React.Fragment>
                    <div className="customTextField" >
                    {/* onSubmit={callUpdateGroupName} */}
                        <CommonContentEditable UpdateOnWorkFunct={UpdateOnWorkFunct} setCurrentValue={setCurrentValue} title={"editgroups"} setIstextEmoji={setIstextEmoji} id={"GroupEditTextField"} />
                        <div className="editprfbtn">
                            {(CurrentValue !== "" && SelectedRoom?.group_name !== CurrentValue) && (<Tooltip content="Save" direction="top">
                                <div className='TextFieldsaveIcon' onClick={callUpdateGroupName}></div>
                            </Tooltip>)}
                            <Tooltip content="Cancel" direction="top">
                                <div className='TextFieldcloseIcon' onClick={() => setEdit_state(false)}></div>
                            </Tooltip>
                        </div>
                    </div>
                  </React.Fragment>
                  :
                    <h4 >
                        {SelectedRoom?.admin_ids && <div className="groupinfoNames" dangerouslySetInnerHTML={{__html: SelectedRoom?.group_name}}></div>}
                        {SelectedRoom?.admin_id && <div className="groupinfoNames" dangerouslySetInnerHTML={{__html: SelectedRoom?.broadcast_name}}></div>}
                        {SelectedRoom?.isuserAdmin &&
                            <img className='Edit_icon_label' onClick={()=>callEditGroupsInput()} alt={edit_icon} src={edit_icon} />
                        } 
                    </h4>
                    :
                    <h4>{SelectedRoom?.name}</h4>
                    
                }
                <div className='profilespans'>
                    {SelectedRoom?.isBroadCast?
                        "Broadcast"
                    :
                     !UserType? "Group" : SelectedRoom?.phone_code!== undefined &&`+${SelectedRoom?.phone_code} ${formatPhoneNumber(SelectedRoom?.phone)}`
                    }
                </div>
            </div>
        </div>
    )
}

export default ProfileDetails;