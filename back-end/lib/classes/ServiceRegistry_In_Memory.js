import util from "util"
// import dotenv from"dotenv"

export class ServiceRegistry {
  timeout
  services
  logger

  constructor() {
    // this.logger = logger
    this.timeout = process.env.TIMEOUT_DURATION
    this.services = new Map()
  }

  register(name, ip, port, desc, ver, instanceId, url) {
    const instanceID = parseInt(instanceId)
    if (!this.services.has(name)) {
      this.services.set(name, new Map())
    }

    const serviceInstances = this.services.get(name)
    const serviceInstance = serviceInstances.set(instanceID, {
      ip,
      port,
      desc,
      ver,
      url,
      timestamp: Math.floor(new Date() / 1000),
    })

    return {
      errorCode: 200,
      serviceInstance,
      message: `Service ${name} instance ${instanceID} registered successfully`,
    }
    // console.log(this.services)
    // return serviceInstance
  }

  derigister(name, ID) {
    const id = parseInt(ID)

    if (!this.services.has(name)) {
      return {
        errorCode: 404,
        message: "Service not found",
      }
    }

    const serviceInstances = this.services.get(name)

    // console.log(typeof id, id)
    if (!id) {
      console.log(this.services)
      this.services.delete(name)
      return {
        errorCode: 200,
        message: `Service ${name} deregistered successfully`,
      }
    }

    if (!serviceInstances.has(id)) {
      console.log(this.services)
      return {
        errorCode: 404,
        message: "Instance not found",
      }
    }

    serviceInstances.delete(id)

    if (serviceInstances.size === 0) {
      this.services.delete(name)
    }

    console.log(this.services)
    return {
      errorCode: 200,
      message: `Service ${name} instance ${id} deregistered successfully`,
    }
  }

  getAll() {
    const services = Array.from(this.services.entries()).map(
      ([serviceName, instances]) => ({
        serviceName,
        instances: Array.from(instances.entries()).map(
          ([instanceId, { ip, port, desc, ver, url, timestamp }]) => ({
            instanceId,
            ip,
            port,
            desc,
            ver,
            url,
            timestamp,
          })
        ),
      })
    )
    console.log(util.inspect(services, 1, 5))
    return {
      errorCode: 200,
      services,
    }
  }

  discover(name) {
    // console.log(Array.from(this.services.get(name).entries()))
    if (!this.services.has(name)) {
        return {
          errorCode: 404,
          message: "Service not found",
        }
      }
  
      const serviceInstances = this.services.get(name)

      return serviceInstances
  }

  reRegister(name, instanceID) {
    const service = this.services.get(name)
    if (!service || !service.has(instanceID)) {
        return {
            errorCode: 404,
            message: "Reregister the service. Service timed out!",
        }
    }
    
    const instance = service.get(instanceID)
    // console.log("old: ", instance.timestamp)
    instance.timestamp = Math.floor(new Date()/1000)
    // console.log("new: ", instance.timestamp)
    // return instance
    return {
        errorCode: 200,
        message: `Service ${name} instance ${instanceID} heartbeat recieved`,
    }
  }

  removeStaleServices() {
    const now = Math.floor(new Date() / 1000)
    this.services.forEach((instances, serviceName) => {
      instances.forEach((instance, instanceId) => {
        if (now - instance.timestamp > this.timeout) {
          instances.delete(instanceId)
          console.log(`Removed stale instance ${instanceId} of service ${serviceName}`)
        }
      })
      if (instances.size === 0) {
        this.services.delete(serviceName)
      }
    })
  }
}
