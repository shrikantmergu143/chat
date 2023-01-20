/* eslint-disable */
import React, { useRef , useState, useEffect, useCallback} from "react";
import Webcam from "react-webcam";
import Tooltip from "../common/tooltip";
import { Image } from "react-bootstrap";
import Cancel from "../../assets/img/previewmodal/cancel_icon.png";
import Camera from "../../assets/img/camerabutton.png";
import Send from "../../assets/img/sendCaptureimage.png";
import Delete from "../../assets/img/deleteMessageImage.png";
import { useSelector } from "react-redux";
import { UploadFileAPI } from "../../Api/UploadFile";
import { baseURL } from "../../constant/url";
import CameraAccessPopup from "../common/CameraAccessPopup";
import RighSideLoader from "../common/sidebar/RighSideLoader";

export function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

const CameraTakePhoto = (props) => {
    const { setOpenCamera, SendImagesFunction } = props;
    const webcamRef = useRef(null);
    const initiate ={
        duration:"",
        id:"",
        name:"",
        s3_url:"",
        size:"",
        thumbnail:"",
        url:""
    }
    const [imgSrc, setImgSrc] = useState({
        duration:"",
        id:"",
        name:"",
        s3_url:"",
        size:"",
        thumbnail:"",
        url:""
    });
    const [prviewCaptureImage, setPrviewCaptureImage] = useState(null);
    const access_token = useSelector((state) => state.allReducers.access_token);
    const [ accessToRecording, setAccessToRecording ] = useState(true);
    const [loader, setLoader] = useState(0);
    const [buttonLoader, setButtonLoader] = useState(false)
    const capture =async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setButtonLoader(true)
        const blob = await fetch(imageSrc).then(res=>res.blob()).then(res =>{
            return res;
        });
        // console.log("imageSrc", blob)
        if(blob){
            blob.name = "demo.png"
            const responce = await UploadFileAPI(access_token, blob);
            if(responce?.data){
                setImgSrc(responce?.data);
                setPrviewCaptureImage(imageSrc);
            }
        }
        setButtonLoader(false);
        // let params = {
        //     "record_type": "image",
        //     "base64_str": imageSrc,
        // }
        // window.axios.post(`${baseURL}/upload/record`, params, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json',
        //         'Authorization':`Bearer ${access_token}`
        //     }}
        // ).then(function (result) {
        //     setImgSrc(result.data);
        // });
    }

    // console.log("loader", loader);
    const ImageUpload = async () => {
        console.log("imgSrc", imgSrc)
        if(imgSrc?.id!==""){
            setLoader(1);
            // console.log("imgSrc", imgSrc)
            // const responce = await UploadFileAPI(access_token, imgSrc[0]);
            SendImagesFunction(imgSrc?.id);
            setTimeout(()=>setLoader(0), 2000);
            setImgSrc({});
            setTimeout(()=> setOpenCamera(false), 2000);        
        }
    }
 
    // navigator.mediaDevices.getUserMedia({
    //     video: true
    // }, () => {
    //     console.log('has webcam')
    //     setAccessToRecording(true);
    // }, () => {
    //     console.log('no webcam')
    //     setAccessToRecording(false);
    // });
    useEffect(()=>{
        navigator.getMedia = (
            navigator?.getUserMedia ||
            navigator?.webkitGetUserMedia ||
            navigator?.mozGetUserMedia ||
            navigator?.msGetUserMedia
        );
        if(navigator.getMedia){
            navigator?.getMedia({video: true}, function() {
                // webcam is available
                setAccessToRecording(true);
                }, function() {
                // webcam is not available
                setAccessToRecording(false);
                }
            );
        }else{
            setAccessToRecording(false);
        }
    },[])

    // console.log("accessToRecording", accessToRecording)

    return(
        <div onClick={(e)=>e.stopPropagation()} className="ImageViewPreviewModal captureImage">
            <div className='controlbars'>
                <div>
                    
                </div>
                <Tooltip content="Close" direction="bottom">
                    <Image src={Cancel} onClick={() => setOpenCamera(false)} alt="Cancel" />
                </Tooltip>
            </div>
            {accessToRecording === true ? (<React.Fragment>
                {prviewCaptureImage === null ? (<div className="imageViewMain imagecapturemain">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                    />
                    <RighSideLoader  isShow={buttonLoader} className={"FileUploadLoader"}/>
                    <div className="btnGroupswrapper">
                        <Tooltip content="Capture photo" direction="bottom">
                            <div className="campturebtncmera">
                                    <Image onClick={buttonLoader ===false && capture} src={Camera} alt="Camera" />
                            </div>
                        </Tooltip>
                    </div>
                </div>) : (
                    <div className="imageViewMain imagecapturemain">
                        <Image src={prviewCaptureImage}  alt="camara capture" />
                        <RighSideLoader  isShow={loader === 1 ?true:false} className={"FileUploadLoader"}/>
                        <div className="btnGroupswrapper">
                            <Tooltip content="Send photo" direction="bottom">
                                <div className="campturImagesend">
                                   
                                        <Image src={Send} onClick={() => ImageUpload()} alt="Camera" />
                                </div>
                            </Tooltip>
                            <Tooltip content="Delete photo" direction="bottom">
                                <div 
                                    className="camptureImageDelete" 
                                    onClick={() => {
                                        setPrviewCaptureImage(null);
                                        setImgSrc({});
                                    }}
                                >
                                    <Image src={Delete} alt="Camera" />
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                )} 
        </React.Fragment>) : (<CameraAccessPopup setOpenCamera={setOpenCamera} accessToRecording={accessToRecording} />)}
    </div>
    )
}

export default CameraTakePhoto;