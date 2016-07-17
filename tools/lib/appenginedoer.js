/*
© 2016-present Harald Rudell <c@haraldrudell.com> (http://haraldrudell.com)
All rights reserved.

This source code is licensed under the ISC-style license found in the
LICENSE file in the root directory of this source tree.
 */
import {doCommand, which} from './docommand'
import fs from 'fs'
import https from 'https'
import os from 'os'
import path from 'path'
import unzip from 'unzip'
import xml2js from 'xml2js'

export class AppEngineDoer {
  constructor() {
    this.ensureSdk = this.ensureSdk.bind(this)
    this.findSdkUrl = this.findSdkUrl.bind(this)
    this.installSdk = this.installSdk.bind(this)
    this.runSdk = this.runSdk.bind(this)
  }

  async ensureSdk() {
    if (!this.appcfg) {

      // check if in PATH
      let appcfg = await which('appcfg.py').catch(reason => {
        if (reason instanceof Error) {
          if (reason.code === 'ENOENT') return null // go is not on the PATH
          else throw reason // something failed
        } else throw new Error(`Reason not Error: ${util.format(reason)}`)
      })
      this.isInPath = !!appcfg
      if (appcfg) this.appcfg = appcfg

      // check if installed but not in path
      if (!appcfg) {
        appcfg = path.join(os.homedir(), 'go_appengine', 'appcfg.py')
        if (await new Promise(resolve => {
            fs.access(appcfg, err => resolve(!err))
          }))
          this.appcfg = appcfg
      }

      // install
      if (!this.appcfg) {
  	    const zipUrl = await this.findSdkUrl()
        await this.installSdk(zipUrl)
        if (await new Promise(resolve => {
            fs.access(appcfg, err => resolve(!err))
          }))
          this.appcfg = appcfg
        else throw new Error('Install App Engine sdk failed')
      }
    }
  }

  async findSdkUrl() {
    let zipUrl = await new Promise((resolve, reject) => {
      console.log('finding Google App Engine sdks…')
      const url = 'https://storage.googleapis.com/appengine-sdks'
      const parser = new xml2js.Parser()
        .once('end', object => {
          const list = object.ListBucketResult && object.ListBucketResult.Contents
          const isCurrent = 'featured'
          const isOS = process.platform === 'darwin' ? '_darwin_' :
            /^win/.test(process.platform) ? '_windows_' :  '_linux_'
          const isArch = process.arch === 'ia32' ? '_386-' : 'amd64'
          let lastModified, key
          if (Array.isArray(list)) {
            list.forEach(o => {
              let aKey = o.Key && o.Key[0]
              if (typeof aKey === 'string' &&
                ~aKey.indexOf(isCurrent) &&
                ~aKey.indexOf(isOS) &&
                ~aKey.indexOf(isArch)) {
                  let aLastModified = o.LastModified && o.LastModified[0]
                  if (typeof aLastModified === 'string' &&
                    (!lastModified || aLastModified > lastModified)) {
                    lastModified = aLastModified
                    key = aKey
                  }
              }
            })
          }
          if (key) resolve(url + '/' + key)
          else reject(new Error('Failed to find Google App Engine sdk url'))
        })
      https.get(url, res => {
        if (res.statusCode === 200) {
          let data = []
          res.on('data', chunk => data.push(chunk))
            .once('end', () => parser.parseString(Buffer.concat(data).toString()))
        } else reject(new Error(`status code: ${res.statusCode} url: ${url}`))
      })
    })
    return zipUrl
  }

  async installSdk(url) {
    console.log(`Downloading: ${url}… `)
    const tmpfile = path.join(os.tmpdir(), path.basename(url))
    await new Promise((resolve, reject) => {
      https.get(url, res => {
        if (res.statusCode === 200) {
          res.pipe(fs.createWriteStream(tmpfile)
            .once('finish', () => resolve()))
        } else reject(new Error(`status code: ${res.statusCode} url: ${url}`))
      })
    })

    console.log('Extracting… ')
    await doCommand('unzip', [tmpfile], {cwd: os.homedir()})
  }

  async runSdk(args) {
    await doCommand(this.appcfg, args)
  }
}
