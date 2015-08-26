# StatusBoard

Built by [@danharper7](https://twitter.com/danharper7), designed by [@_ewp](http://twitter.com/_ewp)

Keep your status messages in a public GitHub repo, as text files. One text file per app. Then this web app will fetch and display them.

![Preview](https://i.imgur.com/pktRvSa.png)

e.g. in the [`danharper/status`](https://github.com/danharper/status/tree/master/statuses) repo there's two text files (one for web, one for api). Each text file looks like this, with one status report per line:

    a 2015-08-26T22:03 Ed's doing CSS. We're bumping to amber _just as a precation_!
    g 2015-08-26T00:00 No known issues
    a 2015-08-25T13:04 Ok, slowly coming back online..
    r 2015-08-25T13:01 Ah, so _that's_ what a load balancer's for!
    g 2015-08-25T00:00 Celebrating 10 days without downtime :D

Start your report with the status code

> `g` for green (operational)
> `a` for amber (minor alert)
> `r` for red (major alert)

Then the datetime in ISO8601 format. Followed by the message. The message supports markdown if you want to emphasise just how _sorry_ you are for fucking shit up.

I mentioned there's one file per "app" to report the status of. I've told you this, but I forgot to tell Ed this until he had designed it... 😬 So the app only shows the report of one app (for now?)

> **NOTE** The current live preview is serving up a hard-coded list, but the API integration is fully operational. Just uncomment the call to `await getReal()` in `src/init.js`

#### Development

```
npm install
jspm install
```

Then just start up a server in the current directory.

The `gh-pages` branch also has the source all compiled and bundled. That was done with `jspm bundle-sfx src/index.js`.