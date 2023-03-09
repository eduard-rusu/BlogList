import { useEffect, useState } from 'react'
import blogsService from './services/blogs'
import AddBlog from './components/AddBlog'
import Blog from './components/Blog'
import Login from './components/Login'
import Notification from './components/Notification'
import Toggleable from './components/Toggleable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBloglistUser')
  }
  
  const addNewBlog = (newBlog) => {
    setBlogs(blogs.concat(newBlog))
    setMessage(`Added ${newBlog.title} by ${newBlog.author}`)
  }

  const removeBlog = (blog) => {
    setBlogs(blogs.filter(b => b.id !== blog.id))
  }

  useEffect(() => {
    blogsService.getAll()
      .then(data => setBlogs(data))
      .catch(err => console.error('err'))

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
    return (
      <>
        <h2>Blogs</h2>
        <div>
          {`User ${user.username} is logged in`}
          <button onClick={handleLogout}>logout</button>
        </div>
        <Toggleable buttonLabel={'create new blog'}>
          <h2>create new</h2>
          <AddBlog addNewBlog={addNewBlog} notification={setMessage}/>
        </Toggleable>
        { blogs
          .sort((a, b) => b.likes - a.likes)
          .map(b => <Blog key={b.id} blog={b} user={user} removeBlog={removeBlog}/>) }
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
  );
}

export default App
