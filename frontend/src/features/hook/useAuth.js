import { useDispatch } from "react-redux";
import { register,login,getme } from "../services/auth.api";
import  {setUser,setError,setLoading,} from "../auth/auth.slice"


export function useAuth(){
    const dispatch = useDispatch()
    
    async function handleRegister({email, username, password}) {
        try{
            dispatch(setLoading(true))
            const data = await register ({email, username, password})
            dispatch(setUser(data.user))

        }catch(error) {
            dispatch(setError(error.response?.data?.message|| "registration failed"))
        }finally{
            dispatch(setLoading(false))
        }
        
        
    }


    async function handleLogin({email, password}) {

        try{
            dispatch(setLoading(true))
            const data = await login({email,password})
            dispatch(setUser(data.user))
        }catch(error){
            dispatch(setError(error.response?.data?.message||"login failed"))
        }finally{
            dispatch(setLoading(false))
        }  
    }

    async function handleGetMe () {
        try{
            dispatch(setLoading(true))
            const data = await getme()
            dispatch(setUser(data.user))
        }catch(err){
            dispatch(setError(err.response?.data?.message||"failed to fetch user data "))

        }finally{
            dispatch(setLoading(false))

        }
        
    } 


    return{
        handleRegister,
        handleLogin,
        handleGetMe
    }
    
}
