/*
© 2016-present Harald Rudell <c@haraldrudell.com> (http://haraldrudell.com)
All rights reserved.

This source code is licensed under the ISC-style license found in the
LICENSE file in the root directory of this source tree.
 */
import {doCommand, which} from './docommand'
import path from 'path'
import fs from 'fs'
import util from 'util'

export class GoDoer {
  constructor(goDirectory) {
    this.goDirectory = goDirectory
    this.goPath = goDirectory
    this.cwd = path.join(absGoPath, 'src')
    this.env = Object.assign({}, process.env, {GOPATH: this.goPath})
    this.ensureGo = this.ensureGo.bind(this)
    this.installGo = this.installGo.bind(this)
  }

  async ensureGo() {
    if (this.go) {
      let go = await which('go').catch(reason => {
        if (reason instanceof Error) {
          if (reason.code === 'ENOENT') return null // go is not on the PATH
          else throw reason // something failed
        } else throw new Error(`Reason not Error: ${util.format(reason)}`)
      })
      this.go = go || await this.installGo()
    }
  }

  async installGo() {
    await doCommand('sudo', ['apt-get', 'install', '--yes', 'golang-go'])
    return await which('go')
  }

  async ensurePackage(packageName) {
    const packagePath = path.join(this.goDirectory, 'src', packageName)
    const isInstalled = await new Promise(resolve => {
        fs.access(packagePath, err => resolve(!err))
      })

      if (!isInstalled) {
        await doCommand(go, ['get', packageName], {env: this.env})
      }
    }

  async restore() {
    const srlt = path.join(this.goDirectory, 'bin', 'srlt')
    await doCommand(srlt, ['restore'], {env: this.env})
  }

  _getGoPath() {
    return [this.goDirectory]
      .concat(
        process.env.PATH.split(':').filter(dir => dir[0] !== '.')
      ).join(':')
  }
}
