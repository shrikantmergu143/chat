/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import GetCheckUserLoginAPI from '../../Api/CheckUserLogin';
import DeactiveLoginAPI from '../../Api/DeactiveLogin';
import { CallLogoutUser } from '../../redux/actions';
import RighSideLoader from './sidebar/RighSideLoader'

export default function CheckLogin(props) {
    const { setLoader, access_token } = props;
    const token_id = useSelector((state) => state.allReducers.userLogin?.token_id);
    const ws = new WebSocket(`${process.env.REACT_APP_SERVICE_URL}/${access_token}/`);
    const dispatch = useDispatch()
    useEffect(()=>{
        ws.onmessage = function (evt) {
            const ws_onmessage = JSON.parse(evt.data);
            if(ws_onmessage?.url === "logout"){
                dispatch(CallLogoutUser());
            }
            ws.close();
        }
        ws.onopen = function (evt){
            ws.send(JSON.stringify({"transmit":"broadcast", "url":"user_update"}));
            setTimeout(()=>{
                ws.close();
            }, 1000);
        }
        ws.onerror = function (evt){
            ws.send(JSON.stringify({"transmit":"broadcast", "url":"user_update"}));
            setTimeout(()=>{
                ws.close();
                setLoader(false);
            }, 1000);
        }
        ws.onclose = function(){
            setLoader(false);
        }
    });

    const CallLoginCheck =async () =>{        
        // const response = await GetCheckUserLoginAPI(access_token);
        // console.log("response", response)
        // if(response === true){
        //     setLoader(false);
        //     CallUpdateLoginStatus()
        // }else{
        //     const data = await DeactiveLoginAPI(access_token, token_id);
        //     console.log("data",data)
        //     if(data?.status === 403){
        //         dispatch(CallLogoutUser());
        //     }else{
        //         dispatch(CallLogoutUser());
        //     }
        //     CallUpdateLoginStatus()
        // }
    }
    // const CallUpdateLoginStatus = () =>{
    //     setTimesRepeat(timesRepeat+1);
    //     setTimeout(()=>{
    //         setLoader(false);
    //     }, 4000)
    // }
  return (
    <React.Fragment>
        <RighSideLoader isShow={true} className={"LandingLoader Appjs"}
            title={<label>Connecting</label>}
        />
    </React.Fragment>
  )
}
