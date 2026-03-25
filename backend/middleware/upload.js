import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// helper function to create storage for specific folder
const createStorage = (folder) => {
    // make sure it exists
    const uploadDir = path.join('/app', 'uploads', folder)
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
    }

    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `/app/uploads/${folder}`)
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            const ext = path.extname(file.originalname)
            cb(null, `${folder}-${uniqueSuffix}${ext}`)
        }
    })
}

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    
    if (isValid) {
        cb(null, true)
    } else {
        cb(new Error('Only image files are allowed of these types: jpeg, jpg, png, gif, webp'), false)
    }
}


export const uploadAttraction = multer({
    storage: createStorage('attractions'),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter
})

export const uploadTicketDraw = multer({
    storage: createStorage('ticket-draws'),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter
})