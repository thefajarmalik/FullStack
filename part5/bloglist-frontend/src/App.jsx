import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(false)

  const [loginVisible, setLoginVisible] = useState(false)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('Wrong credentials')
      setError(true)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }
  const userInfo = () => (
    <div>
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
    </div>
  )

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const addBlog = blogObject => {
    blogFormRef.current.toggleVisibility()

    blogService.create(blogObject).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      setMessage(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      )
      setError(false)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    })
  }

  const addLike = (id, blogObject) => {
    blogObject.likes++
    blogService.update(id, blogObject).then(returnedBlog => {
      setBlogs(blogs.map(blog => (blog.id !== id ? blog : returnedBlog)))
      setError(false)
      setMessage(`You just liked ${returnedBlog.title}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    })
  }

  const handleDelete = async blogToDelete => {
    if (
      window.confirm(
        `Are you sure you want to delete blog ${blogToDelete.title} by ${blogToDelete.author}?`
      )
    ) {
      await blogService.deleteBlog(blogToDelete.id)
      setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id))
      setError(false)
      setMessage(`Blog ${blogToDelete.title} deleted`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} error={error} />

      {!user && loginForm()}
      {user && (
        <div>
          {userInfo()}
          <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {sortedBlogs.map(blog => (
            <Blog key={blog.id} blog={blog} addLike={addLike} deleteBlog={handleDelete}/>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
