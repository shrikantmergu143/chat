import React, { useState } from "react";
import Image from "react-bootstrap/Image";
import DummyImage from '../../assets/img/profile/dummyimage.png';
import PreviewProfile from "./PreviewProfile";

function Avatar(props) {
    const { profile, title , preview} = props;
    const [PreviewImageVideo, setPreviewImageVideo] = useState(false);
    const [CurrentVideoImage, setCurrentVideoImage] = useState({
        url:profile,
        name:profile,
        id:profile
    });
    const VideoImagesShowFnt = (e) => {
        e.stopPropagation();
        e.preventDefault()
        if(profile !== undefined && profile !== null){
            setCurrentVideoImage({
                url:preview?preview:profile,
                name:profile,
                id:profile
            });
            setTimeout(()=>setPreviewImageVideo(!PreviewImageVideo), 100)
        }
    }
    return props?.className?
    (
        <React.Fragment>
         {(profile !== undefined && profile !== null) ? 
                <Image onClick={VideoImagesShowFnt} src={profile} className={props?.className?props?.className:"avatarImage"} onError={(e)=>e.target.src = DummyImage} alt="profile"/> :
                <Image onClick={VideoImagesShowFnt} src={DummyImage} className={props?.className?props?.className:"avatarImage"} alt="profile"/>
            }
        {PreviewImageVideo === true && (<PreviewProfile setPreviewImageVideo={setPreviewImageVideo} CurrentVideoImage={CurrentVideoImage} />)}
        </React.Fragment>
    ):
    (
        <div className="AvatarCustomSet" onClick={VideoImagesShowFnt}
        >
            {(profile !== undefined && profile !== null) ? 
                <Image src={profile} className={props?.className?props?.className:"avatarImage"} onError={(e)=>e.target.src = DummyImage} alt="profile"/> :
                <Image src={DummyImage} className={props?.className?props?.className:"avatarImage"} alt="profile"/>
            }
        {PreviewImageVideo === true && (<PreviewProfile setPreviewImageVideo={setPreviewImageVideo} CurrentVideoImage={CurrentVideoImage} />)}

        </div>
    )
} 

export default Avatar;