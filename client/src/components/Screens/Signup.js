import React, {useState, useEffect} from "react";
import { Link, useNavigate} from "react-router-dom";
import M from "materialize-css"

const Signup = ()=> {

    const navigate = useNavigate()
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState(undefined);

    useEffect(()=>{
        if(url){
            uploadFields()
        }
    },[url])

    const uploadPic = () =>{
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

    const uploadFields = () =>{
        if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Invalid Email", classes:"#c62828 red darken-3"})
            return;
        }
        fetch("/signup", {
            method:"post",
            headers:{
                "content-type" : "application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        }).then(res=>res.json()).then(data =>{

            if(data.error){
                 M.toast({html: data.error, classes:"#c62828 red darken-3"})
            }else{
                M.toast({html: data.message, classes:"#43a047 green darken-1"})
                navigate("/signin")
            }

        })
    }
    const postData =() => {

        if(image){
            uploadPic()
        }else{
            uploadFields()
        }
        
    }


    return(
        <div className="mycard input-field">
            <div className = "card auth-card">
            <h2> Instagram </h2>

            <input
                    type = "text"
                    placeholder="name"
                    value={name}
                    onChange={event =>{ setName(event.target.value)}}
                    
                />
                <input
                    type = "text"
                    placeholder="email"
                    value={email}
                    onChange={event =>{ setEmail(event.target.value)}}
                />
                <input
                    type = "password"
                    placeholder="password"
                    value={password}
                    onChange={event =>{ setPassword(event.target.value)}}
                />
                <div className="file-field input-field">
                <div className="btn waves-effect waves-light 42a5f5 blue darken-1">
                    <span>Upload Pic</span>
                    <input 
                        type="file" 
                        onChange={ (event)=>{setImage(event.target.files[0])}}/>

                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
                <button className="btn waves-effect waves-light 42a5f5 blue lighten-1" onClick={()=>postData()}>
                    Sign Up
                </button>
                <h5> <Link to="/signin"> Already have an account?</Link> </h5>

            </div>
        </div>
    );
}

export default Signup;