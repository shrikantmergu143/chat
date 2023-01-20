import React from 'react'

export default function NoDataFound(props) {
  if(props?.centered === true){
    return(
        <div style={{
            height:"100%",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
        }}>
        <div className={'No_data_div '+props?.className}>
            <img alt={""} className={"No_datafound"} src={props?.src} />
            <h4 className='notdatafound'>{props?.title}</h4>
        </div>
      </div>
    )
  }
  return (
    <div className={'No_data_div '+props?.className}>
        <img alt={""} className={"No_datafound"} src={props?.src} />
        <h4 className='notdatafound'>{props?.title}</h4>
    </div>
  )
}
