// Controller import
const { POSTER_POST_API, POSTER_GET_API, POSTER_GET_PUBLIC_API, POSTER_GET_ID_API, POSTER_DELETE_API, POSTER_PATCH_API} = require('../controllers/poster-api');
const { POSTER_UPLOAD_API } = require('../multer/poster-image-upload');

// Middleware import
const AuthenticateMiddleware = require('../middleware/authenticate');
const PosterExistsMiddleware = require('../middleware/poster-exists');

module.exports = (app) => {
    // Poster Routes Definition
    app.post('/posters', AuthenticateMiddleware, POSTER_POST_API);
    app.get('/posters', AuthenticateMiddleware, POSTER_GET_API);
    app.get('/posters/public', POSTER_GET_PUBLIC_API);
    app.get('/posters/:id', AuthenticateMiddleware, POSTER_GET_ID_API);
    app.delete('/posters/:id', AuthenticateMiddleware, POSTER_DELETE_API);
    app.patch('/posters/:id', AuthenticateMiddleware, POSTER_PATCH_API);
    app.post('/posters/uploads/:id', AuthenticateMiddleware, PosterExistsMiddleware, POSTER_UPLOAD_API);
}