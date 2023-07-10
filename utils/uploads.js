import multer from 'multer';

const upload = multer({
    dest: 'uploads/',
    filename: (req, file, callback) => {
        const timestamp = Date.now();
        const filename = `bulk_create_personnel_${timestamp}.csv`; // to fix the naming issue
        callback(null, filename);
    }
});

const uploadFile = (filename) => {
    return (req, res, next) => {
        upload.single(filename)(req, res, function (error) {
            if (error instanceof multer.MulterError) {
                const err = new Error('Multer error occurred during file upload.');
                err.status = 400;
                return next(err);
            } else if (error) {
                const err = new Error('Unknown error occurred during file upload.');
                err.status = 400;
                return next(err);
            }
            next();
        });
    }
}

export default uploadFile;
