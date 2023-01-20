import React from "react";
import Image from "react-bootstrap/Image";
import CommonAvatarUpload from "./CommonAvatarUpload";
import closeSidebarImg from "../../../assets/img/closeSidebar.png"; 

const CommonHeader = (props) => {
    const { close, title, setIstextEmoji, setGroupTitle, grouptitle, imageUploads, setImageUploads, setImageUploadsUrl, onEmojiClick, picker, setpicker } = props;

    const CloseSidebar = () => {
        close(false);
        setImageUploads("");

        // clear groups clear
        let cmntMsg = document.getElementById('GroupEditableTextField');
        cmntMsg.innerHTML = null;
        setTimeout(() => {
            var child = cmntMsg.lastElementChild;
            while (child) {
                cmntMsg.removeChild(child);
                child = cmntMsg.lastElementChild;
            }
        }, 100);
    }
    
    return(
        <div className="commonHeader">
            <div className="backbtntitle">
                <Image 
                    src={closeSidebarImg} 
                    className="closesidebar" 
                    onClick={CloseSidebar} 
                    alt="close" 
                />
                <h4>{title}</h4>
            </div>
            <CommonAvatarUpload 
                title={title}
                setGroupTitle={setGroupTitle} 
                setIstextEmoji={setIstextEmoji}
                grouptitle={grouptitle} 
                imageUploads={imageUploads} 
                setImageUploads={setImageUploads} 
                setImageUploadsUrl={setImageUploadsUrl}
                onEmojiClick={onEmojiClick}
                picker={picker}
                setpicker={setpicker}
            />
        </div>
    )
}

export default CommonHeader;