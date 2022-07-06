const { member } = require('../models')
const crypto = require('crypto')
const session = require('express-session')

class memberController {
    constructor() {

    }

    encryptPassword(password, salt) {
          if (salt === undefined) {
            salt = crypto.randomBytes(64).toString('hex')
          }
          const key = crypto.pbkdf2Sync(password, salt, 999, 64, 'sha512')
          return { encrypt_password : key.toString('hex'), salt : salt }
    }

    async loginProcess(user_id, password) {
        // 먼저 아이디가 있는지 확인
        const id_info = await this.findId(user_id)
        if (id_info === null) {
            throw "로그인 정보가 없습니다."
        }
        // 패스워드 암호화
        const { encrypt_password } = this.encryptPassword(password, id_info.salt)
        // 아이디와 비밀번호로 계정찾기
        let member_info = await this.findMember(user_id, encrypt_password)
        if (member_info === null) {
            throw "로그인 정보가 없습니다."
        } else {
            return { user_id : id_info.user_id, nickname : id_info.nickname }
        }
    }
    async registerProcess(req) {
        let { user_id, password, nickname } = req
        let register_result, find_id_result
        find_id_result = await this.findId(user_id)

        if (find_id_result !== null) { //아이디가 존재하는 경우
            throw "이미 사용중인 아이디 입니다."
        } else {
            let { encrypt_password, salt } = await this.encryptPassword(password)
            register_result = await member.create({
                user_id : user_id,
                password : encrypt_password,
                nickname : nickname,
                salt : salt
            })
        }

    }
    async findId(user_id) {
        let find_info = await member.findOne({
            where : {
                user_id : user_id
            }
        })
        if (find_info === null) {
            return null
        } else {
            return find_info.toJSON()
        }
    }
    
    async findMember(user_id, password) {
        let find_info = await member.findOne({
            where : {
                user_id : user_id,
                password : password
            }
        })
        if (find_info === null) {
            return null
        } else {
            return find_info.toJSON()
        }

    }
}


module.exports = memberController