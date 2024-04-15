import { useState } from 'react'

const Blog = ({ blog, addLike, deleteBlog }) => {
  const [detailIsVisible, toggleDetailIsVisible] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const getLoggedUserName = () => {
    const user = window.localStorage.getItem('loggedBlogappUser')
    return user ? JSON.parse(user).username : null
  }

  if (!detailIsVisible) {
    return (
      <div style={blogStyle}>
        <p>
          {blog.title} {blog.author}{' '}
          <button onClick={() => toggleDetailIsVisible(true)}>show</button>
        </p>
      </div>
    )
  } else {
    console.log(blog)
    return (
      <div style={blogStyle}>
        <p className='title-author'>
          {blog.title} {blog.author}{' '}
          <button onClick={() => toggleDetailIsVisible(false)}>hide</button>
        </p>
        <p className='url'>{blog.url}</p>
        <p className='likes'>
          likes {blog.likes}{' '}
          <button onClick={() => addLike(blog.id, blog)}>like</button>
        </p>
        <p>{blog.user.name}</p>
        {getLoggedUserName() === blog.user.username && (
          <button onClick={() => deleteBlog(blog)}>remove</button>
        )}
      </div>
    )
  }
}

export default Blog
