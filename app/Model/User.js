'use strict'

const Lucid = use('Lucid')

class User extends Lucid {

  apiTokens () {
    return this.hasMany('App/Model/Token')
  }

  static get hidden () {
    return ['password']
  }
}

module.exports = User
