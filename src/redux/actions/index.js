export const ActionTypes = {
    USER_ID: "USER_ID",
    SET_MY_PROFILE: "SET_MY_PROFILE",
    REFRESH_DATA: "REFRESH_DATA",
    EDIT_PROFILE: "EDIT_PROFILE",
    SET_ROOM: "SET_ROOM",
    TAB_CHANGE: "TAB_CHANGE",
    SET_BLOCKED_USERS: "SET_BLOCKED_USERS",
    CREATE_NEW_GROUP: "CREATE_NEW_GROUP",
    SELECT_ROOM: "SELECT_ROOM",
    SET_MESSAGE: "SET_MESSAGE",
    NEW_MESSAGE_SEND: "NEW_MESSAGE_SEND",
    DELETE_MESSAGE: "DELETE_MESSAGE",
    SAVED_MESSAGES: "SAVED_MESSAGES",
    SET_REMOVE_SAVED_MESSAGES:"SET_REMOVE_SAVED_MESSAGES",
    SAVE_MESSAGE: "SAVE_MESSAGE",
    CLEAR_CHAT_HISTORY: "CLEAR_CHAT_HISTORY",
    MAKE_ADMIN: "MAKE_ADMIN",
    REMOVE_GROUPS_MEMBER: "REMOVE_GROUPS_MEMBER",
    STORE_CONTACT_LIST:"STORE_CONTACT_LIST",
    STORE_USER_PROFILE:"STORE_USER_PROFILE",
    SET_WEBSOCKET_CONNECTION:"SET_WEBSOCKET_CONNECTION",
    STORE_BLOCK_CONTACT:"STORE_BLOCK_CONTACT",
    GET_GROUPS_LIST:"GET_GROUPS_LIST",
    GET_GROUPS_DETAILS:"GET_GROUPS_DETAILS",
    GET_MESSAGE_LIST:"GET_MESSAGE_LIST",
    FILTER_CHAT_MESSAGES_LIST:"FILTER_CHAT_MESSAGES_LIST",
    UPDATE_CHAT_MESSAGES_LIST:"UPDATE_CHAT_MESSAGES_LIST",
    SET_UPDATE_GROUPS_DETAILS_FILTER:"SET_UPDATE_GROUPS_DETAILS_FILTER",
    SET_SEEN_AT_MESSAGES:"SET_SEEN_AT_MESSAGES",
    SET_MESSAGES_SEEN_MEMBERS:"SET_MESSAGES_SEEN_MEMBERS",
    SET_MESSAGES_DELIVERED:"SET_MESSAGES_DELIVERED",
    SET_REMOVE_MEMBER_FROM_ROOM:"SET_REMOVE_MEMBER_FROM_ROOM",
    SET_CHAT_LIMIT_LIST:"SET_CHAT_LIMIT_LIST",
    SET_REMOVE_GROUP_FROM_ROOM:"SET_REMOVE_GROUP_FROM_ROOM",
    SET_OLD_CHAT_MESSAGES_TO_NEW:"SET_OLD_CHAT_MESSAGES_TO_NEW",
    SET_SAVE_QRCODE:"SET_SAVE_QRCODE",
    SET_LOGIN_QR_CODE_USER:"SET_LOGIN_QR_CODE_USER",
    SET_LOGOUT_USER:"SET_LOGOUT_USER",
    SET_USER_ONLINE_OR_OFFLINE:"SET_USER_ONLINE_OR_OFFLINE",
    SET_UPDATE_MEDIA_FILES:"SET_UPDATE_MEDIA_FILES",
    SET_UPDATE_MESSAGES_LIST:"SET_UPDATE_MESSAGES_LIST",
    SET_REGISTERD_DEVICE_ID:"SET_REGISTERD_DEVICE_ID",
    SET_REGISTERD_SYSTEM_ID:"SET_REGISTERD_SYSTEM_ID",
    TOASTER_MESSAGE:"TOASTER_MESSAGE",
    SET_BROWSER_ACTIVITY:"SET_BROWSER_ACTIVITY",
    SET_OPEN_MODAL_POPUP_CONFIRM:"SET_OPEN_MODAL_POPUP_CONFIRM",
    SET_CLOSE_MODAL_POPUP_CONFIRM:"SET_CLOSE_MODAL_POPUP_CONFIRM",
    SET_ADD_GROUP_IN_ROOMS:"SET_ADD_GROUP_IN_ROOMS",
    SET_GO_BACK_TO_HOME_SCREEN:"SET_GO_BACK_TO_HOME_SCREEN",
    SET_ADD_CHAT_IN_MESSAGES_LIST:"SET_ADD_CHAT_IN_MESSAGES_LIST",
    SET_UPDATE_MESSAGES_SEEN_DELIVERED:"SET_UPDATE_MESSAGES_SEEN_DELIVERED",
    SET_ADD_BROADCAST_GROUP_LIST:"SET_ADD_BROADCAST_GROUP_LIST",
    SET_ADD_SYSTEM_GROUP_LIST:"SET_ADD_SYSTEM_GROUP_LIST",
    SET_SELECTROOM_BROADCAST:"SET_SELECTROOM_BROADCAST",
    SET_UPDATE_BROADCAST_GROUP_LIST:"SET_UPDATE_BROADCAST_GROUP_LIST",
    SET_ADD_BROADCAST_MESSAGES_LIST_BROADCAST:"SET_ADD_BROADCAST_MESSAGES_LIST_BROADCAST",
    SET_ADD_NEW_BROADCAST:"SET_ADD_NEW_BROADCAST",
    SET_USERS_TYPEING_STATUS:"SET_USERS_TYPEING_STATUS",
    SET_STORE_SAVE_CHAT_LIST:"SET_STORE_SAVE_CHAT_LIST",
    SET_SAVE_MESSAGES_LIST:"SET_SAVE_MESSAGES_LIST",
    SET_NEW_MESSAGES_SAVE:"SET_NEW_MESSAGES_SAVE",
    SET_RESET_REDUX_STORE:"SET_RESET_REDUX_STORE",
    SET_ADD_BROADCAST_MESSAGES_LIST:"SET_ADD_BROADCAST_MESSAGES_LIST",
    SET_UPDATE_BLOCK_CONTACT:"SET_UPDATE_BLOCK_CONTACT",
    SET_UPDATE_CHAT_MESSAGES_URL:"SET_UPDATE_CHAT_MESSAGES_URL",
    SET_MESSAGES_SEEN_BY_USER:"SET_MESSAGES_SEEN_BY_USER",
    SET_GROUP_USERCREATED_DETAILS:"SET_GROUP_USERCREATED_DETAILS",
    SET_BROADCAST_MEESAGES_UPDATE:"SET_BROADCAST_MEESAGES_UPDATE",
    SET_DETAILS_LIST_STORE:"SET_DETAILS_LIST_STORE",
    SET_BROADCAST_DETAILS_LIST:"SET_BROADCAST_DETAILS_LIST",
    GET_ALL_USER_LIST:"GET_ALL_USER_LIST",
    SET_MESSAGES_TAB_COUNT:"SET_MESSAGES_TAB_COUNT",
    SET_USER_DETAILS_LIST_STORE:"SET_USER_DETAILS_LIST_STORE",
    SET_UPDATE_CONTACT_NAME:"SET_UPDATE_CONTACT_NAME",
    SET_MAGIC_CODE:"SET_MAGIC_CODE",
    SET_ADD_NOTIFICATION_LIST:"SET_ADD_NOTIFICATION_LIST",
    SET_SEARCH_MODAL_DATA:"SET_SEARCH_MODAL_DATA",
    SET_STORE_GETCHATS_HISTORY:"SET_STORE_GETCHATS_HISTORY",
    DELETE_STORE_GETCHATS_HISTORY:"DELETE_STORE_GETCHATS_HISTORY",
    SET_REPLAY_SAVE_CHAT_MESSAGES:"SET_REPLAY_SAVE_CHAT_MESSAGES",
    SET_STORE_VIEW_THUMBNAIL_URL:"SET_STORE_VIEW_THUMBNAIL_URL",
    CLEAR_STORE_VIEW_THUMBNAIL_URL:"CLEAR_STORE_VIEW_THUMBNAIL_URL",
    SET_STORE_VIEW_BASE_URL:"SET_STORE_VIEW_BASE_URL",
    CLEAR_STORE_VIEW_BASE_URL:"CLEAR_STORE_VIEW_BASE_URL",
    SET_STORE_USER_TYPES:"SET_STORE_USER_TYPES",
    SET_SELECT_USER_TYPE:"SET_SELECT_USER_TYPE",
    SET_DESELECT_USER_TYPE:"SET_DESELECT_USER_TYPE",
    SET_SCROLL_TO_CHAT:"SET_SCROLL_TO_CHAT",
    EMOJI_LIST_GET:"EMOJI_LIST_GET",
    OPEN_GROUP_INFO:"OPEN_GROUP_INFO",
    CHECK_FILE_AUTHENTICATE:"CHECK_FILE_AUTHENTICATE",
    THEME_CHANGE:"THEME_CHANGE",
    SET_PAGINATION_LIST:"SET_PAGINATION_LIST",
    SET_UPDATE_PAGINATION_LIST:"SET_UPDATE_PAGINATION_LIST"
}

export const ThemeChangeBtn = (theme) => {
    return {
        type: ActionTypes.THEME_CHANGE,
        payload: theme,
    }
}

export const openGroupInfoFnct = (infosidebar) => {
    return {
        type: ActionTypes.OPEN_GROUP_INFO,
        payload: infosidebar,
    }
}

export const getMessageList = (messages) => {
    return {
        type: ActionTypes.GET_MESSAGE_LIST,
        payload: messages,
    }
}

export const refreshData = () => {
    return {
        type: ActionTypes.REFRESH_DATA,
    }
}

export const emojiListData = (emoji) => {
    return {
        type: ActionTypes.EMOJI_LIST_GET,
        payload: emoji,
    }
}

export const userIdGet = (user_id) => {
    return {
        type: ActionTypes.USER_ID,
        payload: user_id,
    }
}

export const ToasterMessageShow = (message) => {
    return {
        type: ActionTypes.TOASTER_MESSAGE,
        payload: message,
    }
}

export const setMyProfile = (profile) => {
    return {
        type: ActionTypes.SET_MY_PROFILE,
        payload: profile,
    }
}

export const editMyProfile = (profile) => {
    return {
        type: ActionTypes.EDIT_PROFILE,
        payload: profile,
    }
}

export const makeAdmin = (member) => {
    return {
        type: ActionTypes.MAKE_ADMIN,
        payload: member,
    }
}

export const saveMessage = (message) => {
    return {
        type: ActionTypes.SAVE_MESSAGE,
        payload: message,
    }
}

export const removeMember = (member) => {
    return {
        type: ActionTypes.REMOVE_GROUPS_MEMBER,
        payload: member,
    }
}

export const setRoom = (Rooms) => {
    return {
        type: ActionTypes.SET_ROOM,
        payload: Rooms,
    }
}

export const mainTabChange = (request_for) => {
    return {
        type: ActionTypes.TAB_CHANGE,
        payload: request_for,
    }
}

export const setBlockedUsers = (Rooms) => {
    return {
        type: ActionTypes.SET_BLOCKED_USERS,
        payload: Rooms,
    }
}

export const createNewGroup = (group) => {
    return {
        type: ActionTypes.CREATE_NEW_GROUP,
        payload: group,
    }
}

export const getGroupsList = (group) => {
    return {
        type: ActionTypes.GET_GROUPS_LIST,
        payload: group,
    }
}

export const selectRoom = (Room) => {
    return {
        type: ActionTypes.SELECT_ROOM,
        payload: Array.isArray(Room) === true ? Room[0] : Room,
    }
}

export const setMessages = (messages) => {
    return {
        type: ActionTypes.SET_MESSAGE,
        payload: messages,
    }
}

export const newMessageSend = (newMessage) => {
    return {
        type: ActionTypes.NEW_MESSAGE_SEND,
        payload: newMessage,
    }
}

export const deleteMessage = (message) => {
    return {
        type: ActionTypes.DELETE_MESSAGE,
        payload: message,
    }
}

export const savedMessages = (messages) => {
    return {
        type: ActionTypes.SAVED_MESSAGES,
        payload: messages,
    }
}
export const removeSaveMessageList = (messages) => {
    return {
        type: ActionTypes.SET_REMOVE_SAVED_MESSAGES,
        payload: messages,
    }
}
export const clearMessage = (messages) => {
    return {
        type: ActionTypes.CLEAR_CHAT_HISTORY,
        payload: messages,
    }
}
export const contactList = (payload) => {
    return {
        type: ActionTypes.STORE_CONTACT_LIST,
        payload: payload,
    }
}
export const getBlockContacts = (payload) => {
    return {
        type: ActionTypes.STORE_BLOCK_CONTACT,
        payload: payload,
    }
}
export const StoreUserprofile = (payload) => {
    return {
        type: ActionTypes.STORE_USER_PROFILE,
        payload: payload,
    }
}
export const setConnectWebSocket = (payload) => {
    return {
        type: ActionTypes.SET_WEBSOCKET_CONNECTION,
        payload: payload,
    }
}
export const getSelectRoomsDetails = (payload) => {
    return {
        type: ActionTypes.GET_GROUPS_DETAILS,
        payload: payload,
    }
}
export const SetFilterChatMessagesList = (payload) => {
    return {
        type: ActionTypes.FILTER_CHAT_MESSAGES_LIST,
        payload: payload,
    }
}
export const SetUpdateChatMessagesList = (payload) => {
    return {
        type: ActionTypes.UPDATE_CHAT_MESSAGES_LIST,
        payload: payload,
    }
}
export const SetUpdateGroupListFilter = (payload) => {
    return {
        type: ActionTypes.SET_UPDATE_GROUPS_DETAILS_FILTER,
        payload: payload,
    }
}
export const SetSeenAtMessages = (payload) => {
    return {
        type: ActionTypes.SET_SEEN_AT_MESSAGES,
        payload: payload,
    }
}
export const SetMembersListSeenMessages = (payload) =>{
    return {
        type: ActionTypes.SET_MESSAGES_SEEN_MEMBERS,
        payload: payload,
    }
}
export const SetMessagesDelivered = (payload) =>{
    return {
        type: ActionTypes.SET_MESSAGES_DELIVERED,
        payload: payload,
    }
}
export const RemoveMembersFromRooms = (payload) =>{
    return {
        type: ActionTypes.SET_REMOVE_MEMBER_FROM_ROOM,
        payload: payload,
    }
}
export const RemoveGroupsFromRooms = (payload) =>{
    return {
        type: ActionTypes.SET_REMOVE_GROUP_FROM_ROOM,
        payload: payload,
    }
}
export const GetStoreLimitMessage = (payload) =>{
    return {
        type: ActionTypes.SET_CHAT_LIMIT_LIST,
        payload: payload,
    }
}
export const GetStoreOldMessage = (payload) =>{
    return {
        type: ActionTypes.SET_OLD_CHAT_MESSAGES_TO_NEW,
        payload: payload,
    }
}
export const GetCallSaveQR = (payload) =>{
    return {
        type: ActionTypes.SET_SAVE_QRCODE,
        payload: payload,
    }
}
export const StoreLoginUserQR = (payload) =>{
    return {
        type: ActionTypes.SET_LOGIN_QR_CODE_USER,
        payload: payload,
    }
}
export const CallLogoutUser = () =>{
    return {
        type: ActionTypes.SET_LOGOUT_USER,
    }
}
export const CallOnline = (payload) =>{
    return {
        type: ActionTypes.SET_USER_ONLINE_OR_OFFLINE,
        payload:payload
    }
}
export const UpdateMediaFiles = (payload) =>{
    return {
        type: ActionTypes.SET_UPDATE_MEDIA_FILES,
        payload:payload
    }
}
export const setUpdateMessagesList = (payload) =>{
    return {
        type: ActionTypes.SET_UPDATE_MESSAGES_LIST,
        payload:payload
    }
}

export const setRegisterdDevice = (payload) =>{
    return {
        type: ActionTypes.SET_REGISTERD_DEVICE_ID,
        payload:payload
    }
}

export const setRegisterdSystem = (payload) =>{
    return {
        type: ActionTypes.SET_REGISTERD_SYSTEM_ID,
        payload:payload
    }
}

export const setBrowserStatus = (messages) => {
    return {
        type: ActionTypes.SET_BROWSER_ACTIVITY,
        payload: messages,
    }
}
export const setOpenModalPopup = (messages) => {
    return {
        type: ActionTypes.SET_OPEN_MODAL_POPUP_CONFIRM,
        payload: messages,
    }
}

export const setCloseModalPopup = () => {
    return {
        type: ActionTypes.SET_CLOSE_MODAL_POPUP_CONFIRM,
    }
}

export const setAddGroupCreated = (messages) => {
    return {
        type: ActionTypes.SET_ADD_GROUP_IN_ROOMS,
        payload: messages,
    }
}
export const setGoBackFromSelect = (messages) => {
    return {
        type: ActionTypes.SET_GO_BACK_TO_HOME_SCREEN,
        payload: messages,
    }
}
export const setAddChatInMessageList = (messages) => {
    return {
        type: ActionTypes.SET_ADD_CHAT_IN_MESSAGES_LIST,
        payload: messages,
    }
}
export const SetUpdateMessagesSeenDelivered = (messages) => {
    return {
        type: ActionTypes.SET_UPDATE_MESSAGES_SEEN_DELIVERED,
        payload: messages,
    }
}
export const setAddBroadCastGroup = (messages) => {
    return {
        type: ActionTypes.SET_ADD_BROADCAST_GROUP_LIST,
        payload: messages,
    }
}
export const setAddSystemGroup = (messages) => {
    return {
        type: ActionTypes.SET_ADD_SYSTEM_GROUP_LIST,
        payload: messages,
    }
}
export const setSelectedBroadCastList = (messages) => {
    return {
        type: ActionTypes.SET_SELECTROOM_BROADCAST,
        payload: messages,
    }
}
export const updateBroadcastGroupList = (messages) => {
    return {
        type: ActionTypes.SET_UPDATE_BROADCAST_GROUP_LIST,
        payload: messages,
    }
}
export const setAddMessagesListBroadcast = (messages) => {
    return {
        type: ActionTypes.SET_ADD_BROADCAST_MESSAGES_LIST_BROADCAST,
        payload: messages,
    }
}
export const setAddNewBroadCast = (messages) => {
    return {
        type: ActionTypes.SET_ADD_NEW_BROADCAST,
        payload: messages,
    }
}
export const setUserTypeing = (messages) => {
    return {
        type: ActionTypes.SET_USERS_TYPEING_STATUS,
        payload: messages,
    }
}
export const setSaveChatList = (messages) => {
    return {
        type: ActionTypes.SET_STORE_SAVE_CHAT_LIST,
        payload: messages,
    }
}
export const setNewMessageSave = (messages) => {
    return {
        type: ActionTypes.SET_NEW_MESSAGES_SAVE,
        payload: messages,
    }
}
export const setSaveMessageInList = (messages) => {
    return {
        type: ActionTypes.SET_SAVE_MESSAGES_LIST,
        payload: messages,
    }
}
export const setResetReduxStore = () => {
    return {
        type: ActionTypes.SET_RESET_REDUX_STORE,
    }
}
export const setAddBroadcastMessagesList = () => {
    return {
        type: ActionTypes.SET_ADD_BROADCAST_MESSAGES_LIST,
    }
}
export const setUpdateContactList = (messages) => {
    return {
        type: ActionTypes.SET_UPDATE_BLOCK_CONTACT,
        payload: messages,
    }
}
export const SetMessageSeenByUser = (message) =>{
    return{
        type: ActionTypes.SET_MESSAGES_SEEN_BY_USER,
        payload: message,
    }
}
export const setGroupCreatedUser = (message) =>{
    return{
        type: ActionTypes.SET_GROUP_USERCREATED_DETAILS,
        payload: message,
    }
}
export const SetBroadcastMessagesUpdate = (message)=>{
    return{
        type: ActionTypes.SET_BROADCAST_MEESAGES_UPDATE,
        payload: message,
    }
}
export const SetDetailsList = (message)=>{
    return{
        type: ActionTypes.SET_DETAILS_LIST_STORE,
        payload: message,
    }
}
export const setDetailsBroadcastList = (message)=>{
    return{
        type: ActionTypes.SET_BROADCAST_DETAILS_LIST,
        payload: message,
    }
}
export const GetAllUsersList = (userlist)=>{
    return{
        type: ActionTypes.GET_ALL_USER_LIST,
        payload: userlist
    }
}
export const setMessagesTabCounts = (payload)=>{
    return{
        type: ActionTypes.SET_MESSAGES_TAB_COUNT,
        payload: payload
    }
}
export const setUsersDetailsList = (payload)=>{
    return{
        type: ActionTypes.SET_USER_DETAILS_LIST_STORE,
        payload: payload
    }
}
export const setUpdateContactName = (payload)=>{
    return{
        type: ActionTypes.SET_UPDATE_CONTACT_NAME,
        payload: payload
    }
}
export const setGetMagicCode = (payload)=>{
    return{
        type: ActionTypes.SET_MAGIC_CODE,
        payload: payload
    }
}
export const setAddNotificationList = (payload)=>{
    return{
        type: ActionTypes.SET_ADD_NOTIFICATION_LIST,
        payload: payload
    }
}
export const setSearchModalData = (payload)=>{
    return{
        type: ActionTypes.SET_SEARCH_MODAL_DATA,
        payload: payload
    }
}
export const setStoreGetChatsHistory = (payload)=>{
    return{
        type: ActionTypes.SET_STORE_GETCHATS_HISTORY,
        payload: payload
    }
}
export const deleteStoreGetChatsHistory = (payload)=>{
    return{
        type: ActionTypes.DELETE_STORE_GETCHATS_HISTORY,
        payload: payload
    }
}
export const setReplaySaveChatMessages = (payload)=>{
    return{
        type: ActionTypes.SET_REPLAY_SAVE_CHAT_MESSAGES,
        payload: payload
    }
}
export const SetStoreViewBaseURL = (payload)=>{
    return{
        type: ActionTypes.SET_STORE_VIEW_BASE_URL,
        payload: payload
    }
}
export const CleanViewBaseURL = ()=>{
    return{
        type: ActionTypes.CLEAR_STORE_VIEW_BASE_URL,
    }
}
export const setStoreUserTypes = (payload)=>{
    return{
        type: ActionTypes.SET_STORE_USER_TYPES,
        payload: payload
    }
}
export const setSelectUserType = (payload)=>{
    return{
        type: ActionTypes.SET_SELECT_USER_TYPE,
        payload: payload
    }
}
export const setDeselectUserType = (payload)=>{
    return{
        type: ActionTypes.SET_DESELECT_USER_TYPE,
        payload: payload
    }
}
export const setScrollToChatid = (payload)=>{
    return{
        type: ActionTypes.SET_SCROLL_TO_CHAT,
        payload: payload
    }
}
export const SetIsAuthenticate = (payload)=>{
    return{
        type: ActionTypes.CHECK_FILE_AUTHENTICATE,
        payload: payload
    }
}
export const SetPaginationList = (payload)=>{
    return{
        type: ActionTypes.SET_PAGINATION_LIST,
        payload: payload
    }
}
export const SetUpdatepaginationList = (payload)=>{
    return{
        type: ActionTypes.SET_UPDATE_PAGINATION_LIST,
        payload: payload
    }
}