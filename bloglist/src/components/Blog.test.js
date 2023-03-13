import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container

  beforeEach(() => {
    container = render(
      <Blog />
    ).container
  })

  test('Initialy only title and author are shown', () => {
    const blog = container.querySelector('.blog')
    console.log(blog)
  })

})