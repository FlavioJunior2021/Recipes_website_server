import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function allRecipesRoutes(app: FastifyInstance) {
	app.get("/recipes", async (_req, _res) => {
		const recipes = await prisma.recipe.findMany({
			orderBy: {
				created_at: "asc",
			},
		});
		return recipes.map((recipe) => {
			return {
				id: recipe.id,
				title: recipe.title,
				ingredients: recipe.ingredients,
				coverURL: recipe.coverURL,
				instructions: recipe.instructions,
				category: recipe.categoryId,
				tags: recipe.tags,
			};
		});
	});
	app.get("/recipe/:id", async (req, res) => {
		const params = z.object({
			id: z.string().uuid(),
		});
		const { id } = params.parse(req.params);

		const recipes = await prisma.recipe.findMany({
			where: {
				id,
			},
		});
		return recipes.map((recipe) => {
			return {
				id: recipe.id,
				title: recipe.title,
				ingredients: recipe.ingredients,
				coverURL: recipe.coverURL,
				instructions: recipe.instructions,
				category: recipe.categoryId,
				tags: recipe.tags,
			};
		});
		
	});
}