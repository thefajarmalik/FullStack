import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
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

  test('renders title and author but not URL nor number of likes', async () => {
    render(<Blog blog={blog} addLike={vi.fn()} deleteBlog={vi.fn()} />)
    expect(
      screen.getByText('This is blog title', { exact: false })
    ).toBeDefined()
    expect(screen.getByText('John Doe', { exact: false })).toBeDefined()

    expect(
      screen.queryByText('http://example.com/blog-number-one', { exact: false })
    ).toBeNull()
    expect(screen.queryByText(4, { exact: false })).toBeNull()
  })

  test('when show button clicked, show url and likes', async () => {
    render(<Blog blog={blog} addLike={vi.fn()} deleteBlog={vi.fn()} />)
    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)
    expect(
      screen.queryByText('http://example.com/blog-number-one', { exact: false })
    ).toBeDefined()
    expect(screen.queryByText(blog.likes, { exact: false })).toBeDefined()
  })

  test('when the like button is clicked twice, handler is called twice', async () => {
    const likeHandler = vi.fn()
    render(<Blog blog={blog} addLike={likeHandler} deleteBlog={vi.fn()} />)
    const user = userEvent.setup()
    const showButton = screen.getByText('show')
    await user.click(showButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(likeHandler.mock.calls).toHaveLength(2)
  })
})
