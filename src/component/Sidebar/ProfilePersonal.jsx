/* eslint-disable */
import React, { useEffect } from 'react';
import Avatar from '../common/Avatar';
import Tooltip from '../common/tooltip';
import { useDispatch, useSelector } from "react-redux";
import { mainTabChange, setMyProfile } from "../../redux/actions";
import GetProfile from '../../Api/ws/GetProfile';
import DummyImage from '../../assets/img/profile/dummyimage.png';
import {Image} from "react-bootstrap"
import ProfileAuthPreview from '../ChatPanels/ProfileAuthPreview';
// import GetUser from '../../Api/GetUser';

const ProfilePersonal = () => {
  const dispatch = useDispatch();
  const { MyProfile, access_token } = useSelector((state) => state.allReducers);

  useEffect(() => {
    FetchAllData();
  }, []);

  // fetch all profile data 
  const FetchAllData = () => {
    dispatch(GetProfile(access_token));
    // const myset = GetUser(access_token);
  }
  return (
    <div className="profileUser_wrap" id='profileUser_Id'>
        <div className="profileUser_Set">
          <Tooltip content="You" direction="bottom">
            <button onClick={(e) => dispatch(mainTabChange("ProfileEdit"))}>
               <div className="AvatarCustomSet">
                    {(MyProfile?.view_thumbnail_url !== undefined || MyProfile?.view_thumbnail_url !== null) ? 
                        // <Image src={MyProfile?.avatar_url !== undefined ? MyProfile?.avatar_url : MyProfile?.avatar_url} className="avatarImage" onError={(e)=>e.target.src = DummyImage} alt="profile"/> 
                        <ProfileAuthPreview 
                            url={MyProfile?.view_thumbnail_url}
                            className={"avatarImage"}
                            defultIcon={DummyImage}
                            click={false}
                        />
                        :
                        <Image src={DummyImage} className="avatarImage" alt="profile"/>
                    }
                </div>
            </button>
          </Tooltip>
        </div>
    </div>
  );
}

export default ProfilePersonal;