describe('Blog app', function () {
  beforeEach(function () {
    localStorage.removeItem('loggedBloglistUser')
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      username: 'test',
      password: 'test'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.get('.loginForm')
      .parent()
      .should('not.have.css', 'display', 'none')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username-input').type('test')

      cy.get('#password-input').type('test')

      cy.get('#login-submit').click()

      cy.contains('Blogs')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username-input').type('test')

      cy.get('#password-input').type('wrong password')

      cy.get('#login-submit').click()

      cy.contains('Invalid Credentials')
    })

    describe('When logged in', function () {
      beforeEach(function () {
        cy.login({ username: 'test', password: 'test' })
      })

      it('A blog can be created', function () {
        cy.get('#title-input').type('title')
        cy.get('#author-input').type('author')
        cy.get('#url-input').type('www.example.com')
        cy.get('#create-blog').click()
        cy.get('.blog').should('not.be.empty')
      })

      it('User can like the blog', function () {})

      it('User can delete blog', function () {})

      it('Only user who created the blog can see the delete button', function () {})
    })
  })
})