import React, { Component } from 'react'
import md2html from './md2html'
import { getFaked, getReal } from './api'

const map = (obj, fn) => Object.keys(obj).map((key, i) => fn(obj[key], key, i))

const COLOURS = new Map([
	['g', 'green'],
	['a', 'orange'],
	['r', 'red'],
])

class Root extends Component {
	render() {
		/**
		 * {
		 * 	api: {
		 * 		'2015-08-26': [
		 * 			{ status: 'r', time: '22:29', message: '**ARGH!!** Fuck it all...' },
		 * 			{ status: 'g', time: '22:20', message: 'All good now' },
		 * 		]
		 * 	},
		 * 	web: {
		 * 		'2015-08-26': [
		 * 			{ status: 'g', time: '00:00', message: 'All good' },
		 * 		]
		 * 	}
		 * }
		 */
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

class AppStatuses extends Component {
	render() {
		const { name, statuses } = this.props
		return (
			<div>
				<h3>{name}</h3>
				{map(statuses, (statuses, date, i) => (
					<div>
						<h4>{date}</h4>
						<List key={i} list={statuses} />
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
				{this.props.list.map(({status, time, message}, i) => (
					<Item key={i} status={status} time={time} message={message} />
				))}
			</ul>
		)
	}
}

class Item extends Component {
	render() {
		return (
			<li className="status-item" style={{ color: COLOURS.get(this.props.status) }}>
				{this.props.time} <Markdown content={this.props.message} />
			</li>
		)
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

	React.render(<Root lists={appStatuses} />, document.getElementById('main'))
}
