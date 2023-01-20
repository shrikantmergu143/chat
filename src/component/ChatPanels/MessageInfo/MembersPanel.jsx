/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import DummyImage from '../../../assets/img/profile/dummyimage.png';
import { ListGroup, ListGroupItem, Image } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { formatPhoneNumber } from '../GroupInfo/ProfileDetails';
import moment from 'moment';
import ProfileAuthPreview from '../ProfileAuthPreview';

export const timeSince = (dateParam)=> {
    if (!dateParam) {
        return null;
      }
    
      const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
      const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
      const today = new Date();
      const yesterday = new Date(today - DAY_IN_MS);
      const seconds = Math.round((today - date) / 1000);
      const minutes = Math.round(seconds / 60);
      const isToday = today.toDateString() === date.toDateString();
      const isYesterday = yesterday.toDateString() === date.toDateString();
      const isThisYear = today.getFullYear() === date.getFullYear();
    
    
      if (seconds < 5) {
        return 'Just now';
      } else if (seconds < 60) {
        return `Today, ${ seconds } seconds ago`;
      } else if (seconds < 90) {
        return `Today, ${ minutes } minute ago`;
      } else if (minutes < 60) {
        return `Today, ${ minutes } minutes ago`;
      } else if (isToday) {
        return `Today, ${moment(dateParam).format('HH:MM A')}`; // Today at 10:20
      } else if (isYesterday) {
        return `Yesterday, ${moment(dateParam).format('HH:MM A')}`; // Yesterday at 10:20
      } else if (isThisYear) {
        //   console.log("dateParam", moment.utc(dateParam)..format('MMM d, YYYY'))
        return moment(dateParam).format('MMM D, HH:MM A'); // 10. January at 10:20
      }
    
      return moment(dateParam).format('MMM D, YYYY'); // 10. January 2017. at 10:20
}
export default function MembersPanel(props) {
  const { SelectedRoom, userLogin } = useSelector((state) => state.allReducers);
  const {msg} = props;
  const GroupsUserList = [];
    const Users = msg?.seen_bylength?.map((item)=>{
        const checkUsers = SelectedRoom?.users?.filter((items)=>items?.id === item?.user_id);
        if(checkUsers?.length === 1){
            return{
                ...item,
                users:checkUsers[0]
            }
        }
    });
    const DeliveredUsers = msg?.delivered_bylength?.map((item)=>{
        const checkUsers = SelectedRoom?.users?.filter((items)=>items?.id === item?.user_id);
        if(checkUsers?.length === 1){
            return{
                ...item,
                users:checkUsers[0]
            }
        }
    })
    .filter((item)=>{
        const users = Users?.filter((items)=>items?.user_id === item?.user_id);
        if(users?.length === 0 || users === undefined)
            return item;
        else
            return null;
    });
//   console.log("UsersUsers", props);
  const MembersList = (props)=>{
      const {user, type, date} = props;
      return(
        user!==undefined && user?.id!==userLogin?.user_id &&
        <ListGroup.Item
            className="d-flex justify-content-between align-items-start"
        >
            {/* {user?.avatar_url !== undefined && user?.avatar_url !== null ? <Image 
                src={user?.avatar_url} 
                alt="member"
                onError={(e)=>e.target.src=DummyImage}
            /> : <Image src={DummyImage} alt="dummy image" />} */}
            <ProfileAuthPreview 
                url={user?.view_thumbnail_url}
                className={"avatarImage"}
                avatar={user}
                defultIcon={DummyImage}
            />
            <div className="ChatMemberDetails">
                <h4>{user?.id === userLogin?.user_id ? "You" : user?.name ? user?.name: user?.phone}</h4>
                <small className="msgdelivered">
                    <div className={` d-flex align-items-center ${type === "seenMessage"?"SeenBy":' DeliveredBy'}`}>
                        <div className={type}></div>
                        <p className='SeenBy'>
                            {date!=="None" ?
                                // moment.utc(date?.substring(0, date?.length - 1)).local().fromNow()
                               timeSince(new Date(moment.utc(date).local()))
                            : 
                                "--:--"
                            }
                         </p>
                    </div>
                </small>
            </div>
        </ListGroup.Item>
      )
  }
  return (
    <div>
        {/* <div className='MessageSeenInfo'>
        {(msg?.group_id!== undefined || msg?.broadcast_group_id!==undefined)
             &&<div className="d-flex justify-content-between align-items-start px-3 py-3">
                    <div className="ChatMemberDetails ReadBy"> Read by</div> 
                  </div>
        }
        </div> */}
        {(msg?.group_id!== undefined || msg?.broadcast_group_id!==undefined) ?
        <React.Fragment>
            <div className="d-flex justify-content-between align-items-start px-3 py-3 border-bottom-1">
                <div className="ChatMemberDetails title ReadBy"> Read by</div> 
            </div>
            {Users?.map((user, index) => 
                (<React.Fragment key={index?.toString()}>
                    <MembersList user={user?.users} date={user?.date} type={"seenMessage"} />
                </React.Fragment>
                )
            )}
            {(msg?.group_id!== undefined || msg?.broadcast_group_id!==undefined) && <div
                        className="d-flex justify-content-between align-items-start px-3 py-3 border-bottom-1"
                    >
                        <div className="ChatMemberDetails title DeliveredBy"> Delivered by</div> 
                    </div>
            }
            {DeliveredUsers?.map((user, index) => 
            Users?.filter((items)=>items?.user_id === user?.user_id)?.length ? null :(
                <MembersList user={user?.users} date={user?.date} key={index} type={"seenMessage Delivered"}/>
            ))}
        </React.Fragment>
        :
        <div className='MessageSeenInfo'>
            <ListGroup.Item className="d-flex justify-content-between align-items-start">
                <div className="ChatMemberDetails">
                    <div className=''>
                        <small className="msgdelivered">
                            <div  className='SeenBy  d-flex align-items-center'>
                                <div className="seenMessage "></div>
                                <h4>Read</h4>
                            </div>
                        </small>
                    </div>
                    <p className='SeenBy'>
                    {msg?.seen_at!=="None" ?
                        // moment.utc(msg?.seen_at).local().fromNow()
                         timeSince(new Date(moment.utc(msg?.seen_at).local()))
                         : "--:--"}
                    </p>
                </div>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-start">
                <div className="ChatMemberDetails pn-4">
                    <div className=''>
                        <small className="msgdelivered">
                            <div  className='DeliveredBy  d-flex align-items-center'>
                                <div className="seenMessage Delivered "></div>
                                <h4>Delivered</h4>
                            </div>
                        </small>
                    </div>
                    <p className='SeenBy'>
                    {msg?.delivered_at!=="None" ?
                        //  moment.utc(msg?.delivered_at).local().fromNow()
                         timeSince(new Date(moment.utc(msg?.delivered_at).local()))
                    : "--:--"}
                    </p>
                </div>
            </ListGroup.Item>
           {/* {msg?.delivered_at==="None" && <ListGroup.Item className="d-flex justify-content-between align-items-start">
                <div className="ChatMemberDetails pn-4">
                    <h4>Delivered</h4>
                    <p className='DeliveredBy msgdelivered'>
                        <div className="seenMessage Delivered"></div>
                        {moment.utc(msg?.created_at).local().format('hh:mm a')}
                    </p>
                </div>
            </ListGroup.Item>} */}
        </div>
        }
    </div>
  )
}
