/* eslint-disable */
import React, { useState } from "react";
import { Modal, Button, ListGroup, Image } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import DummyImage from '../../assets/img/profile/dummyimage.png';
import No_search_found from '../../assets/img/sidebar/No_search_found.svg';
import { Scrollbars } from 'react-custom-scrollbars-2';
import SearchBox from "./SearchBox";
import dummygroup from "./../../assets/img/profile/dummygroup.png"
import { formatPhoneNumber } from "../ChatPanels/GroupInfo/ProfileDetails";
import ProfileAuthPreview from "../ChatPanels/ProfileAuthPreview";
import NoDataFound from "./NoDataFound";

function ModalCommon(props) {
    const { show, onHide, msg, memberslist, button_title  } = props;
    // const memberslist = useSelector((state) => state.allReducers.Rooms);
    const [ filterMembers, setFilterMembers ] = useState("");
    const [selectContact, setSelectContact] = useState([]);
    const FliterArray = memberslist&& memberslist?.filter((elm) => {
        if(filterMembers == "") {
            return elm;
        } else if (elm?.name?.toLowerCase()?.includes(filterMembers && filterMembers?.toLowerCase())) {
            return elm;
        } else if (elm?.group_name?.toLowerCase()?.includes(filterMembers && filterMembers?.toLowerCase())) {
            return elm;
        } else if (elm?.broadcast_name?.toLowerCase()?.includes(filterMembers && filterMembers?.toLowerCase())) {
            return elm;
        }
    })
    const SelectUserFn = (user) =>{
        const state = selectContact?.filter((item)=>item===user);
        if(state?.length>0){
            const data = selectContact?.filter((item)=>item!==user);
            setSelectContact(data)
        }else{
            setSelectContact([...selectContact, user])
        }
    }
    const SignleSelectUserFn =(user) =>{
        setSelectContact([ user])
    }
    const OnClose = async () => {
        setSelectContact([])
        await onHide();
    }
    return(
        <Modal
            show={show}
            onHide={OnClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="customModalDesign"
            key={show.toString()}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
               {msg}
                </Modal.Title>
                <SearchBox 
                    filterMembers={filterMembers}
                    setFilterMembers={setFilterMembers}
                />
            </Modal.Header>
            <Modal.Body>
                <div className="ChatMemberList">
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
                            {FliterArray && FliterArray.sort(( a, b )=> 
                            a?.name?a?.name?.localeCompare(b.name?b.name:b.group_name):a?.group_name?.localeCompare(b.name?b.name:b.group_name)
                            ).map((user, index) => 
                                <label htmlFor={"userids" + user?.id} key={index}>
                                    {/* {console.log("user", user)} */}
                                    <ListGroup.Item >
                                        {user?.admin_ids!==undefined?
                                            <ProfileAuthPreview
                                                url={user?.avatar?.view_thumbnail_url}
                                                className={""}
                                                avatar={user?.avatar}
                                                defultIcon={dummygroup}
                                                outerDiv={true}
                                                click={false}
                                            />
                                        :
                                        // user?.avatar_url !== undefined && user?.avatar_url !== null ? 
                                        // <Image 
                                        //     src={user?.avatar_url} 
                                        //     alt="member"
                                        // /> : <Image src={DummyImage} alt="dummy image" />
                                        <ProfileAuthPreview 
                                            url={user?.view_thumbnail_url}
                                            className={"avatarImage"}
                                            avatar={user}
                                            defultIcon={DummyImage}
                                        />
                                        }
                                        {user?.admin_ids!==undefined?
                                        <div className="ChatMemberDetails" style={{display:"grid"}}>
                                            <h4 dangerouslySetInnerHTML={{__html: user?.group_name}}></h4>

                                        </div>:
                                        <div className="ChatMemberDetails" style={{display:"grid"}}>
                                            <h4>{user?.name?user?.name:`+${user?.phone_code}${formatPhoneNumber(user?.phone)}`}</h4>
                                            
                                            {(user?.is_block === false || user?.is_block === undefined) ?(user?.phone !== "" ? <p>+{user?.phone_code}{formatPhoneNumber(user?.phone)}</p> : null)
                                            :<p>This user is blocked</p>}
                                        </div>
                                        }
                                        <div className="customCheckBoxNew">
                                            <label className="containernew" >
                                                <input 
                                                    type="checkbox" 
                                                    id={"userids" + user?.id}  
                                                    onChange={() =>
                                                        (user?.is_block === false || user?.is_block === undefined) && (props?.isMultiple === true ? 
                                                            SelectUserFn(user?.id)
                                                        :SignleSelectUserFn(user?.id))
                                                    }
                                                    checked = {
                                                        selectContact?.filter((item)=>item===user?.id)?.length>0?true : false
                                                    }
                                                />
                                                <span className="checkmark"></span>
                                            </label>
                                        </div>
                                    </ListGroup.Item>
                                </label>
                            )}
                            {FliterArray && FliterArray.length == 0 ? //<h4 className="noresultfound">No Result Found</h4> 
                            <NoDataFound centered={true} title={"No Data Found"} src={No_search_found} className={"No_data_div"} />
                            : null}
                        </Scrollbars>
                      {selectContact?.length>0 &&  <div className='createbuttonsbtm'>
                            <Button onClick={()=>props?.formSubmit(selectContact, setSelectContact )}>{button_title}</Button>
                        </div>}
                    </ListGroup>
                </div>
            </Modal.Body>
        </Modal>
    )
} 

export default ModalCommon;