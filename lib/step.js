var Step = function(options) {
	if (typeof options == "string") options = {label: options};

	this.label = options.label;
	this.start = Date.now();
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
		this.end = Date.now();
		this.duration = this.end - this.start;
		return this;
	},

	toJSON: function() {
		return {
			label: this.label,
			start: this.start,
			end: this.end,
			duration: this.duration,
			steps: this.steps.map(function (step) {
				return step.toJSON();
			})
		};
	}
};

module.exports = Step;