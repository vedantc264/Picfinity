

import axios from "axios";

export default async function handleButtonOnClick(photo_id , loggedIn ,token){
    console.log("handle button clicked");
    if(!loggedIn)
    {
        // window.location.href = "/login";
        alert("please login first")
    }
    console.log(photo_id);
    console.log(token);
    const response = await axios.post("https://ieee-hackathon-2024-codecrafters-1.onrender.com/api/photo/saveAPhoto",{
       
    },{
        headers:{
            "Content-Type":"application/json",
            "token" : token,
            photo_id : photo_id
        }
    });
    console.log(response.data)
    
    if(response.data.Api_Response==323)
    {
        alert("photo is already saved");
    }
    else if(response.data.saved)
    {
        alert("photo saved")
    }
    
}