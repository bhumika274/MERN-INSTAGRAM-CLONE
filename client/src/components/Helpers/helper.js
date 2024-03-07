export const GetMethod = () =>{
    return(
        <>
        {
           { method: "get",
            headers:{
                "authorization" : `Bearer ${localStorage.getItem("jwt")}`
            }}
        }
        </>
        
    )
}