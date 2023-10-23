import { type FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcrypt'

export async function authRoutes (app: FastifyInstance) {
  // cadastro de usuario
  app.post('/login', async (req, res) => {
    const bodySchema = z.object({
      username: z.string(),
      email: z.string().email(),
      password: z.string().min(8)
    })

    const { username, email, password } = bodySchema.parse(req.body)
    const hashedPassword = await bcrypt.hash(password, 10) // 10 é o número de rounds de hashing

    const isAdmin = email.endsWith('@admin.com')

    const existingUser = await prisma.user.findFirst({
      where: {
        email
      }
    })
    if (existingUser) {
      throw new Error('Usuário já registrado com esse email')
    }
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        admin: isAdmin
      }
    })
    const token = app.jwt.sign(
      {
        username: user.username,
        email: user.email,
        admin: user.admin,
				id: user.id
      },
      {
        sub: user.id,
        expiresIn: '30 days'
      }
    )
    return { token }
  })

  app.post('/auth', async (req, res) => {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(8)
    })
    const { email, password } = bodySchema.parse(req.body)

    const user = await prisma.user.findFirst({
      where: {
        email
      }
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Credenciais inválidas')
    }

    const token = app.jwt.sign(
      {
        username: user.username,
        email: user.email,
        admin: user.admin,
				id: user.id
      },
      {
        sub: user.id,
        expiresIn: '30 days'
      }
    )
    return { token }
  })
}
