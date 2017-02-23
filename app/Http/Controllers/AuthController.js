'use strict'

const User = use('App/Model/User')
const Token = use('App/Model/Token')
const Hash = use('Hash')

class AuthController {
    * index(request, response) {
        yield response.sendView('login')
    }

    * login(request, response) {
      const checkForLogin = yield request.auth.check()
      if (!checkForLogin) {
        
        const user = yield User.findBy('email', request.input('email'))
        const loginMessage = {
            success: 'Logged-in Successfully!',
            error: 'Invalid Credentials'
        }

        if (user !== null) {
          const verify = yield Hash.verify(request.input('password'), user.password)
          if (verify) {
            const token = yield request.auth.generate(user)

            response.status(200).json({
              msg: loginMessage.success,
              token: token
            })
          } else {
            yield response.status(401).json({ error: loginMessage.error })
          }
        } else {
          yield response.status(401).json({ error: loginMessage.error })
        }
      } else {
        response.status(200).json({
          msg: "Already logged-in"
        })
      }
    }

    * logout(request, response) {
      const checkForLogin = yield request.auth.check()
      if (checkForLogin) {
        const token = request.header('Authorization')
        const tkBD = yield Token.findBy('token', token)

        yield request.auth.revoke(user, [token])
      } else {
        yield response.status(400).json({ error: "Bad Request" })
      }
    }
}

module.exports = AuthController
