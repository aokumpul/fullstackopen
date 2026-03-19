const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Aku Ankka',
        username: 'aankka',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()

    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()

    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'aankka', 'salainen')
      await expect(page.getByText('Aku Ankka logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'aankka', 'wrong')
 
      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('invalid username or password')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'aankka', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'a blog created by playwright', 'playwright', 'www.playwright.dev')

      const successDiv = page.locator('.success')
      await expect(successDiv).toContainText('a new blog a blog created by playwright by playwright')

      const collapsedDiv = page.locator('.blogCollapsed')
      await expect(collapsedDiv).toContainText('a blog created by playwright')

      const expandedDiv = page.locator('.blogExpanded')
      await expect(expandedDiv).toContainText('a blog created by playwright')
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'another blog created by playwright', 'playwright', 'www.playwright.dev')  
      })
  
      test('blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('hide')).toBeVisible()
        await expect(page.getByText('likes 0')).toBeVisible()

        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })
    })
  })
})