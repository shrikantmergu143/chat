const CheckIsLogin = async () => {
    const responce = fetch(`${process.env.REACT_APP_BASE_URL}/user/get_login`).then(res=>res.text());
      return responce;
};
  
export default CheckIsLogin;