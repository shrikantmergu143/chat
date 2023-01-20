import React from "react";
import { Image } from "react-bootstrap";
import CloseButton from "../../../assets/img/close-sidebar.svg";
import closeSidebarImg from "../../../assets/img/closeSidebar.png";

const Header = (props) => {
    const { UserType,isBroadCast, close, showMoreFile, setshowMoreFile } = props;

    return(<div className="groupInfoSidebarHeader"> 
            {showMoreFile !== true ? <Image src={CloseButton} className="sidebarclosebtn" onClick={() => close(false)} alt="close" /> :
            <Image src={closeSidebarImg} className="sidebarclosebtn" onClick={() => setshowMoreFile(false)} alt="close" />}
            {isBroadCast === true ? <h4>Broadcast Info</h4>:<h4>{UserType? "Contact Info" : "Group Info"}</h4>}
    </div>)
}

export default Header;