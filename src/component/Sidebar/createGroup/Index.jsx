/* eslint-disable */
import React, { useState } from "react";
import ProjectLogoData from "../ProjectLogoData";
import Creategrouplist from "./Creategrouplist";
import CommonSidebar from "../../common/sidebar/CommonSidebar";
import AvatarGroupList from "../../common/AvatarGroupList";

const Index = (props) => {
    const [ filterMembers, setFilterMembers ] = useState("");
    const [ selectMember, setSelectMember ] = useState([]);
    const [ commonSidebarOpen, setCommonSidebarOpen ] = useState(false);
    const { sidebarTitle } = props;
    // header search member array 
    // const FliterArray = memberslist.filter((elm) => {
    //     if(filterMembers == "") {
    //         return elm;
    //     } else if (
    //         elm?.displayname?.toLowerCase().includes(
    //             filterMembers && filterMembers.toLowerCase(),
    //         )
    //     ) {
    //         return elm;
    //     }
    // })

    return (
        <div className={selectMember.length > 0 ? "chatsidebarwrapps createhroupWrapper groupCreateListManage" : "chatsidebarwrapps createhroupWrapper"}>
            {/* project details */}
            <ProjectLogoData 
                filterMembers={filterMembers}
                setFilterMembers={setFilterMembers}
            />
            {selectMember.length > 0 && (<AvatarGroupList 
                selectMember={selectMember}
                setSelectMember={setSelectMember}
            />)}
            {/* create group  */}
            <Creategrouplist 
                selectMember={selectMember}
                filterMembers={filterMembers}
                setSelectMember={setSelectMember}
                setCommonSidebarOpen={setCommonSidebarOpen}
                type={sidebarTitle === "New Group" ? "group" : "broadcast"}
            />

            {/* new group sidebar */}
            <CommonSidebar 
                open={commonSidebarOpen} 
                close={setCommonSidebarOpen}
                setSelectMember={setSelectMember}
                title={sidebarTitle === "New Group" ? "New Group" : "New Broadcast"}
                selectMember={commonSidebarOpen === true ? selectMember : null}
                type={sidebarTitle === "New Group" ? "group" : "broadcast"}
            />
        </div>
    )
}

export default Index;