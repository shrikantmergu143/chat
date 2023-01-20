import React from "react";
import Toast from 'react-bootstrap/Toast';
import { ToasterMessageShow } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";

const ToasterAlert = (props) => {
    const { ToasterMsg } = props;
    const dispatch = useDispatch();

    return(
        <Toast 
            onClose={() => dispatch(ToasterMessageShow({msg: "", status: "", show: false}))} 
            show={ToasterMsg?.show} 
            delay={3000} 
            autohide
        >
          <Toast.Body className={ToasterMsg?.status === "error" ? "bg-danger text-white" : "bg-success text-white"} >
            {ToasterMsg?.msg}
            <button className="btn-close" onClick={() => dispatch(ToasterMessageShow({msg: "", status: "", show: false}))} ></button>  
          </Toast.Body>
        </Toast>
    )
}

export default ToasterAlert;