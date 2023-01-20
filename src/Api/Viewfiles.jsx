/* eslint-disable eqeqeq */

import { ActionTypes } from "../redux/actions";

const GetViewFilesAPI = async (url, qr_token) => {
    const options = {
      headers: {
        'Authorization': `Bearer ${qr_token}`
      }
    };
    const responce = await fetch(url, options)
    .then( res => res.blob() )
    .then( blob => {
      var file = window.URL.createObjectURL(blob);
      return file;
    }).catch((error)=>{return error;});
    return responce;
};
export const BlobGetViewFilesAPI = async (url, qr_token) => {
  const options = {
    headers: {
      'Authorization': `Bearer ${qr_token}`
    }
  };
  const responce = await fetch(url, options)
  .then( res => res.blob() )
  .then( blob => {
    var file = blob
    return file;
  }).catch((error)=>{return error;});
  return responce;
};

export default GetViewFilesAPI;

// const GetViewFilesAPI = async (url, qr_token, messages, roomID, dispatch) => {
//     var postData = new FormData();
//     var req = new XMLHttpRequest();
//     req.open('GET', url, true); //true means request will be async
//     req.responseType = 'blob';
//     req.onreadystatechange = function (aEvt) {
//       if (req.readyState == 4) {
//         if(req.status == 200){
//           console.log("aEvt", aEvt)
//         }
//           //update your page here
//           //req.responseText - is your result html or whatever you send as a response
//         else
//           alert("Error loading page\n");
//       }
//     };
//     req.onload = function (e) {
//       var blob = req.response;

//       dispatch(blob);
//       // dispatch({
//       //   type: ActionTypes?.SET_UPDATE_CHAT_MESSAGES_URL,
//       //   payload: {...messages, select_id:roomID, blob:blob},
//       // })
//       // console.log("blobblob", blob)
//       // saveOrOpenBlob(blob, name);
//     }
//     req.setRequestHeader('Authorization', `Bearer ${qr_token}`);
//     req.send(postData);
// };

// export default GetViewFilesAPI;

const saveOrOpenBlob =(blob, name)=>{
		var fileName = name
		var tempEl = document.createElement("a");
    document.body.appendChild(tempEl);
    tempEl.style = "display: none";
    const url = window.URL.createObjectURL(blob);
    // console.log("url", url)
    window.open(url)
    tempEl.href = url;
    tempEl.download = fileName;
    tempEl.click();
		window.URL.revokeObjectURL(url);
}