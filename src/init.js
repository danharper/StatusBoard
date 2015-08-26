import React, { Component } from 'react'
import R from 'ramda'
import md2html from './md2html'
import { getFaked, getReal } from './api'

const map = (obj, fn) => Object.keys(obj).map((key, i) => fn(obj[key], key, i))

class AppStatuses extends Component {
	render() {
		const { name, statuses } = this.props
		return (
			<div>
				<h3>{name}</h3>
				{map(statuses, (statuses, date, i) => (
					<DatedStatuses key={i} date={date} statuses={statuses} />
				))}
			</div>
		)
	}
}

class DatedStatuses extends Component {
	render() {
		const { date, statuses } = this.props
		return (
			<div>
				<h4>{date}</h4>
				<List list={statuses} />
			</div>
		)
	}
}

class App extends Component {
	render() {
		const { lists } = this.props
		return (
			<div>
				{map(lists, (statuses, appName, i) => (
					<AppStatuses key={i} name={appName} statuses={lists[appName]} />
				))}
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
