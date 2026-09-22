

import axios from "axios";

export default async function handleButtonOnClickDelete(photo_id , loggedIn ,token , photos,  setPhotos){
    console.log("handle button clicked");
    if(!loggedIn)
    {
        // window.location.href = "/login";
        alert("please login first")
    }
    console.log(photo_id);
    console.log(token);
    const response = await axios.delete("https://ieee-hackathon-2024-codecrafters-1.onrender.com/api/photo/deleteAPhoto",{
        headers :{
            "Content-type" : "Application/json",
            token : token,
            "photo_id" : photo_id
        }
    })
    console.log(response.data)
    if(response.data.deleted)
    {
        //now we need to remove the photo with the provided photo id from the array
        //we need to find the index of the photo with the provided photo id
        const index = photos.findIndex((photo) => photo.photo_id === photo_id);
        console.log(index);
        //now we need to remove the photo with the provided photo id from the array
        //we need to find the index of the photo with the provided photo id
        photos.splice(index,1);
        setPhotos(photos);
        alert("photo deleted")
    }
    else{
        alert("problem")
    }
}