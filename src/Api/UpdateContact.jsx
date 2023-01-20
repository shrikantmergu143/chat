import { baseURL } from '../constant/url';
import { setUpdateContactName } from '../redux/actions';
// import axios from 'axios';

const GetUpdateContact = (accessToken) => {
    return(async (dispatch, getState)=>{
        const axios = require('axios').default;
    
        axios.get(`${process.env.REACT_APP_BASE_URL}/user/get-contacts`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
        .then(function (response) {
            if(response?.status === 200){
                dispatch(setUpdateContactName({
                    Contacts:JSON.parse(response?.data?.data)
                }))
            }
        })
        .catch(function (error) {
            return error;
        });
    })
}
export default GetUpdateContact;
