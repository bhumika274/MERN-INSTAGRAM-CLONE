import React, {useState, useEffect, useContext} from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";

const  SubsUserPost = () => {

    const [data, setData] = useState([]); //contains things to display on page, we called it from database
    const {state} = useContext(UserContext);
    
    useEffect(()=>{

        fetch("/getsubpost", {
            headers:{
                "authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        })
        .then(res=>res.json())
        .then(result=>{
            setData(result.posts)
        }).catch(error =>{
            console.log(error)
        })
    },[])

    const likePost = (id)=>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{

            const newData = data.map(item =>{
                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
        })
        setData(newData);
        }).catch(error=>{
            console.log(error)
        })
    }

    const unlikePost = (id)=>{

        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "authorization":`Bearer ${localStorage.getItem("jwt")}`
            },
            body:JSON.stringify({ //doing this to request body
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item =>{

                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData);
        }).catch(error=>{
            console.log(error)
        })
    }

    const makeComment = (text, postId) =>{
        fetch("/comment", {
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body:JSON.stringify({
                postId, 
                text 
            })
        }).then(res => res.json())
        .then(result => {
            const newData = data.map(item =>{
                if(item._id === result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData);
        }).catch(error=>{
            console.log(error)
        })
    }

    const deletePost = async (postid) => {
        try {
          const response = await fetch(`/deletepost/${postid}`, {
            method: "delete",
            headers: {
              "authorization": `Bearer ${localStorage.getItem("jwt")}`,
            },
          });
      
          if (response.status === 204) {
            const newData = data.filter((item) => item._id !== postid);
            setData(newData);
          } else {
            const errorData = await response.json(); // Parse JSON for error messages
            console.error("Error:", errorData);
          }
        } catch (error) {
          console.error("Network error:", error);
        }
    };

    return(
        <div className="home">
        {
            data ? 
            data.map(item =>{   
                console.log("item", item);             
                return(
                    <div className="card  home-card" key = {item._id}>
                    <h5 style={{padding:"5px"}}> <Link to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile" }> <img className = "display-icon" src = {item.postedBy.pic}/> {item.postedBy.name}</Link>{item.postedBy._id === state._id &&
                    <i  className="material-icons" 
                        style={{float : "right"}}
                        onClick={()=>deletePost(item._id)}>
                    delete</i>
                    }               
                    </h5>
                    <div className="card-image" >
                        <img style={{height: "70vh"}} src= {item.photo} alt={item.postedBy.name}/>    
                    </div>
                    <div className="card-content">
                        <i className="material-icons" style={{color:"red"}}>favorite</i> 
                        {
                            item.likes.includes(state._id)
                            ?
                                <i className="material-icons" 
                                    onClick={()=>{unlikePost(item._id)}}
                                >thumb_down</i>
                            :
                             
                                <i className="material-icons" 
                                    onClick={()=>{likePost(item._id)}}
                                >thumb_up</i>

                        }
                       
                        <h6>{item.likes.length} likes</h6>
                        <h6 style={{fontWeight:"bold"}}>{item.title}</h6>
                        <p>{item.body}</p>
                        {
                            item.comments.map(record =>{
                                console.log("comment", item);
                                return(          
                                    <h6 key={record._id}><Link to={ "/profile/"+record.postedBy._id } style={{fontWeight: "bold"}}> {record.postedBy.name}</Link > {record.text} </h6>

                                )})
                        }
                        <form onSubmit={(event =>{ 
                                event.preventDefault()
                                makeComment(event.target[0].value, item._id)
                                event.target[0].value = ""
                            })}>
                            <input type="text" placeholder="add a comment" />
                        </form>
                    </div>
                </div>
                    
                )
            })
            :
            <h2>Loading...</h2>
        
        }
     
        </div>
    );
}

export default SubsUserPost;