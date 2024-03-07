import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import M from "materialize-css"

function CreatePost (){

    const navigate = new useNavigate();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");


    useEffect(()=>{
      if (url) {
        fetch("/createpost", {
          method: "post",
          headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${localStorage.getItem("jwt")}`,
          },
          body: JSON.stringify({title,body,pic:url}),
        })
          .then(res => res.json())
          .then(data => {

            if (data.error) {
              M.toast({ html: data.error, classes: "#c62828 red darken-3" });
            } else {
              M.toast({ html: "Post Created Successfully", classes: "#43a047 green darken-1" });
              navigate("/");
            }
          }).catch(error=>{
            console.log(error)
          })
    }
    },[url])
    const PostDetails = () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "insta-clone");
        data.append("cloud_name", "bhuicc");
      
        // Fetch to upload photo to server
        fetch("https://api.cloudinary.com/v1_1/bhuicc/image/upload", {
          method: "post",
          body: data,
        })
          .then((res) => res.json())
          .then((data) => setUrl(data.url))
          .catch((error) => console.log(error));
        
    }

    return(
        <div className="card input-field" style={{
            margin: "30px auto",
            width: "50%",
            padding: "20px",
            textAlign: "center"
        }}>
            <input 
                type="text"
                placeholder="title"
                value={title}
                onChange={(event)=>setTitle(event.target.value)}  />
            <input 
                type="text" 
                placeholder="body" 
                value={body}
                onChange={(event)=>setBody(event.target.value)}  />
            <div className="file-field input-field">
                <div className="btn waves-effect waves-light 42a5f5 blue darken-1">
                    <span>Upload Image</span>
                    <input 
                        type="file" 
                        onChange={ (event)=>{setImage(event.target.files[0])}}/>

                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light 42a5f5 blue darken-1" onClick={()=> PostDetails()}>
                    Submit Post
            </button>

        </div>
    );
}

export default CreatePost;