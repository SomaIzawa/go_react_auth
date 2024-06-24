import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/Auth'
import { useNavigate } from 'react-router-dom'

type FormDatas = {
  email :string,
  password :string,
}

export default function Login() {
  const auth = useContext(AuthContext)
  const navigete = useNavigate()
  const [input, setInput] = useState<FormDatas>({
    email: "",
    password: "",
  })

  const onChangeHandler = (e :React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInput((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const onSubmit = async () => {
    const resUser = await auth.login(input.email, input.password)
    if(resUser != null){
      auth.setUser(resUser)
      auth.setIsAuth(resUser != null)
      navigete("/pageA")
    } else {
      alert("メールアドレスまたはパスワードが間違っています")
    }
  }

  return (
    <>
      <div>Login</div>
      <table>
        <tbody>
          <tr>
            <th>email</th>
            <td>
              <input name='email' type="email" value={input.email} onChange={onChangeHandler} />
            </td>
          </tr>
          <tr>
            <th>password</th>
            <td>
              <input name='password' type="password" value={input.password} onChange={onChangeHandler} />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <button type='button' onClick={onSubmit}>submit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}
