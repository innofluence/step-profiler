"use strict";

var Step = require('./step');

var Profiler = function(options) {
	this.options = options || {};

	if (this.options.disabled === undefined) this.options.disabled = false;
	if (typeof this.options.disabled === 'function') this.options.disabled = this.options.disabled();
	this.steps = [];
};

Profiler.prototype = {
	start: function(label) {
		var step = new Step({
			label: label,
			disabled: this.options.disabled
		});

		this.steps.push(step);
		return step;
	},

	toJSON: function() {
		return {
			steps: this.steps.map(function (step) {
				return step.toJSON();
			})
		};
	}
};

module.exports = Profiler;