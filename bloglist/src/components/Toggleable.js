import { useState } from "react"
import Login from "../services/login"

const Toggleable = ({ buttonLabel, children }) => {
  const [loginVisible, setLoginVisible] = useState(false)
  const hide = { display: loginVisible ? 'none' : ''}
  const show = { display: loginVisible ? '' : 'none'}

  const toggleVisibility = () => {
    setLoginVisible(!loginVisible)
  }

  return (
    <div>
      <div style={hide}>
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div style={show}>
        { children }
        <div>
          <button onClick={toggleVisibility}>cancel</button>
        </div>
      </div>
    </div>
  )
}

export default Toggleable