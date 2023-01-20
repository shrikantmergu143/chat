import React from "react";
import { Image } from "react-bootstrap";
import AccessImage from "../../assets/img/accessCamera.png"

const CameraAccessPopup = (props) => {
    const { setOpenCamera } = props;

    return(<div className="AllowCammeraWrapper">
        <div className="AllowCammeras">
            <h4>Allow Camera</h4>
            <p>To take photos, Nationwide needs access to your computer's camera. Click <Image src={AccessImage} alt="acces image" />  in the URL bar and choose “Always allow web.nationwide.com to access your camera.” </p>
            <button onClick={() => setOpenCamera(false)}>OK, GOT IT</button>
        </div>
    </div>)
}

export default CameraAccessPopup;