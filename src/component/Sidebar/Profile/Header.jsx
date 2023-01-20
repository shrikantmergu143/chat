import React from "react";
import { Image } from "react-bootstrap";
import Logout from "../../../assets/img/Logout.svg"; 
import Tooltip from "./../../common/tooltip";
import DummyImage from "../../../assets/img/profile/dummyimage.png"
const Header = (props) => {
    
    return(
        <div className="ProfileHeader">
            <div className="backbtntitle">
                <h4>Edit Profile</h4>
                <Tooltip content="Logout" direction="left">
                    <Image  onError={(e)=>e.target.src=DummyImage} src={Logout} onClick={()=>props?.CallLogOut()} className="logout" alt="logout" />
                </Tooltip>
            </div>
        </div>
    )
}

export default Header;