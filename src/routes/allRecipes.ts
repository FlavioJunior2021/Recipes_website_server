import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

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
}