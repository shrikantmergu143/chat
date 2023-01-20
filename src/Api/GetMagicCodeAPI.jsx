const getMagiccodeAPI = async (accessToken, payload) => {
  const responce = window.axios.post(`${process.env.REACT_APP_BASE_URL}/user/get_magic_code`,payload, {
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization':`Bearer ${accessToken}`
        },
    }).then(function (result) {
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

export default getMagiccodeAPI;