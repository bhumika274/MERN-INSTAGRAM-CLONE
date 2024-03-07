import React, {useEffect, useState, useContext} from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";

const Profile = ()=>{

    const [userProfile, setUserProfile] = useState(null);
    const  {state, dispatch} = useContext(UserContext);
    const {userid} = useParams();
    const [showfollow, setShowFollow] = useState(state?!state.following.includes(userid):true);
    useEffect( ()=>{

        fetch(`/user/${userid}`, {
            method: "get",
            headers:{
                "authorization" : `Bearer ${localStorage.getItem("jwt")}`
            }
        })
        .then(res => res.json())
        .then(result =>{
            console.log(result)    
            setUserProfile(result)    
        })
    },[])

    const unfollowUser = () =>{
        fetch("/unfollow", {
            method: "put",
            headers:{
                "Content-Type" : "application/json",
                "authorization" : `Bearer ${localStorage.getItem("jwt")}`
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res => res.json())
            .then(data =>{

                dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
                localStorage.setItem("user",JSON.stringify(data));
                setUserProfile(prevState =>{
                    const newFollower = prevState.user.followers.filter(item => item !== data._id)
                    return{
                        ...prevState,
                        user:{
                            ...prevState.user,
                            followers:newFollower
                        }
                    }
                })
                setShowFollow(true);
        })

        
    }

    const followUser = () =>{
        
        fetch("/follow", {
            method: "put",
            headers:{
                "Content-Type" : "application/json",
                "authorization" : `Bearer ${localStorage.getItem("jwt")}`
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res => res.json())
            .then(data =>{

                dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
                localStorage.setItem("user",JSON.stringify(data));
                setUserProfile(prevState =>{
                    
                    return{
                        ...prevState,
                        user:{
                            ...prevState.user,
                            followers:[...prevState.user.followers,data._id]
                        }
                    }
                    
                })
                setShowFollow(false);
        })
        
        
    }
    return(
        <>
        {userProfile 
        ?
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
        <div  style={{
            display:"flex",
            justifyContent:"space-around",
            margin:"18px 0px",
            borderBottom:"1px solid black"
            }}>

            <div>
                <img style={{width:"160px", height:"160px", borderRadius:"50%"} }
                src={userProfile?userProfile.user.pic:"loading.."}/>
                
            </div>
            

            <div>
                <h4>{userProfile.user.name}</h4>
                <h5>{userProfile.user.email}</h5>
                <div style={{

                    display:"flex",
                    justifyContent:"space-between",
                    width:"108%"

                }}>
                    <h6>{userProfile.posts.length} Posts</h6>
                    <h6>{userProfile.user.followers.length} Followers</h6>
                    <h6>{userProfile.user.following.length} Following</h6>
                </div>
                <div>
                { showfollow ? 
                    <button className="btn waves-effect waves-light 42a5f5 blue lighten-1" onClick={()=>followUser()} style={{margin: "10px"}}>
                    Follow
                    </button>
                :
                    <button className="btn waves-effect waves-light 42a5f5 blue lighten-1" onClick={()=>unfollowUser()} style={{margin: "10px"}}>
                        Unfollow
                    </button>
                }
                
                
                </div>
            </div>
        </div>

        <div className="gallery">

            {
                userProfile.posts.map(item=>{

                    return(
                        <div key = {item._id} className="item" ><img 
                            src={item.photo} alt={item.title} style={{height: "200px", width: "200px"}} />
                        </div>
                    )

                })
            }
            
            
                
        </div>
        </div> : 
        <h2>loading...</h2> }
        
        </>
    );
}

export default Profile;