const { nanoid } = require('nanoid');
const books = require('./books');
const addBookHandler = (request, h) => {
  try {
    let {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;

    // Cek value reading
    if (readPage === 0) {
      reading = false;
    }
    if (!name || !author || !pageCount) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal menambahkan buku. Mohon isi nama buku',
        })
        .code(400);
    }
    if (readPage > pageCount) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        })
        .code(400);
    }
    const finished = pageCount === readPage;
    const id = nanoid(16);
    const currentDate = new Date().toISOString();

    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      insertedAt: currentDate,
      updatedAt: currentDate,
    };

    books.push(newBook);
    return h
    .response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: newBook.id, 
      },
    })
    .code(201);
  } catch (error) {
    return h.response({ error: 'Internal Server Error' }).code(500);
  }
};
const getAllBooksHandler = (request, h) => {
  const simplifiedBooks = [];

  for (const book of books) {
    const simplifiedBook = {
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    };
    simplifiedBooks.push(simplifiedBook);
  }

  return h.response({
    status: 'success',
    data: {
      books: simplifiedBooks, 
    },
  }).code(200);
};
const getBookByIdHandler = (request, h) => {
  const bookId = request.params.id;
  const book = books.find((book) => book.id === bookId);
  if (!book) {
    return h
      .response({
        status: 'fail',
        message: 'Buku tidak ditemukan', 
      })
      .code(404);
  }
  return h
    .response({
      status: 'success',
      data: {
        book, 
      },
    })
    .code(200);
};
const editBookHandler = (request, h) => {
  try {
    const bookId = request.params.id;
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;

    // Find Book By ID
    const bookToUpdate = books.find((book) => book.id === bookId);
    if (!bookToUpdate) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Id tidak ditemukan',
        })
        .code(404);
    }
    if (!name) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku',
        })
        .code(400);
    }
    if (readPage > pageCount) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        })
        .code(400);
    }
    bookToUpdate.name = name;
    bookToUpdate.year = year;
    bookToUpdate.author = author;
    bookToUpdate.summary = summary;
    bookToUpdate.publisher = publisher;
    bookToUpdate.pageCount = pageCount;
    bookToUpdate.readPage = readPage;
    bookToUpdate.reading = reading;

    bookToUpdate.updatedAt = new Date().toISOString();

    return h
      .response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      })
      .code(200);
  } catch (error) {
    return h.response({ error: 'Internal Server Error' }).code(500);
  }
};
const deleteBookHandler = (request, h) => {
  try {
    const bookId = request.params.id;

    // Find Book By ID
    const bookIndexToDelete = books.findIndex((book) => book.id === bookId);

    if (bookIndexToDelete === -1) {
      return h
        .response({
          status: 'fail',
          message: 'Buku gagal dihapus. Id tidak ditemukan',
        })
        .code(404);
    }
    books.splice(bookIndexToDelete, 1);

    return h
      .response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      })
      .code(200);
  } catch (error) {
    return h.response({ error: 'Internal Server Error' }).code(500);
  }
};
const filterBookHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = books;

  if (name) {
    const lowerCaseNameQuery = name.toLowerCase();
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(lowerCaseNameQuery));
  }
  if (reading !== undefined) {
    const isReading = reading === '1';
    filteredBooks = filteredBooks.filter((book) => isReading === book.reading);
  }
  if (finished !== undefined) {
    const isFinished = finished === '1';
    filteredBooks = filteredBooks.filter((book) => isFinished === book.finished);
  }

  if (filteredBooks.length === 0) {
    return h
      .response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      })
      .code(404);
  }

  const response = {
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  };

  return h.response(response).code(200);
};

module.exports = { 
                    addBookHandler,
                    getAllBooksHandler,
                    getBookByIdHandler,
                    editBookHandler,
                    deleteBookHandler,
                    filterBookHandler,
                    };