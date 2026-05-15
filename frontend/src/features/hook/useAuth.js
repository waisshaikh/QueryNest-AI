import { useDispatch } from "react-redux";
import { register,login,getme } from "../services/auth.api";
import  {setUser,setError,setLoading,} from "../auth/auth.slice"


export function auth (){
    const Dispatch = useDispatch()
    
}