import { baseURL } from "../constant/url";

export const SendNotificationAPI = async (access_token, notification_id) => {
    try {
      const getResponse = await window.axios.get(`${process.env.REACT_APP_BASE_URL}/firebase/notification/${notification_id}`,{
        headers: {
          'Authorization':`Bearer ${access_token}`
        }
      })
  
      return getResponse;
    } catch (error) {}
};