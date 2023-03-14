import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'


describe('<BlogForm />', () => {
  let container

  beforeEach(() => {
    container = render(
      <BlogForm />
    ).container
  })

  test('calls onSubmit', async () => {
    const addNewBlog = jest.fn()
    container = render(
      <BlogForm addNewBlog={addNewBlog}/>
    ).container

    const user = userEvent.setup()

    const title = container.querySelector('#titleInput')
    const author = container.querySelector('#authorInput')
    const url = container.querySelector('#urlInput')
    const button = container.querySelector('#createBlog')

    await user.type(title, 'title')
    await user.type(author, 'author')
    await user.type(url, 'url')
    await user.click(button)

    expect(addNewBlog.mock.calls).toHaveLength(1)
    expect(addNewBlog.mock.calls[0][0].title).toBe('title')
    expect(addNewBlog.mock.calls[0][0].author).toBe('author')
    expect(addNewBlog.mock.calls[0][0].url).toBe('url')
  })
})

