import { getHelloWorld } from "../controllers/recipe.controller.js";

export default async function routes (fastify, options) {
    fastify.get('/', getHelloWorld);
  }

