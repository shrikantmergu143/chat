import React from 'react';
import { Nav } from 'react-bootstrap';
import ProfilePersonal from './ProfilePersonal';
import { useSelector, useDispatch } from "react-redux";
import { mainTabChange } from "../../redux/actions";
import { Link } from 'react-router-dom';
import Tooltip from '../common/tooltip';
import ThemeMode from '../common/darkMode/ThemeMode';

const SidebarMenu = (props) => {
  const {CallReloadContents, callOpenFilterModal, select_types} = props
  const sidebarLinks = useSelector((state) => state.allReducers.MainTabsSelected);
  const dispatch = useDispatch();

  return (
    <div className="SidebarMenu_wrap">
      {/* Profile personal start here */}
      <ProfilePersonal key={"sad"} />
      {/* Sidebar menu start here */}
      <Nav defaultActiveKey={"/home"} className="SidebarMenu_wrap_divider flex-column">
        <Link to={"/home"} onClick={() => dispatch(mainTabChange("Chat"))}>
          <Tooltip content="Chat" direction="right">
            <li
              className={sidebarLinks && sidebarLinks === "Chat" ? "nav-link active" : "nav-link"}
            >
                <span className='SidebarMenu_icon message_icon'></span>
            </li>
          </Tooltip>
        </Link>
        <Tooltip content="Create Group" direction="right">
          <li 
            className={sidebarLinks && sidebarLinks === "Creategroup" ? "nav-link active" : "nav-link"}
            onClick={() => dispatch(mainTabChange("Creategroup"))}
          >
              <span className='SidebarMenu_icon new_group_icon'></span>
          </li>
        </Tooltip>
        <Tooltip content="Create Broadcast" direction="right">
          <li 
            className={sidebarLinks && sidebarLinks === "brodcast" ? "nav-link active" : "nav-link"}
            onClick={() => dispatch(mainTabChange("brodcast"))}
          >
              <span className='SidebarMenu_icon brodcast_icon'></span>
          </li>
        </Tooltip>
        <li className='nav-link disabled' disabled></li>
        <Tooltip content="Saved Message" direction="right">
          <li 
            className={sidebarLinks && sidebarLinks === "savedmessage" ? "nav-link active" : "nav-link"}
            onClick={() => dispatch(mainTabChange("savedmessage"))}
          >
              <span className='SidebarMenu_icon savedmessage_icon'></span>
          </li>
        </Tooltip>
        <Tooltip content="Filter" direction="right">
          <li 
            className={select_types?.length>0 && sidebarLinks === "Chat" ?"nav-link active":"nav-link"}
            onClick={() => callOpenFilterModal(true)}
          >
              <span className='SidebarMenu_icon filter_icon'></span>
          </li>
        </Tooltip>
        <Tooltip content="Refresh" direction="right">
          <li 
            className={"nav-link"}
            // onClick={() => dispatch(mainTabChange("refresh"))}
            onClick={CallReloadContents}
          >
              <span className='SidebarMenu_icon refresh_icon'></span>
          </li>
        </Tooltip>
        <li className='nav-link disabled' disabled ></li>
        <Tooltip content="Blocked Users" direction="right">
          <li 
            className={sidebarLinks && sidebarLinks === "blockusers" ? "nav-link active" : "nav-link"}
            onClick={() => dispatch(mainTabChange("blockusers"))}
          >
              <span className='SidebarMenu_icon bloack_icon' id="bloack_icon"></span>
          </li>
        </Tooltip>

        {/* dark mode switch button */}
        <ThemeMode />
      </Nav>
    </div>
  );
}

export default SidebarMenu;