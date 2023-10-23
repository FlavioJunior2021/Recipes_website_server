import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import fastifyJwt from '@fastify/jwt'
import 'dotenv/config'
import fastify from 'fastify'
import { resolve } from 'path'

import { authRoutes } from './routes/auth'
import { recipesRoutes } from './routes/recipes'
import { categoryRoutes } from './routes/category'
import { uploadRoutes } from './routes/uploads'
import { adminRoutes } from './routes/admin'
import { allRecipesRoutes } from './routes/allRecipes'

const app = fastify()

app.register(cors, {
  origin: true
})

app.register(jwt, {
  secret: 'akshfasihfaifhai-shgai-ghaisghapsghasgh'
})

app.register(multipart)

app.register(fastifyStatic, {
	root: resolve(__dirname, '../uploads'),
	prefix: '/uploads',
})

app.register(authRoutes)
app.register(categoryRoutes)
app.register(uploadRoutes)
app.register(recipesRoutes)
app.register(adminRoutes)
app.register(allRecipesRoutes)


app
  .listen({
    port: 3333,
    host: '0.0.0.0'
  })
  .then(() => {
    console.log('🚀 HTTP server running on port http://localhost:3333')
  })
