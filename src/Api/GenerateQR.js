import { baseURL } from '../constant/url';

const GenerateQRcodeAPI = async () => {
  const responce = window.axios.get(`${process.env.REACT_APP_BASE_URL}/user/generate-qr-token`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }}).then(function (result) {
        return result;
    }).catch(function (result) {
        // console.log("Something went wrong...");
    });
    return responce;
};

export default GenerateQRcodeAPI;