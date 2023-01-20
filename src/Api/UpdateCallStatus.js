import { baseURL } from "../constant/url";

export const UpdateCallStatusAPI = async (access_token, call_id, status) => {
    try {
      const headers = new Headers();
  
      headers.append("Content-Type", "application/json");
      headers.append("Vary", "Accept");
      headers.append("Authorization", `Bearer ${access_token}`);
  
      const getResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/firebase/call_status/${call_id}/${status}`,
        {
            headers,
            method: "GET",
        }
      )
  
      return getResponse;
    } catch (error) {}
};