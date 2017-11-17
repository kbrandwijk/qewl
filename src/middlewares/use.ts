import { Request, Response, AsyncRequestHandler, NextFunction } from 'express'
import { QewlRouterMiddlewareHandler } from '../types'
import { base } from './base'
import { GraphQLResolveInfo } from 'graphql'
import { addHelpers } from '../helpers'

export function use(path: string, fn: QewlRouterMiddlewareHandler): AsyncRequestHandler {
  return base(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // wrap the function
    const middlewareFunction = async (
      parent: any,
      args: { [key: string]: any },
      context: { [key: string]: any },
      info: GraphQLResolveInfo,
      nxt: any
    ) => {
      const event: any = { parent, args, context, info }
      addHelpers(event)
      return await fn(event, nxt)
    }
    req.qewl.middlewares.push({ path, fn: middlewareFunction })

    next()
  })
}
