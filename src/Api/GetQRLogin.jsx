import { baseURL } from '../constant/url';

const GetloginQRCode = async (qr_token) => {
  const responce = window.axios.get(`${process.env.REACT_APP_BASE_URL}/user/get-qr-login/${qr_token}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }}).then(function (result) {
        return {
          data:result?.data,
          status:200
        };
    }).catch(function (result) {
      return {
        ...result?.response?.data,
        status:result?.response?.status,
      };
    });
      return responce;
};

export default GetloginQRCode;