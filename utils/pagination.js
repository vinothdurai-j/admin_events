// Reads page & limit from query and gives skip value for MongoDB.
const getPagination = (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

module.exports = { getPagination };
