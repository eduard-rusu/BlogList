import { useState } from "react"

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const details = {display: showDetails ? '' : 'none'}

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  return (
    <div style={blogStyle}>
      { blog.title } 
      { blog.author }
      <button onClick={toggleDetails}>text</button>
      <div style={details}>
        <div>
          { blog.url }
        </div>
        <div>
          { blog.likes }
          <button>like</button>
        </div>
        <div>
          { blog.user.username}
        </div>
      </div>
    </div>
  )
}

export default Blog