var Step = function(options) {
	if (typeof options == "string") options = {label: options};

	this.label = options.label;
	this.timings = {
		start: Date.now()
	};
	this.steps = [];
};

Step.prototype = {
	start: function(label) {
		var step = new Step({
			label: label
		});

		this.steps.push(step);
		return step;
	},

	stop: function() {
		this.timings.end = Date.now();
		this.timings.duration = this.timings.end - this.timings.start;
		return this;
	},

	toJSON: function() {
		return {
			label: this.label,
			timings: this.timings,
			steps: this.steps.map(function (step) {
				return step.toJSON();
			})
		};
	}
};

module.exports = Step;