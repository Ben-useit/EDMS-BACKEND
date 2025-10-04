const prisma = require('./db');

const createToken = async ({ data }) => {
  try {
    const result = await prisma.node_token.create({
      data,
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createToken };
