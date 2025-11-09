import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
dotenv.config()

function isAuthenticated(req, res, next) {
    const token = req.cookies?.token

    if (!token || typeof token !== 'string') {
        return res.status(401).send({ success: false, message: 'Unauthorized. Please log in!' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decoded
        next()
    } 
    catch (error) {
        console.error("Exception occurred inside isAuthenticated!\n", error)
        return res.status(401).send({ success: false, message: 'Invalid or expired token!' })
    }
}

export { 
    isAuthenticated,
}