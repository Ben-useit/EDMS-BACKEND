const { StatusCodes } = require('http-status-codes');
const prisma = require('../prisma/db');

const getDocuments = async (req, res) => {
  let { page, limit } = req.query;
  page = Number(page) || 1;
  limit = Number(limit) || 10;
  const skip = (page - 1) * limit;
  const total = await prisma.documents_document.count({
    where: { is_stub: true },
  });
  const result = await prisma.documents_document.findMany({
    where: {
      is_stub: true,
    },
    skip: skip,
    take: limit,
  });
  console.log(page, limit);
  res.status(StatusCodes.OK).json({
    total: total,
    nCount: result.length,
    page: page,
    documents: result,
  });
};

module.exports = { getDocuments };
