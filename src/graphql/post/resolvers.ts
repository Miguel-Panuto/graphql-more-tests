import { PrismaClient } from '@prisma/client';
import { request } from 'express';

const db = new PrismaClient();

type post = {
  id: string;
  title: string;
  content: string;
};

export default {
  Query: {
    posts: () => db.posts.findMany(),
    post: (_: unknown, { id }: post) =>
      db.posts.findOne({
        where: {
          id: parseInt(id),
        },
      }),
  },

  Mutation: {
    createPost: (_: unknown, { title, content }: post) => {
      console.log(request.body);
      const { id } = request.body;
      return db.posts.create({
        data: {
          title,
          content,
          user: {
              connect: {
                  id
              }
          }
        },
      })
    }
  },
};
