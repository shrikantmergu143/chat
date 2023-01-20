/* eslint-disable array-callback-return */
/* eslint-disable */
import { ButtonGroup, Dropdown } from 'react-bootstrap';
import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setUserTypeing } from '../../redux/actions';

const CommanTyping = (props) => {   
    const {
      SelectedRoom,
      user_id,
      type
    } = props;
    const DetailsList = useSelector((state) => state.allReducers.DetailsList);
    const Contacts = useSelector((state) => state?.allReducers?.Contacts);
    const dispatch = useDispatch();

    useEffect(()=>{
        setTimeout(()=>{
            dispatch(setUserTypeing({
                ...SelectedRoom?.userTyping,
                status:0
            }));
        }, 5000)
    }, [])

    if(SelectedRoom?.userTyping?.to_id){
        let users = SelectedRoom?.users?.filter((item)=>item?.id === user_id)[0];
        if(!users){
            if(DetailsList[SelectedRoom?.id]){
                const RoomData = DetailsList[SelectedRoom?.id];
                const Userdata = RoomData?.users?.filter((item)=>item?.id === user_id)[0];
                users = {
                    ...Userdata,
                    name:Userdata?.phone
                };
            }

        }
        if(users){
            const Is_Contact = Contacts?.filter((item)=>item?.id === user_id);
            if(Is_Contact?.length>0){
                users.name = Is_Contact[0]?.name
            }else{
                users.name = users?.phone
            }
        }
        return type?(
            <Dropdown as={ButtonGroup} >
                <li className={"chatMessageList"} >
                
                    <div className="typeing_main_div groups">
                        <div className="chat-bubble">
                            {SelectedRoom?.userTyping?.to_id?
                            <small className='groupusername_display' style={{fontSize:10}}>{users?.name}</small>
                            :
                            <small className='groupusername_display'   style={{fontSize:10}}>typing</small>
                            }
                            <div className="typing">
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </div>
                        </div>
                    </div>
                </li>
            </Dropdown>
        ):(
            <div className="typeing_main_div small">
            <div className="typing">
            {SelectedRoom?.userTyping?.to_id?
            <span>{users?.name} typing</span>
            :
            <span>typing</span>
            }
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
        </div>
        )
    }
    return type?(
        <Dropdown as={ButtonGroup} >
            <li className={"chatMessageList"} >
                <div className="typeing_main_div">
                    <div className="chat-bubble">
                        <div className="typing">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                    </div>
                </div>
            </li>
        </Dropdown>
    ):(
        <div className="typeing_main_div small">
            <div className="typing">
            <span>typing</span>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
        </div>
    )
}

export default CommanTyping;