/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import GetViewFilesAPI from '../../Api/Viewfiles';
import PropTypes from 'prop-types';
import { Image } from 'react-bootstrap';
import { AudioPlayerControlSprite, Audio as Audios } from 'react-audio-player-pro';
import {LoaderComman} from '../common/sidebar/RighSideLoader';
import defulticon from "./../../assets/img/defult icon.svg";
import DarkUserIcon from "./../../assets/img/profile/user_dark.png";
import DarkGroupIcon from "./../../assets/img/profile/group_dark.png";
import PreviewPopup from '../common/PreviewProfile';
import { setGetMagicCode, SetIsAuthenticate, SetStoreViewBaseURL } from '../../redux/actions';

export default function ProfileAuthPreview(props) {
    const access_token = useSelector((state)=>state?.allReducers?.access_token)
    const view_base_url = useSelector((state)=>state?.allReducers?.view_base_url);
    const isAuthCheck = useSelector((state)=>state?.allReducers?.isAuthCheck);
    const ThemeCheck = useSelector((state)=>state?.allReducers?.themeDarkLight);
    const { url, avatar, defultIcon, click } = props;
    const [previewURL, setPreviewURL] = useState(null);
    const dispatch = useDispatch();
    const [fileLoader, setFileloader] = useState(false);
    const [PreviewImageVideo, setPreviewImageVideo] = useState(false);
    const [CurrentVideoImage, setCurrentVideoImage] = useState({
        url:defultIcon,
        name:defultIcon,
        id:defultIcon,
    });
    const data = async ()=>{
        if(url){
            // // local file preview code 
            // if( view_base_url[url]!== undefined ){
            //     setPreviewURL(view_base_url[url]);
            // }else{
            //     setFileloader(true)
            //     const responce = await GetViewFilesAPI(url, access_token);
            //     dispatch(SetStoreViewBaseURL({id:url, url:responce}));
            //     setPreviewURL(responce);
            //     setFileloader(false);
            // }

            // live file preview code
            setPreviewURL(url);
        }else{
            setPreviewURL(props?.defultIcon);
        }
    }
    useEffect(() => {
        data();
    }, [url, previewURL]);
    const VideoImagesShowFnt =async (e) => {
        if(click !== false){
            e.stopPropagation();
            e.preventDefault()
            if(previewURL !== null && avatar?.view_file_url){
                if(view_base_url[avatar?.view_file_url]){
                    setCurrentVideoImage({
                        url:view_base_url[avatar?.view_file_url],
                        name:view_base_url[avatar?.view_file_url],
                        id:view_base_url[avatar?.view_file_url]
                    });
                    setTimeout(()=>setPreviewImageVideo(!PreviewImageVideo), 100);
                }else{
                    const responce = await GetViewFilesAPI(avatar?.view_file_url, access_token);
                    if(responce){
                        dispatch(SetStoreViewBaseURL({id:avatar?.view_file_url, url:responce}));
                        setCurrentVideoImage({
                            url:responce,
                            name:responce,
                            id:responce
                        });
                        setTimeout(()=>setPreviewImageVideo(!PreviewImageVideo), 100)
                    }
                }
            }else{
                setCurrentVideoImage({
                    url:props?.defultIcon,
                    name:props?.defultIcon,
                    id:props?.defultIcon
                });
                setTimeout(()=>setPreviewImageVideo(!PreviewImageVideo), 100)
            }
        }
    }
    const onErrorCallBack = (e) =>{
        e.target.src = props?.defultIcon;
        if(isAuthCheck === undefined){
          return dispatch(SetIsAuthenticate("checked"));
        }
        if(props?.avatar?.view_thumbnail_url && isAuthCheck === ""){
            dispatch(setGetMagicCode(""))
            dispatch(SetIsAuthenticate("checked"))
        }
        if(props?.avatar?.view_thumbnail_url && isAuthCheck === "checked"){
            dispatch(setGetMagicCode(""))
            dispatch(SetIsAuthenticate(""))
        }
    }

    if(fileLoader === true && props?.outerDiv === true)
        return(
            <React.Fragment>
                <Image onClick={VideoImagesShowFnt} src={
                    ThemeCheck === "dark" && previewURL?.includes("system_logo/group.png") === true ? DarkGroupIcon :
                    ThemeCheck === "dark" && previewURL?.includes("system_logo/user.png") === true ? DarkUserIcon :
                    props?.defultIcon} className={props?.className} onError={onErrorCallBack}  alt="profile"/>
                {PreviewImageVideo === true && (<PreviewPopup setPreviewImageVideo={setPreviewImageVideo} CurrentVideoImage={CurrentVideoImage} />)}
            </React.Fragment>
        );
    if(fileLoader === false && props?.outerDiv === true)
        return(
            <React.Fragment>
                {(previewURL !== undefined && previewURL !== null) ?
                    <Image onClick={VideoImagesShowFnt} src={
                        ThemeCheck === "dark" && previewURL?.includes("system_logo/group.png") === true ? DarkGroupIcon :
                        ThemeCheck === "dark" && previewURL?.includes("system_logo/user.png") === true ? DarkUserIcon :
                        previewURL} className={props?.className} onError={onErrorCallBack} alt="profile"/> 
                    :
                    <Image onClick={VideoImagesShowFnt} src={
                        ThemeCheck === "dark" && previewURL?.includes("system_logo/group.png") === true ? DarkGroupIcon :
                        ThemeCheck === "dark" && previewURL?.includes("system_logo/user.png") === true ? DarkUserIcon :
                        props?.defultIcon} className={props?.className} onError={onErrorCallBack}  alt="profile"/>
                }
                {PreviewImageVideo === true && (<PreviewPopup setPreviewImageVideo={setPreviewImageVideo} CurrentVideoImage={CurrentVideoImage} />)}
            </React.Fragment>
            
        );

    if(fileLoader)
        return(
            <div className="AvatarCustomSet auth_file">
                <Image onClick={VideoImagesShowFnt} src={props?.defultIcon} className={props?.className} onError={onErrorCallBack}  alt="profile"/>
                {PreviewImageVideo === true && (<PreviewPopup setPreviewImageVideo={setPreviewImageVideo} CurrentVideoImage={CurrentVideoImage} />)}
            </div>
        );

    return (
        <div className="AvatarCustomSet auth_file" 
            // onClick={VideoImagesShowFnt}
        >
            {/* previewURL?.split('/')[previewURL?.split('/').length - 1] */}
            {(previewURL !== undefined && previewURL !== null) ?
                <Image onClick={VideoImagesShowFnt} src={
                    ThemeCheck === "dark" && previewURL?.includes("system_logo/group.png") === true ? DarkGroupIcon :
                    ThemeCheck === "dark" && previewURL?.includes("system_logo/user.png") === true ? DarkUserIcon :
                    previewURL
                } className={
                    previewURL?.includes("system_logo/group.png") === true ? props?.className + " system_logo_groups" :
                    previewURL?.includes("system_logo/user.png") === true ? props?.className +  " system_logo_users" :
                    props?.className
                } onError={onErrorCallBack} alt="profile"/> 
                :
                <Image onClick={VideoImagesShowFnt} src={props?.defultIcon} className={props?.className} onError={onErrorCallBack}  alt="profile"/>
            }
            {PreviewImageVideo === true && (<PreviewPopup setPreviewImageVideo={setPreviewImageVideo} CurrentVideoImage={CurrentVideoImage} />)}
        </div>
    )
}
ProfileAuthPreview.propTypes = {
    defultIcon: PropTypes.any,
    className:PropTypes.string,
    onClick:PropTypes.func,
    url:PropTypes.string,
    avatar:PropTypes.any,
    src:PropTypes.string,
    outerDiv:PropTypes.bool
};