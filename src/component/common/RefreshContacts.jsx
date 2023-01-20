import React from "react";
import spinner_transferent from "../../assets/img/spinner_transferent.svg";
import { Image } from 'react-bootstrap';

const RefreshContacts = () => {
    return(
        <div className="refreshContactWraps">
            <div className="refreshContactBlogs">
                <Image src={spinner_transferent} alt="refresh contacts" />
                <h4>Refresh Contacts</h4>
            </div>
        </div>
    )
}

export default RefreshContacts;