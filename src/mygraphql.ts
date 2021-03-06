'use strict'

import Config from './aws-exports'

export default class Mygraphql {
  public gql: any
  public client: any

  constructor() {
    // appsync client
    const config = new Config()
    global.WebSocket = require('ws')
    global.window = global.window || {
      setTimeout: setTimeout,
      clearTimeout: clearTimeout,
      WebSocket: global.WebSocket,
      ArrayBuffer: global.ArrayBuffer,
      addEventListener: function() {},
      navigator: { onLine: true }
    }
    global.localStorage = {
      store: {},
      getItem: function(key) {
        return this.store[key]
      },
      setItem: function(key, value) {
        this.store[key] = value
      },
      removeItem: function(key) {
        delete this.store[key]
      }
    }

    require('es6-promise').polyfill()
    require('isomorphic-fetch')

    const AUTH_TYPE = require('aws-appsync/lib/link/auth-link').AUTH_TYPE
    const AWSAppSyncClient = require('aws-appsync').default
    const url = config.ENDPOINT
    const region = config.REGION
    const type = AUTH_TYPE.AWS_IAM
    const AWS = require('aws-sdk')
    AWS.config.update({
      region: config.REGION,
      credentials: new AWS.Credentials({
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY
      })
    })
    const credentials = AWS.config.credentials
    this.gql = require('graphql-tag')
    this.client = new AWSAppSyncClient({
      url: url,
      region: region,
      auth: {
        type: type,
        credentials: credentials
      },
      disableOffline: true
    })
  }

  public mutate(mt: String) {
    return this.client.mutate({ mutation: this.gql(mt) })
  }
  public query(qr: String) {
    return this.client.query({ query: this.gql(qr) })
  }
  public subscription(sb: String) {
    return this.client.subscribe({ query: this.gql(sb) })
  }
}
