const listHelper = require('../utils/list_helper')

test('dummy returns 1', () => {
  const blog = []
  const result = listHelper.dummy(blog)
  expect(result).toBe(1)
})
