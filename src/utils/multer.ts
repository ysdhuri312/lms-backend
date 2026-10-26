import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { courseSchema } from '../modules/instructor/instructor.schema';

const uploadDir = path.resolve('./public/temp/uploads');

// Create directory if it doesn't exist
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const { courseId } = courseSchema.parse(req.body);

    const id = courseId ?? 'course';
    const extension = path.extname(file.originalname);

    cb(null, `${id}-${Date.now()}${extension}`);
  },
});

const upload = multer({ storage });

export default upload;
