async function getAuth(req, reply, fastify) {

    let dbToken = req.cookies['dbToken'];
    console.log("req.query", req.query)

    req.query.db === 'mongo' ? dbToken = 'sql' : dbToken = 'mongo';

    reply.setCookie('dbToken', dbToken);
  
    reply.send({ message: `Login successful. Database switched to ${dbToken}` });
}

export default getAuth;
