import React, { useContext } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/Auth'

export default function BaseLayout() {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const logout = async () => {
    const ok = await auth.logout()
    if(ok){
      auth.setIsAuth(false)
      auth.setUser(null)
      navigate("/login")
    } else {
      alert("ログアウトに失敗しました")
    }
  }

  return (
    <>
      <header>
        <Link to="/">
          <h1>react auth sample</h1>
        </Link>
        <button onClick={logout}>
          logout
        </button>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}
