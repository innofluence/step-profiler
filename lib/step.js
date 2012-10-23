var Step = function(options) {
	if (typeof options == "string") options = {label: options};

	this.options = options;
	this.label = options.label;

	if (!this.options.disabled()) {
		this.timings = {
			start: Date.now()
		};
	
		this.breakpoints = [];
	}
};

Step.prototype = {
	start: function(label) {
		if (!this.steps) this.steps = [];

		var step = new Step({
			label: label,
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

	stop: function() {
		if (!this.options.disabled()) {
			this.timings.end = Date.now();
			this.timings.duration = this.timings.end - this.timings.start;
		}
		return this;
	},

	toJSON: function() {
		return {
			label: this.label,
			timings: this.timings,
			breakpoints: this.breakpoints,
			steps: this.steps ? this.steps.map(function (step) {
				return step.toJSON();
			}) : null
		};
	}
};

module.exports = Step;