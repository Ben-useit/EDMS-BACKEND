const { StatusCodes } = require('http-status-codes');
const prisma = require('../prisma/db');
const getSearchArray = (query, term) => {
  if (!query || !term) return null;

  // Match quoted phrases or individual words
  let keywords = query.match(/"([^"]+)"|\S+/g);
  if (!keywords) return [];

  // Remove surrounding quotes
  keywords = keywords.map((s) => s.replace(/^"|"$/g, ''));

  // Create array of search filters with dynamic term key
  const searchArray = keywords.map((word) => ({
    [term]: {
      contains: word,
      mode: 'insensitive',
    },
  }));
  return searchArray;
};

const getDocuments = async ({ query }) => {
  let { page, limit, search } = query;
  limit = Number(limit) || 10;
  let queryObject = { take: limit };

  const searchArray = getSearchArray(search, 'label');
  if (!searchArray) {
    queryObject.where = {};
  } else {
    queryObject.where = {
      OR: searchArray,
    };
  }
  const documents = await prisma.documents_document.findMany(queryObject);
  return documents;
};

const getDocumentTypes = async ({ query }) => {
  let { page, limit, search } = query;
  limit = Number(limit) || 10;
  let queryObject = { take: limit };

  const searchArray = getSearchArray(search, 'label');
  if (!searchArray) {
    queryObject.where = {};
  } else {
    queryObject.where = {
      OR: searchArray,
    };
  }
  const documents = await prisma.documents_documenttype.findMany(queryObject);
  return documents;
};

const getRegister = async ({ query }) => {
  let { page, limit, search } = query;
  limit = Number(limit) || 10;
  let queryObject = { take: limit };

  const searchArray = getSearchArray(search, 'file_no');
  if (!searchArray) {
    queryObject.where = {};
  } else {
    queryObject.where = {
      OR: searchArray,
    };
  }
  const documents = await prisma.register_register.findMany(queryObject);
  return documents;
};

const search = async (req, res) => {
  let result = {};
  const documents = await getDocuments({ query: req.query });
  const documentTypes = await getDocumentTypes({ query: req.query });
  const register = await getRegister({ query: req.query });
  result.documents = { nCount: documents.length, documents: documents };
  result.documentTypes = {
    nCount: documentTypes.length,
    documentTypes: documentTypes,
  };
  result.register = {
    nCount: register.length,
    documentTypes: register,
  };
  res.status(StatusCodes.OK).json(result);
};

module.exports = { search };
