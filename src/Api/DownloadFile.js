import { useSelector } from 'react-redux';
import GetViewFilesAPI from './Viewfiles';

const DownloadFile =async (file, access_token) => {
    const url = await GetViewFilesAPI(file?.view_file_url, access_token);
    var tempEl = document.createElement("a");
    tempEl.href = url;
    tempEl.download = file?.name;
    tempEl.click();
    window.URL.revokeObjectURL(url);
                
};

export default DownloadFile;