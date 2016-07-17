/*
© 2016-present Harald Rudell <c@haraldrudell.com> (http://haraldrudell.com)
All rights reserved.

This source code is licensed under the ISC-style license found in the
LICENSE file in the root directory of this source tree.
 */
import {doCommand, which} from './docommand'

export class MakeDoer {
  constructor(absGoPath) {
    this.env = Object.assign({}, process.env, {GOPATH: absGoPath})
    this.cwd = path.join(absGoPath, 'src')
    this.ensureMake = this.ensureMake.bind(this)
    this.installMake = this.installMake.bind(this)
    this.make = this.make.bind(this)
  }

  async ensureMake() {
    if (this.go) {
      let go = await which('go').catch(reason => {
        if (reason instanceof Error) {
          if (reason.code === 'ENOENT') return null // go is not on the PATH
          else throw reason // something failed
        } else throw new Error(`Reason not Error: ${util.format(reason)}`)
      })
      this.go = go || await this.installMake()
    }
  }

  async installMake() {
    await doCommand('sudo', ['apt-get', 'install', '--yes', 'build-essential'])
    return await which('make')
  }

  async make(args) {
    await doCommand('make', args, {env: this.env, cwd: this.cwd})
  }
}
