import React, {useContext, useRef, useEffect, useState} from "react";
import { UserContext } from "../App";
import {Link, useNavigate } from "react-router-dom";
import M from "materialize-css"


const NavBar = ()=> {

    const searchModel = useRef(null);
    const [search, setSearch] = useState("")
    const [userDetails, sestUserDetails] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(()=>{
      M.Modal.init(searchModel.current)
    },[])

    const renderList=()=>{
      if(state){
        return[

            <li key="1" ><i className="large material-icons modal-trigger" data-target="modal1" style={{color:"black"}}>search</i></li>,
            <li key="2" ><Link to="/createpost"> Create Post </Link></li>,
            <li key="3"><Link to="/profile"> Profile </Link></li>,
            <li key="4"><Link to="/myfollowerspost"> My Feed </Link></li>,
            <li key="5"> <button className="btn #c62828 red darken-3" onClick={()=>{
              localStorage.clear()
              dispatch({type:"CLEAR"})
              navigate("/signin")
            }}>
              Logout
            </button></li>
        ]
      }else{
        return[
          <li key="6"><Link to="/signin">Signin</Link></li>,
          <li key="7"><Link to="/signup">Signup</Link></li>
        ]}
    }

    const fetchUsers = (query) =>{
      setSearch(query)
      fetch("/search-users", {
        method:"post",
        headers:{
          "Content-Type":"application/json",
          "authorization":`Bearer ${localStorage.getItem("jwt")}`
        },
        body:JSON.stringify({
          query
        })
      })
        .then(res=> res.json())
        .then(results=>{
          sestUserDetails(results.user)
      })
      
    }
    return (
        <nav>
        <div className="nav-wrapper white">
          <Link to={state?"/":"/signin"} className="brand-logo left">Instagram</Link>
          <ul id="nav-mobile" className="right">
            {renderList()}
          </ul>
        </div>
        <div id="modal1" className="modal" ref={searchModel}>
          <div className="modal-content" style={{color:"black"}}>
          <input
                    type = "text"
                    placeholder="search user"
                    value={search}
                    onChange={event => fetchUsers(event.target.value)}
                />
                 <ul className="collection">
                  {
                      userDetails.map(item => {
                      return <Link to= { item._id === state._id ? "/profile" : "/profile/"+item._id} 
                                onClick= {()=>{
                                  M.Modal.getInstance(searchModel.current).close()
                                  setSearch("")}}
                                
                              >
                        <li key={item._id} className="collection-item">{item.email}</li>
                      </Link>
                    })

                  }
                  </ul>
          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch("")}>close</button>
          </div>
        </div>
      </nav>
            
    )
}

export default NavBar;