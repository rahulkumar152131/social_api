import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '_') + file.originalname);
  }
})
const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/png" || file.mimetype == "image/gif" || file.mimetype == "image/jpeg" || file.mimetype == "image/jpg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

export const upload = multer({
  storage,
  fileFilter
})