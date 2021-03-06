var React = require('react');

module.exports = React.createClass({
	handleMouseDown (event) {
		event.preventDefault();
		event.stopPropagation();
		this.props.onSelect(this.props.option, event);
	},
	handleMouseEnter (event) {
		this.props.onFocus(this.props.option, event);
	},
	handleMouseMove (event) {
		if (this.props.isFocused) return;
		this.props.onFocus(this.props.option, event);
	},
	render () {
		return (
			<div
			className={this.props.className}
			onMouseDown={this.handleMouseDown}
			onMouseEnter={this.handleMouseEnter}
			onMouseMove={this.handleMouseMove}
			title={this.props.option.title}>
				<h4><strong>{this.props.option.location.get('name')}</strong></h4>
				{this.props.option.location.get('address') + ', '}
				{this.props.option.location.get('city') + ', '}
				{this.props.option.location.get('state') + ' '}
				{this.props.option.location.get('zipcode')}
			</div>
		);
	}
})
