/* eslint-disable */
import React, { useState } from "react";
import Tooltip from "../common/tooltip";
import { Image, Dropdown } from 'react-bootstrap';
import Document from "../../assets/img/uploadbutton/Document.svg";
import Camera from "../../assets/img/uploadbutton/Camera.svg";
import Images from "../../assets/img/uploadbutton/Image.svg";
import Video from "../../assets/img/uploadbutton/Video.svg";
import Audio from "../../assets/img/uploadbutton/Audio.svg";
import Contact from "../../assets/img/uploadbutton/Contact.svg";
import { newMessageSend } from "../../redux/actions";
import { useSelector } from "react-redux";
import { UploadFileAPI } from "../../Api/UploadFile";
import { image_extension, video_extension, Audio_extension } from "../common/sidebar/CommonAvatarUpload";
import RighSideLoader from "../common/sidebar/RighSideLoader";
import { checkExtension } from "./SearchChat/MessagesPanel";

const MsgScrollDown = (time) => {
    setTimeout(() => {
        var element = document.getElementById("chatPanelScroll");
        element?.scrollIntoView({ block: 'end' });
    }, time);
}

const UploadFileBox = (props) => {
    const { uploadfileBox, setuploadfileBox, CameraOpenClickPhoto, setImageUploads, Messages, SendImagesFunction } = props;
    const access_token = useSelector((state) => state.allReducers.access_token);
    const [loader, setLoader] = useState(0);
    
    // image upload function
    const ImageUpload =async (e) => {
        // get the files
        console.log("files", e)
        let files = e.target.files;
        if(files?.length>0){
            setLoader(3)
            let file = files[0];
            if(image_extension?.includes(file?.type)){
                const responce = await UploadFileAPI(access_token, file);
                if(responce?.data){
                    SendImagesFunction(responce?.data?.id);
                }
            }
            e.target.value = null;
            setTimeout(()=>setLoader(0), 2000)
            // setImageUploads(allFiles);
            closeUploadBox();
        }

        MsgScrollDown(100);

    }

    // video upload function
    const VideoUpload =async (e) => {
        // get the files
        let files = e.target.files;
        // console.log("e=======>", e.target.files)
        if(files?.length>0){
            
            setLoader(4)
            let file = files[0];
            // console.log("ew=======>", file?.type)
            if(video_extension?.includes(file?.type)){
                
                const responce = await UploadFileAPI(access_token, file);
                
                if(responce?.data){
                    SendImagesFunction(responce?.data?.id);
                }
            }
            e.target.value = null;

            // setImageUploads(allFiles);
            closeUploadBox();
            setTimeout(()=>setLoader(0), 2000)
        }

        MsgScrollDown(100);

    }

    // file upload function
    const filesUpload = async (e) => {
        // get the files
        let files = e.target.files;
        // console.log("Files_extension", Files_extension.includes(files.))
        if(files?.length>0){
            setLoader(1)
            let file = files[0];
            // console.log("Files_extension", Files_extension?.includes(file?.name));
            if( checkExtension(file?.name) ){
                const responce = await UploadFileAPI(access_token, file);
                if(responce?.data){
                    SendImagesFunction(responce?.data?.id);
                }
            }
            e.target.value = null;

            // setImageUploads(allFiles);
            closeUploadBox();
            setTimeout(()=>setLoader(0), 2000)
        }
        
        MsgScrollDown(100);

    }

    // audio upload function
    const AudioUpload = async (e) => {
        // get the files
        let files = e.target.files;

        if(files?.length>0){
            setLoader(5)
            let file = files[0];
            // console.log("ew=======>", file?.type)
            if(Audio_extension?.includes(file?.type)){
                const responce = await UploadFileAPI(access_token, file);
                if(responce?.data){
                    SendImagesFunction(responce?.data?.id);
                }
            }
            e.target.value = null;

            // setImageUploads(allFiles);
            closeUploadBox();
            setTimeout(()=>setLoader(0), 2000)
        }
        
        MsgScrollDown(100);

    }

    // close upload box function
    const closeUploadBox = () => {
        setTimeout(() => {
            setuploadfileBox(false);
        }, 1000);
    }
     //style={{transform: uploadfileBox === true ? "translateX(0%)" : "translateX(115%)"}}
    
    return(
        <Dropdown.Menu>
            <div className="uploadfilesBoxset">
                <Dropdown.Toggle className="uploadfilesbox">
                    <RighSideLoader  isShow={loader === 1 ?true:false} className={"FileUploadLoader"}/>
                    <Tooltip content="Upload Document" direction="top">
                        <Image src={Document} alt="file upload"  />
                        <input
                            type="file"
                            onChange={ filesUpload }
                            id="multipleimage"
                            // accept=".pdf, .ppt, .psd, .excel, .rar, .ods, .zip, .xlsx, .tif, .xls, .dll, .sav, .dat, .dbf, .txt, .doc, .docx, .mov, .wmv, .avi, .mkv"
                            accept=".txt, .pdf, .xls, .xlsx, .ppt, .doc, .docx"
                            multiple
                        />
                    </Tooltip>
                </Dropdown.Toggle>
                <Dropdown.Toggle className="uploadfilesbox">
                    <RighSideLoader  isShow={loader === 2 ?true:false} className={"FileUploadLoader"}/>
                    <Tooltip content="Camera" direction="top">
                        <Image src={Camera} alt="file upload" onClick={CameraOpenClickPhoto} />
                    </Tooltip>
                </Dropdown.Toggle>
                <Dropdown.Toggle className="uploadfilesbox">
                    <RighSideLoader  isShow={loader === 3 ?true:false} className={"FileUploadLoader"}/>
                    <Tooltip content="Image" direction="top">
                        <Image src={Images} alt="file upload" />
                        <input
                            type="file"
                            onChange={ImageUpload}
                            id="multipleimage"
                            // accept=".jpg, .jpeg, .png, .gif, .webp, .PNG, .svg"
                            accept=".png, .jpg, .jpeg"
                        />
                    </Tooltip>
                </Dropdown.Toggle>
                <Dropdown.Toggle className="uploadfilesbox">
                    <RighSideLoader  isShow={loader === 4 ?true:false} className={"FileUploadLoader"}/>
                    <Tooltip content="Video" direction="top">
                        <Image src={Video} alt="file upload"  />
                        <input
                            type="file"
                            onChange={ VideoUpload }
                            id="multipleimage"
                            // accept=".mp4, .webm"
                            accept=".mp4, .mov, .3gp"
                            // multiple
                        />
                    </Tooltip>
                </Dropdown.Toggle>
                <Dropdown.Toggle className="uploadfilesbox">
                    <RighSideLoader  isShow={loader === 5 ?true:false} className={"FileUploadLoader"}/>
                    <Tooltip content="Audio" direction="top">
                        <Image src={Audio} alt="file upload"  />
                        <input
                            type="file"
                            onChange={ AudioUpload }
                            id="multipleimage"
                            // accept=".mp3, .ogg, .wav, .mpeg"
                            accept=".mp3, .m4a, .aac, .wav"
                            multiple
                        />
                    </Tooltip>
                </Dropdown.Toggle>
                {/* <div className="uploadfilesbox">
                    <Tooltip content="Contact" direction="top">
                        <Image src={Contact} alt="file upload"  />
                    </Tooltip>
                </div> */}
            </div>
        </Dropdown.Menu>
    )
}

export default UploadFileBox;