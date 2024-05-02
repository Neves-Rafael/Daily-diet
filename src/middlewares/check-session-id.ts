import { FastifyReply, FastifyRequest } from "fastify";

export function checkSessionId(request: FastifyRequest, reply: FastifyReply){
  const sessionId = request.cookies.sessionId

  if(!sessionId){
    return reply.status(401).send({
      error: "User Unauthorized.",
    })
  }

  return reply.send()
}