import { useState } from 'react'
import loginService from '../services/login'
import blogServices from '../services/blogs'

const Login = ({
  handleOnSubmit,
  setUsername,
  setPassword,
  username,
  password,
}) => {

  return (
    <form className="loginForm" onSubmit={ handleOnSubmit }>
      <div>
        username:
        <input
          id="username-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        >
        </input>
      </div>
      <div>
        password:
        <input
          id="password-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        >
        </input>
      </div>
      <button id="login-submit" type="submit">Login</button>
    </form>
  )
}

export default Login