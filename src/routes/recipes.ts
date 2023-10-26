import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function recipesRoutes(app: FastifyInstance) {
	app.register((fastify, options, done) => {
		app.addHook("preHandler", async (req) => {
			await req.jwtVerify();
		});

		app.post("/recipe", async (req, res) => {
			const bodySchema = z.object({
				title: z.string(),
				ingredients: z.string(),
				coverURL: z.string(),
				instructions: z.string(),
				categoryId: z.string().uuid(),
				tags: z.string(),
			});

			const { title, ingredients, coverURL, instructions, tags, categoryId } = bodySchema.parse(req.body);

			const recipe = await prisma.recipe.create({
				data: {
					title,
					coverURL,
					ingredients,
					tags,
					instructions,
					created_at: Date.now().toString(),
					userId: req.user.sub,
					categoryId
				},
			});
			return recipe;
		});

		app.delete("/recipe/:id", async (req, res) => {
			const params = z.object({
				id: z.string().uuid(),
			});
			const { id } = params.parse(req.params);

			const recipe = await prisma.recipe.findFirstOrThrow({
				where: {
					id,
				},
			});
			if (recipe.userId !== req.user.sub && !req.user.admin) {
				return await res.status(401).send();
			}
			await prisma.recipe.delete({
				where: {
					id,
				},
			});
		});

		app.put("/recipe/:id", async (req, res) => {
			const params = z.object({
				id: z.string().uuid(),
			});
			const bodySchema = z.object({
				title: z.string(),
				ingredients: z.string(),
				instructions: z.string(),
			})
			const { id } = params.parse(req.params);
			const { title, ingredients, instructions } = bodySchema.parse(req.body);

			const recipe = await prisma.recipe.findFirstOrThrow({
				where: {
					id,
				},
			});
			if (recipe.userId !== req.user.sub) {
				return await res.status(401).send();
			}
			await prisma.recipe.update({
				where: {
					id,
				},
				data: {
					title,
					ingredients,
					instructions
				}
			});

		});

		done();
	});
}
