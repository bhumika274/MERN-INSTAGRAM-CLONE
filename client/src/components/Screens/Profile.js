import React, {useEffect, useState, useContext} from "react";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";

    const Profile=()=>{

        const [myPics, setMyPics] = useState([]);
        const [image, setImage] = useState("");
        const  {state, dispatch} = useContext(UserContext);
        const navigate = useNavigate();
        useEffect(()=>{

            fetch("/mypost", {
                headers:{
                    "authorization" : `Bearer ${localStorage.getItem("jwt")}`
                }
            })
            .then(res => res.json())
            .then(result =>{
                setMyPics(result.posts) 
            })
        },[])
    
    useEffect(()=>{
        if(image){

            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", "insta-clone");
            data.append("cloud_name", "bhuicc");
            
            console.log(data);
            // Fetch to upload photo to server
            fetch("https://api.cloudinary.com/v1_1/bhuicc/image/upload", {
            method: "post",
            body: data
            })
            .then(res => res.json())
            .then(data =>{
                
                fetch("/updatepic", {
                    method:"put",
                    headers:{
                        "Content-Type" : "application/json",
                        "authorization" : `Bearer ${localStorage.getItem("jwt")}`
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                }).then(res => res.json())
                .then(result =>{
                    console.log(result)
                    localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                    dispatch({type:"UPDATEPIC",payload:result.pic})
                })
            })
            .catch((error) => console.log(error));
        
        }
    },[image])

    
    const updatePhoto = (file) =>{
        setImage(file);
    }

    return(
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div  style={{
                margin:"18px 0px",
                borderBottom:"1px solid black"
                }}>

                <div style={{
                    display:"flex",
                    justifyContent:"space-around"
                }}>
                    <div>
                        <img style={{width:"160px", height:"160px", borderRadius:"50%"} }
                        src={state?state.pic:"https://res.cloudinary.com/bhuicc/image/upload/v1707037510/irjvunkymmddarebuonz.jpg"}/>
                    </div>
                    
                <div>
                    <h4>{state?state.name:"loading..."}</h4>
                    <h5>{state?state.email:"loading..."}</h5>
                    <div style={{display:"flex", justifyContent:"space-between",width:"108%"}}>
                        <h6>{myPics.length} Posts</h6>
                        <h6>{state?state.followers.length:"0"} Followers</h6>
                        <h6>{state?state.following.length:"0"} Following</h6>
                    </div>
                </div>
            </div>

            <div className="file-field input-field" style={{margin:"10px"}}>
            <div className="btn #64b5f6 blue darken-1">
                <span>Update Pic</span>
                <input 
                    type="file" 
                    onChange={ (event)=>{
                        updatePhoto(event.target.files[0])
                        navigate("/profile");
                    }}
                
                    />
            </div>
            <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            </div>
            <div className="gallery">

                {
                    myPics.map(item=>{
                        return(
                           <img key = {item._id} src={item.photo} alt={item.title} style={{height: "200px", width: "200px"}} />
                        )
                    })
                }
                
                
                    
            </div>
        </div>
    );
}

export default Profile;