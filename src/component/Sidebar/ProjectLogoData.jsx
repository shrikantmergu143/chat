import React from "react";
import Logo from '../../assets/img/sidebar/logo.svg';
import SearchBox from '../common/SearchBox';
import Image from 'react-bootstrap/Image';
import Search from '../../assets/img/sidebar/search.svg';
import { useDispatch } from "react-redux";
import { setSearchModalData } from "../../redux/actions";
import Tooltip from "../common/tooltip";

const ProjectLogoData = (props) => {
    const { filterMembers,setFilterMembers } = props;
    const dispatch = useDispatch()
    const callShowSearchModal = () => {
        dispatch(setSearchModalData(true))
    }
    return(
        <div className="projectchatlogo">
            {/* prject logo */}
            <div className="projectlogo header_logo_project">
                <Image src={Logo} alt="logo" />
                <h4 className="w-auto m-0">Nationwide</h4>
                <Tooltip className={"w-auto"} content="Search" direction="bottom">
                    <button onClick={()=>callShowSearchModal()} className="btn btn-logo ">
                        <div className="search_logos" />
                    </button>
                </Tooltip>
            </div>
            {/* search box */}
                <SearchBox filterMembers={filterMembers} setFilterMembers={setFilterMembers} />
        </div>
    )
}

export default ProjectLogoData;