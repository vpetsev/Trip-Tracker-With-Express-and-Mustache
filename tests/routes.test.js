const assert = require('node:assert/strict')
const test = require('node:test')
const app = require('../app')

test('trip creation uses session ownership and duplicate signup responds', async () => {
  const server = app.listen(0, '127.0.0.1')
  await new Promise(resolve => server.once('listening', resolve))
  const base = `http://127.0.0.1:${server.address().port}`
  const request = (path, body, cookie) => fetch(base + path, {
    method: body ? 'POST' : 'GET', redirect: 'manual',
    headers: { ...(body ? {'content-type':'application/x-www-form-urlencoded'} : {}), ...(cookie ? {cookie} : {}) },
    body: body ? new URLSearchParams(body) : undefined
  })
  try {
    const denied = await request('/index', {title:'Anonymous'})
    assert.equal(denied.status, 302)
    assert.equal(denied.headers.get('location'), '/login')
    assert.equal(global.allTrips.length, 0)
    const duplicate = await request('/register', {username:'john',password:'anything'})
    assert.equal(duplicate.status, 409)
    assert.match(await duplicate.text(), /already registered/)
    const login = await request('/login', {username:'john',password:'password'})
    const cookie = login.headers.get('set-cookie').split(';')[0]
    for (const route of ['/index', '/trips']) {
      const result = await request(route, {title:`Owned ${route}`,username:'asdf'}, cookie)
      assert.equal(result.status, 302)
      assert.equal(result.headers.get('location'), '/trips')
    }
    assert(global.allTrips.every(trip => trip.username === 'john'))
    assert.match(await (await request('/trips', null, cookie)).text(), /Owned/)
    const otherLogin = await request('/login', {username:'asdf',password:'asdf'})
    const otherCookie = otherLogin.headers.get('set-cookie').split(';')[0]
    assert.doesNotMatch(await (await request('/trips', null, otherCookie)).text(), /Owned/)
  } finally {
    await new Promise(resolve => server.close(resolve))
  }
})
