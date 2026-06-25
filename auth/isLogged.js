const jwt = require("jsonwebtoken");

function isLoggedIn(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).redirect("/login");
    }

    try {
        const data = jwt.verify(token, "thisisSecret");
        req.user = data;
        next();
    } catch (err) {
        return res.status(401).send("Invalid or expired token.");
    }
}

module.exports = isLoggedIn;
