import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = event => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type='text'
            value={newTitle}
            name='title'
            onChange={({ target }) => setNewTitle(target.value)}
            placeholder='write title here'
          />
        </div>
        <div>
          author:
          <input
            type='text'
            value={newAuthor}
            name='author'
            onChange={({ target }) => setNewAuthor(target.value)}
            placeholder='write author here'
          />
        </div>
        <div>
          url:
          <input
            type='text'
            value={newUrl}
            name='url'
            onChange={({ target }) => setNewUrl(target.value)}
            placeholder='write url here'
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}
export default BlogForm
