/* eslint-disable no-param-reassign */
/* eslint-disable no-empty-function */
const crypto = require('crypto')
const { member } = require('../models')

class memberController {
    constructor(data) {
        this.userId = data.userId
        this.password = data.password
        this.nickname = data?.nickname
    }

    // eslint-disable-next-line class-methods-use-this
    encryptPassword(salt) {
          if (salt === undefined) {
            salt = crypto.randomBytes(64).toString('hex')
          }
          const key = crypto.pbkdf2Sync(this.password, salt, 999, 64, 'sha512')
          return { encryptPassword : key.toString('hex'), salt }
    }

    async loginProcess() {
        // 먼저 아이디가 있는지 확인
        const idInfo = await this.findId()
        if (idInfo === null) {
            throw new Error("로그인 정보가 없습니다.")
        }
        // 패스워드 암호화
        const { encryptPassword } = this.encryptPassword(idInfo.salt)
        // 아이디와 비밀번호로 계정찾기
        console.log(idInfo.salt)
        const memberInfo = await this.findMember(encryptPassword)
        if (memberInfo === null) {
            throw new Error("로그인 정보가 없습니다.")
        } else {
            return { userId : idInfo.user_id, nickname : idInfo.nickname }
        }
    }

    async registerProcess() {
        const findIdResult = await this.findId()
        const findNickResult = await this.findNickname()
        if (findIdResult !== null) { // 아이디가 존재하는 경우
            throw new Error("이미 사용중인 아이디 입니다.")
        }
        if (findNickResult !== null) { // 닉네임이 존재하는 경우
            throw new Error("이미 사용중인 닉네임 입니다.")
        }
         
        const { encryptPassword, salt } = await this.encryptPassword()
        // eslint-disable-next-line no-unused-vars
        const registerResult = await member.create({
            user_id : this.userId,
            password : encryptPassword,
            nickname : this.nickname,
            salt
        })
        return registerResult
    }

    
    
    async findId() {
        const findInfo = await member.findOne({
            where : {
                user_id : this.userId
            }
        })
        if (findInfo === null) {
            return null
        }
        return findInfo.toJSON()        
    }
    
    async findNickname() {
        const findInfo = await member.findOne({
            where : {
                nickname : this.nickname
            }
        })
        if (findInfo === null) {
            return null
        }
        return findInfo.toJSON()        
    }

    async findMember(password) {
        const findInfo = await member.findOne({
            where : {
                user_id : this.userId,
                password
            }
        })
        if (findInfo === null) {
            return null
        }
        return findInfo.toJSON()
    }
}


module.exports = memberController