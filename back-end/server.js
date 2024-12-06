import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import cors from 'cors'
import util from "util"
// import logger from './config/Log.js'
import { ServiceRegistry } from './lib/classes/ServiceRegistry.js'
import { DbClient } from './lib/database/Database.js'
import { normalizeIPAddress } from './lib/helpers.js'

dotenv.config()

const app = express()
const PORT = process.env.SERVICE_REGISTRY_PORT || 4471
const JWT_SECRET = process.env.JWT_SECRET || 'CS4471'
const serviceRegistry = new ServiceRegistry()
const dbClient = new DbClient()

app.use(cors())

app.use(bodyParser.json())

//Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  // console.log("authHeader: ", authHeader)
  const token = authHeader && authHeader.split(' ')[1]
  // console.log("token: ", token)
  
  if (token == null) return res.sendStatus(401)
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.get('/', (req, res) => {
  res.send("<h1>It's Working</h1>")
})

/**
 * Login a user
 * POST /login
 * Body: { username, password }
 */
app.post('/login', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing required fields', format: '{ username, password }' })
  }

  const user = await dbClient.findUser(username)

  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' })
  }

  const validPassword = await bcrypt.compare(password, user.password)
  // console.log("YO! ", validPassword)

  if (!validPassword) {
    return res.status(400).json({ message: 'Invalid username or password' })
  }

  const accessToken = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' })
  res.status(200).json({ accessToken })
})

/**
 * Register a new service instance
 * POST /register
 * Body: { serviceName, port, description, version, instanceId, url, reqEx, resEx }
 */
app.post('/register', authenticateToken, async (req, res) => {
  const { serviceName, port, description, version, instanceId, url, reqEx, resEx } = req.body
  // reqEx = (!reqEx) ? "" : reqEx
  // resEx = (!resEx) ? "" : resEx

  if (!serviceName || !port || !description || !version || !instanceId || !url) {
    return res.status(400).json({ message: 'Missing required fields', format: '{ serviceName, port, description, version, instanceId, url, reqEx(optional), resEx(optional) }' })
  }

  if (instanceId == 0) {
    return res.status(400).json({ message: 'instance id should be > 0' })
  }

  const ip = normalizeIPAddress(req.ip)
  const response = await serviceRegistry.register(serviceName, ip, port, description, version, instanceId, url, reqEx, resEx )
  console.log(response)

  res.status(response.errorCode).json(response.message)
})

/**
 * Deregister a service instance
 * POST /deregister
 * Body: { serviceName, instanceId }
 */
app.post('/deregister', authenticateToken, async (req, res) => {
  const { serviceName, instanceId } = req.body

  if (!serviceName) {
    return res.status(400).json({ message: 'Missing required fields', format: '{ serviceName, instanceId(optional) }' })
  }

  const response = await serviceRegistry.deregister(serviceName, instanceId)
  console.log(response.message)

  res.status(response.errorCode).json({ message: response.message })
})

/**
 * Get all registered services
 * GET /services
 */
app.get('/services', authenticateToken, async (req, res) => {
  const services = await serviceRegistry.getAll()
  res.status(services.errorCode).json(services.services)
})

/**
 * Discover available instances for a service
 * GET /discover/:serviceName
 */
app.get('/discover/:serviceName', authenticateToken, async (req, res) => {
  const { serviceName } = req.params

  if (!serviceName) {
    return res.status(400).json({ message: 'Missing required fields', format: '{ serviceName }' })
  }

  const response = await serviceRegistry.discover(serviceName)
  
  if (response.errorCode) {
    return res.status(response.errorCode).json({ message: response.message })
  }

  // const instances = response.map(({ instanceId, ip, port, desc, ver, url, reqEx, resEx }) => ({
  //   instanceId,
  //   ip,
  //   port,
  //   desc,
  //   ver,
  //   url,
  //   reqEx,
  //   resEx 
  // }))

  const instances = response.map(({ instanceId, url }) => ({
    instanceId,
    url
  }))

  res.status(200).json(instances)
})

/**
 * Health check for the registry
 * GET /health
 */
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Service registry is healthy' })
})

/**
 * Receive heartbeats from services to re-register
 * POST /reregister
 * Body: { serviceName, instanceId }
 */
app.post('/reregister', authenticateToken, async (req, res) => {
  const { serviceName, instanceId } = req.body

  if (!serviceName || !instanceId) {
    return res.status(400).json({ message: 'Missing required fields', format: '{ serviceName, instanceId }' })
  }

  const response = await serviceRegistry.reRegister(serviceName, instanceId)
  res.status(response.errorCode).json(response.message)
})

// Start server
app.listen(PORT, () => {
  console.log(`Service registry running on port ${PORT}`)
})

// Check for stale services at the configured interval
const CHECK_INTERVAL = process.env.CHECK_INTERVAL || 5000
setInterval(async () => {
  await serviceRegistry.removeStaleServices()
}, CHECK_INTERVAL)
