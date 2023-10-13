const { addBookHandler,
        getAllBooksHandler,
        getBookByIdHandler,
        editBookHandler,
        deleteBookHandler,
        filterBookHandler,
      } = require('./handler');
const routes=[
  {
  method: 'POST',
  path: '/books',
  handler: addBookHandler, 
},
{
  method: 'GET',
  path: '/books',
  handler: (request, h) => {
    if (request.query.name || request.query.reading || request.query.finished) {
      return filterBookHandler(request, h);
    } else {
      return getAllBooksHandler(request, h);
    }
  },
},
{
  method: 'GET',
  path: '/books/{id}',
  handler: getBookByIdHandler,
},
{
  method: 'PUT',
  path: '/books/{id}',
  handler: editBookHandler,
},
{
  method: 'DELETE',
  path: '/books/{id}', 
  handler: deleteBookHandler,
},
];
module.exports = routes;