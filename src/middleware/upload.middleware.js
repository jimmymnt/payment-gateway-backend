const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + './../../public/files');
  },
  filename: function (req, file, callback) {
    // You can write your own logic to define the filename here (before passing it into the callback), e.g:
    console.log(file.originalname);
    const filename = `file_${crypto.randomUUID()}`;
    callback(null, filename);
  },
});


const upload = multer({
  // storage,
  dest: "var/tmp/",
  limits: {
    fileSize: 4 * 1024 * 1024 // Defined in bytes (4 Mb)
  },
});

module.exports = upload;