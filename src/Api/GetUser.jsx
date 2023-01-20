import { baseURL } from '../constant/url';
// import axios from 'axios';

const GetUser = (accessToken) => {
    const axios = require('axios').default;

    axios.get(`${process.env.REACT_APP_BASE_URL}/user/get`, {
        headers: {
            "Vary": "Accept",
            "Authorization": `Bearer ${accessToken}`,
        }
    })
    .then(function (response) {
        // console.log(response);
    })
    .catch(function (error) {
        // console.log(error);
    })
    .then(function () {
        // always executed
    });
};

export default GetUser;
 