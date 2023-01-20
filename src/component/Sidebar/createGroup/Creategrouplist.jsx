/* eslint-disable */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { Scrollbars } from 'react-custom-scrollbars-2';
import Avatar from "../../common/Avatar";
import NoDataFound from "../../common/NoDataFound";
import No_search_found from "../../../assets/img/sidebar/No_search_found.svg";
import No_contacts from "../../../assets/img/sidebar/No_contacts.svg";
import DummyImage from '../../../assets/img/profile/dummyimage.png';
import ProfileAuthPreview from "../../ChatPanels/ProfileAuthPreview";

const Creategrouplist = (props) => {
    const { memberslist,setSelectMember,selectMember,setCommonSidebarOpen, filterMembers, type } = props;
    const { Contacts } = useSelector((state) => state.allReducers);
    const SortedList = Contacts.filter((elm) => elm.name !== undefined ).sort((a, b) => a?.name?.localeCompare(b?.name));
    
    // creating alphabetical array
    const data = Contacts.filter((elm) =>{
         if(elm?.name !== null && elm?.name !== undefined && elm?.is_block !== true){
            return elm.name.toLowerCase().includes(filterMembers.toLowerCase())
         }
        } ).reduce((r, e) => {
        // get first letter of name of current element
        // console.log("e321", e.name)
        let group =  e?.name[0];
        // if there is no property in accumulator with this letter create it
        if(!r[group]) r[group] = {group, children: [e]}
        // if there is push current element to children array for that letter
        else r[group].children.push(e);
        // return accumulator
        return r;
    }, {})
    const MemberListSorted = Object?.values(data)?.sort(function(a, b) {
        var textA = a.group.toUpperCase();
        var textB = b.group.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });;
    // console.log("MemberListSorted", MemberListSorted,)

    // if checkbox check then select user for create group
    const SelectUserFn = (user) => {
        const checkBoxCheck = document.querySelector("#userid" + user.id);        
        let selectMembervar = [...selectMember];
        if(checkBoxCheck.checked === true) {
            selectMembervar.push(user);
            setSelectMember(selectMembervar);
        } else {
            let selectMembervarnew = selectMember.filter((elm, _index) => {
                if(elm?.id !== user?.id) {
                    return elm;
                }
            })
            setSelectMember(selectMembervarnew);
        }
    }      

    return(
        <div className="ChatMemberList">
            <ListGroup>
                <Scrollbars 
                    renderTrackVertical={props => <div {...props} className="track-vertical"/>}
                    renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
                    renderView={props => <div {...props} className="view"/>}
                    className="scrollararea"
                >
                    {MemberListSorted && MemberListSorted.map((elm, index) => 
                        <React.Fragment key={index}>
                            <div className="alphbetCharectors">{elm?.group}</div>
                            {elm?.children.map((user, index) => <ListGroup.Item key={index}>
                                {/* <Avatar profile={user?.avatar_url} title={user?.name} /> */}
                                <ProfileAuthPreview 
                                    url={user?.view_thumbnail_url}
                                    className={"avatarImage"}
                                    avatar={user}
                                    defultIcon={DummyImage}
                                />
                                <div className="ChatMemberDetails">
                                    <h4>{user?.name}</h4>
                                    {user?.is_block === true ?
                                        <p>This user is blocked</p>
                                    :
                                        <p>+{user?.phone_code} {user?.phone}</p>
                                    }
                                </div>
                                <div className="customCheckBoxNew">
                                    <label className="containernew" >
                                        <input 
                                            type="checkbox" id={"userid" + user?.id}  
                                            onChange={() => SelectUserFn(user)}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                            </ListGroup.Item>
                            )}
                        </React.Fragment>
                    )}
                    {MemberListSorted && MemberListSorted.length === 0 && Contacts?.length !==0 ?// <h4 className="noresultfound">No Result Found</h4> 
                        <NoDataFound centered={true} title={"No Data Found"} src={No_search_found} className={"No_data_div"} />
                    : Contacts?.length ===0 && MemberListSorted.length == 0&&  <NoDataFound centered={true} title={"No Contact Empty"} src={No_contacts} className={"No_data_div"} />}
                </Scrollbars>
                {/* create group next button */}
                {((type === "broadcast" && selectMember.length > 1)||type === "group" && selectMember.length > 0) && (<div className="createbuttonsbtm">
                    <Button
                        onClick={() => setCommonSidebarOpen(true)}
                    >
                        Next ({selectMember.length})
                    </Button>
                </div>)}
            </ListGroup>
        </div>
    )
}

export default Creategrouplist;