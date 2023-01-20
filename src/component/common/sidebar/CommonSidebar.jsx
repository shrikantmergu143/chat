import React, {useState} from "react";
import CommonHeader from "./CommonHeader";
import ParticipantsList from "./ParticipantsList";

const CommonSidebar = (props) => {
    const { open, close, title, selectMember, setSelectMember, type} = props;
    const [ grouptitle, setGroupTitle ] = useState("");
    const [ imageUploads, setImageUploads ] = useState("");
    const [ imageUploadsUrl, setImageUploadsUrl ] = useState();
    const [ picker, setpicker ] = useState(false);
    const [ istextEmoji, setIstextEmoji ] = useState(false);

    // emoji add on edit profile
    const onEmojiClick = (event, emojiObject) => {
        setGroupTitle(grouptitle + emojiObject?.emoji);
    }
    // console.log("imageUploads", imageUploads)
    return(
        <div className={open === true ? "sidebarWrapper open" : "sidebarWrapper"}>
            <CommonHeader 
                close={close}
                title={title === "New Group" ? "New Group" : "New Broadcast"}
                grouptitle={grouptitle}
                setIstextEmoji={setIstextEmoji}
                setGroupTitle={setGroupTitle}
                onEmojiClick={onEmojiClick}
                picker={picker}
                setpicker={setpicker}
                imageUploads={imageUploads}
                setImageUploads={setImageUploads}
                setImageUploadsUrl={setImageUploadsUrl}
            />
            <ParticipantsList 
                Title={title === "New Group" ? "New Group" : "New Broadcast"}
                selectMember={selectMember}
                setSelectMember={setSelectMember}
                grouptitle={grouptitle}
                imageUploads={imageUploads}
                type={type}
                imageUploadsUrl={imageUploadsUrl}
                istextEmoji={istextEmoji}
            />
        </div>
    )
}

export default CommonSidebar;