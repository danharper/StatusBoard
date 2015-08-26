import React, { Component } from 'react'
import md2html from './md2html'

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

const getFaked = async () => [
	['api', [
		["g", "2015-08-26T00:00", "No known issues"],
		["a", "2015-08-25T13:04", "Ok, slowly coming back online.."],
		["r", "2015-08-25T13:01", "Ah, so _that's_ what a load balancer's for!"],
		["g", "2015-08-25T00:00", "Celebrating 10 days without downtime :D"],
	]],
	['web', [
		["g", "2015-08-26T18:55", "We're back! So sorry!!"],
		["r", "2015-08-26T18:29", "Oops, unplugged the wrong cable! Waiting for the building to power cycle..."],
		["a", "2015-08-26T18:23", "**Invesitgating** Having some issues with something!"],
	]],
]

const getReal = async () => {
	const apps = await api('statuses')

	console.log(apps)

	const appStatuses = await* apps.map(async app => await api(app.path))

	console.log(appStatuses)

	const fileNames = apps.map(app => {
		const [name] = app.name.split('.')
		return name
	})

	console.log(fileNames)

	const parseText = text => {
		const status = text.substr(0, 1)
		const date = text.substr(2, 16)
		const message = text.substr(19)
		return [status, date, message]
	}

	const all = fileNames.reduce((carry, name, i) => {
		const statuses = atob(appStatuses[i].content).split('\n').filter(s => s.trim().length > 0).map(s => parseText(s))
		carry.push([name, statuses])
		return carry
	}, [])

	console.log(all)

	return all

}

class App extends Component {
	render() {
		return (
			<div>
				{this.props.lists.map(([type, statuses]) => (
					<div>
						<h4>{type}</h4>
						<List list={statuses} />
					</div>
				))}
			</div>
		)
	}
}

class List extends Component {
	render() {
		return (
			<ul>
				{this.props.list.map(([status, date, message]) => (
					<Item status={status} date={date} message={message} />
				))}
			</ul>
		)
	}
}

const COLOURS = new Map([
	['g', 'green'],
	['a', 'gold'],
	['r', 'red'],
])

class Item extends Component {
	render() {
		return <li className="status-item" style={{ color: COLOURS.get(this.props.status) }}>{this.props.date} <Markdown content={this.props.message} /></li>
	}
}

class Markdown extends Component {
	render() {
		return <span className="contains-markdown" dangerouslySetInnerHTML={{ __html: md2html(this.props.content) }} />
	}
}

export default async function main() {
	const appStatuses = await getReal()
	// const appStatuses = await getFaked()

	// const x = await api('statuses')

	// const file = await api(x[0].path)

	// const content = atob(file.content)
	const raw = '2015-08-26T18:23 **Invesitgating** Having some issues with something!'

	const time = raw.substr(0, 16)
	const text = raw.substr(17)

	console.log(text, '@', time)
	console.log(time)
	console.log(md2html(text))

	console.warn(React)

	React.render(<App lists={appStatuses} />, document.getElementById('main'))

}
