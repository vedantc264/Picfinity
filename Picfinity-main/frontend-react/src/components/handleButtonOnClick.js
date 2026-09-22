import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default async function handleButtonOnClick(photo_id, loggedIn, token) {
    console.log("handle button clicked");
    if (!loggedIn) {
        alert("please login first");
        return;
    }
    console.log(photo_id);
    console.log(token);
    try {
        const response = await axios.post(`${API_BASE}/photo/saveAPhoto`, {
            photo_id: photo_id
        }, {
            headers: {
                "Content-Type": "application/json",
                "token": token,
                photo_id: photo_id
            }
        });
        console.log(response.data);

        if (response.data.Api_Response == 323) {
            alert("photo is already saved");
        } else if (response.data.saved) {
            alert("photo saved");
        }
    } catch (err) {
        console.error("Error saving photo:", err);
        alert(err.response?.data?.message || "Error saving photo");
    }
}