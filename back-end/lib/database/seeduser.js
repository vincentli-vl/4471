import bcrypt from 'bcrypt'
import { DbClient } from './Database.js'
const dbClient = new DbClient()

const seedAdminUser = async () => {
  const username = process.env.ADMIN_USER || 'admin'
  const password = process.env.ADMIN_PASS || 'password'
  const hashedPassword = await bcrypt.hash(password, 10)
  await dbClient.createUser(username, hashedPassword)
  console.log(`Admin user ${username} created`)
}

seedAdminUser().catch((err) => {
  console.error('Error seeding admin user:', err)
})
