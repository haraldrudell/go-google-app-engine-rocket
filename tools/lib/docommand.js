/*
© 2016-present Harald Rudell <c@haraldrudell.com> (http://haraldrudell.com)
All rights reserved.

This source code is licensed under the ISC-style license found in the
LICENSE file in the root directory of this source tree.
 */
import {spawn} from 'child_process'
import {default as whichCb} from 'which'
import bluebird from 'bluebird'

/*
Execute a command as binary file or via shell
executable: shell command or absolute filename to executable file
args: command arguments: optional string or array of string
opts: optional object mofidying arguments to child_process.spawn
- default: {shell: true, stdio: 'inherit'}
*/
export async function doCommand(executable, args, opts) {
  await new Promise((resolve, reject) => {
    if (args && !Array.isArray(args)) args = [args]
    const printable = executable + (Array.isArray(args) ?
      ' ' + args.join(' ') :
      '')
    console.log(printable)
    let options = {shell: true, stdio: 'inherit'}
    if (opts) Object.assign(options, opts)
    spawn(executable, args, options)
      .once('close', code => !code ?
        resolve() :
        reject(new Error(`status code: ${code} ${printable}`))
      )
  })
}

export const which = bluebird.promisify(whichCb)
