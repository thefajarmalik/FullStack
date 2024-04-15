import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  const blog = {
    id: '"6618d8a0f64f7e44ed795128"',
    title: 'This is blog title',
    url: 'http://example.com/blog-number-one',
    author: 'John Doe',
    likes: 4,
    user: {
      id: '661829276209756e01c7bd27',
      name: 'Administrator',
      username: 'admin123'
    }
  }

  test('when the submit button is clicked, createBlog is called with right details', async () => {
    const submitHandler = vi.fn()
    render(<BlogForm createBlog={submitHandler} />)
    const user = userEvent.setup()

    const inputTitle = screen.getByPlaceholderText('write title here')
    const inputAuthor = screen.getByPlaceholderText('write author here')
    const inputUrl = screen.getByPlaceholderText('write url here')

    await user.type(inputTitle, 'This is blog title')
    await user.type(inputAuthor, 'John Doe')
    await user.type(inputUrl, 'http://example.com/blog-number-one')

    const showButton = screen.getByText('create')
    await user.click(showButton)
    expect(submitHandler.mock.calls).toHaveLength(1)
    expect(submitHandler.mock.calls[0][0].title).toBe('This is blog title')
    expect(submitHandler.mock.calls[0][0].author).toBe('John Doe')
    expect(submitHandler.mock.calls[0][0].url).toBe(
      'http://example.com/blog-number-one'
    )
  })
})
