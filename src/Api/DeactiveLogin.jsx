import { baseURL } from '../constant/url';

const DeactiveLoginAPI = async (accessToken, token_id) => {
  const responce = window.axios.get(`${process.env.REACT_APP_BASE_URL}/user/deactivate-token/${token_id}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization':`Bearer ${accessToken}`
    }}).then(function (result) {
        return {
          ...result.data,
          status:200
        };
    }).catch(function (result) {
        return {
          ...result?.response?.data,
          status:result?.response?.status
        }
    });
    return responce;
};

export default DeactiveLoginAPI;