import { baseURL } from '../constant/url';

const GetUser = async (accessToken) => {
  const responce = window.axios.get(`${process.env.REACT_APP_BASE_URL}/user/get`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization':`Bearer ${accessToken}`
    }}).then(function (result) {
        return result.data;
    }).catch(function (result) {
        // console.log("Something went wrong...");
        return result;
    });
    return responce;
};

export default GetUser;