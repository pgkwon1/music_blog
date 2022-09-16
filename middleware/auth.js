class Auth {

    constructor() {

    }

    static loginCheck(req, res, next) {
        const { session } = req
        if (session.is_login !== true) {
            res.send("<script>alert('로그인 후 이용해주세요'); location.href='/';</script>")
        }
        next()
    }
}

module.exports = Auth