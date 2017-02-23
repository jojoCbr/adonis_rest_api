'use strict'

const User = use('App/Model/User')
const Hash = use('Hash')

class RegisterController {
    * index(request, response) {
        response.status(405).json({ msg: 'Method Not Allowed'})
    }

    * doRegister(request, response) {
      const exists = yield User.findBy('email', request.input('email'))

      if (!exists) {
        const user = new User()
        user.username = request.input('name')
        user.email = request.input('email')
        user.telephone = request.input('phone')
        user.password = yield Hash.make(request.input('password'))

        let resp = yield user.save()

        if (resp) {
          var registerMessage = {
              success: 'Registration Successful! Now go ahead and login',
              creation: user
          }

          yield response.status(200).json(registerMessage)

        } else {
          yield response.status(500)
        }
      } else {
        yield response.status(409).json({ error: "User already exist"})
      }
    }
}

module.exports = RegisterController
