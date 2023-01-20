import React from 'react'

export default function MessageStatus(props) {
    const {msg, SelectedRoom} = props;
  return msg?.deleted_at === null &&(
    <React.Fragment>
        {(msg?.group_id !== undefined && msg?.broadcast_group_id === undefined) ?
            <React.Fragment>
            { (
                (msg?.delivered_bylength?.length  < SelectedRoom?.users?.length &&  msg?.seen_bylength?.length  < SelectedRoom?.users?.length )
                    || 
                    (
                        msg?.seen_by === null && msg?.delivered_by === null
                    )
                )? 
                <div className="messageNotSeen"></div> :
                msg?.delivered_bylength?.length ===  SelectedRoom?.users?.length && msg?.seen_bylength?.length ===  SelectedRoom?.users?.length ?
                <div className="seenMessage Delivered"></div>
                :<div className="seenMessage"></div>
            }
            </React.Fragment>:<React.Fragment></React.Fragment>}
            {( msg?.broadcast_group_id !== undefined) &&
            <React.Fragment>
            { (
                (msg?.delivered_bylength?.length  < SelectedRoom?.users?.length &&  msg?.seen_bylength?.length  < SelectedRoom?.users?.length )
                    || 
                    (
                        msg?.seen_by === null && msg?.delivered_by === null
                    )
                )? 
                <div className="messageNotSeen"></div> :
                msg?.delivered_bylength?.length >=  SelectedRoom?.users?.length && msg?.seen_bylength?.length >=  SelectedRoom?.users?.length ?
                <div className="seenMessage Delivered"></div>
                :<div className={
                    msg?.delivered_by === null ?"messageNotSeen":"seenMessage"}></div>
            }
            </React.Fragment>}
        {msg?.group_id === undefined && msg?.broadcast_group_id === undefined ?
            (msg.delivered_at === "None" && msg?.seen_at === "None" )? 
            <div className="messageNotSeen"></div> :
            msg.delivered_at !== "None" && msg?.seen_at === "None"?
            <div className="seenMessage"></div>
            :
            <div className="seenMessage Delivered"></div>
            :
            <React.Fragment></React.Fragment>
        }
    </React.Fragment>
  )
}
