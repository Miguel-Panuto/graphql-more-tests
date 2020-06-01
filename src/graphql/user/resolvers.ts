import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import generateToken from '../../utils/generateToken';

const db = new PrismaClient();

type user = {
    id: string;
    name: string;
    email: string;
    password: string | undefined;
}

const errorResponse = new GraphQLError('Invalid login', undefined, undefined, undefined, ['Email']);

export default {
    Query: {
        users: () => db.users.findMany(),
        user: (_: unknown, { id }: user) => db.users.findOne({
            where: {
                id: parseInt(id)
            }
        })
    },

    Mutation: {
        createUser: (_: unknown, { name, email, password }: user) =>
             db.users.create({
                 data: {
                     name,
                     email,
                     password: bcrypt.hashSync(password, 10)
                 }
             }),
        createSession: async (_: unknown, { email, password }: user) => {
            let user = await db.users.findOne({
                where: {
                    email
                }
            });

            if(!user) {
                return errorResponse;
            }

            if(! await bcrypt.compare(password, user.password)) {
                return errorResponse;
            }
            
            const id = user.id;
            password = undefined;
            user = null;
            return { token: generateToken({ id })};
        }
    }
}