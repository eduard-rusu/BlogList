import { useState } from 'react'
import blogsService from '../services/blogs'

const AddBlog = ({ addNewBlog, notification }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleOnSubmit = async (e) => {
    e.preventDefault()

    if (title === '' || author === '' || url === '') {
      notification('Incomplete form')
      return
    }

    try {
      const res = await blogsService.create({
        title, author, url
      })
      addNewBlog(res)
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (ex) {
      notification(ex)
      console.error(ex)
    }
  }

  return (
    <form onSubmit={handleOnSubmit}>
      <div>
        title:
        <input type="text" value={title} onChange={({ target }) => setTitle(target.value)}>
        </input>
      </div>
      <div>
        author:
        <input type="text" value={author} onChange={({ target }) => setAuthor(target.value)}>
        </input>
      </div>
      <div>
        url:
        <input type="text" value={url} onChange={({ target }) => setUrl(target.value)}>
        </input>
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default AddBlog