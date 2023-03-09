import { forwardRef, useImperativeHandle, useState } from "react"

const Toggleable = forwardRef(({ buttonLabel, children }, refs) => {
  const [loginVisible, setLoginVisible] = useState(false)
  const hide = { display: loginVisible ? 'none' : ''}
  const show = { display: loginVisible ? '' : 'none'}

  const toggleVisibility = () => {
    setLoginVisible(!loginVisible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })

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
})

export default Toggleable