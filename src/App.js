/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-debugger, no-console */
import React, {createContext, useEffect, useState} from "react";
import "../src/assets/css/style.css";
import "../src/assets/css/responsive.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Index from "./component/Index";
import ScanQRcode from "./component/ScanQRcode/ScanQRcode";
import { CallLogoutUser, CallOnline, setBrowserStatus, emojiListData, setGetMagicCode } from "./redux/actions/index";
import ModalWanringPopup from "./component/common/ModalWarning"
import RighSideLoader from "./component/common/sidebar/RighSideLoader";
import GetCheckUserLoginAPI from "./Api/CheckUserLogin";
// export const WebSocketContext = createContext();
import "./firebase/firebaseInit";
import DeactiveLoginAPI from "./Api/DeactiveLogin";
import CheckLogin from "./component/common/CheckLogin";
import emoji from "../src/component/common/emojiCustom/emoji.json";
import getMagiccodeAPI from "./Api/GetMagicCodeAPI";
import CheckIsLogin from "./Api/CheckIsLogin";
import { uuidv4 } from '../src/Api/UploadFile';
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';


function App() {
    const access_token = useSelector((state) =>state?.allReducers?.access_token);
    const magicCode = useSelector((state) =>state?.allReducers?.magic_code);
    const [useLoader, setLoader] = useState(false);
    const [timesRepeat, setTimesRepeat] = useState(0);
    const dispatch = useDispatch();
    const device_id = localStorage?.getItem("device_id");

    useEffect(()=>{
        dispatch(CallOnline(navigator.onLine));
        if(!device_id){
            localStorage?.setItem("device_id", uuidv4());
        };
    },[]);

    useEffect(()=>{
        CheckLoginUser();
    },[magicCode]);

    const CheckLoginUser = async (e) => {
        if(magicCode === ""){
            SessionLogin();
        }
    };

    useEffect(() => {
        if(emoji) {
            dispatch(emojiListData(emoji));
        }
        
    }, [ access_token ])
    
    const callRender = async () =>{ 
        setLoader(true);
    }

    const SessionLogin = async () => {       
        const payloadMagic = {
            device_id:device_id,
            device_type:"web"
        }
        const responce2 = await getMagiccodeAPI(access_token, payloadMagic);
        if(responce2?.status === 200){
            setTimeout(()=>window.location.replace(process.env.REACT_APP_BASE_URL+`/user/set_login/${responce2.data}/${device_id}/web`),1000);
            dispatch(setGetMagicCode(responce2?.data));
        }
    }

    if(!access_token){
        return(
            <ScanQRcode />
        )
    }

    if(useLoader){
        return(
        <React.Fragment>
            <CheckLogin access_token={access_token} setLoader={setLoader}  />
        </React.Fragment>
        )
    }
    return (
       <React.Fragment>
            <Index callRender={callRender} timesRepeat={timesRepeat} setTimesRepeat={setTimesRepeat}/>
            <ModalWanringPopup />
        </React.Fragment>
    );
}
export default App;
