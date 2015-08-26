import React, { Component } from 'react'
import R from 'ramda'
import md2html from './md2html'
import { getFaked, getReal } from './api'

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
	// appStatuses = await getReal()

	const groupedLists = appStatuses.reduce((carry, [app, statuses]) => {
		carry[app] = R.groupBy(s => s.date, statuses)
		return carry
	}, {})

	React.render(<App lists={groupedLists} />, document.getElementById('main'))

}
