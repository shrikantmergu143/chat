import React from 'react'
import { Dropdown } from 'react-bootstrap'
import DownArrow from "./../../assets/img/arrow-down.svg"
export default function SaveChatMenu(props) {
    const { id, callUnSaveMessages, CallForwardMessage, setOpenModalBox } = props;
  return (
    <Dropdown className="savechat-toggle" key={id}
        align="end"
        id="dropdown-menu-align-end"
    >
        <Dropdown.Toggle id="dropdown-basic">
        </Dropdown.Toggle>
        <Dropdown.Menu className="customeDropdownHere">
            <Dropdown.Item onClick={()=>callUnSaveMessages(props?.msg)} >UnSave Message</Dropdown.Item>
            <Dropdown.Item onClick={()=>setOpenModalBox(props?.msg)} >Forward Message</Dropdown.Item>
            {/* <Dropdown.Item >Forward Messages</Dropdown.Item> */}
            {/* <Dropdown.Item >Download</Dropdown.Item> */}
        </Dropdown.Menu>
    </Dropdown>
  )
}
