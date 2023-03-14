import { useEffect, useRef, useState } from 'react'
import blogsService from './services/blogs'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import Login from './components/Login'
import Notification from './components/Notification'
import Toggleable from './components/Toggleable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const blogFormRef = useRef()

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBloglistUser')
  }

  const test = () => {

  }

  const addNewBlog = async ({ title, author, url }) => {
    if (title === '' || author === '' || url === '') {
      setMessage('Incomplete form')
      return
    }
    try {
      const res = await blogsService.create({ title, author, url })
      setBlogs(blogs.concat(res))
      setMessage(`Added ${res.title} by ${res.author}`)
      blogFormRef.current.toggleVisibility()
    } catch (ex) {
      setMessage(ex)
      console.error(ex)
    }
  }

  const handleRemoveBlog = (blog) => {
    if (blog.user.username !== user.username) return () => {}

    return async () => {
      if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) return
      try {
        await blogsService.remove(blog.id)
      } catch (ex) {
        console.error(ex)
        return
      }
      setBlogs(blogs.filter(b => b.id !== blog.id))
    }
  }

  const handleOnLike = (blog) => {
    return () => {
      const newBlog = {}
      Object.assign(newBlog, blog)
      newBlog.likes += 1
      setBlogs(blogs.filter(b => b !== blog).concat(newBlog))
    }
  }

  useEffect(() => {
    blogsService.getAll()
      .then(data => setBlogs(data.sort((a, b) => b.likes - a.likes)))
      .catch(err => console.error(err))

    const user = JSON.parse(window.localStorage.getItem('loggedBloglistUser'))
    if (user) {
      setUser(user)
      blogsService.setToken(user.token)
    }

  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMessage('')
    }, 5000)
    return () => clearTimeout(timeout)
  }, [message])

  const loginForm = () => {
    return (
      <>
        <h2>Login</h2>
        <Toggleable buttonLabel={'log in'}>
          <Login setUser={setUser}/>
        </Toggleable>
      </>
    )
  }

  const blogForm = () => {
    const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes).map(b => {
      return (
        <Blog key={b.id} blog={b} username={user.username} handleOnLike={handleOnLike(b)} handleRemoveBlog={handleRemoveBlog(b)}/>
      )
    })
    return (
      <>
        <h2>Blogs</h2>
        <div>
          {`User ${user.username} is logged in`}
          <button onClick={handleLogout}>logout</button>
        </div>
        <Toggleable buttonLabel={'create new blog'} ref={blogFormRef}>
          <h2>create new</h2>
          <BlogForm addNewBlog={test}/>
        </Toggleable>
        { sortedBlogs }
      </>
    )
  }

  const notificationForm = () => {
    return (
      <>
        <Notification msg={message}/>
      </>
    )
  }

  return (
    <>
      {message !== '' && notificationForm()}
      {user === null && loginForm()}
      {user !== null && blogForm()}
    </>
  )
}

export default App
