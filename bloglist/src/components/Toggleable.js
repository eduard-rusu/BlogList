import { forwardRef, useImperativeHandle, useState } from 'react'
import PropTypes from 'prop-types'

const Toggleable = forwardRef(({ buttonLabel, children }, refs) => {
  const [loginVisible, setLoginVisible] = useState(true)
  const hide = { display: loginVisible ? 'none' : '' }
  const show = { display: loginVisible ? '' : 'none' }

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


Toggleable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

Toggleable.displayName = 'Toggleable'

export default Toggleable