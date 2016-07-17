/*
© 2016-present Harald Rudell <c@haraldrudell.com> (http://haraldrudell.com)
All rights reserved.

This source code is licensed under the ISC-style license found in the
LICENSE file in the root directory of this source tree.
 */
import {doCommand, which} from './docommand'
import path from 'path'
import util from 'util'

export class MakeDoer {
  constructor(paths) {
    this.spawnOpts = {
      env: Object.assign({}, process.env, {GOPATH: paths.GOPATH, PORT: paths.PORT}),
      cwd: paths.goSource,
    }
    this.ensureMake = this.ensureMake.bind(this)
    this.installMake = this.installMake.bind(this)
    this.make = this.make.bind(this)
  }

  async ensureMake() {
    const hasMake = await which('make').catch(reason => {
      if (reason instanceof Error) {
        if (reason.code === 'ENOENT') return null // go is not on the PATH
        else throw reason // something failed
      } else throw new Error(`Reason not Error: ${util.format(reason)}`)
    })
    if (!hasMake) await this.installMake()
  }

  async installMake() {
    await doCommand('sudo', ['apt-get', 'install', '--yes', 'build-essential'])
  }

  async make(args) {
console.log('cwd:', this.spawnOpts.cwd)
    await doCommand('pwd', args, this.spawnOpts)
    await doCommand('make', args, this.spawnOpts)
  }
}
