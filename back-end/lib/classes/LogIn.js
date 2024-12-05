// models/User.js
import bcrypt from 'bcrypt'

const users = new Map()

export const createUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10)
  users.set(username, { username, password: hashedPassword })
}

export const findUser = (username) => {
  return users.get(username)
}

export const validatePassword = async (user, password) => {
  return bcrypt.compare(password, user.password)
}
