import { useContext, useEffect } from "react"
import { AuthContext } from "../context/Auth"
import { Outlet, useNavigate } from "react-router-dom"

export default function ProtectedPage() {
  const auth = useContext(AuthContext)
  const navigate = useNavigate();

  useEffect(() => {
    const test = async () => {
      if(!auth.isAuth){
        const user = await auth.findMe();
        auth.setUser(user)
        auth.setIsAuth(user != null)
        if(user == null){
          navigate("/login")
        }
      }
    }

    test();
  },[])

  return (
    <Outlet />
  )
}
