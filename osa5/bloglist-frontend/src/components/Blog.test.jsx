import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  test('renders only title and author by default', () => {
    const blog = {
        title: 'Testiblogi',
        author: 'Ismo Laitela',
        url: 'www.blog.stellans.fi',
        likes: 666,
        user: {
            name: 'Seppo Taalasmaa',
            username: 'suppo'
        }
    }

    const user = {
      name: 'Seppo Taalasmaa',
      username: 'suppo'
    }

    render(<Blog blog={blog} user={user} />)

    expect(screen.getAllByText('Testiblogi Ismo Laitela')).toBeDefined()

    expect(screen.queryByText('www.blog.stellans.fi')).not.toBeVisible()
    expect(screen.queryByText('likes 666')).not.toBeVisible()
    expect(screen.queryByText('Seppo Taalasmaa')).not.toBeVisible()
  })

  test('renders also url, likes and user\'s name when view-button is clicked', async () => {
    const blog = {
        title: 'Testiblogi',
        author: 'Ismo Laitela',
        url: 'www.blog.stellans.fi',
        likes: 666,
        user: {
            name: 'Seppo Taalasmaa',
            username: 'suppo'
        }
    }

    const blogUser = {
      name: 'Seppo Taalasmaa',
      username: 'suppo'
    }

    render(<Blog blog={blog} user={blogUser} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')

    await user.click(viewButton)

    expect(screen.getAllByText('Testiblogi Ismo Laitela')).toBeDefined()

    expect(screen.getByText('www.blog.stellans.fi')).toBeVisible()
    expect(screen.getByText('likes 666')).toBeVisible()
    expect(screen.getByText('Seppo Taalasmaa')).toBeVisible()
  })

  test('calls the mockhandler twice when the like button is clicked twice', async () => {
    const blog = {
        title: 'Testiblogi',
        author: 'Ismo Laitela',
        url: 'www.blog.stellans.fi',
        likes: 666,
        user: {
            name: 'Seppo Taalasmaa',
            username: 'suppo'
        }
    }

    const blogUser = {
      name: 'Seppo Taalasmaa',
      username: 'suppo'
    }

    const handleLike = vi.fn()

    render(<Blog blog={blog} user={blogUser} handleLike={handleLike}/>)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    const likeButton = screen.getByText('like')

    await user.click(viewButton)
    await user.click(likeButton)
    await user.click(likeButton)

    expect(handleLike.mock.calls).toHaveLength(2)
  })
})
