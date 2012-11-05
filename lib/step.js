"use strict";

var Step = function(options) {
	if (typeof options == "string") options = {label: options};

	this.options = options;
	this.label = options.label;
	this.type = options.type;

	if (!this.options.disabled()) {
		this.timings = {
			start: Date.now()
		};
	
		this.breakpoints = [];
	}
};

Step.prototype = {
	start: function(label, type) {
		if (!this.steps) this.steps = [];

		var step = new Step({
			label: label,
			type: type || 'default',
			disabled: this.options.disabled
		});

		this.steps.push(step);
		return step;
	},

	breakpoint: function(label) {
		if (!this.options.disabled()) {
			this.breakpoints.push({
				label: label,
				timing: Date.now() - this.timings.start
			});
		}
	},

	stop: function(duration) {
		if (!this.options.disabled()) {
			this.timings.end = Date.now();
			if (duration) this.timings.start = this.timings.end - duration;
			this.timings.duration = duration || (this.timings.end - this.timings.start);
		}
		return this;
	},

	toJSON: function() {
		return {
			label: this.label,
			type: this.type,
			timings: this.timings,
			breakpoints: this.breakpoints,
			steps: this.steps ? this.steps.map(function (step) {
				return step.toJSON();
			}) : null
		};
	}
};

module.exports = Step;