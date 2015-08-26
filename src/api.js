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

const parseText = text => {
	return {
		status: text.substr(0, 1),
		date: text.substr(2, 10),
		time: text.substr(13, 5),
		message: text.substr(19),
	}
}

export const getFaked = async () => [
	['api', [
		parseText("g 2015-08-26T00:00 No known issues"),
		parseText("a 2015-08-25T13:04 Ok, slowly coming back online.."),
		parseText("r 2015-08-25T13:01 Ah, so _that's_ what a load balancer's for!"),
		parseText("g 2015-08-25T00:00 Celebrating 10 days without downtime :D"),
	]],
	['web', [
		parseText("g 2015-08-26 18:55 We're back! So sorry!!"),
		parseText("r 2015-08-26 18:29 Oops, unplugged the wrong cable! Waiting for the building to power cycle..."),
		parseText("a 2015-08-26 18:23 **Investigating** Having some issues with something!"),
	]],
]

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

	return all
}
