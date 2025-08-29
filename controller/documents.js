const { StatusCodes } = require('http-status-codes');
const prisma = require('../prisma/db');
const { getObjects } = require('../utils/authorization');

const getDocumentList = async (req, res) => {
  const objectIds = await getObjects(req.user.id, 'user', 'document', 'read');
  const query = req.queryOptions.query;
  const docSearch = [];
  const metaSearch = [];

  if (query) {
    query.forEach((item) => {
      if (item.meta) metaSearch.push(item);
      else docSearch.push(item);
    });
  }

  const metaFilter = {
    metadata_documentmetadata: {
      some: {
        OR: metaSearch.map(({ meta }) => ({
          value: meta,
        })),
      },
    },
  };

  // Construct query
  const queryObject = {
    where: {
      uuid: { in: objectIds },
      AND: {
        OR: docSearch,
      },
    },
  };
  queryObject.where.AND.OR.push(metaFilter);

  // Get total number
  const total = await prisma.documents_document.count(queryObject);

  // Add pagination
  queryObject.take = req.queryOptions.take;
  queryObject.skip = req.queryOptions.skip;
  const page = req.queryOptions.page;
  const pages = Number((total / req.queryOptions.take).toFixed(0));

  // Get paginated result
  const documents = await prisma.documents_document.findMany(queryObject);
  res
    .status(StatusCodes.OK)
    .json({ total, page, pages, items: documents.length, documents });
};

module.exports = { getDocumentList };
