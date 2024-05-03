const getRecipes = (req, reply) => {
  reply.send({
    recipes: [{ id: '1', name: 'Item One' }]
})
}

export default getRecipes;