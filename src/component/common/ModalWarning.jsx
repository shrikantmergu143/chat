/* eslint-disable */
import React, { useState } from "react";
import { Modal, Button, ListGroup, Image } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import DummyImage from '../../assets/img/profile/dummyimage.png';
import ArrowForward from '../../assets/img/sidebar/arrow-forward.svg';
import { Scrollbars } from 'react-custom-scrollbars-2';
import SearchBox from "./SearchBox";
import { formatPhoneNumber } from "../ChatPanels/GroupInfo/ProfileDetails";

function ModalCommon() {
    const is_online = useSelector((state) =>state?.allReducers?.is_online);
    if(is_online === true || is_online === ""){
        return null;
    }else{
        return(
            <Modal
                show={true}
                // onHide={OnClose}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className="customModalDesign"
                // key={show.toString()}
            >
                <Modal.Body>
                Nation Wide is trying to connect, so messages can’t be sent yet
                </Modal.Body>
            </Modal>
        )
    }
} 

export default ModalCommon;