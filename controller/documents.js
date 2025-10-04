const path = require('path');
const { v4: uuid4 } = require('uuid');
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
    documentmetadata: {
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
  // queryObject.where.AND.OR.push(metaFilter);

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

const fileUpload = async (req, res) => {
  const documents = req.files.documents;
  const newDocuments = await createFileObjects(documents);
  res.json({ document: newDocuments });
};

const createFileObjects = async (documents) => {
  const newDocuments = await Promise.all(
    documents.map(async (document) => {
      const uuid = uuid4();
      const docPath = path.join(
        __dirname,
        '../media',
        'document_storage',
        `${uuid}`
      );

      await document.mv(docPath);

      const newDocument = await prisma.node_document.create({
        data: {
          label: document.name,
          uuid: uuid,
          date_added: new Date(),
        },
      });

      return newDocument;
    })
  );

  return newDocuments;
};

module.exports = { getDocumentList, fileUpload };
