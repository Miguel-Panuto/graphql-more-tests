import express from 'express';
import graphqlHTTP from 'express-graphql';
import userSchema from './graphql/user/schema';
import postSchema from './graphql/post/schema';
import auth from './middleware/auth';

const PORT = process.env.PORT || 3333;

const app = express();

app.use('/user', graphqlHTTP({
    schema: userSchema,
    customFormatErrorFn: (error) => ({
        message: error.message,
        path: error.path,
    })
}));

app.use('/post', auth, graphqlHTTP({
    schema: postSchema,
    customFormatErrorFn: (error) => ({
        message: error.message,
        path: error.path
    })
}))

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))