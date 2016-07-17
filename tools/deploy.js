/*
© 2016-present Harald Rudell <c@haraldrudell.com> (http://haraldrudell.com)
All rights reserved.

This source code is licensed under the ISC-style license found in the
LICENSE file in the root directory of this source tree.
 */
import {AppEngineDoer} from './lib/appenginedoer'
import path from 'path'

import run from './run';

async function deploy() {
  const appEngineDoer = new AppEngineDoer

  await appEngineDoer.ensureSdk()
  console.log(`Google App Engine sdk executable: ${appEngineDoer.appcfg}`)
  if (!appEngineDoer.isInPath) console.log(`Please add directory ${path.dirname(appEngineDoer.appcfg)} to PATH`)

  await appEngineDoer.runSdk(['backends', 'list'])
}

export default deploy;
