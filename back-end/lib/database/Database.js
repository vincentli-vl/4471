import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import {resolve} from 'path';
import fs from 'fs';

dotenv.config({ path: '../../.env' })

export class DbClient{
    pool

    constructor(){
        // console.log({ path: resolve(process.cwd(), '../../.env') })
        // console.log({ path: resolve(process.cwd(), 'IBMSQL_Cert_CA.crt') })
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: {
              ca: fs.readFileSync(resolve(process.cwd(), 'IBMSQL_Cert_CA.crt'))
            }
        })
        // console.log(this.pool)
    }

    async query (sql, params){
        console.log('Executing query:', sql);
        console.log('With parameters:', params);
        const [results, ] = await this.pool.execute(sql, params)
        // const results = await this.pool.execute(sql, params)
        // console.log("query func= ", results)
        return results
    }

    async createUser (username, password){
        const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        const params = [username, password];
        await this.query(sql, params);
    };

    async findUser (username){
        const sql = 'SELECT * FROM users WHERE username = ?'
        const params = [username]
        const users = await this.query(sql, params)
        return users[0]
    }

    async registerService (serviceName, ip, port, description, version, instanceId, url, reqEx, resEx){
        const timestamp = Math.floor(new Date() / 1000)
        const sql = `INSERT INTO services (serviceName, ip, port, description, version, instanceId, url, requestExample, responseExample, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE ip=VALUES(ip), port=VALUES(port), description=VALUES(description), version=VALUES(version), url=VALUES(url), requestExample=VALUES(requestExample), responseExample=VALUES(responseExample), timestamp=VALUES(timestamp)`
        const params = [serviceName, ip, port, description, version, instanceId, url, (reqEx) ? reqEx : "", (resEx) ? resEx : "", timestamp]
        await this.query(sql, params)
    }

    async deregisterService (serviceName, instanceId){
        const sql = 'DELETE FROM services WHERE serviceName = ? AND instanceId = ?'
        const params = [serviceName, instanceId]
        const result = await this.query(sql, params)
        return result.affectedRows
    }

    async getAllServices (){
        const sql = 'SELECT * FROM services'
        return await this.query(sql)
    }

    async findServiceInstances (serviceName){
        const sql = 'SELECT * FROM services WHERE serviceName = ?'
        const params = [serviceName]
        return await this.query(sql, params)
    }

    async updateServiceTimestamp (serviceName, instanceId){
        const timestamp = Math.floor(new Date() / 1000)
        const sql = 'UPDATE services SET timestamp = ? WHERE serviceName = ? AND instanceId = ?'
        const params = [timestamp, serviceName, instanceId]
        const result = await this.query(sql, params)
        return result.affectedRows
    }

    async migrateExpiredService (service){
        const { serviceName, ip, port, description, version, instanceId, url, reqEx, resEx, timestamp } = service
        const sql = `INSERT INTO expired_services (serviceName, ip, port, description, version, instanceId, url, requestExample, responseExample, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        const params = [serviceName, ip, port, description, version, instanceId, url, (reqEx) ? reqEx : "", (resEx) ? resEx : "", timestamp]
        await this.query(sql, params)
    }

    async removeStaleServices (timeout){
        // console.log("Now: ", Math.floor(new Date() / 1000))
        // console.log("timeout: ", timeout)

        const threshold = Math.floor(new Date() / 1000) - timeout
        // console.log("threshold: ", threshold)
        const sql = 'SELECT * FROM services WHERE timestamp < ?'
        const params = [threshold]
        const staleServices = await this.query(sql, params)
        
        if(staleServices.length > 0){
            for (const service of staleServices) {
                await this.migrateExpiredService(service)
            }
            
            const deleteSql = 'DELETE FROM services WHERE timestamp < ?'
            await this.query(deleteSql, [threshold])
        }
    }

    async onClose(){
        await this.query('DELETE * FROM services')
    }
}
