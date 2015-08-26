import React, { Component } from 'react'
import R from 'ramda'
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
		{ status: "g", date: "2015-08-26", time: "00:00", message: "No known issues" },
		{ status: "a", date: "2015-08-25", time: "13:04", message: "Ok, slowly coming back online.." },
		{ status: "r", date: "2015-08-25", time: "13:01", message: "Ah, so _that's_ what a load balancer's for!" },
		{ status: "g", date: "2015-08-25", time: "00:00", message: "Celebrating 10 days without downtime :D" },
	]],
	['web', [
		{ status: "g", date: "2015-08-26", time: "18:55", message: "We're back! So sorry!!" },
		{ status: "r", date: "2015-08-26", time: "18:29", message: "Oops, unplugged the wrong cable! Waiting for the building to power cycle..." },
		{ status: "a", date: "2015-08-26", time: "18:23", *message: "*Invesitgating** Having some issues with something!" },
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
		const date = text.substr(2, 10)
		const time = text.substr(13, 5)
		const message = text.substr(19)
		return {status, date, time, message}
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
		const { lists } = this.props
		return (
			<div>
				{Object.keys(lists).map((appName, i) => {
					const statusesByDate = lists[appName]
					return (
						<div key={i}>
							<h3>{appName}</h3>
							{Object.keys(statusesByDate).map((date, i) => {
								const statuses = statusesByDate[date]
								return (
									<div key={i}>
										<h4>{date}</h4>
										<List list={statuses} />
									</div>
								)
							})}
						</div>
					)
				})}
			</div>
		)
	}
}

class List extends Component {
	render() {
		return (
			<ul>
				{this.props.list.map(({status, time, message}, i) => (
					<Item key={i} status={status} time={time} message={message} />
				))}
			</ul>
		)
	}
}

const COLOURS = new Map([
	['g', 'green'],
	['a', 'orange'],
	['r', 'red'],
])

class Item extends Component {
	render() {
		return <li className="status-item" style={{ color: COLOURS.get(this.props.status) }}>{this.props.time} <Markdown content={this.props.message} /></li>
	}
}

class Markdown extends Component {
	render() {
		return <span className="contains-markdown" dangerouslySetInnerHTML={{ __html: md2html(this.props.content) }} />
	}
}

export default async function main() {
	var appStatuses;
	appStatuses = await getFaked()
	appStatuses = await getReal()

	const groupedLists = appStatuses.reduce((carry, [app, statuses]) => {
		carry[app] = R.groupBy(s => s.date, statuses)
		return carry
	}, {})

	React.render(<App lists={groupedLists} />, document.getElementById('main'))

}
