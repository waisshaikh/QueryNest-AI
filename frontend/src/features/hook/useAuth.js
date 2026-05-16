import { useDispatch } from "react-redux";
import { register,login,getme } from "../services/auth.api";
import  {setUser,setError,setLoading,} from "../auth/auth.slice"


export function auth (){
    const Dispatch = useDispatch()
    
    async function handleRegister({email, username, password}) {
        try{
            Dispatch(setLoading(true))
            const data = await register ({email, username, password})

        }catch(error) {
            Dispatch(setError(error.response?.data?.message|| "registration failed"))
        }finally{
            Dispatch(setLoading(false))
        }
        
        
    }


    async function handleLogin({email, password}) {

        try{
            Dispatch(setLoading(true))
            const data = await login({email,password})
            Dispatch(setUser(data.user))
        }catch(error){
            Dispatch(setError(error.response?.data?.message||"login failed"))
        }finally{
            Dispatch(setLoading(false))
        }  
    }

    async function handleGetMe () {
        try{
            Dispatch(setLoading(true))
            const data = await getme()
            Dispatch(setUser)(data.user)
        }catch(err){
            Dispatch(setError(err.response?.data?.message||"failed to fetch user data "))

        }finally{
            Dispatch(setLoading(false))

        }
        
    } 
    

    return{
        handleRegister,
        handleLogin,
        handleGetMe
    }
    
}