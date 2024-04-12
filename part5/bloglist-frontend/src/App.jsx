import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

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

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  )

  const addBlog = event => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    blogService.create(blogObject).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      setMessage(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      )
      setError(false)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    })
  }

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          type='text'
          value={newTitle}
          name='title'
          onChange={({ target }) => setNewTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          type='text'
          value={newAuthor}
          name='author'
          onChange={({ target }) => setNewAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          type='text'
          value={newUrl}
          name='url'
          onChange={({ target }) => setNewUrl(target.value)}
        />
      </div>
      <button type='submit'>create</button>
    </form>
  )

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} error={error} />

      {user === null ? (
        loginForm()
      ) : (
        <div>
          {userInfo()}
          {blogForm()}
          {blogs.map(blog => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
