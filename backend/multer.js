
const multer = require('multer');
const path = require('path');

// storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads/"); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// file filter configuration
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === "image/") {
//         cb(null, true);
//     } 
//     else {
//         cb(new Error("Only images are allowed."), false);
//     }
// };

const fileFilter = (req, file, cb) => {
    const allowedExtensions = [".png", ".jpg", ".jpeg"];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (file.mimetype.startsWith("image/") && allowedExtensions.includes(fileExtension)) {
        cb(null, true); // Accept file
    } else {
        cb(new Error("Only .png, .jpg, and .jpeg images are allowed."), false); // Reject file
    }
};


// Initialise multer instances
const upload = multer ({storage, fileFilter});

module.exports = upload;
