const queryMiddleware = (req, res, next) => {
  let { limit, page } = req.query;
  limit = Number(limit) || 10;
  page = Number(page) || 1;
  const skip = (page - 1) * limit;
  req.queryObject = { where: {} };
  req.queryOptions = { take: limit, page, skip };

  const query = req.query;
  delete query.limit;
  delete query.page;
  if (Object.keys(query).length === 0) return next();
  const queryArray = Object.keys(query);
  req.queryOptions.query = [];
  queryArray.forEach((item) => {
    let keywords = query[item].match(/"([^"]+)"|\S+/g);
    if (keywords) {
      keywords = keywords.map((s) => s.replace(/^"|"$/g, ''));
      keywords.forEach((word) =>
        req.queryOptions.query.push({
          [item]: {
            contains: word,
            mode: 'insensitive',
          },
        })
      );
    }
  });
  return next();
};

module.exports = queryMiddleware;
