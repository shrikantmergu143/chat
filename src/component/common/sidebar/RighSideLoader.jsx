import React from 'react'
import spinner_transferent from "./../../../assets/img/spinner_transferent.svg";

export default function RighSideLoader(props) {
    const {isShow, className, title } = props
  return (
      isShow &&
        <React.Fragment>
          <div className={className}>
            <img src={spinner_transferent} alt={spinner_transferent} />
            {title ? title:null}
          </div>
        </React.Fragment>
  )
}

export const LoaderComman = (props)=> {
    const {isShow, className, title } = props
  return (
      isShow &&
        <React.Fragment>
          <div className={className}>
            <div className='commanLoader'/>
            {title ? title:null}
          </div>
        </React.Fragment>
  )
}
export const MessagesListLoader = (props)=> {
  const {isShow, className, title } = props
  return (
      isShow &&
        <React.Fragment>
          <div className={className}>
            <div className='MessaegsList_loader'/>
            {title ? title:null}
          </div>
        </React.Fragment>
  )
}
