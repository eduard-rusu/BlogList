import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container

  const blog = {
    title: 'title',
    author: 'me',
    likes: 0,
    user: {
      username: 'root'
    }
  }

  const browserUser = {
    username: ''
  }

  beforeEach(() => {
    container = render(
      <Blog blog={blog} user={browserUser}/>
    ).container
  })

  test('Initialy only title and author are shown', () => {
    const blogDetails = container.querySelector('.details')
    expect(blogDetails).toHaveStyle('display: none')
  })

  test('show button works', async () => {
    const user = userEvent.setup()
    const button = container.querySelector('#detailsButton')

    await user.click(button)

    const blogDetails = container.querySelector('.details')
    expect(blogDetails).not.toHaveStyle('display: none')
  })

  test('like button is clicked twice', async () => {
    const handleOnLike = jest.fn()

    container = render(
      <Blog blog={blog} user={browserUser} handleOnLike={handleOnLike}/>
    ).container

    const user = userEvent.setup()
    const button = container.querySelector('#likeButton')

    await user.click(button)
    await user.click(button)

    expect(handleOnLike.mock.calls).toHaveLength(2)
  })

})