import R from 'ramda'
const GITHUB_API = 'https://api.github.com'
const REPO = 'danharper/status'

const api = async path => {
	const response = await fetch(GITHUB_API+'/repos/'+REPO+'/contents/'+path, {
		headers: {
			'Accept': 'application/vnd.github.v3+json',
			'Authorization': 'token 86fe53cb8474d8104a8d4b51cefc1e54f7d24e32',
		},
	})

	return await response.json()
}

const groupedLists = appStatuses => appStatuses.reduce((carry, [app, statuses]) => {
	carry[app] = R.groupBy(s => s.date, statuses)
	return carry
}, {})

const parseText = text => {
	return {
		status: text.substr(0, 1),
		date: text.substr(2, 10),
		time: text.substr(13, 5),
		message: text.substr(19),
	}
}

export const getFaked = async () => groupedLists([
	['api', [
		parseText("g 2015-08-27T00:00 All systems are GO!"),
		parseText("g 2015-08-26T18:55 We're back! So sorry!!"),
		parseText("r 2015-08-26T18:29 Oops, unplugged the wrong cable! Waiting for the building to power cycle..."),
		parseText("a 2015-08-26T18:23 **Investigating** Having some issues with something! We think it's a DDOS, those darn [cyber criminals](http://www.smeadvisor.com/wp-content/uploads/2012/08/cyber-crime.jpg)!"),
		parseText("g 2015-08-25T13:12 That was embarassing. Well, I guess you don't learn until you press `Terminate` in AWS 😆 💩"),
		parseText("a 2015-08-25T13:04 Ok, slowly coming back online.."),
		parseText("r 2015-08-25T13:01 Ah, so _that's_ what a load balancer's for!"),
		parseText("g 2015-08-25T00:00 Celebrating 3 days without downtime :D"),
		parseText("g 2015-08-24T00:00 Fully Operational"),
		parseText("g 2015-08-23T00:00 Fully Operational"),
		parseText("g 2015-08-22T00:00 Fully Operational"),
		parseText("g 2015-08-21T17:20 Normal running has resumed"),
		parseText("a 2015-08-21T16:20 I swear I look away for _one_ second!"),
	]],
	['web', [
		parseText("g 2015-08-26T18:55 We're back! So sorry!!"),
		parseText("r 2015-08-26T18:29 Oops, unplugged the wrong cable! Waiting for the building to power cycle..."),
		parseText("a 2015-08-26T18:23 **Investigating** Having some issues with something!"),
	]],
])

const parseContent = content => atob(content)
	.split('\n')
	.filter(s => s.trim().length)
	.map(parseText)

export const getReal = async () => {
	const apps = await api('statuses')

	console.log(apps)

	const appStatuses = await* apps.map(async app => await api(app.path))

	console.log(appStatuses)

	const fileNames = apps.map(app => {
		const [name] = app.name.split('.')
		return name
	})

	console.log(fileNames)

	const all = fileNames.reduce((carry, name, i) => {
		const statuses = parseContent(appStatuses[i].content)
		carry.push([name, statuses])
		return carry
	}, [])

	console.log(all)

	return groupedLists(all)
}
