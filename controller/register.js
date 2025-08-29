const { StatusCodes } = require('http-status-codes');
const prisma = require('../prisma/db');

const getRegisterList = async (req, res) => {
  const queryObject = req.queryObject;
  const total = await prisma.register_register.count(queryObject);
  queryObject.take = req.queryOptions.take;
  queryObject.skip = req.queryOptions.skip;
  const page = req.queryOptions.page;
  const pages = Number((total / req.queryOptions.take).toFixed(0));
  const register = await prisma.register_register.findMany(queryObject);
  res
    .status(StatusCodes.OK)
    .json({ total, page, pages, items: register.length, register });
};

module.exports = { getRegisterList };
