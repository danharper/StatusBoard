import React, { Component } from 'react'
import md2html from './md2html'
import { getFaked, getReal } from './api'
import { english as ordinal } from 'ordinal'
import months from 'months'

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

const mostRecentStatus = datedStatuses => {
	const mostRecentDate = Object.keys(datedStatuses).reduce((carry, date) => date > carry ? date : carry, '')
	return datedStatuses[mostRecentDate][0]
}

class AppStatuses extends Component {
	render() {
		const { name, statuses } = this.props
		return (
			<div>
				<AppName name={name} currentStatus={mostRecentStatus(statuses)} />
				<div className="status__wrapper">
					{map(statuses, (statuses, date, i) => (
						<div className="date" key={i}>
							<h1 className="date__title"><NiceDate date={date} /></h1>
							<List key={i} list={statuses} />
						</div>
					))}
				</div>
			</div>
		)
	}
}

class NiceDate extends Component {
	render() {
		const date = new Date(this.props.date)
		return (
			<span>{months[date.getMonth()]} {ordinal(date.getDate())}, {date.getFullYear()}</span>
		)
	}
}

const STATUS_CLASSES = new Map([
	['g', 'status--good'],
	['a', 'status--minor'],
	['r', 'status--major'],
])

const statusClass = ({status}, yourClass = '') => yourClass + ' ' + STATUS_CLASSES.get(status)

const STATUS_HERO_MESSAGES = new Map([
	['g', 'All Systems Operational'],
	['a', 'Minor System Outage'],
	['r', 'Major System Outage'],
])

const statusMessage = ({status}) => STATUS_HERO_MESSAGES.get(status)

class AppName extends Component {
	render() {
		const { name, currentStatus } = this.props
		return (
			<div className={statusClass(currentStatus, 'status__hero')}>
				{statusMessage(currentStatus)}
			</div>
		)
	}
}

class List extends Component {
	render() {
		return (
			<ul className="status__list">
				{this.props.list.map((status, i) => (
					<Item key={i} status={status} />
				))}
			</ul>
		)
	}
}

class Item extends Component {
	render() {
		const { status } = this.props
		return (
			<li className={statusClass(status, 'status__list__item')}>
				<div className="item__timestamp">
					<div className="item__timestamp__slug">{status.time}</div>
				</div>
				<div className="item__message">
					<Markdown content={status.message} />
				</div>
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

	appStatuses = { api: appStatuses.api } // one app only, forgot to tell the designer i have multiple apps...

	React.render(<Root lists={appStatuses} />, document.getElementById('main'))
}
