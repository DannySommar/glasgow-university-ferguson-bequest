import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url)) // useless, dont listen to ai listen to guy on youtube

// when creating new, it used to be an error. need to create it just in case.
const uploadDir = path.join('/app', 'uploads', 'attractions')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/app/uploads/attractions')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) // AI is good for this tbh
    const ext = path.extname(file.originalname)
    cb(null, `attraction-${uniqueSuffix}${ext}`)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/
  const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  
  if (isValid) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed of these types: jpeg, jpg, png, gif, webp'), false)
  }
}

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter
})