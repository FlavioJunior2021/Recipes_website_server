import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function adminRoutes(app: FastifyInstance) {

	app.register((fastify, options, done) => {
		app.addHook('preValidation', async (req) => {
			await req.jwtVerify()
			const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user.id } });
			if (!user?.admin) {
					throw new Error('Acesso negado. Somente administradores podem acessar essa rota.');
			}
		})
	
		app.get("/admin/users", async (req, res) => {
			const users = await prisma.user.findMany();
			const userResponse = users.map((user) => ({
				id: user.id,
				username: user.username,
				email: user.email,
				isAdmin: user.admin,
			}));
			return userResponse;
		});
	
		app.delete("/admin/:id/user", async (req, res) => {
			const params = z.object({
				id: z.string().uuid(),
			});
			const { id } = params.parse(req.params);
			await prisma.user.delete({
				where: {
					id,
				},
			});
		})
		
		done()
	})
}
