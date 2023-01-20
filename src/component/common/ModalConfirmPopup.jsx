/* eslint-disable */
import React, { useContext, useState } from "react";
import { Modal, Button, ListGroup, Image } from 'react-bootstrap';
import { useSelector, useDispatch } from "react-redux";
import wsSend_request from "../../Api/ws/ws_request";
import { setCloseModalPopup } from "../../redux/actions";
import { WebSocketContext } from "../Index";
import BlockedUsers from "../../assets/img/sidebar/block_user.svg";

function ModalConfirmPopup(props) {
    const { users, ModalPopup,} = useSelector((state)=>state?.allReducers);
    const {websocket} = useContext(WebSocketContext)
    const dispatch = useDispatch();
    const OnClose = async () => {
        dispatch(setCloseModalPopup());
    }
    const CallActionType =async () =>{
        if(ModalPopup?.ActionType){
            wsSend_request(websocket, ModalPopup?.ActionType)
            if(ModalPopup?.Id){
                ModalPopup?.callBackList(ModalPopup?.Id);
            }else{
                ModalPopup?.callBackList();
            }
            OnClose();
        }else if(ModalPopup?.ActionType === ""){
            if(ModalPopup?.Id){
                ModalPopup?.callBackList(ModalPopup?.Id);
            }else{
                ModalPopup?.callBackList();
            }
            OnClose();
        }
    }

    return(
        <Modal
            show={ModalPopup?.IsShow}
            onHide={OnClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="customModalDesign confirmPopup"
            key={ModalPopup?.IsShow.toString()}
            onShow={()=>{
                document.getElementById("popup_modalConfirm").focus()
            }}
        >
            {ModalPopup?.Title.includes("Block") ? (<div className="blockuserWraps">
                <Modal.Header >
                    <img src={BlockedUsers} className="blockeduserLogo" alt="blocked user" />
                    <Modal.Title id="contained-modal-title-vcenter" dangerouslySetInnerHTML={{__html: ModalPopup?.Title}}></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-5" dangerouslySetInnerHTML={{__html: ModalPopup?.Description}}></p>
                    <div className="text-right">
                        <Button id={"popup_modalConfirm"} onClick={()=>CallActionType()} variant="primary">{ModalPopup?.ButtonSuccess}</Button>
                        <Button onClick={()=>OnClose()} variant="secondary">CANCEL</Button>
                    </div>
                </Modal.Body>
            </div>): (<>
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter" dangerouslySetInnerHTML={{__html: ModalPopup?.Title}}></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-5" dangerouslySetInnerHTML={{__html: ModalPopup?.Description}}></p>
                    <div className="text-right">
                        <Button id={"popup_modalConfirm"} onClick={()=>CallActionType()} variant="primary">{ModalPopup?.ButtonSuccess}</Button>
                        <Button onClick={()=>OnClose()} variant="secondary">CANCEL</Button>
                    </div>
                </Modal.Body>
            </>)}
        </Modal>
    )
} 

export default ModalConfirmPopup;