const { POSTER_PATCH_API } = require('./../controllers/poster-api');
const multer = require('multer');

/**
 * Create disk storage for the multer
 */
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + './../uploads');
    },
    filename: function(req, file, callback) {
        callback(null, new Date().toISOString() + file.originalname);
    }
});

/**
 * Create file filter for the multer
 * @param {*} req request
 * @param {*} file the uploaded file
 * @param {*} callback function to store/reject the uploaded file
 */
const fileFilter = (req, file, callback) => {
    if(file.mimetype === 'image/jpeg' || 
       file.mimetype === 'image/png' ||
       file.mimetype === 'image/jpg') {
        // store the file
        callback(null, true);
    } else {
        // reject a file
        callback(null, false);
    }
};

/**
 * Create the actual multer instance to extract the files
 * identified by the key 'posterImage'
 */
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 100},
    fileFilter: fileFilter
}).single('posterImage');


const POSTER_UPLOAD_API = (request, response) => {
    upload(request, response, function (err) {
        if(err) {
            if(err.code === 'LIMIT_FILE_SIZE') {
                response.status(400).send({'error': 'File size should not exceed 1MB.'});
            } else {
                response.status(400).send(err);
            }
        } else {
            const imageURL = '/image/' + request.file.filename;
            request.body.url = imageURL;
            POSTER_PATCH_API(request, response);
        }
    })
};

module.exports = {
    POSTER_UPLOAD_API
};