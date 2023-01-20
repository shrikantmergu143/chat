/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Button, Image } from "react-bootstrap";
import AvatarDummyImage from "../../../assets/img/profile/dummyimage.png";
import Avatar from "../../common/Avatar";
import ProfileAuthPreview from "../../ChatPanels/ProfileAuthPreview";
import EmojiPicker from "../../common/emojiCustom/EmojiPicker";
import DarkUserIcon from "../../../assets/img/profile/user_dark.png";
import { useSelector } from 'react-redux';

const EditProfile = (props) => {
    const { profileEditDetails, setProfileEditDetails, UploadAvatarImage, SaveProfile, picker, setpicker, onEmojiClick, onKeySubtmit } = props;
    const [ IsEditProfile, setIsEditProfile ] = useState(false);
    const [ istextEmoji, setIstextEmoji ] = useState(false);
    const ThemeCheck = useSelector((state)=>state?.allReducers?.themeDarkLight);
    const [ DefaultImageSet, setDefaultImageSet ] = useState(AvatarDummyImage);

    useEffect(() => {
        if(ThemeCheck === "dark") {
            setDefaultImageSet(DarkUserIcon);
        } else {
            setDefaultImageSet(AvatarDummyImage);
        }
    }, [ ThemeCheck ]);

    const EditProfileFut = () => {
        setIsEditProfile(!IsEditProfile);
        setTimeout(() => {
            document.getElementById("profiletextfield").innerHTML = profileEditDetails.name;
            // cursor focus contenteditable div
            const el = document.getElementById('profiletextfield');
            const selection = window.getSelection();
            const range = document.createRange();
            selection.removeAllRanges();
            range.selectNodeContents(el);
            range.collapse(false);
            selection.addRange(range);
            el.focus();
        }, 200);
    }

    // shift enter disable
    useEffect(() => {
        var editprofile = document.getElementById("profiletextfield");
        if(editprofile) {
            editprofile.addEventListener('keypress', (evt) => {
                if (evt.which === 13) {
                    evt.preventDefault();
                }
            });
        }
    }, []);

    const UpdateOnWorkFunct = (e) => {
        if(e?.target?.innerText.length === 25 && e.keyCode != 8) {
            e.preventDefault();
        }
    }

    useEffect(() => {
        var currentmsghtml = document.getElementById("profiletextfield")?.innerHTML;
        setProfileEditDetails({...profileEditDetails, name: currentmsghtml})
    }, [ picker ]);
    
    return(
        <div className="CommonAvatarUploadandText profileedite_wrapper">
            <div className="AvatarUploadImageWrps">
                {profileEditDetails?.view_thumbnail_url !== undefined && profileEditDetails?.view_thumbnail_url !== "" && profileEditDetails?.view_thumbnail_url !== null ?
                <ProfileAuthPreview
                    url={profileEditDetails?.view_thumbnail_url}
                    className={"groupAvatarImage"}
                    avatar={{
                        ...profileEditDetails,
                        view_file_url:profileEditDetails?.view_thumbnail_url
                    }}
                    defultIcon={DefaultImageSet}
                    outerDiv={true}
                />
                : 
                // <Image src={AvatarDummyImage} className="groupAvatarImage" alt="upload image" />
                <Avatar
                    profile={DefaultImageSet} 
                    preview={DefaultImageSet}
                    title={DefaultImageSet}
                    className="groupAvatarImage"
                    alt="details" 
                />
                }
                
                <label className="uploadbtn">
                    <input 
                        type="file" 
                        id="uploadimage" 
                        // accept=".jpg, .jpeg, .png, .gif, .webp, .PNG, .svg"
                        accept=".jpg, .jpeg, .png"
                        onChange={(e) => UploadAvatarImage(e)}
                    />
                </label>
            </div>
            <div className={profileEditDetails.name === "" ? "customTextField error" : "customTextField"}>
                {IsEditProfile === true ? (<React.Fragment>
                    <span className="fielsNames">Your Name</span>
                    <div 
                        contentEditable="true"
                        id="profiletextfield"
                        className="commonCustomTextfield"
                        onInput={(e) => setProfileEditDetails({...profileEditDetails, name: e.target.innerHTML})}
                        onKeyPress={(e) => UpdateOnWorkFunct(e)}
                        placeholder=""
                        data-text=""
                    />
                    <div className="editprfbtn">
                        <div className="emojitextfieldicon" onClick={() => setpicker(!picker)}></div>
                    </div>
                </React.Fragment>) : (
                <React.Fragment>
                    <span className="fielsNames">Your Name</span>
                    <h4>{profileEditDetails?.name}</h4>
                    <div className="editprfbtn">
                        <div className="TextFieldEditIcon" onClick={() => EditProfileFut()}></div>
                    </div>
                </React.Fragment>)}
                
                {picker === true && (<div className="emojiWrapper" ><EmojiPicker setpicker={setpicker} setIstextEmoji={setIstextEmoji} id={"profiletextfield"} /></div>)}
            </div>

            {(profileEditDetails.name !== "" && IsEditProfile === true) && (<div className="buttoneditprofile">
                <Button onClick={() => SaveProfile()}>Save</Button>
            </div>)}
        </div>
    )
}

export default EditProfile;