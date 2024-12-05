import express, { response } from 'express'
import bodyParser from 'body-parser'
import dotenv from "dotenv"
import { ServiceRegistry } from './lib/classes/ServiceRegistry_In_Memory.js'
import util from "util"
import { mapToJson, normalizeIPAddress } from './lib/helpers.js'
// import logger from './config/Log.js'
dotenv.config()

const app = express()
const PORT = process.env.SERVICE_REGISTRY_PORT || 4471
const serviceRegistry = new ServiceRegistry()

app.use(bodyParser.json())

/**
 * Register a new service instance
 * POST /register
 * Body: { serviceName, port, description, version, instanceId, url, reqEx, resEx }
 */
app.post('/register', (req, res) => {
  const { serviceName, port, description, version, instanceId, url, reqEx, resEx } = req.body

  if (!serviceName || !port || !description || !version || !instanceId || !url) {
    return res.status(400).json({ message: 'Missing required fields', format: '{ serviceName, port, description, version, instanceId, url, reqEx(optional), resEx(optional) }' })
  }

  if (instanceId == 0){
    return res.status(400).json({ message: 'instance id should be > 0' })
  }

  const ip = normalizeIPAddress(req.ip)
  const response = serviceRegistry.register(serviceName, ip, port, description, version, instanceId, url)
  console.log(response)

  // res.status(200).json(mapToJson(response))
  res.status(response.errorCode).json(response.message)
})

/**
 * Deregister a service instance
 * POST /deregister
 * Body: { serviceName, instanceId }
 */
app.post('/deregister', (req, res) => {
  const { serviceName, instanceId } = req.body

  if (!serviceName) {
    return res.status(400).json({ message: 'Missing required fields', format: '{ serviceName, instanceId(optional) }' })
  }

  const response = serviceRegistry.derigister(serviceName, instanceId)
  console.log(response.message)

  res.status(response.errorCode).json({ message: response.message })
})

/**
 * Get all registered services
 * GET /services
 */
app.get('/services', (req, res) => {
  const services = serviceRegistry.getAll()
  res.status(services.errorCode).json(services.services)
})

/**
 * Discover available instances for a service
 * GET /discover/:serviceName
 */
app.get('/discover/:serviceName', (req, res) => {
  const { serviceName } = req.params
  // console.log(req.params)

  if (!serviceName) {
    return res.status(400).json({ message: 'Missing required fields', format: '{ serviceName }' })
  }

  const response = serviceRegistry.discover(serviceName)
  // res.status(response.errorCode).json({ service: response.message })

  console.log(util.inspect(response, 1, 5))
  const instances = Array.from(response).map(([instanceId, { ip, port, desc, ver, url, timestamp }]) => ({
    instanceId,
    ip,
    port,
    desc,
    ver,
    url,
    timestamp,
  }))

  instances.forEach(instance => {
    delete instance.timestamp
  })

  res.status(200).json(instances)
})

/**
 * Health check for the registry
 * GET /health
 */
// app.get('/health', (req, res) => {
//   res.status(200).json({ message: 'Service registry is healthy' })
// })

/**
 * Recieve heartbeats from services to reregister
 * POST /reregister
 * Body: { serviceName, instanceId }
 */
app.post('/reregister', (req, res) => {
  const { serviceName, instanceId } = req.body

  if (!serviceName || !instanceId) {
    return res.status(400).json({ message: 'Missing required fields', format: '{ serviceName, instanceId }' })
  }

  const response = serviceRegistry.reRegister(serviceName, instanceId)
  // console.log(response)

  // res.status(200).json(response)
  res.status(response.errorCode).json(response.message)
})

app.listen(PORT, () => {
  console.log(`Service registry running on port ${PORT}`)
})

setInterval(() => {
  serviceRegistry.removeStaleServices()
}, process.env.CHECK_INTERVAL)