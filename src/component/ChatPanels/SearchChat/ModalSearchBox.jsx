/* eslint-disable */
import React, { useContext, useEffect, useState } from "react";
import { Modal, Form, Image, ListGroup, ListGroupItem, Badge, Alert, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from "react-redux";
import CloseIcon from "../../../assets/img/close-sidebar.svg"
import { WebSocketContext } from "../../Index";
import Search from '../../../assets/img/sidebar/search.svg';
import { setSearchModalData } from "../../../redux/actions";
import NoDataFound from "../../common/NoDataFound";
import No_search_found from "../../../assets/img/sidebar/No_search_found.svg";
import { useNavigate } from "react-router-dom";
import MessagesPanel from "./MessagesPanel";
import VideoGridView from "./VideoGridView"
import ImageGridView from "./ImageGridView"
import { Scrollbars } from 'react-custom-scrollbars-2';
import SavePreviewPopup from "../../common/SavePreviewPopup";
import wsSend_request from "../../../Api/ws/ws_request";
import MembersListUsers from "./MembersListUsers";

const ImagesExtention = ['jpg', "jpeg", "png", "webp"];
const VideosExtention = ['mp4', "webm"];
const AudiosExtention = ['mp3', "m4a", "ogg", "wav", "mpeg"];
const DocumentsExtention = [ "pdf","zip","psd","ppt","txt","rar","doc","docx","xls","ods","deb","xlsx","tif","dll","sav","dat","dbf","excel","avi","mkv","wmv","mov"];

const TagButtons = ["Images", "Documents", "Videos", "Audios", "Contacts"];
function ModalConfirmPopup(props) {
    const { userLogin, SearchModal, DetailsList, UserDetails, getChatHistory, MessageList, BroadcastList } = useSelector((state) => state?.allReducers);
    const [SearchInput, setSearchInput] = useState("");
    const access_token = useSelector((state) => state?.allReducers?.access_token);
    const [SelectTag, setSelectTag] = useState("")
    const [PreviewImageVideo, setPreviewImageVideo] = useState(false);
    const navigate = useNavigate();
    const [ CurrentVideoImage, setCurrentSelectedFile ] = useState({});
    const [modalShow, setModalShow] = useState(false)
    const { websocket } = useContext(WebSocketContext);
    const [Syncing, setSyncing] = useState(false);
    const dispatch = useDispatch();


    useEffect(() => {
        if(SearchModal === true){
            if(getChatHistory?.length>0){
                setSyncing(true);
            }else{
                setSyncing(false);
            }
            SyncGetChatsDetails()
        }
    }, [SearchModal]);
    useEffect(()=>{
        if(SearchModal === true){
            if(getChatHistory?.length>0){
                setSyncing(true);
            }else{
                setSyncing(false);
            }
        }
    },[getChatHistory?.length === 0])
    const SyncGetChatsDetails = () =>{
        getChatHistory?.map((item)=>{
            wsSend_request(websocket, item);
        })
    }
    const OnClose = () => {
        dispatch(setSearchModalData(false));
    }
    if (SearchModal === false) {
        return (<div />);
    } else {

        const DetailsLists = Object.entries(DetailsList)?.map(([k, v]) => ({["id"]:k,["details"]:v}));
        const UsersList = Object.entries(UserDetails)?.map(([k, v]) => ({["id"]:k,["details"]:v}));
        const Messages = Object.entries(MessageList)?.map(([k, v]) => ({ ["id"]: k, ["messages"]: v }));
        const MessagesLists = Messages?.map((item) => {
            if (UserDetails[item?.id]) {
                return {
                    ...item,
                    details: UserDetails[item?.id]
                };
            } else if (DetailsList[item?.id]) {
                return {
                    ...item,
                    details: DetailsList[item?.id]
                };
            } else if (BroadcastList[item?.id]) {
                return {
                    ...item,
                    details: BroadcastList[item?.id]
                };
            }
        })
        const ChatMessagesPush = [];
        const MessagesTabListFilter = MessagesLists?.filter((item) => {
            if (SearchInput?.length === 0) {
                return null;
            }else if( SelectTag !== ""){
                return null;
            }else if (item?.details?.phone && item?.details?.phone?.toLowerCase()?.includes(SearchInput && SearchInput?.toLowerCase())) {
                ChatMessagesPush?.push({
                    ...item,
                    messages: undefined
                })
                return item;
            } 
            else if (item?.details?.name && item?.details?.name?.toLowerCase()?.includes(SearchInput && SearchInput?.toLowerCase())) {
                ChatMessagesPush?.push({
                    ...item,
                    messages: undefined
                })
                return item;
            } else if (item?.details?.group_name && item?.details?.group_name?.toLowerCase()?.includes(SearchInput && SearchInput?.toLowerCase())) {
                ChatMessagesPush?.push({
                    ...item,
                    messages: undefined
                })
            } else if (item?.details?.broadcast_name && item?.details?.broadcast_name?.toLowerCase()?.includes(SearchInput && SearchInput?.toLowerCase())) {
                ChatMessagesPush?.push({
                    ...item,
                    messages: undefined
                })
            }
        })
        MessagesLists?.map((item) => {
            if (SearchInput?.length === 0 && SelectTag === "") {
                return null;
            } else {
                item?.messages?.filter((msg) => {
                    if("Contacts" === SelectTag){
                        if(msg?.message_type === "contact"){
                            if(SearchInput?.length === 0){
                                ChatMessagesPush?.push({
                                    details: item?.details,
                                    messages: msg
                                })
                                return item;
                            }else if(msg?.message?.toLowerCase()?.includes(SearchInput?.toLowerCase())){
                                ChatMessagesPush?.push({
                                    details: item?.details,
                                    messages: msg
                                })
                                return item;
                            }
                        }
                    }
                    if("Audios" === SelectTag){
                        if(msg?.message_type === "file"){
                            const filter = AudiosExtention?.filter((item1)=>{
                                if(msg?.file?.name && msg?.file?.name?.toLowerCase()?.includes(item1 && `.${item1}`?.toLowerCase())){
                                    return item1;
                                }else{
                                    return null;
                                }
                            })
                            if(filter?.length>0){
                                if(SearchInput?.length === 0){
                                    ChatMessagesPush?.push({
                                        details: item?.details,
                                        messages: msg
                                    })
                                    return item;
                                }else if(msg?.file?.name?.toLowerCase()?.includes(SearchInput?.toLowerCase())){
                                    ChatMessagesPush?.push({
                                        details: item?.details,
                                        messages: msg
                                    })
                                    return item;
                                }
                            }
                        }
                    }
                    if("Videos" === SelectTag){
                        if(msg?.message_type === "file"){
                            const filter = VideosExtention?.filter((item1)=>{
                                if(msg?.file?.name && msg?.file?.name?.toLowerCase()?.includes(item1 && `.${item1}`?.toLowerCase())){
                                    return item1;
                                }else{
                                    return null;
                                }
                            })
                            if(filter?.length>0){
                                if(SearchInput?.length === 0){
                                    ChatMessagesPush?.push({
                                        details: item?.details,
                                        messages: msg
                                    })
                                    return item;
                                }else if(msg?.file?.name?.toLowerCase()?.includes(SearchInput?.toLowerCase())){
                                    ChatMessagesPush?.push({
                                        details: item?.details,
                                        messages: msg
                                    })
                                    return item;
                                }
                            }
                        }
                    }
                    if("Documents" === SelectTag){
                        if(msg?.message_type === "file"){
                            const filter = DocumentsExtention?.filter((item1)=>{
                                if(msg?.file?.name && msg?.file?.name?.toLowerCase()?.includes(item1 && `.${item1}`?.toLowerCase())){
                                    return item1;
                                }else{
                                    return null;
                                }
                            })
                            if(filter?.length>0){
                                if(SearchInput?.length === 0){
                                    ChatMessagesPush?.push({
                                        details: item?.details,
                                        messages: msg
                                    })
                                    return item;
                                }else if(msg?.file?.name?.toLowerCase()?.includes(SearchInput?.toLowerCase())){
                                    ChatMessagesPush?.push({
                                        details: item?.details,
                                        messages: msg
                                    })
                                    return item;
                                }
                            }
                        }
                    }
                    if("Images" === SelectTag){
                        if(msg?.message_type === "file"){
                            const filter = ImagesExtention?.filter((item1)=>{
                                if(msg?.file?.name && msg?.file?.name?.toLowerCase()?.includes(item1 && `.${item1}`?.toLowerCase())){
                                    return item1;
                                }else{
                                    return null;
                                }
                            })
                            if(filter?.length>0){
                                if(SearchInput?.length === 0){
                                    ChatMessagesPush?.push({
                                        details: item?.details,
                                        messages: msg
                                    })
                                    return item;
                                }else if(msg?.file?.name?.toLowerCase()?.includes(SearchInput?.toLowerCase())){
                                    ChatMessagesPush?.push({
                                        details: item?.details,
                                        messages: msg
                                    })
                                    return item;
                                }
                            }
                        }
                    }else if(SelectTag === ""){
                        if (msg?.message_type === "location" && (msg?.message?.toLowerCase()?.includes(SearchInput && SearchInput?.toLowerCase()))) {
                            ChatMessagesPush?.push({
                                details: item?.details,
                                messages: msg
                            })
                        }else if (msg?.message_type === "text" && (msg?.message?.toLowerCase()?.includes(SearchInput && SearchInput?.toLowerCase()))) {
                            ChatMessagesPush?.push({
                                details: item?.details,
                                messages: msg
                            })
                        } else if (msg?.message_type === "file" && (msg?.file?.name?.toLowerCase()?.includes(SearchInput && SearchInput?.toLowerCase()))) {
                            ChatMessagesPush?.push({
                                details: item?.details,
                                messages: msg
                            })
                        }else if (msg?.message_type === "contact" && (msg?.message?.toLowerCase()?.includes(SearchInput && SearchInput?.toLowerCase()))) {
                            ChatMessagesPush?.push({
                                details: item?.details,
                                messages: msg
                            })
                        }
                    }
                })
            }
        });
        const CallSetTagSelected = (data)=>{
            console.log("data", data)
            setSelectTag(data === SelectTag ?"":data)
        }
        let ImageGridViewstate = false;
        if("Images"?.toLowerCase() === SelectTag?.toLowerCase()){
            ImageGridViewstate = true
        }
        let VideosGridViewstate = false;
        if("Videos"?.toLowerCase() === SelectTag?.toLowerCase()){
            VideosGridViewstate = true
        }
        const setOpenModalBox = (msg) =>{
            setCurrentSelectedFile({...msg});
            setModalShow(true)
            setPreviewImageVideo(true)
        } 
        const FilterDetailsCount = DetailsLists?.filter((item)=>{
            if(MessagesLists?.filter((item1)=>item1?.id===item?.id)?.length === 1){
                return null
            }
            return item;
        });
        const FilterUsersCount = UsersList?.filter((item)=>{
            if(MessagesLists?.filter((item1)=>item1?.id===item?.id)?.length === 1){
                return null
            }
            return item;
        });

        // if(FilterDetailsCount?.length !== 0 || FilterUsersCount?.length !== 0){
        //     FilterDetailsCount?.map((item)=>{
        //         let param = {
        //             "transmit":"single",
        //             "url":"get_chats",
        //             "request": {
        //                 "chat_type":"group",
        //                 "to_id": item?.id,
        //                 "updated_at": "",
        //                 "is_limit":500
        //             }
        //         }
        //         // console.log("get_chats", param, SelectedRoom)
        //         wsSend_request(websocket, param);
        //     })
        //     FilterUsersCount?.map((item)=>{
        //         let param = {
        //             "transmit":"single",
        //             "url":"get_chats",
        //             "request": {
        //                 "chat_type":"single",
        //                 "to_id": item?.id,
        //                 "updated_at": "",
        //                 "is_limit":500
        //             }
        //         }
        //         // console.log("get_chats", param, SelectedRoom)
        //         wsSend_request(websocket, param);
        //     })
        //     setSyncing(false);
        // }

        // const CallForwardMessage = (filter, sender_name, type) =>{};
        // const callForwardMessageAPI = (filter, sender_name, type) =>{};

        return (
        <React.Fragment>
            <div className="Search_Component">
                <Modal
                    show={SearchModal}
                    onHide={OnClose}
                    centered
                    className="SearchModal"
                    key={"SearchModal"}
                    size="lg"
                >
                    <Modal.Header className={"px-5"} >
                        <div className="chatSearchBox mb-3">
                            <label htmlFor={"search_input"}>
                                <Image src={Search} alt="search" />
                            </label>
                            <Form.Control
                                disabled={Syncing} 
                                placeholder="Search…"
                                className={"px-5"}
                                id={"search_input"}
                                value={SearchInput}
                                name={"Search"}
                                onChange={(e) => setSearchInput(e?.target?.value)}
                            />
                            {SearchInput?.length > 0 &&
                                <label htmlFor={"search_input"}>
                                    <Image onClick={() => setSearchInput("")} src={CloseIcon} className={"right"} alt="search" />
                                </label>}
                        </div>
                        <div className="d-flex w-auto search_tags gap-2">
                            {
                                TagButtons?.map((item, index)=>(
                                    <React.Fragment key={index}>
                                        <button disabled={Syncing} onClick={()=>CallSetTagSelected(item)} className={`btn ${SelectTag === item && "active"}`}>
                                            {item}
                                        </button>
                                    </React.Fragment>
                                ))
                            }
                        </div>
                    </Modal.Header>
                    <Modal.Body style={{ minHeight: "360px" }}>
                       {Syncing === true && <div className="px-4">
                            <Alert  variant={"info"}>
                                <div className="d-flex align-items-center gap-2">
                                    <Spinner size="sm" className="" animation="border"/>
                                    Please wait syncing your messages
                                </div>
                            </Alert>
                        </div>}
                        <div className="chatpannelwrapper" style={{ height: "100%" }} >
                            <div  className="CHatcustomscroll">
                            {ChatMessagesPush?.length > 0 &&
                                <React.Fragment>
                                    <ListGroup as={"ul"}  variant="flush" style={{height:"100%"}}>
                                        <Scrollbars
                                            renderTrackVertical={props => <div {...props} className="track-vertical"/>}
                                            renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
                                            renderView={props => <div {...props} className={`view`} style={{
                                                marginBottom: "-1px",
                                                position: "absolute",
                                                inset: "0px",
                                                overflow: "scroll",
                                                marginRight: "-19px",
                                            }} />}
                                            style={{
                                                height: "calc(100vh - 150px)",
                                                minHeight:"340px"
                                            }}
                                            className="scrollararea"
                                        >
                                        <div className={`${(ImageGridViewstate === true||VideosGridViewstate === true) && "grid_images"}`}>
                                            {ChatMessagesPush.sort(( a, b )=> {
                                                    return new Date( b?.messages?.created_at ) - new Date( a?.messages?.created_at )
                                            })?.map((msg, index)=>(
                                                <React.Fragment key={index?.toString()}>
                                                    {ImageGridViewstate === false&& VideosGridViewstate===false && msg?.messages!== undefined && MessagesPanel({
                                                        msg:msg?.messages,
                                                        chatDetails:msg?.details,
                                                        access_token:access_token,
                                                        userLogin:userLogin,
                                                        DetailsList:DetailsList,
                                                        UserDetails:UserDetails,
                                                        navigate:navigate,
                                                        dispatch:dispatch
                                                    })}
                                                    {ImageGridViewstate === true && msg?.messages!== undefined && ImageGridView({
                                                        msg:msg?.messages,
                                                        chatDetails:msg?.details,
                                                        access_token:access_token,
                                                        userLogin:userLogin,
                                                        setOpenModalBox:setOpenModalBox
                                                    })}
                                                    {VideosGridViewstate === true && msg?.messages!== undefined && VideoGridView({
                                                        msg:msg?.messages,
                                                        chatDetails:msg?.details,
                                                        access_token:access_token,
                                                        userLogin:userLogin,
                                                        setOpenModalBox:setOpenModalBox
                                                    })}
                                                    {ImageGridViewstate === false&& VideosGridViewstate===false && msg?.messages === undefined && MembersListUsers({
                                                        user:msg?.details,
                                                        chatDetails:msg?.details,
                                                        access_token:access_token,
                                                        userLogin:userLogin,
                                                        navigate:navigate,
                                                        setOpenModalBox:setOpenModalBox,
                                                        dispatch:dispatch
                                                    })}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                        </Scrollbars>
                                    </ListGroup>
                                </React.Fragment>
                            
                            }
                            {ChatMessagesPush?.length <= 0 &&
                                <NoDataFound centered={true} title={"No Data Found"} src={No_search_found} className={"No_data_div p-5"} />
                            }
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
                {PreviewImageVideo === true && (
                    <SavePreviewPopup 
                        setOpenModalBox={setOpenModalBox}
                        setModalShow={setModalShow}
                        setPreviewImageVideo={setPreviewImageVideo}
                        CurrentVideoImage={CurrentVideoImage}
                        UserId={userLogin?.user_id}
                        UnsaveButton={false}
                    />)
                }
            </div>
        </React.Fragment>
        )
    }
}
export default ModalConfirmPopup;