import { useEffect } from "react"
import { useSelector } from "react-redux"


function AdminLoginProtected({children}) {
    const {adminToken} = useSelector(state=>state.admin)
    useEffect(()=>{
        if(adminToken){}

    },[])

}

export default AdminLoginProtected