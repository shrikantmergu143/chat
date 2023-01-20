import React from "react";
import { Image } from "react-bootstrap";
import CloseButton from "../../../assets/img/close-sidebar.svg";
import closeSidebarImg from "../../../assets/img/closeSidebar.png";

const Header = (props) => {
    const { UserType,isBroadCast, close, showMoreFile, setshowMoreFile, setMessagesInfoSidebar, setGroupInfoSidebar } = props;
    const showInfoGroup = () => {
        setMessagesInfoSidebar({
            show:false,
            Messages:[]
        });
      }
  

    return(<div className="groupInfoSidebarHeader"> 
            <Image src={CloseButton} className="sidebarclosebtn" onClick={() => setMessagesInfoSidebar(false)} alt="close" />
            <h4>Message Info</h4>
    </div>)
}

export default Header;