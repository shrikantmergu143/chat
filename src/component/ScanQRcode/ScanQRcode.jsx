/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Button, Card, Container, Row } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux'
import GenerateQRcodeAPI from '../../Api/GenerateQR';
import { Scrollbars } from 'react-custom-scrollbars-2';
import GetloginQRCode from '../../Api/GetQRLogin';
import { GetCallSaveQR, setGetMagicCode, StoreLoginUserQR } from '../../redux/actions';
import RighSideLoader from '../common/sidebar/RighSideLoader';
import mobile_info_login from "./../../assets/img/mobile_info_login.png";
import logo from "./../../assets/img/sidebar/logo.svg";
import apple_icon from "./../../assets/img/apple_icon.svg";
import store_icon from "./../../assets/img/store_icon.svg";
import getMagiccodeAPI from '../../Api/GetMagicCodeAPI';
import { uuidv4 } from '../../Api/UploadFile';

export default function ScanQRcode() {
    const qr_token = useSelector((state) =>state?.allReducers?.qr_token);
    const [currentCount, setCount] = useState(1);
    const [callGenerateToken, SetcallGenerateToken] = useState(1);
    const [sideBarLoader, setSideBarLoader] = useState(true);
    const [isShow, SetIsShow] = useState(false);
    const [Qr_token, setQr_token] = useState("")
    const dispatch = useDispatch();
    const device_id = localStorage?.getItem("device_id");

    const CheckUserLogin = async() => {
        if(qr_token){
            const responce = await GetloginQRCode(qr_token);
            console.log("login user", responce);
            if(responce?.status === 200){
                SetIsShow(true);
                const payloadMagic = {
                    device_id:device_id,
                    device_type:"web"
                }
                const responce2 =await getMagiccodeAPI(responce?.data?.data?.users_detail?.access_token, payloadMagic);
                console.log("data", responce2);
                if(responce2?.status === 200){
                    const payload = {
                        ...responce?.data?.data,
                        global_group:responce?.data?.data?.users_detail?.global_group,
                        users_detail:{
                            access_token:responce?.data?.data?.users_detail?.access_token,
                            global_group:responce?.data?.data?.users_detail?.global_group,
                            ...responce?.data?.data?.users_detail?.user,
                        }
                    }
                    dispatch(setGetMagicCode(responce2?.data));
                    setTimeout(()=>window.location.replace(process.env.REACT_APP_BASE_URL+`/user/set_login/${responce2?.data}/${device_id}/web`),1000);
                    dispatch(StoreLoginUserQR(payload));
                }
                
                setTimeout(()=>SetIsShow(false), 3000);

            }else{
                if(responce?.errors === "Token already scanned."){
                    callGenerateQRcodeAPI();
                }
            }
        }
        setCount(currentCount + 1)
    };
    const callGenerateQRcodeAPI = async () =>{
        setSideBarLoader(true)
        const responce = await GenerateQRcodeAPI();

        if(responce?.status === 200){
            if(responce?.data?.data?.qr_token){
                dispatch(GetCallSaveQR(responce?.data?.data?.qr_token));
            }else{
                setTimeout(callGenerateQRcodeAPI, 1000)
            }
        }else{
            setTimeout(callGenerateQRcodeAPI, 1000)
        }
        setTimeout(()=>setSideBarLoader(false), 2000);
        SetcallGenerateToken(callGenerateToken + 1)
    }

    useEffect(() => {
        if (currentCount <= 0) {
            return;
        }
        const id = setInterval(CheckUserLogin, 1000);
        return () => clearInterval(id);
    },[currentCount]);

    useEffect(()=>{
            if (callGenerateToken <= 0) {
                return;
            }
            const minutes15 = setInterval(callGenerateQRcodeAPI, 900000);
            return () => clearInterval(minutes15);
    },[callGenerateToken]);
    
    useEffect(()=>{
        // console.log("window.location", window.location)
        if(window?.location?.pathname !== "/"){
            window.location?.replace(window.location?.origin)
        }
        if(!device_id){
            localStorage?.setItem("device_id", uuidv4());
        }
    },[])
    useEffect(()=>{
        callGenerateQRcodeAPI();
    },[!qr_token])

    return (
        <Scrollbars
            renderTrackVertical={props => <div {...props} className="track-vertical"/>}
            renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
            renderView={props => <div {...props} className="view"/>}
            style={{
                height: "calc(100vh)"
            }}
            className="scrollararea"
            >
            <div className={"login_qr scrolbar_hover noselect"}>
                <Container className={"container-xl main-container"}>
                    <Card className={"login_card scrolbar_hover"}>
                        <RighSideLoader isShow={isShow} className={"Qr_card_loginCard"}/>
                        <Card.Body className={"login_body"}>
                            <Row>
                                <div className={"col-6 backgroundImage position-relative"} >
                                        <img draggable={false} className='logo_card mb-2 ' alt={""} src={logo} />
                                        <h5 className='text-center title_card mb-4'>Web Scan QR Code</h5>
                                        <div className=''>
                                        <p className='second-text text-center mb-4'>
                                            <span>Scan to use desktop view</span>
                                            <span className='text-center d-flex justify-content-center'>
                                                <b className='w-auto me-1 pr-color' > Nationwide</b>
                                                <label className='w-auto me-1'>application</label>
                                            </span>
                                        </p>
                                        </div>
                                    <div className="qr_image mb-3">
                                        {sideBarLoader?
                                            <RighSideLoader isShow={sideBarLoader} className={"Rside_loader"}/>
                                        :
                                            <img alt='.' draggable={false} src={`https://chart.googleapis.com/chart?cht=qr&chl=${qr_token}&chs=260x260&chld=L|0`} className="qr-code img-thumbnail img-responsive" />
                                        }
                                    </div>
                                    <div className='button_position'>
                                        <div className='app_div mt-1'>
                                            <button className='black_btn btn transition'>
                                                <img alt="" src={store_icon} draggable={false} className="play_logo me-2"/>
                                                <div className="d-flex f-column">
                                                    <p className="mb-0">GET IT ON</p>
                                                    <h5 className="mb-0">Google Play</h5>
                                                </div>
                                            </button>
                                            <button className="black_btn btn transition">
                                                <img alt="" src={apple_icon} draggable={false} className="play_logo me-2"/>
                                                <div className="d-flex f-column">
                                                    <p className="mb-0">Available on the</p>
                                                    <h5 className="mb-0">App Store</h5>
                                                </div>
                                            </button>
                                        </div>
                                        <p className='text-center mb-0 pr-color'>Download App Now</p>
                                    </div>
                                </div>
                                <div className={"col-6 mobile_banner"}>
                                    <img src={mobile_info_login} alt={"."} draggable={false} className={"noselect"} />
                                </div>
                            </Row>
                        </Card.Body>
                    </Card>
                    
                </Container>
            </div>
        </Scrollbars>
    )
}
