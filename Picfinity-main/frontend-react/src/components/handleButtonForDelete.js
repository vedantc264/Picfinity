import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default async function handleButtonOnClickDelete(photo_id, loggedIn, token, photos, setPhotos) {
    console.log("handle button clicked");
    if (!loggedIn) {
        alert("please login first");
        return;
    }
    console.log(photo_id);
    console.log(token);
    try {
        const response = await axios.delete(`${API_BASE}/photo/deleteAPhoto`, {
            headers: {
                "Content-type": "Application/json",
                token: token,
                "photo_id": photo_id
            }
        });
        console.log(response.data);
        if (response.data.deleted) {
            const updated = photos.filter((photo) => (photo.photoId || photo.id) !== photo_id);
            setPhotos(updated);
            alert("photo deleted");
        } else {
            alert("problem deleting photo");
        }
    } catch (err) {
        console.error("Error deleting photo:", err);
        alert(err.response?.data?.message || "problem deleting photo");
    }
}