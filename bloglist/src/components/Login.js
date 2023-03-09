import { useState } from 'react'
import loginService from '../services/login'
import blogServices from '../services/blogs'

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleOnSubmit = async (e) => {
    e.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      blogServices.setToken(user.token)
      setUser(user)
    } catch (ex) {
      console.error(ex)
    }
  }

  return (
    <form onSubmit={ handleOnSubmit }>
      <div>
        username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        >
        </input>
      </div>
      <div>
        password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        >
        </input>
      </div>
      <button type="submit">Login</button>
    </form>
  )
}

export default Login