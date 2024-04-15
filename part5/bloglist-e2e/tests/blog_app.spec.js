const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Valtteri Bottas',
        username: 'valtteri',
        password: 'bottas'
      }
    })

    await page.goto('/')
  })
  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('Blogs')
    await expect(locator).toBeVisible()
  })
  test('user can log in', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'wrong')
    await expect(page.getByText('Wrong credentials')).toBeVisible()
    const errorDiv = await page.locator('.error')
    await expect(errorDiv).toContainText('Wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
  })
  describe('when logged in', () => {
    const blog1 = {
      title: 'This is blog title',
      url: 'http://example.com/blog-number-one',
      author: 'John Doe'
    }
    const blog2 = {
      title: 'Second blog this is',
      url: 'http://example.com/blog-number-two',
      author: 'Christina Korhonen'
    }
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await createBlog(page, blog1)
    })

    test('a new blog can be created', async ({ page }) => {
      await expect(page.getByTestId('blogitem')).toContainText(
        'This is blog title'
      )
    })
    test('a new blog can be edited (add 2 likes)', async ({ page }) => {
      await page.getByRole('button', { name: 'show' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByTestId('blogitem-expanded')).toContainText([
        'likes 2'
      ])
    })
    test('the user who added the blog can delete the blog', async ({
      page
    }) => {
      await page.getByRole('button', { name: 'show' }).click()
      page.on('dialog', async dialog => await dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByTestId('blogitem-expanded')).not.toBeVisible()
      await expect(page.getByTestId('blogitem')).not.toBeVisible()
    })
    test('the user who did not add the blog cannot delete the blog', async ({
      page
    }) => {
      await page.getByRole('button', { name: 'logout' }).click()
      await page.goto('/')
      await loginWith(page, 'valtteri', 'bottas')
      await page.getByRole('button', { name: 'show' }).click()
      await expect(
        page.getByRole('button', { name: 'remove' })
      ).not.toBeVisible()
    })
    test('the blogs are sorted by likes', async ({ page }) => {
      await page.getByRole('button', { name: 'show' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await createBlog(page, blog2)
      await page.waitForTimeout(6000) //This is to wait for the notification to vanish
      const blog1Pos = await page.getByText('This is blog title').boundingBox()
      const blog2Pos = await page.getByText('Second blog this is').boundingBox()
      expect(blog1Pos.y).toBeLessThan(blog2Pos.y)
    })
  })
})
