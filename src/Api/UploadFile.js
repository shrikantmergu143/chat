/* eslint-disable no-mixed-operators */
import { baseURL } from "../constant/url";
export function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
  
export const UploadFileAPI = async (access_token, file) => {
  // console.log("file==========>", file)
    try {
            const formData = new FormData();
            formData.append("file", file, file.name);
            formData.append("random_id", uuidv4());
            const getResponse = await window.axios.post(`${process.env.REACT_APP_BASE_URL}/upload/file`,formData,{
                headers: {
                    'Authorization':`Bearer ${access_token}`
            }});
            // console.log("responce", getResponse)
      return getResponse;
    } catch (error) {}
};