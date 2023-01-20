/* eslint-disable */
import React from "react";
import Avatar from "./Avatar";
import Slider from "react-slick";
import CloseIcon from "../../assets/img/closeSmall.png";
import dummyuser from "../../assets/img/profile/dummyimage.png"
import Image from "react-bootstrap/Image";
import ProfileAuthPreview from "../ChatPanels/ProfileAuthPreview";

const AvatarGroupList = (props) => {
    const { selectMember, setSelectMember } = props;
    var settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };

    function SampleNextArrow(props) {
        const { className, onClick } = props;
        return (
          <div
            className={className}
            onClick={onClick}
          />
        );
      }
      
      function SamplePrevArrow(props) {
        const { className, onClick } = props;
        return (
          <div
            className={className}
            onClick={onClick}
          />
        );
      }

    const RemoveUserFn = (avatar) => {
        // console.log("avatar", avatar)
        const uncheckedid = document.querySelector("#userid" + avatar?.id);
        uncheckedid.checked = false;
        let selectMembervarnew = selectMember.filter((elm) => {
            if(elm?.id !== avatar?.id) {
                return elm;
            }
        })
        setSelectMember(selectMembervarnew);
    }

    return(
        <div className="avatarGrouplistwrapper">
            <Slider {...settings}>
                {selectMember?.map((avatar, index) => 
                    <div className="groupavatarwRPS" key={index}>
                        <ProfileAuthPreview 
                          url={avatar?.view_thumbnail_url}
                          className={"avatarImage"}
                          avatar={avatar?.avatar}
                          defultIcon={dummyuser}
                        />
                        <Image src={CloseIcon} onClick={() => RemoveUserFn(avatar)} className="closebtn" alt="close"/>
                        <h4 className="grpavatarnams">{avatar?.name}</h4>
                    </div>
                )}
            </Slider>
        </div>
    )
}

export default AvatarGroupList;