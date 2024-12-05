// service

// if(!service.get(name)){
//     const serviceInstance = service.find()
//     if([service.ip, service.port, service.instanceId].join(":") == [ip, port, instanceId].join(":"))
//         return "service already registered"
//     else{
//         serviceInstance["name"] = name
//         serviceInstance["ip"] = ip
//         serviceInstance["port"] = port
//         serviceInstance["instanceId"] = instanceId
//         serviceInstance["desc"] = desc
//         serviceInstance["ver"] = ver
//         serviceInstance["url"] = url
//         service.push(serviceInstance)
//         return `Another instance to service ${service.name} added with instance id ${instanceId}`
//     }
// }

// const key = name+version+ip+port;

// if(!this.services[key]){
//     this.services[key] = {};
//     this.services[key].timestamp = Math.floor(new Date() / 1000);
//     this.services[key].ip = ip;
//     this.services[key].port = port;
//     this.services[key].name = name;
//     this.services[key].version = version;
//     this.log.debug(`Added services ${name}, version ${version} at ${ip}:${port}`);
//     return key;
// }

// this.services[key].timestamp = Math.floor(new Date() / 1000);
// this.log.debug(`Updated services ${name}, version ${version} at ${ip}:${port}`);
// return key;