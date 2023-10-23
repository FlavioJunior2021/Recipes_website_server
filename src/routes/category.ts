import { type FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function categoryRoutes(app: FastifyInstance) {
	app.register((fastify, options, done) => {
		app.get("/category/:id/recipes", async (req, res) => {
			const paramsSchema = z.object({
				id: z.string().uuid(),
			});
			const { id } = paramsSchema.parse(req.params);
	
			const recipes = await prisma.recipe.findMany({
				where: {
					categoryId: id,
				},
			});
			return recipes.map((recipe) => {
				return {
					title: recipe.title,
					ingredients: recipe.ingredients,
					instructions: recipe.instructions,
					coverURL: recipe.coverURL,
					tags: recipe.tags,
				};
			});
		});
		done();
	});
}
