const app = require('../app')
const request = require('supertest')

describe('GET crypto/:name', () => {
  test('should return crypto data', async () => {
    const response = await request(app).get('/api/crypto/bitcoin')
    const { body } = response
    const { lastest, history } = body
    const historyLength = history.length
    const historyLast = history[historyLength - 1]
    expect(response.statusCode).toBe(200)
    expect(historyLength).toBeGreaterThan(0)
    expect(lastest).toStrictEqual(historyLast)
  })
  test('should return 404 if crypto not found', async () => {
    const response = await request(app).get('/api/crypto/vitcoin')
    expect(response.statusCode).toBe(404)
  })
  test('should return 400 if crypto name is empty', async () => {
    const response = await request(app).get('/api/crypto/')
    expect(response.statusCode).toBe(400)
  })
  test('Should return data from date query', async () => {
    const response = await request(app).get('/api/crypto/bitcoin?date=12-18-21')
    const { body } = response
    expect(response.statusCode).toBe(200)
    expect(body.length).toBeGreaterThan(0)
  })
  test('Should return 404 if date is invalid or missing', async () => {
    const response = await request(app).get('/api/crypto/bitcoin?date=12-18-19')
    expect(response.statusCode).toBe(404)
  })
})

describe('GET top50/', () => {
  test('should return top50 data', async () => {
    const response = await request(app).get('/api/top50')
    const { body } = response
    const dataLength = body.length
    expect(response.statusCode).toBe(200)
    expect(dataLength).toBe(50)
  })
  test('should return top50 data from date', async () => {
    const response = await request(app).get('/api/top50?date=12-17-21')
    const { body } = response
    expect(response.statusCode).toBe(200)
    expect(body.length).toBe(50)
  })
  test('should return 404 if top50 not found', async () => {
    const response = await request(app).get('/api/top50?date=12-17-20')
    expect(response.statusCode).toBe(404)
  })
})

describe('GET coins/', () => {
  test('should return a list with the available coins', async () => {
    const response = await request(app).get('/api/coins')
    const { body } = response
    const dataLength = body.length
    expect(response.statusCode).toBe(200)
    expect(dataLength).toBe(50)
  })
})
