import { useState } from 'react'
import blogsService from '../services/blogs'

const BlogForm = ({ addNewBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleOnSubmit = (e) => {
    e.preventDefault()

    addNewBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleOnSubmit}>
      <div>
        title:
        <input
          id="title-input"
          type="text"
          value={title}
          onChange={({ target }) => setTitle(target.value)}>
        </input>
      </div>
      <div>
        author:
        <input
          id="author-input"
          type="text"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}>
        </input>
      </div>
      <div>
        url:
        <input
          id="url-input"
          type="text"
          value={url}
          onChange={({ target }) => setUrl(target.value)}>
        </input>
      </div>
      <button type="submit" id="create-blog">create</button>
    </form>
  )
}

export default BlogForm