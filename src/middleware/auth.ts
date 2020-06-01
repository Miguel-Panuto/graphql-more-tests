import { RequestHandler } from 'express';
import jwt, { VerifyCallback } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

let authConfig = require('../config/auth.json');

const db = new PrismaClient();

const auth: RequestHandler = async (req, res, next) => {
  // This will pickup the content from the authorization
  const authHeader = req.headers.authorization;

  // Verify if there is not a header, and this will send a error
  if (!authHeader)
    return res.status(401).json({ error: 'Not allowed, token expected' });

  // split in 2 the 'Bearer anthejwtcode'
  const parts: any = authHeader.split(' ');

  // Verify if is in 2 parts, if ins't will return a error
  if (parts.length !== 2) return res.status(401).json({ error: 'False token' });

  const [scheme, token] = parts;

  // Verify if isn't  bearer and return a error
  if ('bearer' !== scheme.toLowerCase()) {
    return res.status(401).json({ error: 'Token not in correct format' });
  }

  type user = {
    id: number;
  };
  const verifyLogin: VerifyCallback = async (err, decoded) => {
    if (err) return new GraphQLError('Not authorized');
    const { id } = decoded as user;

    const user = await db.users.findOne({
      where: {
        id,
      },
    });
    req.body = { id: user?.id };
  };

  // And then verify if thw jwt is correct
  jwt.verify(token, process.env.AUTH || authConfig.secret, verifyLogin);

  next();
};

export default auth;
