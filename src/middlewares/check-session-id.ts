import { FastifyReply, FastifyRequest } from "fastify";

export async function checkSessionId(request: FastifyRequest, reply: FastifyReply){
  const { sessionId } = request.cookies
  
  if(!sessionId){
    return reply.status(401).send({
      error: "User Unauthorized.",
    })
  }
}