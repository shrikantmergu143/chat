/* eslint-disable */
import React, { useContext, useState, useEffect } from "react";
import Header from "./Header";
import EditProfile from "./EditProfile";
import { useDispatch, useSelector } from "react-redux";
import { editMyProfile, mainTabChange, CallLogoutUser, ToasterMessageShow, setOpenModalPopup } from "../../../redux/actions";
import { baseURL } from "../../../constant/url";
import { WebSocketContext } from "../../Index";
import wsSend_request from "../../../Api/ws/ws_request";
import DeactiveLoginAPI from "../../../Api/DeactiveLogin";
import { getExtension } from "../../ChatPanels/SearchChat/MessagesPanel";
import { SubscribeTokenToTopic } from '../../../firebase/firebaseInit';

const Index = (props) => {
    // const { ProfileData } = props;
    // const ProfileData = useSelector((state) => state.allReducers.MyProfile);
    const { access_token, MyProfile, registration_ids, registration_id, Rooms } = useSelector((state) => state.allReducers);
    const users = useSelector((state) => state.allReducers.userLogin);
    const {websocket} = useContext(WebSocketContext)
    const [ profileEditDetails, setProfileEditDetails ] = useState({
        id: "",
        name: "",
        view_file_url: "",
        profile_url: "",
        avatar:"",
        view_file_url:"",
        view_thumbnail_url:""
    })
    const dispatch = useDispatch();
    const [ picker, setpicker ] = useState(false);

    useEffect(() => {
        setProfileEditDetails({
            ...profileEditDetails,
            ...MyProfile,
            id: MyProfile?.id,
            name: MyProfile?.name,
            view_file_url: MyProfile?.view_file_url,
            profile_url: "",
        })
    }, [MyProfile]);

    // Profile upload function
    const UploadAvatarImage = (e) => {
        if(e.target.files?.length > 0){
            const file = e.target.files[0];
            if(getExtension(file?.name) === "jpg" || getExtension(file?.name) === "png" || getExtension(file?.name) ===  "jpeg"){
                const reader = new FileReader();
                reader.onload = () => {
                    if(reader.readyState === 2) {
                        var formData = new FormData();
                        formData.append("avatar",file);
                        if(profileEditDetails.name !== MyProfile?.name){
                            formData.append('name', profileEditDetails.name);
                        }else{
                            formData.append('name', MyProfile.name);
                        }
                        // console.log("access_token", access_token);
                        window.axios.post(`${process.env.REACT_APP_BASE_URL}/upload/profile`, formData, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'Authorization':`Bearer ${access_token}`
                            }}
                        ).then(function (result) {
                            dispatch(editMyProfile(result.data));
        
                            dispatch(ToasterMessageShow({
                                msg: "Profile Updated successfully",
                                status: "success",
                                show: true,
                            }));
                            const param = {"transmit":"broadcast", "url":"user_update"}
                            wsSend_request(websocket, param);
                            
                        });
                        setProfileEditDetails({
                            ...profileEditDetails, 
                            view_file_url: reader && reader?.result,
                            profile_url: file,
                        })
                    }
                    
                }
                reader.readAsDataURL(file);
            }else{
                dispatch(ToasterMessageShow({
                    msg: "Please upload valid image",
                    status: "error",
                    show: true,
                }));
            }
            e.target.value = "";
        }
    }

    // on enter click edit profile
    const onKeySubtmit = (e) => {
        const code = e.keycode || e.which;
        if(code === 13) {
            SaveProfile();
        }
    }

    // save profile fucntion
    const SaveProfile = () => {
        if(profileEditDetails.name !== "") {
            var formData = new FormData();
            if(profileEditDetails.profile_url){
                formData.append("avatar", profileEditDetails.profile_url);
            }
            if(profileEditDetails.name !== MyProfile?.view_file_url){
                formData.append('name', profileEditDetails.name);
            }
            // console.log("access_token", access_token);
            window.axios.post(`${process.env.REACT_APP_BASE_URL}/upload/profile`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization':`Bearer ${access_token}`
                }}).then(function (result) {
                    dispatch(editMyProfile(result.data));
                    // toaster message show
                    dispatch(ToasterMessageShow({
                        msg: "Profile Updated successfully",
                        status: "success",
                        show: true,
                    }))
                    
                    // Profile Updated successfully
                    dispatch(mainTabChange("Chat"));
                });
        } else {
            // toaster message show
            dispatch(ToasterMessageShow({
                msg: "Your Name can't be empty",
                status: "error",
                show: true,
            }))
        }
    }
    const CallLogOut = async () =>{
        const payload = {
            Title:`Logout`,
            Description:`Are you sure you want to log out?`,
            IsShow:true,
            Id:"",
            ActionType: "",
            callBackList:LogoutUserAPI,
            ButtonSuccess:"LOG OUT"
        }
        dispatch(setOpenModalPopup(payload));
    }
    const LogoutUserAPI = async () =>{
        // console.log("users", users?.token_id);
        if(users?.token_id){
            Rooms?.map(async(item)=>{
                if(item?.group_type){
                    if(registration_ids[item?.id]){
                    await SubscribeTokenToTopic(registration_id, item?.id, "DELETE");
                    }
                }
            })
            await DeactiveLoginAPI(access_token, users?.token_id);
            // const param = {"transmit":"single", "url":"user_logout"}
            // wsSend_request(websocket, param);
            dispatch(CallLogoutUser());
            setTimeout(()=>window.open(process.env.REACT_APP_BASE_URL+`/user/del_login`),1000);
        }
    }

    // emoji add on edit profile
    const onEmojiClick = (event, emojiObject) => {
        setProfileEditDetails({
            ...profileEditDetails, 
            profile_url: profileEditDetails.profile_url,
            name: document.getElementById("profiletextfield").value + emojiObject?.emoji,
        })
    }

    return(
        <div className="editprofileWrapper">
            {/* edit profile header start here */}
            <Header CallLogOut={CallLogOut}/>
            {/* edit profile start here */}
            <EditProfile 
                UploadAvatarImage={UploadAvatarImage}
                ProfileData={MyProfile} 
                profileEditDetails={profileEditDetails} 
                setProfileEditDetails={setProfileEditDetails}
                SaveProfile={SaveProfile}
                picker={picker}
                setpicker={setpicker}
                onEmojiClick={onEmojiClick}
                onKeySubtmit={onKeySubtmit}
            />
        </div>
    )
}

export default Index;