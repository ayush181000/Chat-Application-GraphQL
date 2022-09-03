import pc from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';

const prisma = new pc.PrismaClient();

const resolvers = {
  Query: {
    users: async (_, args, { userId }) => {
      if (!userId) throw new ForbiddenError('You must be logged in');
      return await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        where: { id: { not: userId } },
      });
    },

    messagesByUser: async (_, { receiverId }, { userId }) => {
      if (!userId) throw new ForbiddenError('You must be logged in');
      return await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId, receiverId },
            { senderId: receiverId, receiverId: userId },
          ],
        },
        orderBy: { createdAt: 'asc' },
      });
    },
  },

  Mutation: {
    signupUser: async (_, { userNew }) => {
      const user = await prisma.user.findUnique({
        where: { email: userNew.email },
      });

      if (user) throw new AuthenticationError('User already exists');

      const hashedPassword = await bcrypt.hash(userNew.password, 10);

      const newUser = await prisma.user.create({
        data: {
          ...userNew,
          password: hashedPassword,
        },
      });

      return newUser;
    },

    signinUser: async (_, { userSignin }) => {
      console.log(userSignin.email);
      const user = await prisma.user.findUnique({
        where: { email: userSignin.email },
      });

      // If user doesnt exist
      if (!user) {
        throw new AuthenticationError("User doesn't exist with that email");
      }

      const doMatch = await bcrypt.compare(userSignin.password, user.password);

      // If password doesnt match
      if (!doMatch)
        throw new AuthenticationError('Email or password is invalid');

      // send token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

      return { token };
    },

    createMessage: async (_, { receiverId, text }, { userId }) => {
      if (!userId) throw new ForbiddenError('You must be logged in');

      const message = await prisma.message.create({
        data: {
          text,
          receiverId,
          senderId: userId,
        },
      });

      return message;
    },
  },
};

export default resolvers;
