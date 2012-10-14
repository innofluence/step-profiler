var Step = require('./step');

var Profiler = function(options) {
	this.steps = [];
};

Profiler.prototype = {
	start: function(label) {
		var step = new Step({
			label: label
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