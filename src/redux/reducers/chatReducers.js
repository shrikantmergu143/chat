/* eslint-disable */
import { ActionTypes } from "../../redux/actions";
import moment, { relativeTimeRounding } from "moment";
import { PaginationList } from "../../component/ChatPanels/Index";

const initailData = {
    user_id: "",
    access_token: "",
    MyProfile: {},
    Rooms: [],
    SelectedRoom: {},
    BlockedUserList: [],
    MainTabsSelected: "Chat",
    Messages: [],
    SavedMessages: [],
    Contacts:[],
    MessageList: [],
    SaveChatList: [],
    qr_token:"",
    userLogin:{},
    is_online:"",
    Toaster_message: {
        msg: "",
        status: "", 
        show: false,
    },
    registration_id:"",
    registration_ids:"",
    NotiVisible:true,
    ModalPopup:{
        Title:"",
        IsShow:false,
        Desription:"",
        Id:"",
        ActionType:{}
    },
    MessagesTab:[],
    ContactTab:[],
    GoBackToHome:false,
    DetailsList:[],
    UserDetails:[],
    AllUsersList:[],
    BroadcastList:[],
    DeviceContact:[],
    magic_code:"",
    userTyping:[],
    Notification:[],
    SearchModal:false,
    getChatHistory:[],
    replySaveChat:[],
    view_thumbnail_url:[],
    view_base_url:[],
    user_types:[],
    select_types:[],
    scroll_chat_id:{
        msg_id:"",
        to_id:""
    },
    emojilist: {
        All: [],
        Smileys_Emotion: [],
        Animals_Nature: [],
        Food_Drink: [],
        Travel_Places: [],
        Activities: [],
        Objects: [],
        Flags: [],
    },
    GroupInfoSidebar: false,
    isAuthCheck:"checked",
    themeDarkLight: "light",
    pagination:{
        page_data:[],
        page_size:50,
        page_number:1
    }
}

export const chatReducers = (state = initailData, action) => {
    let url = window.location.pathname;
    let location_id = url.substring(url.lastIndexOf('/') + 1);
    switch(action.type) {
        case ActionTypes.USER_ID :
            return { ...state, user_id : action.payload };
        case ActionTypes.OPEN_GROUP_INFO :
            return {
                ...state,
                GroupInfoSidebar: action.payload,
            }
        case ActionTypes.THEME_CHANGE : 
            return {
                ...state,
                themeDarkLight: action.payload,
            }
        case ActionTypes.EMOJI_LIST_GET :
            return {
                ...state,
                emojilist: {
                    All: action.payload,
                    Smileys_Emotion: action.payload && action.payload.filter((elm) => elm.category === 'Smileys & Emotion'),
                    Animals_Nature: action.payload && action.payload.filter((elm) => elm.category === 'Animals & Nature'),
                    Food_Drink: action.payload && action.payload.filter((elm) => elm.category === 'Food & Drink'),
                    Travel_Places: action.payload && action.payload.filter((elm) => elm.category === 'Travel & Places'),
                    Activities: action.payload && action.payload.filter((elm) => elm.category === 'Activities'),
                    Objects: action.payload && action.payload.filter((elm) => elm.category === 'Objects'),
                    Flags: action.payload && action.payload.filter((elm) => elm.category === 'Flags'),
                },
            }
        case ActionTypes.GET_MESSAGE_LIST :
            let data = {};
            const old_messages = state?.MessageList[action?.payload?.id];
            // console.log("old_messages", old_messages);
            if(old_messages?.length === 0){
                data = {
                    ...state.MessageList,
                    [action?.payload?.id]:action?.payload?.Messages
                };
            }  else{
                const arrays = [];
                old_messages?.map((item)=>{
                    arrays?.push(item)
                })
                action?.payload?.Messages?.map((item)=>{
                    const matchList = arrays?.filter((item2)=>item2.id===item?.id)
                    if(matchList?.length>0){

                    }else{
                        arrays?.push(item)
                    }
                })
                const UpdatedData = arrays?.map((item)=>{
                    const checkData =   action?.payload?.Messages?.filter((item1)=>item1.id===item.id);
                    if(checkData?.length >0){
                        return {...checkData[0]}
                    }else{
                        return {
                            ...item
                        }
                    }
                })
                data = {...state.MessageList,[action?.payload?.id]:UpdatedData};
            }

            if(action?.payload?.id === location_id){
                const oldMessages = PaginationList(data[action?.payload?.id], state?.pagination?.page_size, 1);
                return {
                    ...state,
                    MessageList:data,
                    pagination:{
                        page_data:oldMessages?.reverse(),
                        page_size:initailData?.pagination?.page_size,
                        page_number:initailData?.pagination?.page_number,
                    }
                }
            }
            return {
                ...state,
                MessageList:data,
            }
        case ActionTypes.SET_ADD_BROADCAST_MESSAGES_LIST_BROADCAST:
            const old_BroadcastMSG = state?.MessageList[action?.payload?.id];
            // console.log("my_rooms", action?.payload,old_BroadcastMSG)

            old_BroadcastMSG?.push({
                ...action?.payload?.Messages,
                seen_by:null,
                delivered_by:null,
            });
            const my_rooms = state?.Rooms?.map((item)=>{
                if(item.id === action?.payload?.id){
                    // console.log("my_rooms", action?.payload, item)
                    return {
                        ...item,
                        last_message:action?.payload?.Messages?.message,
                        last_message_at:action?.payload?.Messages?.updated_at,
                        last_message_type:action?.payload?.Messages?.message_type,
                        file:action?.payload?.Messages?.file,
                    }
                }else 
                return {...item}
            });
            if(action?.payload?.id === location_id){
                state?.pagination?.page_data?.push({
                    ...action?.payload?.Messages,
                    seen_by:null,
                    delivered_by:null,
                })
                return{
                    ...state,
                    MessageList:{
                        ...state.MessageList,
                        [action?.payload?.id]:old_BroadcastMSG
                    },
                    Rooms:my_rooms,
                    pagination:{
                        page_data:state?.pagination?.page_data,
                        page_size:state?.pagination?.page_size,
                        page_number:state?.pagination?.page_number,
                    }
                }
            }
            // console.log("my_rooms", action?.payload, my_rooms);
            return{
                ...state,
                MessageList:{
                    ...state.MessageList,
                    [action?.payload?.id]:old_BroadcastMSG
                },
                Rooms:my_rooms
            }
        case ActionTypes.SET_OLD_CHAT_MESSAGES_TO_NEW:
            const newMSg = state?.MessageList[action?.payload?.id]
            const OldMSg = action?.payload?.Messages;
            const combine = [];
            newMSg?.map((item)=>{
                combine?.push(item)
            })
            OldMSg?.map((item)=>{
                const check_match = combine?.filter((item1) =>item1.id===item.id)
                if(check_match?.length === 0)
                combine?.push(item)
            })
            // console.log("combine", combine)
            // const LimitChat = {
            //     ...state?.MessageList,
            //     [action?.payload?.id]:action?.payload?.Messages
            // }
            return{
                ...state,
                MessageList:{
                    ...state?.MessageList,
                [action?.payload?.id]:combine
                },
            }
        case ActionTypes.SET_MY_PROFILE :
            let MyprofileDeta = {}
            
            if(action.payload) {
                MyprofileDeta = {
                    ...action.payload,
                    name: action.payload.name,
                }
            }

            return {
                ...state,
                MyProfile: MyprofileDeta,
            }
        case ActionTypes.EDIT_PROFILE :
            return {
                ...state,
                MyProfile: {
                    ...action.payload
                },
            }
        case ActionTypes.SAVE_MESSAGE :
            const SavedMessagelist = [...state.SavedMessages];
            SavedMessagelist.push(action.payload);
            return {
                ...state,
                SavedMessages: SavedMessagelist,
            }
        case ActionTypes.MAKE_ADMIN :
            return {
                ...state,
                Rooms: action.payload,
            }
        case ActionTypes.SET_ROOM :
            return {
                ...state,
                Rooms: action.payload,
                MessagesTab: action.payload,
            }
        case ActionTypes.TAB_CHANGE : 
            return {
                ...state,
                MainTabsSelected: action.payload,
            }
        case ActionTypes.STORE_BLOCK_CONTACT:
            const BlockContact = action.payload?.map((item)=>{
                const checkUsers = state?.Contacts?.filter((item1)=>item1.id === item.id);
                if(checkUsers?.length === 0){
                    return{
                        ...item,
                        name:item?.phone
                    }
                }else{
                    return{
                        ...item,
                        name:checkUsers[0]?.name
                    }
                }
            })
            return {
                ...state,
                BlockedUserList: BlockContact,
            }
        case ActionTypes.CREATE_NEW_GROUP : 
            const arrayroom = [...state.Rooms];
            // arrayroom.splice(0, 0, action.payload).push(action.payload);
            const arrayconcatroom = arrayroom.concat(action.payload);
            return {
                ...state,
                Rooms: arrayconcatroom,
            }
        case ActionTypes.GET_GROUPS_LIST :
            const Roomdata = [];

            if(state?.Rooms?.length === 0){
                action.payload?.map((items)=>Roomdata.push({...items,  
                    group_name : items.group_name,
                    last_message : items.last_message,
                }));
                // var myupdatename = action.payload.name.replace(/(<([^>]+)>)/gi, "");

            }else{
                const ResponceList = [];
                state.Rooms?.filter(item=>{
                   const resp =  action.payload?.filter(items=>items.id === item?.id);
                   if(resp?.length === 1){
                        ResponceList?.push({...resp[0],  
                            group_name : resp[0].group_name,
                            last_message : resp[0].last_message,
                        })
                    }
                });
                const OLDData = [];
                state?.Rooms?.map((items)=>{
                    const data = ResponceList?.filter((item)=>item.id === items.id);
                    if(data?.length === 0){
                        if(items.name !== undefined) {
                            OLDData.push({...items, 
                                name : items.name,
                                last_message : items.last_message,
                            })
                            ResponceList.push({...items, 
                                name : items.name,
                                last_message : items.last_message,
                            })
                        }
                        else if(items.group_name !== undefined) {
                            OLDData.push({...items,
                                group_name : items.group_name,
                                last_message : items.last_message,
                            })
                            ResponceList.push({...items,
                                group_name : items.group_name,
                                last_message : items.last_message,
                            })
                        } else {
                            OLDData.push({...items, 
                                broadcast_name : items.broadcast_name,
                                last_message : items.last_message,
                            })
                            ResponceList.push({...items, 
                                broadcast_name : items.broadcast_name,
                                last_message : items.last_message,
                            })
                        }
                    }else{
                        OLDData.push({...data[0]})
                    }
                });
                ResponceList?.map((item)=>Roomdata.push(item));
            }
            
            return {
                ...state,
                Rooms: Roomdata,
                MessagesTab: Roomdata,
            }
            // const groups = state.Rooms?.filter(item=>item?.admin_ids === undefined);
            // 
            // 
            // action.payload?.map((items) =>{
            //     const data = groups?.filter(item => item.id  === items.id).length;
            //     if(data === 0){
            //         groups?.push(items)
            //     }
            // });
            // const RoomsDta = groups?.map((item)=>{
            //     const newData = action.payload?.filter((items)=>items?.id === item?.id);
            //     if(newData?.length === 0){
            //         return{
            //             ...item
            //         }
            //     }else{
            //         return {
            //             ...newData[0]
            //         }
            //     }
            // });

            // const RoomsDtas = RoomsDta && RoomsDta.map((elm) => {
            //     if(elm.name !== undefined) {
            //         return {
            //             ...elm,
            //             name : MessageConvertEmoji(elm.name),
            //         }
            //     } 
            //     else if(elm.group_name !== undefined) {
            //         return {
            //             ...elm,
            //             group_name : MessageConvertEmoji(elm.group_name),
            //         }
            //     } else {
            //         return {
            //             ...elm,
            //             broadcast_name : MessageConvertEmoji(elm.broadcast_name),
            //         }
            //     }
            // });
            
            // return {
            //     ...state,
            //     Rooms: RoomsDtas,
            //     MessagesTab: RoomsDtas,
            // }
        case ActionTypes.SELECT_ROOM :
            return {
                ...state,
                SelectedRoom: action.payload,
            }
        case ActionTypes.GET_GROUPS_DETAILS:
            const MediafilesFilter = state?.MessageList[action?.payload?.id]?.filter((item)=>{
                if(item?.file !== undefined){
                    return item;
                }
                return null
            });
            const mediaFilesS = MediafilesFilter?.map((firstMsg)=>{
                let msg = {...firstMsg, is_save:false};
                if((firstMsg?.group_id && firstMsg?.seen_by && firstMsg?.delivered_by) || (firstMsg?.broadcast_group_id && firstMsg?.seen_by && firstMsg?.delivered_by)){
                    let seen_by = JSON.parse(firstMsg?.seen_by)
                    let delivered_by = JSON.parse(firstMsg?.delivered_by)
        
                    let DeliveredLength = Object.keys(delivered_by)?.map((key) => {
                        return {user_id:key, date:delivered_by[key]}
                    });
                    
                    if(seen_by !== null){
                        let SeenLength =Object.keys(seen_by)?.map((key) => {
                            return {user_id:key, date:seen_by[key]}
                        });
                        msg = {
                            ...firstMsg,
                            seen_by:seen_by,
                            seen_bylength:SeenLength,
                            delivered_by:delivered_by,
                            delivered_bylength:DeliveredLength,
                            is_save:msg?.is_save
                        }
                    }
                    msg = {
                        ...msg,
                        ...firstMsg,
                        delivered_by:delivered_by,
                        delivered_bylength:DeliveredLength,
                        is_save:msg?.is_save
                    }
                }
                return msg;
            })
            const filtering_members = action.payload?.groups?.map((item)=>{
                const data = state.Contacts?.filter((items)=>{
                    return item?.user_ids?.split(',')?.filter(user => user === items.id)?.length?items:0
                 })
                 return {
                     ...item,
                     members:data
                 };
             })
            //  console.log("state",state, action.payload?.admin_ids)
            const isuserAdmin =  action.payload?.admin_ids?.split(',')?.filter(user => user === state?.userLogin?.user_id)?.length > 0?true:false;
            const checkusersAdmin =  action.payload?.users?.map((item)=>{
                const check = action.payload?.admin_ids?.split(',')?.filter(user => user === item?.id)?.length>0 ? true: false;
                const check_contact = state?.userLogin?.Contacts.filter((items)=>items?.user_id === item?.id)?.length>0?true:false;
                const RegisterName = state?.userLogin?.Contacts.filter((items)=>items?.user_id === item?.id);
                if(check_contact){
                    return {
                        ...item,
                        isAdmin:check,
                        user_type:check?"admin":"user",
                        name:RegisterName[0]?.name
                    }
                }else{
                    return {
                        ...item,
                        isAdmin:check,
                        user_type:check?"admin":"user",
                        name:item?.phone
                    }
                }
            })
            const device_Name = JSON?.parse(state?.userLogin?.contacts);
            let contactList = {};
            if(action.payload?.admin_ids === undefined){
            const name = device_Name?.filter((item)=>item?.user_id === action?.payload?.id)
            const check_contact = state?.userLogin?.Contacts.filter((items)=>items?.user_id === action?.payload?.id);
            if(check_contact?.length>0){
                contactList =  {
                    ...action?.payload,
                    isGroups:action.payload?.user_ids === undefined?false:true,
                    mediaFiles:mediaFilesS,
                    groups:filtering_members,
                    isuserAdmin:isuserAdmin,
                    users:checkusersAdmin,
                    name:check_contact[0]?.name
                }
            }else{
                contactList =  {
                    ...action?.payload,
                    isGroups:action.payload?.user_ids === undefined?false:true,
                    mediaFiles:mediaFilesS,
                    groups:filtering_members,
                    isuserAdmin:isuserAdmin,
                    users:checkusersAdmin,
                    name:action.payload?.phone
                }
            }
            }else{
                contactList =  {
                    ...action?.payload,
                    isGroups:action.payload?.user_ids === undefined?false:true,
                    mediaFiles:mediaFilesS,
                    groups:filtering_members,
                    isuserAdmin:isuserAdmin,
                    users:checkusersAdmin
                }
            }

            let SelectRoomsUpdate = {}; 
            if(contactList.name !== undefined) {
                SelectRoomsUpdate = {
                    ...contactList,
                    name : contactList.name,
                }
            } 
            else if(contactList.group_name !== undefined) {
                SelectRoomsUpdate = {
                    ...contactList,
                    group_name : contactList.group_name,
                }
            } else {
                SelectRoomsUpdate = {
                    ...contactList,
                    broadcast_name : contactList.broadcast_name,
                }
            };
            
            return {
                ...state,
                SelectedRoom: {
                    ...SelectRoomsUpdate
                },
            }
        case ActionTypes.SET_UPDATE_MEDIA_FILES:
            const Mediafilesfilter = state?.MessageList[action?.payload?.id]?.filter((item)=>{
                if(item?.file !== undefined && item?.deleted_at === null){
                    return item;
                }
                return null
            });
            const mediaFiles = Mediafilesfilter?.map((firstMsg)=>{
                let msg = {...firstMsg, is_save:false};
                if((firstMsg?.group_id && firstMsg?.seen_by && firstMsg?.delivered_by) || (firstMsg?.broadcast_group_id && firstMsg?.seen_by && firstMsg?.delivered_by)){
                    let seen_by = JSON.parse(firstMsg?.seen_by)
                    let delivered_by = JSON.parse(firstMsg?.delivered_by)
        
                    let DeliveredLength = Object.keys(delivered_by)?.map((key) => {
                        return {user_id:key, date:delivered_by[key]}
                    });
                    
                    if(seen_by !== null){
                        let SeenLength =Object.keys(seen_by)?.map((key) => {
                            return {user_id:key, date:seen_by[key]}
                        });
                        msg = {
                            ...firstMsg,
                            seen_by:seen_by,
                            seen_bylength:SeenLength,
                            delivered_by:delivered_by,
                            delivered_bylength:DeliveredLength,
                            is_save:msg?.is_save
                        }
                    }
                    msg = {
                        ...msg,
                        ...firstMsg,
                        delivered_by:delivered_by,
                        delivered_bylength:DeliveredLength,
                        is_save:msg?.is_save
                    }
                }
                return msg;
            })
            return {
                ...state,
                SelectedRoom: {
                    ...action.payload,
                    isGroups:action.payload?.user_ids === undefined?false:true,
                    mediaFiles:mediaFiles,
                },
            }
        case ActionTypes.SET_MESSAGE :
            return {
                ...state,
                Messages: action.payload,
            }
        case ActionTypes.TOASTER_MESSAGE:
            return {
                ...state,
                Toaster_message: action.payload,
            }
        case ActionTypes.NEW_MESSAGE_SEND : 
            // edit message reducer action type
            const editmessage = state.MessageList[location_id];
            const OldPagination1 = state?.pagination?.page_data.map((elms) => {
                if(elms?.id === action?.payload?.id) {
                    return {
                        ...elms,
                        message : action.payload.message,
                        updated_at : action.payload.updated_at,
                        is_edited: action.payload.is_edited
                    };
                }else
                return elms
            });;
            const editmessageUpdate = editmessage.map((elms) => {
                if(elms?.id === action?.payload?.id) {
                    return {
                        ...elms,
                        message : action.payload.message,
                        updated_at : action.payload.updated_at,
                        is_edited: action.payload.is_edited
                    };
                }else
                return elms
            });
            return {
                ...state,
                MessageList: {...state.MessageList, [location_id]: editmessageUpdate},
                pagination:{
                    ...state?.pagination,
                    page_data:OldPagination1
                }
            }
        case ActionTypes.DELETE_MESSAGE :
            const locationId = window.location.pathname.split("/")[2];
            const deleteMessage = state.MessageList[locationId];
            const OldPagination2 = state?.pagination?.page_data?.map((elms) => {
                if(elms?.id === action?.payload?.id) {
                    return {
                        ...elms,
                        message : action.payload.message,
                        message_type :  action.payload.message_type === "text" ? "text delete" : "text delete",
                        updated_at : action.payload.updated_at,
                        deleted_at : action.payload.deleted_at,
                    };
                }else
                return elms
            });
            const newMessage = deleteMessage.map((elms) => {
                if(elms?.id === action?.payload?.id) {
                    return {
                        ...elms,
                        message : action.payload.message,
                        message_type :  action.payload.message_type === "text" ? "text delete" : "text delete",
                        updated_at : action.payload.updated_at,
                        deleted_at : action.payload.deleted_at,
                    };
                }else
                return elms
            });

            return {
                ...state,
                MessageList: {...state.MessageList, [locationId]:newMessage},
                pagination:{
                    ...state?.pagination,
                    page_data:OldPagination2
                }
            }  
        case ActionTypes.REMOVE_GROUPS_MEMBER : 
            const deletedmember = [...state.SelectedRoom?.memberlist]
            const DeletedArray = [];
            deletedmember.forEach((elm) => {
                if(elm.id !== action.payload) {
                    DeletedArray.push(elm);
                }
            })
            return {
                ...state,
                SelectedRoom : {
                    memberlist : DeletedArray
                }
            }
        case ActionTypes.SAVED_MESSAGES :
            // const SavedMessageList = action.payload;
            // const SavedMessageListArray = SavedMessageList.map((elms) => {
            //     if(elms.chat.message_type === "text") {
            //         return{
            //             ...elms,
            //             chat: {
            //                 ...elms.chat,
            //                 message: MessageConvertEmoji(elms.chat.message),
            //             },
            //         }
            //     } else {
            //         return elms;
            //     };
            // });
            
            return {
                ...state,
                SavedMessages: action.payload,
            }
        case ActionTypes.CLEAR_CHAT_HISTORY :
            return {
                ...state,
                MessageList: {...state.MessageList, [location_id]: []},
                pagination:{
                    ...initailData?.pagination
                }
            } 
        case  ActionTypes.STORE_CONTACT_LIST :
            const Rooms = state?.Rooms;
            const device_contact = state?.userLogin?.Contacts;
            const filtersContect = action.payload?.map((item)=>{
                const check = device_contact?.filter((item1) =>item1?.user_id === item?.id);
                
                if(check?.length>0){
                    return{
                        ...item,
                        name:check[0].name,
                        online:item.online,
                        unread_count:item?.unread_count
                    }
                }
                else{
                    if(Rooms?.filter((item1) =>item1?.user_id === item?.id) === 0){
                        Rooms?.push({
                            ...item,
                            name:item.phone,
                            unread_count:item?.unread_count
                        })
                    }
                    return {
                        ...item,
                        online:item.online,
                    }
                }
            })
            const filterContacts = filtersContect?.filter((item)=>{
                if(state?.userLogin?.Contacts){
                    const CheckList = state?.userLogin?.Contacts?.filter((usr)=>usr?.user_id === item?.id)?.length;
                    if(CheckList>0){
                        return {
                            ...item,
                            unread_count:item?.unread_count,
                            online:item?.online
                        };
                    }
                }else{
                    if(Rooms?.filter((item1) =>item1?.user_id === item?.id)?.length === 0){
                        Rooms?.push({
                            ...item,
                            name:item.phone,
                            unread_count:item?.unread_count
                        })
                    }
                    return {
                        ...item,
                        online:item?.online
                    };
                }
            });
           const ROOMsData = Rooms?.map((item)=>{
                const newData = action.payload?.filter((items)=>items?.id === item?.id);
                if(newData?.length === 0){
                    return{
                        ...item
                    }
                }else{
                    const CheckList = state?.userLogin?.Contacts?.filter((usr)=>usr?.user_id === item?.id)?.length;
                    if(CheckList>0){
                        return{
                            ...newData[0],
                            name:item?.name
                        }
                    }else{
                        return {
                            ...newData[0],
                            name:newData[0]?.phone 
                        }
                    }
                    
                }
            })

            return {
                ...state,
                Contacts: filterContacts,
                Rooms:ROOMsData
            }
        case  ActionTypes.SET_UPDATE_MESSAGES_LIST :
            // console.log("Contacts:",state?.userLogin,action.payload)
            const newContact = action?.payload;
            // const filtersContact = state?.Contacts;
            let RoomsContact = state?.Rooms;
            const checkInRooms = state?.Rooms?.filter((item)=> item.id === action?.payload?.id)?.length>0?true:false;
            const checkInContact = state?.Contacts?.filter((item)=> item.id === action?.payload?.id)?.length>0?true:false;
            if(checkInRooms === true || checkInContact === true){
                RoomsContact = RoomsContact?.map((item)=>{
                    if(item?.id === action?.payload?.id){
                        return{
                            ...item,
                            users:action?.payload?.users
                        }
                    }
                    else{
                        return item
                    }
                })
            }else{
                // filtersContact?.push({...newContact,name:newContact?.phone})
                if(state?.userLogin?.user_id !== action?.payload?.id){
                    RoomsContact?.push({
                        ...newContact,name:newContact?.phone
                    })
                }
            }
           
            return {
                ...state,
                // Contacts: filtersContact,
                Rooms: RoomsContact
            }
        case  ActionTypes.SET_REMOVE_MEMBER_FROM_ROOM :
            return {
                ...state,
                Rooms: state?.Rooms?.filter(item =>item?.id !== action?.payload?.to_id),
            }
        case  ActionTypes.SET_REMOVE_GROUP_FROM_ROOM :
            // console.log("RemoveList", action?.payload)
            return {
                ...state,
                Rooms: state?.Rooms?.filter(item =>item?.id !== action?.payload?.id),
            }
        case  ActionTypes.FILTER_CHAT_MESSAGES_LIST :
            // console.log("state?.Rooms",action?.payload, state?.Rooms.filter((item)=>{
            //     if(item?.id === action?.payload?.group_id){
            //         return item
            //     }else if(item?.id === action?.payload?.from_id){
            //         return item
            //     }
            // }))
            const filterList = state?.Rooms?.map((item)=>{
                if(state?.userLogin?.user_id !== action?.payload?.from_id){
                    if(item.id === action?.payload?.group_id){
                        // console.log("state?.Roomss",action?.payload)
                        return {
                            ...item,
                            last_message_type:action?.payload?.message_type,
                            file:action?.payload?.file,
                            last_message_at:action?.payload?.updated_at,
                            updated_at:action?.payload?.updated_at,
                            last_message: action?.payload?.message,
                            unread_count:item?.unread_count+1
                        }
                    }else if(item.id === action?.payload?.from_id && action?.payload?.group_id === undefined){
                        // console.log("state?.Roomss",action?.payload)
                        return {
                            ...item,
                            last_message_type:action?.payload?.message_type,
                            file:action?.payload?.file,
                            last_message_at:action?.payload?.updated_at,
                            updated_at:action?.payload?.updated_at,
                            last_message: action?.payload?.message,
                            unread_count:item?.unread_count+1
                        }
                    }
                }else{
                    if(item.id === action?.payload?.group_id && action?.payload?.id){
                        return {
                            ...item,
                            last_message_type:action?.payload?.message_type,
                            file:action?.payload?.file,
                            last_message_at:action?.payload?.updated_at,
                            updated_at:action?.payload?.updated_at,
                            last_message: action?.payload?.message
                        }
                    }else if(item.id === action?.payload?.to_id && action?.payload?.id){
                        return {
                            ...item,
                            last_message_type:action?.payload?.message_type,
                            file:action?.payload?.file,
                            last_message_at:action?.payload?.updated_at,
                            updated_at:action?.payload?.updated_at,
                            last_message: action?.payload?.message
                        }
                    }
                }
                return item;
            });
            // console.log("filterList",filterList)
            return {
                ...state,
                Rooms:filterList
                // Contacts: action.payload?.filter(item =>item?.is_block === false),
            }
        case  ActionTypes.UPDATE_CHAT_MESSAGES_LIST :
            // console.log("state?.Rooms",action?.payload, state?.Rooms.filter((item)=>{
            //     if(item?.id === action?.payload?.group_id){
            //         return item
            //     }else if(item?.id === action?.payload?.from_id){
            //         return item
            //     }
            // }))
            const FilterList = state?.Rooms?.map((item)=>{
                if(state?.userLogin?.user_id !== action?.payload?.from_id){
                    if(item.id === action?.payload?.broadcast_group_id){
                        return {
                            ...item,
                            last_message_type:action?.payload?.message_type,
                            file:action?.payload?.file,
                            last_message_at:action?.payload?.updated_at,
                            updated_at:action?.payload?.updated_at,
                            last_message:action?.payload?.message,
                            unread_count:item?.unread_count
                        }
                    }else if(item.id === action?.payload?.group_id){
                        // console.log("state?.Roomss",action?.payload)
                        return {
                            ...item,
                            last_message_type:action?.payload?.message_type,
                            file:action?.payload?.file,
                            last_message_at:action?.payload?.updated_at,
                            updated_at:action?.payload?.updated_at,
                            last_message:action?.payload?.message,
                            unread_count:item?.unread_count
                        }
                    }else if(item.id === action?.payload?.from_id && action?.payload?.group_id === undefined){
                        // console.log("state?.Roomss",action?.payload)
                        return {
                            ...item,
                            last_message_type:action?.payload?.message_type,
                            file:action?.payload?.file,
                            last_message_at:action?.payload?.updated_at,
                            updated_at:action?.payload?.updated_at,
                            last_message: action?.payload?.message,
                            unread_count:item?.unread_count
                        }
                    }
                }else{
                    if(item.id === action?.payload?.broadcast_group_id){
                        return {
                            ...item,
                            last_message_type:action?.payload?.message_type,
                            file:action?.payload?.file,
                            last_message_at:action?.payload?.updated_at,
                            updated_at:action?.payload?.updated_at,
                            last_message: action?.payload?.message,
                            unread_count:item?.unread_count
                        }
                    }else if(item.id === action?.payload?.group_id && action?.payload?.id){
                        return {
                            ...item,
                            last_message_type:action?.payload?.message_type,
                            file:action?.payload?.file,
                            last_message_at:action?.payload?.updated_at,
                            updated_at:action?.payload?.updated_at,
                            last_message: action?.payload?.message
                        }
                    }else if(item.id === action?.payload?.to_id && action?.payload?.id){
                        return {
                            ...item,
                            last_message_type:action?.payload?.message_type,
                            file:action?.payload?.file,
                            last_message_at:action?.payload?.updated_at,
                            updated_at:action?.payload?.updated_at,
                            last_message: action?.payload?.message
                        }
                    }
                }
                return item;
            });
            // console.log("filterList",filterList)
            return {
                ...state,
                Rooms:FilterList
                // Contacts: action.payload?.filter(item =>item?.is_block === false),
            }
        case ActionTypes.SET_MESSAGES_DELIVERED:
             // console.log("deleteMessage=======>", deleteMessage);
            let res = action?.payload?.response;
            let req = action?.payload?.request;
            let Push_messages = []
            let messages_deliver = state?.MessageList[req?.to_id];
                // console.log("messages_deliver",messages_deliver,res)
            messages_deliver?.map((item)=> {
                const check_Messages = res?.filter((items)=>items?.id === item?.id);
                if(check_Messages?.length>0){
                    // messages_deliver?.push(res)
                    // console.log("messages_deliver", messages_deliver, check_Messages[0])
                    Push_messages?.push({
                        ...item,
                        seen_at:check_Messages[0]?.seen_at,
                        reply_id:check_Messages[0]?.reply_id,
                        message_type:check_Messages[0]?.message_type,
                        message:check_Messages[0]?.message,
                        is_edited:check_Messages[0]?.is_edited,
                        from_id:check_Messages[0]?.from_id,
                        forward_id:check_Messages[0]?.forward_id,
                        delivered_by:check_Messages[0]?.delivered_by,
                        delivered_at:check_Messages[0]?.delivered_at,
                        broadcast_group_id:check_Messages[0]?.broadcast_group_id,
                        created_at:item?.created_at,
                        updated_at:item?.updated_at,
                        deleted_at:check_Messages[0]?.deleted_at,
                        seen_by:check_Messages[0].seen_by,
                        delivered_by:check_Messages[0].delivered_by,
                    });
                }else{
                    Push_messages?.push(item);
                }
            });
            // console.log("messages_deliver", messages_deliver, Push_messages)
            const OldPagination3 = state?.pagination?.page_data?.map((item)=>{
                const result = Push_messages?.filter((item1)=>item.id === item1.id);
                if(result?.length === 1){
                    return result[0];
                }
            })
            return {
                ...state,
                MessageList: {...state.MessageList, [req?.to_id]:Push_messages},
                pagination:{
                    ...state?.pagination,
                    page_data:OldPagination3
                }
            }
        case  ActionTypes.SET_MESSAGES_SEEN_MEMBERS :
            let { request, response } = action?.payload;
            const unseen_countes = state?.Rooms?.map((item)=>{
                if(item?.id === request?.to_id && request?.to_id === location_id){
                    return {
                        ...item,
                        unread_count:0
                    }
                }else{
                    return {
                        ...item
                    }
                }
            });
            const user_messages = state?.MessageList[request?.to_id];
            // console.log("add_delivereds", response, user_messages, request);
            const filter_msg = user_messages?.map((item)=>{
                const check_match = response?.filter((user) =>user.id === item?.id||user.id === item?.broadcast_chat_id);
                if(check_match?.length>0){
                    return{
                        ...check_match[0],
                        seen_at:check_match[0].seen_at,
                        delivered_at:check_match[0].delivered_at,
                        seen_by:check_match[0].seen_by,
                        delivered_by:check_match[0].delivered_by,
                        created_at:item.created_at,
                        updated_at:item.updated_at,
                    }
                }else{
                    return item;
                }
            });
            const OldPagination4 = state?.pagination?.page_data?.map((item)=>{
                const check_match = response?.filter((user) =>user.id === item?.id||user.id === item?.broadcast_chat_id);
                if(check_match?.length>0){
                    return{
                        ...check_match[0],
                        seen_at:check_match[0].seen_at,
                        delivered_at:check_match[0].delivered_at,
                        seen_by:check_match[0].seen_by,
                        delivered_by:check_match[0].delivered_by,
                        created_at:item.created_at,
                        updated_at:item.updated_at,
                    }
                }else{
                    return item;
                }
            })
            return {
                ...state,
                Rooms:unseen_countes,
                MessageList:{
                    ...state?.MessageList,
                    [request?.to_id]:filter_msg
                },
                pagination:{
                    ...state?.pagination,
                    page_data:OldPagination4
                }
                // Contacts: action.payload?.filter(item =>item?.is_block === false),
            }
        case  ActionTypes.SET_UPDATE_MESSAGES_SEEN_DELIVERED :
            let Res = action?.payload?.response;
            let push_messages = []
            if(location_id === state?.SelectedRoom?.id){
                let messages_deliver = state?.MessageList[location_id];
                messages_deliver?.map((item)=> {
                    // console.log("messages_deliver",item?.id,res, item?.id === res?.id, messages_deliver, res)
                    const check_Messages = Res?.filter((items)=>items?.id === item?.id);
                    if(check_Messages?.length>0){
                        // messages_deliver?.push(res)
                        // console.log("messages_deliver", messages_deliver, res)
                        push_messages?.push(check_Messages[0]);
                    }else{
                        push_messages?.push(item);
                    }
                });
            }
            const OldPagination6 = state?.pagination?.page_data?.map((item)=>{
                const result = push_messages?.filter((item1)=>item.id === item1.id);
                if(result?.length === 1){
                    return result[0];
                }else{
                    return item;
                }
            })
            return {
                ...state,
                MessageList: {...state.MessageList, [location_id]:push_messages},
                pagination:{
                    ...state?.pagination,
                    page_data:OldPagination6
                }
            }
        case ActionTypes.SET_ADD_CHAT_IN_MESSAGES_LIST:
            let old_Messages = state?.MessageList[action?.payload?.request?.to_id];
            // || action?.payload?.response?.from_id === state?.userLogin?.user_id
            if(action?.payload?.request?.to_id === location_id){
                // console.log("old_Messages", old_Messages, action?.payload?.response)
                old_Messages?.push(action?.payload?.response);
                state?.pagination?.page_data?.push(action?.payload?.response)
                return{
                    ...state,
                    MessageList:{
                        ...state?.MessageList,
                        [action?.payload?.request?.to_id]:old_Messages
                    },
                    pagination:{
                        page_data:state?.pagination?.page_data,
                        page_size:state?.pagination?.page_size,
                        page_number:state?.pagination?.page_number,
                    }
                }
            }
            return{
                ...state,
                MessageList:{
                    ...state?.MessageList,
                    [action?.payload?.request?.to_id]:old_Messages
                }
            }
        case  ActionTypes.SET_UPDATE_GROUPS_DETAILS_FILTER :
            const filterLists = state?.Rooms?.map((item)=>{
                if(item.id === action?.payload?.id){
                    // console.log("items" , item)
                    return {
                        ...item,
                        group_name: action?.payload?.group_name,
                        broadcast_name: action?.payload?.broadcast_name,
                        updated_at:action?.payload?.updated_at,
                        last_message_at:action?.payload?.updated_at,
                        avatar:action?.payload?.avatar
                    }
                }
                return item;
            })
              
            return {
                ...state,
                Rooms:filterLists
                // Contacts: action.payload?.filter(item =>item?.is_block === false),
            }
        case  ActionTypes.STORE_USER_PROFILE :
            return {
                ...state,
                MyProfile: action.payload,
            }
        case  ActionTypes.SET_SAVE_QRCODE :
            return {
                ...state,
                qr_token: action.payload,
            }
        case  ActionTypes.SET_LOGIN_QR_CODE_USER :
            return {
                ...state,
                userLogin: {
                    ...action.payload,
                    Contacts:JSON.parse(action.payload?.contacts)
                },
                access_token: action.payload?.users_detail?.access_token,
            }
        case  ActionTypes.SET_LOGOUT_USER :
            return initailData;
        case  ActionTypes.SET_USER_ONLINE_OR_OFFLINE :
            return {
                ...state,
                is_online:action?.payload
            };
        case ActionTypes?.SET_REGISTERD_SYSTEM_ID :
            return{
                ...state,
                registration_ids:{
                    ...state?.registration_ids,
                    [action?.payload]: action?.payload
                }
            }
        case  ActionTypes.SET_REGISTERD_DEVICE_ID :
            let DataFCM = "";
            if(state?.registration_id === ""){
                DataFCM = action?.payload
            }else{
                DataFCM = state?.registration_id
            }
            return {
                ...state,
                registration_id:DataFCM
            };
        case  ActionTypes.SET_BROWSER_ACTIVITY :
            return {
                ...state,
                NotiVisible:action?.payload
            };
        case  ActionTypes.SET_OPEN_MODAL_POPUP_CONFIRM :
            return {
                ...state,
                ModalPopup:action?.payload
            };
        case  ActionTypes.SET_CLOSE_MODAL_POPUP_CONFIRM :
            return {
                ...state,
                ModalPopup:{
                    ...initailData?.ModalPopup
                }
            };
        case  ActionTypes.SET_ADD_GROUP_IN_ROOMS :

            const OLD_Rooms = state?.Rooms;
            OLD_Rooms?.push({
                ...action.payload,
                last_message_type:action.payload?.message?.message_type,
                last_message: action.payload?.message?.message,
                last_message_at:action.payload?.message?.created_at,
            });
            // console.log("OLD_Rooms", OLD_Rooms)
            return {
                ...state,
                Rooms:OLD_Rooms,
                MessagesTab:OLD_Rooms
            };
        case  ActionTypes.SET_GO_BACK_TO_HOME_SCREEN :
            return {
                ...state,
                GoBackToHome:action?.payload
            };
        case  ActionTypes.SET_ADD_BROADCAST_GROUP_LIST :
            const cleanBroadcast = [];
            state?.Rooms?.filter((item)=>{
                if(!item?.broadcast_name){
                    cleanBroadcast?.push(item);
                }
            });

            action.payload?.map((item)=>{
                cleanBroadcast?.push({
                    ...item,
                    broadcast_name: item?.broadcast_name,
                    isGroups:true,
                    isBroadCast:true,
                    last_message: item?.last_message === "None"?"":item?.last_message,
                    last_message_at:item?.last_message === "None"?item?.updated_at:item?.last_message_at,
                    last_message_type:item?.last_message === "None"?"":item?.last_message_type,
                })
            })

            return {
                ...state,
                Rooms:cleanBroadcast
            };
        case  ActionTypes.SET_ADD_SYSTEM_GROUP_LIST :
            const CleanSystemGroups = [];
            state?.Rooms?.filter((item)=>{
                if(!item?.group_type){
                    CleanSystemGroups?.push(item)
                }
            });
            action?.payload?.map((item)=>{
                CleanSystemGroups?.push({
                    ...item,
                    isGroups:true,
                    last_message:item?.last_message === "None"?"":item?.last_message,
                    last_message_at:item?.last_message === "None"?item?.updated_at:item?.last_message_at,
                    last_message_type:item?.last_message === "None"?"":item?.last_message_type,
                })
                // console.log("cleanBroadcast", cleanBroadcast)
            })
            return {
                ...state,
                Rooms:CleanSystemGroups
            };
        case  ActionTypes.SET_SELECTROOM_BROADCAST :
            const UsersList = [];
            action?.payload?.user_ids?.split(',')?.map((id)=>{
                const check_Contact = state?.Contacts?.filter((item)=>item.id === id);
                if(check_Contact?.length){
                    UsersList?.push({...check_Contact[0], isAdmin:false});
                }
            })
            // console.log("UsersList", UsersList);
            const UpdateBroadcastContact = state?.Rooms?.map((item)=>{
                if(item?.id === action?.payload?.id){
                    return {...item, user_ids:action?.payload?.user_ids};

                }else{
                    return item;
                }
            })
            return {
                ...state,
                SelectedRoom:{
                    admin_id:action?.payload?.created_by,
                    created_at:action?.payload?.created_at,
                    created_by:action?.payload?.created_by,
                    file:action?.payload?.file,
                    avatar:action?.payload?.avatar,
                    group_avatar:action?.payload?.avatar?.url,
                    broadcast_name: action?.payload?.broadcast_name,
                    group_name: action?.payload?.broadcast_name,
                    id:action?.payload?.id,
                    isGroups:true,
                    isBroadCast:true,
                    is_mute:action?.payload?.is_mute,
                    is_system_group:action?.payload?.is_system_group,
                    last_message: action?.payload?.last_message,
                    last_message_at:action?.payload?.last_message_at,
                    last_message_type:action?.payload?.last_message_type,
                    unread_count:action?.payload?.unread_count,
                    user_ids:action?.payload?.user_ids,
                    updated_at:action?.payload?.updated_at,
                    users:UsersList,
                    isuserAdmin:true
                },
                Rooms:UpdateBroadcastContact
            };
        case  ActionTypes.SET_UPDATE_BROADCAST_GROUP_LIST:
            const UpdateBroadcastContact1 = state?.Rooms?.map((item)=>{
                if(item?.id === action?.payload?.id){
                    return {...item, user_ids:action?.payload?.user_ids};

                }else{
                    return item;
                }
            })
            return{
                ...state,
                Rooms:UpdateBroadcastContact1
            }
        case  ActionTypes.SET_STORE_SAVE_CHAT_LIST :
            return{
                ...state,
                SaveChatList:{
                    ...state?.SaveChatList,
                    [action?.payload.id]:action?.payload.response
                }
            }
        case  ActionTypes.SET_NEW_MESSAGES_SAVE :
            const oldSave = state?.SaveChatList[action?.payload?.id];
            const checkSame = oldSave?.filter((item)=>item?.chat_id === action?.payload?.response?.chat_id);
            if(checkSame?.length === 0){
                oldSave?.push({
                    ...action?.payload?.response
                })
            }
            return{
                ...state,
                SaveChatList:{
                    ...state?.SaveChatList,
                    [action?.payload.id]:oldSave
                }
            }
        case ActionTypes.SET_RESET_REDUX_STORE:
            return{
                ...initailData,
                user_id: state?.user_id,
                userLogin:state?.userLogin,
                access_token:state?.access_token,
                MyProfile:state?.MyProfile,
                is_online:state?.is_online,
                registration_id:state?.registration_id,
                registration_ids:state?.registration_ids,
            }
        case ActionTypes.REFRESH_DATA :
            
            return{
                ...initailData,
                user_id: state?.user_id,
                userLogin:state?.userLogin,
                access_token:state?.access_token,
                MyProfile:state?.MyProfile,
                is_online:state?.is_online
            }
        case ActionTypes.SET_USERS_TYPEING_STATUS:
            let SelectedRoomDummy = state?.SelectedRoom;
            const UpdateState = state?.Contacts?.map((item)=>{
                if(item?.id === action?.payload?.user_id && action?.payload?.to_id === undefined){
                    // console.log("UpdateState", {
                    //     ...item,
                    //     userTyping:action?.payload
                    // })
                    return{
                        ...item,
                        userTyping:action?.payload
                    }
                }else{
                    return{
                        ...item,
                        userTyping:item?.userTyping,
                    }
                }
            });
            const RoomsUpdateState = state?.Rooms?.map((item)=>{
                if(item?.id === action?.payload?.to_id && action?.payload?.to_id !== undefined){
                    // console.log("UpdateState", {
                    //     ...item,
                    //     userTyping:action?.payload
                    // })
                    return{
                        ...item,
                        userTyping:action?.payload
                    }
                }else if(item?.id === action?.payload?.user_id && action?.payload?.to_id === undefined){
                    return{
                        ...item,
                        userTyping:action?.payload
                    }
                }else{
                    return{
                        ...item,
                        userTyping:item?.userTyping,
                    }
                }
            });
            if(action?.payload?.to_id && action?.payload?.to_id === location_id){
                SelectedRoomDummy.userTyping = action?.payload
                SelectedRoomDummy.online = 1;
            }else if(action?.payload?.user_id === location_id && action?.payload?.to_id === undefined){
                SelectedRoomDummy.userTyping = action?.payload
            }
            // console.log("SelectedRoomDummy",SelectedRoomDummy)
            return{
                ...state,
                Contacts: UpdateState,
                Rooms:RoomsUpdateState,
                SelectedRoom:SelectedRoomDummy
            }
        case ActionTypes.SET_UPDATE_BLOCK_CONTACT:
            const blockUser_id = action?.payload;
            const oldContacts = state?.Contacts?.map((item)=>{
                if(item?.id === blockUser_id?.to_id){
                    return{
                        ...item,
                        is_block:blockUser_id?.is_block=== 0 ?false:true
                    }
                }else{
                    return item;
                }
            })
            const oldRoomsDtaa = state?.Rooms?.map((item)=>{
                if(item?.id === blockUser_id?.to_id){
                    return{
                        ...item,
                        is_block:blockUser_id?.is_block=== 0 ?false:true
                    }
                }else{
                    return item;
                }
            })
            return{
                ...state,
                Contacts:oldContacts,
                Rooms:oldRoomsDtaa,
            }
        case ActionTypes?.SET_UPDATE_CHAT_MESSAGES_URL:
            // console.log("SET_UPDATE_CHAT_MESSAGES_URL", action?.payload, window.URL.createObjectURL(action?.payload?.blob))
            const updateList = state?.MessageList[action?.payload?.select_id];
            const updateBlobData = [];
            if(updateList){
                updateList?.map((item)=>{
                    if(item?.id === action?.payload?.id){
                        updateBlobData?.push({
                            ...item,
                            blob:action?.payload?.blob
                        });
                    }else{
                        updateBlobData.push(item);
                    }
                })
            }
            // console.log("updateBlobData", updateBlobData)
            return{
                ...state,
                MessageList:{...state?.MessageList,[action?.payload?.select_id]:updateBlobData}
            }
        case ActionTypes.SET_MESSAGES_SEEN_BY_USER:
            const unseen_counters = state?.Rooms?.map((item)=>{
                if(item?.id === action?.payload?.request?.to_id){
                    return {
                        ...item,
                        unread_count:0
                    }
                }else{
                    return {
                        ...item
                    }
                }
            });

            return{
                ...state,
                Rooms:unseen_counters
            }
        case ActionTypes.SET_GROUP_USERCREATED_DETAILS:
            const userRooms = state?.SelectedRoom;
            userRooms.createdUser = action?.payload;
            return{
                ...state,
                SelectedRoom:userRooms
            }
        case ActionTypes.SET_BROADCAST_MEESAGES_UPDATE:
            let Old_broadcastMSG = [];
            if(state?.MessageList[action?.payload?.broadcast_id]){
                Old_broadcastMSG =  state?.MessageList[action?.payload?.broadcast_id];
                Old_broadcastMSG = Old_broadcastMSG?.map((item)=>{
                    if(item?.id === action?.payload?.id && action?.payload?.from_id === state?.userLogin?.user_id){
                        if(action?.payload?.delivered_at !== "None" && action?.payload?.seen_at === "None"){
                            const delivered = item?.delivered_by;
                            if(item?.delivered_by === null||item?.delivered_by === undefined){
                                return{
                                    ...item,
                                    broadcast_id:null,
                                    broadcast_group_id:action?.payload?.broadcast_id,
                                    delivered_by:JSON.stringify({[action?.payload?.to_id]:`${action?.payload?.delivered_at} `})
                                }
                            }else{
                                const myData = JSON?.parse(delivered)
                                const MergeMyData = {...myData, [action?.payload?.to_id]:`${action?.payload?.delivered_at} `}
                                // console.log("items", myData), MergeMyData;
                                return{
                                    ...item,
                                    broadcast_id:null,
                                    broadcast_group_id:action?.payload?.broadcast_id,
                                    delivered_by:JSON.stringify(MergeMyData)
                                }
                            }
                        }else if(action?.payload?.delivered_at !== "None" && action?.payload?.seen_at !== "None"){
                            const delivered = item?.delivered_by;
                            const seenBy = item?.seen_by;
                            if(item?.seen_by === null||item?.seen_by === undefined){
                                return{
                                    ...item,
                                    broadcast_id:null,
                                    broadcast_group_id:action?.payload?.broadcast_id,
                                    delivered_by:JSON.stringify({[action?.payload?.to_id]:`${action?.payload?.delivered_at} `}),
                                    seen_by:JSON.stringify({[action?.payload?.to_id]:`${action?.payload?.seen_at} `})
                                }
                            }else{
                                const myData = JSON.parse(seenBy)
                                const MergeMyData = {...myData, [action?.payload?.to_id]:`${action?.payload?.seen_at} `};
                                
                                const MyDelivered = JSON.parse(delivered)
                                const MergeMyDelivered = {...MyDelivered, [action?.payload?.to_id]:`${action?.payload?.delivered_at} `}
                                // console.log("items", MergeMyDelivered, MergeMyData);
                                return{
                                    ...item,
                                    broadcast_id:null,
                                    broadcast_group_id:action?.payload?.broadcast_id,
                                    delivered_by:JSON.stringify(MergeMyDelivered),
                                    seen_by:JSON.stringify(MergeMyData)
                                }
                            }
                        }
                        
                        // return {
                        //     ...item
                        // };
                    }
                    else{
                        return item
                    }
                })
            }
            // console.log("add_delivereds", Old_broadcastMSG)
            const OldPagination7 = state?.pagination?.page_data?.map((item)=>{
                const result = Old_broadcastMSG?.filter((item1)=>item.id === item1.id);
                if(result?.length === 1){
                    return result[0];
                }else{
                    return item;
                }
            })
            return{
                ...state,
                MessageList:{
                    ...state?.MessageList,
                    [action?.payload?.broadcast_id]:Old_broadcastMSG
                },
                pagination:{
                    ...state?.pagination,
                    page_data:OldPagination7
                }
            }
        case ActionTypes.GET_ALL_USER_LIST :
            const uniqueArray = action.payload.filter((value, index) => {
                return index === action.payload.findIndex(obj => {
                  return obj.name === value.name;
                });
            });
            
            return {
                ...state,
                AllUsersList: uniqueArray,
            }
        case ActionTypes.SET_DETAILS_LIST_STORE:
            let UserDetails = state?.UserDetails;
            const checkusersAdmins =  action.payload?.users?.map((item)=>{
                const check = action.payload?.admin_ids?.split(',')?.filter(user => user === item?.id)?.length>0 ? true: false;
                const check_contact = state?.userLogin?.Contacts.filter((items)=>items?.user_id === item?.id)?.length>0?true:false;
                const RegisterName = state?.userLogin?.Contacts.filter((items)=>items?.user_id === item?.id);
                if( state?.UserDetails[item?.id]){

                }else{
                    if(check_contact){
                        UserDetails = {
                            ...UserDetails,
                            [item?.id]:item
                        }
                    }else{
                        UserDetails = {
                            ...UserDetails,
                            [item?.id]:{
                                ...item,
                                name:item?.phone
                            }
                        }
                    }
                    
                }

                if(check_contact){
                    return {
                        ...item,
                        isAdmin:check,
                        user_type:check?"admin":"user",
                        name:RegisterName[0]?.name
                    }
                }else{
                    return {
                        ...item,
                        isAdmin:check,
                        user_type:check?"admin":"user",
                        name:item?.phone
                    }
                }
               
            })
            return{
                ...state,
                DetailsList:{
                    ...state?.DetailsList,
                    [action?.payload?.id]:{
                        ...action?.payload,
                        users:checkusersAdmins
                    }
                },
                UserDetails:UserDetails
            }
        case ActionTypes.SET_BROADCAST_DETAILS_LIST:
            const checkusersAdminss =  action.payload?.users?.map((item)=>{
                const check_contact = state?.userLogin?.Contacts.filter((items)=>items?.user_id === item?.id)?.length>0?true:false;
                const RegisterName = state?.userLogin?.Contacts.filter((items)=>items?.user_id === item?.id);
                if( state?.UserDetails[item?.id]){

                }else{
                    if(check_contact){
                        UserDetails = {
                            ...UserDetails,
                            [item?.id]:item
                        }
                    }else{
                        UserDetails = {
                            ...UserDetails,
                            [item?.id]:{
                                ...item,
                                name:item?.phone
                            }
                        }
                    }
                    
                }

                if(check_contact){
                    return {
                        ...item,
                        name:RegisterName[0]?.name
                    }
                }else{
                    return {
                        ...item,
                        name:item?.phone
                    }
                }
                
            })
            return{
                ...state,
                BroadcastList:{
                    ...state?.BroadcastList,
                    [action?.payload?.id]:{
                        ...action?.payload,
                        users:checkusersAdminss
                    }
                },
            }
        case ActionTypes.SET_USER_DETAILS_LIST_STORE:
            let name = "";
            const checkData = state?.userLogin?.Contacts?.filter((item)=>item?.user_id === action?.payload?.id);
            if(checkData?.length>0){
                name = checkData[0]?.name;
            }else{
                name = action?.payload?.phone;
            }
            const PayloadData = {
                ...action?.payload,
                name:name
            }
            return{
                ...state,
                UserDetails:{
                    ...state?.UserDetails,
                    [action?.payload?.id]:{
                        ...PayloadData
                    }
                }
            }
        case ActionTypes.SET_MESSAGES_TAB_COUNT:
            const NewData = state?.Rooms?.map((item)=>{
                if(item?.id === action?.payload?.to_id){
                    return {
                        ...item,
                        unread_count:action?.payload?.unread_count
                    }
                }else{
                    return item;
                }
            });
            const Selectedroom = state?.SelectedRoom;
            if(state?.SelectedRoom?.id === action?.payload?.to_id){
                Selectedroom.unread_count = action?.payload?.unread_count;
            }
            return{
                ...state,
                Rooms:NewData,
                Selectedroom:Selectedroom,
            }
        case ActionTypes.SET_UPDATE_CONTACT_NAME:
            const SelectedRoomData = state?.SelectedRoom;
            const ContactsData = action?.payload?.Contacts?.map((item)=>{
                if(item?.user_id === SelectedRoomData?.id){
                    SelectedRoomData.name = item?.name;
                }
                return item;
            });
            const NewRooms = state?.Rooms?.map((item)=>{
                const checkSameUser = ContactsData?.filter((item2)=>item2?.user_id === item?.id);
                if(checkSameUser?.length >0){
                    return{
                        ...item,
                        name:checkSameUser[0]?.name
                    }
                }else{
                    return {
                        ...item
                    }
                }
            })
            const NewContacts = state?.Contacts?.map((item)=>{
                const checkSameUser = ContactsData?.filter((item2)=>item2?.user_id === item?.id);
                if(checkSameUser?.length >0){
                    return{
                        ...item,
                        name:checkSameUser[0]?.name
                    }
                }else{
                    return {
                        ...item
                    }
                }
            });

            return{
                ...state,
                userLogin:{
                    ...state?.userLogin,
                    Contacts:ContactsData,
                    contacts:JSON.stringify(ContactsData)
                },
                SelectedRoom:SelectedRoomData,
                Contacts:NewContacts,
                Rooms:NewRooms
            }
        case ActionTypes.SET_MAGIC_CODE:
            return{
                ...state,
                magic_code:action?.payload
            };
        case ActionTypes.SET_ADD_NOTIFICATION_LIST:
            // console.log("0167d07a-3c2a-4607-bda7-e688f7ced4a4",action?.payload);
            if(action?.payload?.notification?.show){
                const notification = new Notification(action?.payload?.notification?.title,action?.payload?.notification?.options);
                notification.onclick = (e) =>{
                    e.preventDefault();
                    // window.open(action?.payload?.notification?.path_url, '_blank');
                    window.open(action?.payload?.notification?.path_url)
                    window.focus();
                    notification.close();
                }
            }
            return{
                ...state,
                Notification:{
                    ...state?.Notification,
                    [action?.payload?.id]:action?.payload
                }
            }
        case ActionTypes.SET_SEARCH_MODAL_DATA:
            return{
                ...state,
                SearchModal:action?.payload
            }
        case ActionTypes.SET_STORE_GETCHATS_HISTORY:
            const getOldChatHistory = state?.getChatHistory;

            // console.log("state?.getChatHistory",getOldChatHistory)
            const filterListHistory = getOldChatHistory?.filter((item)=>{
                if(action?.payload?.request?.to_id){
                    if(item?.request?.to_id === action?.payload?.request?.to_id){
                        return item;
                    }else{
                        return null;
                    }
                }
                if(action?.payload?.request?.broadcast_id){
                    if(item?.request?.broadcast_id === action?.payload?.request?.broadcast_id){
                        return item;
                    }else{
                        return null;
                    }
                }
            });
            if(filterListHistory?.length === 0){
                getOldChatHistory?.push(action?.payload)
            }
            return{
                ...state,
                getChatHistory:getOldChatHistory
            }
        case ActionTypes.DELETE_STORE_GETCHATS_HISTORY:
            return{
                ...state,
                getChatHistory:state?.getChatHistory?.filter((item)=>{
                    if(item?.request?.to_id){
                        if(item?.request?.to_id !== action?.payload?.id){
                            return item;
                        }else{
                            return null;
                        }
                    }else if(item?.request?.broadcast_id){
                        if(item?.request?.broadcast_id !== action?.payload?.id){
                            return item;
                        }else{
                            return null;
                        }
                    }
                })
            };
        case ActionTypes.SET_REPLAY_SAVE_CHAT_MESSAGES:
            return{
                ...state,
                replySaveChat:{
                    ...state?.replySaveChat,
                    [action?.payload?.id]:action?.payload
                }
            }
        case ActionTypes.SET_REMOVE_SAVED_MESSAGES:
            return{
                ...state,
                SavedMessages:state?.SavedMessages?.filter((item)=>item?.chat_id!==action?.payload?.id)
            }
        case ActionTypes.SET_STORE_VIEW_BASE_URL:
            return{
                ...state,
                view_base_url:{
                    ...state?.view_base_url,
                    [action?.payload?.id]:action?.payload?.url
                }
            }
        case ActionTypes.CLEAR_STORE_VIEW_BASE_URL:
            return{
                ...state,
                view_base_url:[]
            }
        case ActionTypes.SET_STORE_USER_TYPES:
            const user_types = state?.user_types;
            const user_types_filter = [];

            if(user_types){
                action?.payload?.map((item)=>{
                    const result = user_types?.filter((item1)=>item?.key === item1?.key || item?.value === item1?.value);
                    if(result?.length === 0){
                        user_types_filter?.push(item)
                    }else{
                        user_types_filter?.push(result[0]);
                    }
                })
            }else{
                action?.payload?.map((item)=>{
                    user_types_filter?.push(item);
                })
            }
            return{
                ...state,
                user_types:user_types_filter
            }
        case ActionTypes.SET_SELECT_USER_TYPE:
            const Select_type = state?.select_types;
            Select_type?.push(action?.payload);
            return{
                ...state,
                select_types:Select_type
            }
        case ActionTypes.SET_DESELECT_USER_TYPE:
            return{
                ...state,
                select_types:state?.select_types?.filter((item)=>item?.key!=action?.payload?.key)
            }
        case ActionTypes.SET_SCROLL_TO_CHAT:
            return{
                ...state,
                scroll_chat_id:action?.payload
            };
        case ActionTypes.CHECK_FILE_AUTHENTICATE:
            return{
                ...state,
                isAuthCheck:action?.payload
            }
        case ActionTypes.SET_PAGINATION_LIST:
            return {
                ...state,
                pagination:action?.payload
            }
        case ActionTypes.SET_UPDATE_PAGINATION_LIST:
            const OldPagination = state?.pagination?.page_data;
            const newData = action?.payload;
            let old_page_number = state?.pagination?.page_number;
            if(newData?.length > 0){
                newData?.map((item)=>{
                    if(OldPagination?.filter((items)=>items.id === item?.id)?.length === 0){
                        OldPagination?.push(item);
                    }
                });
                old_page_number += 1;
            }
            return {
                ...state,
                pagination:{
                    page_data:OldPagination,
                    page_size:state?.pagination?.page_size,
                    page_number:old_page_number
                }
            }
        default:
            return state;
    }
}