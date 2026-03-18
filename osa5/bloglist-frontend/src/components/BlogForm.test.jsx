import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('updates parent states and calls onSubmit', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()

    render(<BlogForm createBlog={createBlog}/>)

    const title = screen.getByLabelText('title:')
    const author = screen.getByLabelText('author:')
    const url = screen.getByLabelText('url:')
    const createButton = screen.getByText('create')

    await user.type(title, 'Timon ploki')
    await user.type(author, 'Timo S.')
    await user.type(url, 'www.timonploki.ps')
    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Timon ploki')
    expect(createBlog.mock.calls[0][0].author).toBe('Timo S.')
    expect(createBlog.mock.calls[0][0].url).toBe('www.timonploki.ps')
  })
})