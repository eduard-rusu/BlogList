import { useState } from 'react'

const Blog = ({ blog, username, handleOnLike, handleRemoveBlog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const details = { display: showDetails ? '' : 'none' }
  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  return (
    <div style={blogStyle} className='blog'>
      { blog.title } { blog.author }
      <button onClick={toggleDetails} id='detailsButton'>
        { showDetails ? 'hide' : 'show' }
      </button>
      <div style={details} className='details'>
        <div>
          { blog.url }
        </div>
        <div>
          { blog.likes }
          <button onClick={handleOnLike} id='likeButton'>like</button>
        </div>
        <div>
          { blog.user.username }
        </div>
        <div>
          <button style={{ display: username === blog.user.username ? '' : 'none' }} onClick={handleRemoveBlog}>remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog