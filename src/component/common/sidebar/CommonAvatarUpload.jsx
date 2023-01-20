/* eslint-disable */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import AvatarDummyImage from "../../../assets/img/profile/dummygroup.png";
import AvatarBroadcastDummyImage from "../../../assets/img/profile/broadcastdummy.svg";
import Image from 'react-bootstrap/Image';
import { UploadFileAPI } from "../../../Api/UploadFile";
export const image_extension = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp", "image/svg"];
export const video_extension = ["video/webm", "video/mp4", "video/quicktime", "video/3gp", "video/3gpp"];
export const Audio_extension = ["audio/wav", "audio/ogg", "audio/mpeg", "audio/mp3", "audio/vnd.dlna.adts", "audio/x-m4a"];
import ProfileAuthPreview from "../../ChatPanels/ProfileAuthPreview";
import CommonContentEditable from "../CommonContentEditable";

const CommonAvatarUpload = (props) => {
    const { setGroupTitle, grouptitle, setIstextEmoji, imageUploads, imageUploadsUrl, setImageUploads, setImageUploadsUrl,title,picker, setpicker, onEmojiClick } = props;
    const access_token = useSelector((state) => state.allReducers.access_token);
    const dispatch = useDispatch();

    // Profile upload function
    const UploadAvatarImage =async (e) => {
        if(e.target.files?.length>0){
            if(image_extension.includes(e.target.files[0]?.type)){
                // console.log("e.target.files",e.target.files)
                const responce = await UploadFileAPI(access_token, e.target.files[0]);
                if(responce?.data){
                    console.log(responce?.data)
                    setImageUploadsUrl(responce?.data)
                    setImageUploads(responce?.data?.view_thumbnail_url)
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
    }

    return(
        <div className="CommonAvatarUploadandText">
            <div className="AvatarUploadImageWrps">
                {imageUploads !== undefined && imageUploads !== "" ?
                   <ProfileAuthPreview 
                        url={imageUploads}
                        className={"groupAvatarImage"}
                        click={false}
                        outerDiv={true}
                        defultIcon={AvatarDummyImage}
                    />
                : (title === "New Group" ?
                <Image src={AvatarDummyImage} className="groupAvatarImage" alt="upload image" /> :
                <Image src={AvatarBroadcastDummyImage} className="groupAvatarImage" alt="upload image" />
                )}
                
                {title !== "New Broadcast" && (<label className="uploadbtn">
                    <input 
                        type="file" 
                        id="uploadimage" 
                        // accept=".jpg, .jpeg, .png, .gif, .webp, .PNG, .svg"
                        accept=".jpg, .jpeg, .png"
                        onChange={(e) => UploadAvatarImage(e)}
                    />
                </label>)}
            </div>
            <CommonContentEditable UpdateOnWorkFunct={UpdateOnWorkFunct} title={title} setIstextEmoji={setIstextEmoji} id={"GroupEditableTextField"} setGroupTitle={setGroupTitle} />
        </div>
    )
}

export default CommonAvatarUpload;