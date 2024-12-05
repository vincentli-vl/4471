import { DbClient } from "../database/Database.js"
import util from "util"

export class ServiceRegistry {
  timeout
  dbClient

  constructor() {
    this.timeout = process.env.TIMEOUT_DURATION
    this.dbClient = new DbClient()
  }

  async register(name, ip, port, desc, ver, instanceId, url, reqEx, resEx) {
    await this.dbClient.registerService(name, ip, port, desc, ver, instanceId, url, reqEx, resEx)
    return {
      errorCode: 200,
      message: `Service ${name} instance ${instanceId} registered successfully`,
    }
  }

  async deregister(name, id) {
    const rowsAffected = await this.dbClient.deregisterService(name, id)
    if (rowsAffected === 0) {
      return {
        errorCode: 404,
        message: `Service ${name} instance ${id} not found`,
      };
    }
    return {
      errorCode: 200,
      message: `Service ${name} instance ${id} deregistered successfully`,
    }
  }

  async getAll() {
    const services = await this.dbClient.getAllServices()
    return {
      errorCode: 200,
      services,
    }
  }

  async discover(name) {
    const serviceInstances = await this.dbClient.findServiceInstances(name)
    if (serviceInstances.length === 0) {
      return {
        errorCode: 404,
        message: 'Service not found',
      }
    }
    return serviceInstances
  }

  async reRegister(name, instanceID) {
    const rowsAffected = await this.dbClient.updateServiceTimestamp(name, instanceID)
    if (rowsAffected === 0) {
      return {
        errorCode: 404,
        message: `Service ${name} instance ${instanceID} not found or not registered`,
      };
    }
    return {
      errorCode: 200,
      message: `Service ${name} instance ${instanceID} re-registered successfully`,
    }
  }

  async removeStaleServices() {
    await this.dbClient.removeStaleServices(this.timeout)
  }
}
