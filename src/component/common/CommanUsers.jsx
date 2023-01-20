import moment from 'moment';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import ProfileAuthPreview from '../ChatPanels/ProfileAuthPreview';
import dummyuser from "./../../assets/img/profile/dummyimage.png"

export default function CommanUsers(props) {
  const UserDetails = useSelector((state)=>state?.allReducers?.UserDetails);
  const {userLogin, MyProfile} = useSelector((state)=>state?.allReducers);
  const Users = userLogin?.user_id === props?.to_id ? {...MyProfile, name:"You"} : UserDetails[props?.to_id];

  if(!Users){
    return <div/>;
  }else{
      return (
        <div className='user_profile_popup'>
          <ProfileAuthPreview
            url={Users?.view_thumbnail_url}
            className={"avatarImage"}
            avatar={Users}
            defultIcon={dummyuser}
            click={false}
            outerDiv={true}
          />
          <div >
            <h4 className='mb-0'>{Users?.name}</h4>
            <p  className='mb-0'>{props?.msg?.created_at && moment?.utc(props?.msg?.created_at).local().format("MMM D, YYYY hh:mm A")}</p>
          </div>
        </div>
      )
  }
}
