const jwt = require('jsonwebtoken');

const middlewareVerify = {
    verifyToken: (req, res, next) => {
        const authHeader = req.headers.token;
        console.log("Received token header:", authHeader); // Debug log

        if (authHeader) {
            const token = authHeader.startsWith('Bearer ')
                ? authHeader.split(" ")[1]
                : authHeader;

            console.log("Extracted token:", token); // Debug log

            jwt.verify(token, process.env.SECREC_KEY, (err, user) => {
                if (err) {
                    console.error("Token verification error:", err); // Debug log
                    return res.status(403).json("Token không tồn tại hoặc đã hết hạn!");
                }
                console.log("Decoded user:", user); // Debug log
                req.user = user;
                next();
            });
        } else {
            return res.status(401).json("Hãy đăng nhập để thực hiện chức năng này");
        }
    },
    verifyTokenAndAdmin: (req, res, next) => {
        middlewareVerify.verifyToken(req, res, () => {

            if (req.user.admin || req.user.id === req.params.id) {
                next();
            } else {
                res.status(403).json("Bạn không có quyền này!")
            }
        }
        )
    },
    verifyTokenAdmin: (req, res, next) => {
        middlewareVerify.verifyToken(req, res, () => {
            if (req.user.admin) {
                next();
            } else {
                res.status(403).json("Bạn không có quyền này!")
            }
        })
    }



}

module.exports = middlewareVerify;