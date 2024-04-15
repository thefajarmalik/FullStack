const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'log in' }).click()
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, blog) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByPlaceholder('write title here').fill(blog.title)
  await page.getByPlaceholder('write author here').fill(blog.author)
  await page.getByPlaceholder('write url here').fill(blog.url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByTestId('blogitem').waitFor()
}

export { loginWith, createBlog }
