import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import dotenv from 'dotenv'

const storage = multer.memoryStorage()
const upload = multer({ storage })
dotenv.config()

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

function uploadImage({ original_filename, buffer }) {
    try {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                    public_id: original_filename,
                    overwrite: true,
                    invalidate: true,
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary error inside uploadImage!\n', error)
                        return reject({ success: false, message: 'Upload failed' })
                    }
    
                    resolve({
                        success: true,
                        message: 'Image uploaded!',
                        imageData: {
                            file_name: result.public_id,
                            image_url: result.secure_url,
                        },
                    })
                }
            ).end(buffer)
        })
    }
    catch(error) {
        console.error('Exception occurred inside uploadImage!\n', error)
        return { success: false, message: 'Exception:::: Cloudinary error inside uploadImage!' }
    }
}

async function deleteCloudinaryImage(file_name) {
    try {
        const result = await cloudinary.uploader.destroy(file_name)

        if (result.result === 'ok') {
            return { success: true, message: 'Cloudinary image deleted as well!' }
        } 
        else {
            console.warn('Cloudinary deletion failed!', result)
            return { success: false, message: 'Cloudinary did not delete the image!' }
        }
    } 
    catch (error) {
        console.error('Exception occurred inside deleteCloudinaryImage!\n', error)
        return { success: false, message: 'Cloudinary image delete error!' }
    }
}

async function updateCloudinaryImage({ old_file_name, original_filename, buffer }) {
    try {
        if (old_file_name) {
            await cloudinary.uploader.destroy(old_file_name)
        }

        return await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ public_id: original_filename, overwrite: true, invalidate: true }, (error, result) => {
                    if (error) {
                        console.error('Cloudinary error in updateCloudinaryImage!\n', error)
                        return reject({ success: false, message: 'Image updation failed!' })
                    }

                    resolve({
                        success: true,
                        message: 'Image updated!',
                        imageData: {
                            file_name: result.public_id,
                            image_url: result.secure_url,
                        },
                    })
                }
            ).end(buffer)
        })
    } 
    catch (error) {
        console.error('Exception occurred inside updateCloudinaryImage!\n', error)
        return { success: false, message: 'Cloudinary error during update!' }
    }
}

export {
    uploadImage,
    deleteCloudinaryImage,
    updateCloudinaryImage,   
    upload,
}