/* eslint-disable */
import React, { useContext, useEffect, useState } from "react";
import { Modal, Button, ListGroup, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import DummyImage from '../../assets/img/profile/dummyimage.png';
import No_search_found from '../../assets/img/sidebar/No_search_found.svg';
import { Scrollbars } from 'react-custom-scrollbars-2';
import SearchBox from "./SearchBox";
import dummygroup from "./../../assets/img/profile/dummygroup.png"
import { formatPhoneNumber } from "../ChatPanels/GroupInfo/ProfileDetails";
import ProfileAuthPreview from "../ChatPanels/ProfileAuthPreview";
import NoDataFound from "./NoDataFound";
import wsSend_request from "../../Api/ws/ws_request";
import { WebSocketContext } from "../Index";
import { setDeselectUserType, setSelectUserType } from "../../redux/actions";

function ModalFilterCommon(props) {
    const { show, callOpenFilterModal } = props;
    const select_types = useSelector((state) => state?.allReducers?.select_types);
    const { user_types } = useSelector((state) => state?.allReducers);
    const [selectContact, setSelectContact] = useState([]);
    const {websocket} = useContext(WebSocketContext);
    const dispatch = useDispatch()
    useEffect(()=>{
        wsSend_request(websocket, {"transmit":"single", "url":"user_types"});
    },[]);
    const callSelectUserType = (data) =>{
        if(select_types === undefined){
            dispatch(setSelectUserType(data))

        }else{
            const check_condition = select_types?.filter((item)=>item?.key == data?.key);
            if(check_condition?.length === 0){
                dispatch(setSelectUserType(data))
            }else{
                dispatch(setDeselectUserType(data))
            }
        }
    }
    return(
        <Modal
            show={show}
            onHide={()=>callOpenFilterModal(false)}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="customModalDesign Filter_modal"
            key={show.toString()}
            id="modaluserTypesfilter"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter"> Filter </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className="ChatMemberList Buttons" id="chatmemberlistButtons">
                <ListGroup>
                    <Scrollbars 
                        renderTrackVertical={props => <div {...props} className="track-vertical"/>}
                        renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
                        renderView={props => <div {...props} className={`view ${selectContact?.length>0? "showButton_btm":""}`}/>}
                        style={{
                            height: "calc(100vh - 157px)"
                        }}
                        className="scrollararea"
                    >
                        <div className="view_button">
                            {user_types?.map((item, index)=>(
                                <React.Fragment key={index?.toString()}>
                                    <button 
                                        onClick={()=>callSelectUserType(item)}
                                        className={select_types?.filter((item1)=>item1?.key == item?.key)?.length === 1?"btn active":"btn "}
                                    >
                                        {item?.key?.replace("_", " ")}
                                    </button>
                                </React.Fragment>
                            ))}
                        </div>
                       
                    </Scrollbars>
                </ListGroup>
            </div>
            <div className='createbuttonsbtm'>
                <Button onClick={()=>callOpenFilterModal(false)} >Apply</Button>
            </div>
            </Modal.Body>
        </Modal>
    )
} 

export default ModalFilterCommon;