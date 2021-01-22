import { GET_ANNOUNCEMENT_FILES} from "../Types";
import axios from "axios";

export const uploadFileAnnouncements = (id, formData) => {
    return axios.post(`/api/files/announcement/upload/${id}`, formData)
}

export const getFileAnnouncements = (id) => dispatch => {
   return axios.get(`/api/files/announcement/by_announcement/${id}`)
        .then((res) => {
            console.log("Announcement nya: ", res.data)
            return res.data
            // dispatch({
            //     type: GET_ANNOUNCEMENT_FILES,
            //     payload: res.data
            // })
        })
        .catch(err => new Error(err))
}

export const downloadFileAnnouncements = (id) => dispatch => {
    return axios.get(`/api/files/announcement/download/${id}`)
    .then((res) => {
        window.open(res.data)
        return res.data
        // let { file, filename} = res.data
        // let arraybuffer = Uint8Array.from(file.Body.data);
        // let blob=new Blob([arraybuffer], {type: file.ContentType});
        // let link=document.createElement('a');
        // link.href=window.URL.createObjectURL(blob);
        // link.download=filename;
        // link.click();
        // return link
    })
    .catch((err) => new Error(err))
}

export const viewFileAnnouncement = (id) => dispatch=> {
    axios.get(`/api/files/announcement/${id}`)
        .then((res) => {
            window.open(res.data)
            return res.data
        })
        .catch((err) => new Error(err))
}

export const deleteAnnouncement = (id, file_to_delete, current_file) => {
    let data = {
        file_to_delete: file_to_delete, 
        current_file: current_file
    }

    return axios.delete(`/api/files/announcement/${id}`, {data: data})
}
