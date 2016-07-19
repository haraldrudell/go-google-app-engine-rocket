<h1 align=center>
  ReactJS on Google App Engine Free Tier
</h1>
Written by <a href=http://haraldrudell.com >Harald Rudell</a>

><dl>
  <dt>One-liner install and run on Linux, press control+c to exit:</dt>
  <dd>git clone --depth 1 https://github.com/haraldrudell/go-google-app-engine-rocket.git && cd go-google-app-engine-rocket && npm install && npm start</dd>
</dl>

<h2>Benefits</h2>
- **Free** as in beer
- **ReactJS** can run modular view components single-page applications
- **Free** on Google App Engine GAE [Standard environment](https://cloud.google.com/appengine/docs/about-the-standard-environment})
- **Deploy-Ready** builds on localhost to deployable state as of 16-07-19
- **TODO** Self-deploy to App Engine using `npm run deploy`
- **Free** as in beer

<h2>The Freeness of Free</h2>
- **Lofty Quota Allowances** in abundace: [resource quotas](https://cloud.google.com/appengine/docs/quotas#Resources) Keyword is “Free.”
- **Daily Replenish** of resources at midnight Pacific time
- **No Charge Ever** on quota depletion app gives status code 403/503 https://cloud.google.com/appengine/docs/quotas#When_a_Resource_is_Depleted
- **No Credit Card** though if you take a risk and enable billing on your Google Account, some free limits are increased, too.
- **Safety Limits** some per-minute event rate limits. Don’t hack the Google.

<h2>Features</h2>
- **ECMAScript 2016/stage-0** the latest language version
- **Runtime is Go** that unlike ECMAScript is supported by the Free Tier of Google App Engine
- **Built-in Transpile** from ECMAScript 2016/stage-0 to ECMAScript 5.1 that is runnable on the Go JavaScript implementation
- **Environment** for build is Ubuntu 16.04 amd64, otherwise mileage may vary
- **Free** as in beer

© 2016 <a href=http://haraldrudell.com >Harald Rudell</a> ISC [License](LICENSE)
