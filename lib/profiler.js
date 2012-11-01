"use strict";

var Step = require('./step');

var Profiler = function(options) {
	this.options = options || {};

	if (this.options.disabled === undefined) this.options.disabled = false;
	if (typeof this.options.disabled === 'function') this.options._disabled = this.options.disabled;
	
	this.stepTypes = ['default'];
	if (options.stepTypes && options.stepTypes.length) {
		this.addStepTypes.apply(this, options.stepTypes);
	}

	this.steps = [];
};

Profiler.prototype = {
	start: function(label, type) {
		var step = new Step({
			type: type || 'default',
			label: label,
			disabled: this.disabled.bind(this)
		});

		this.steps.push(step);
		return step;
	},

	addStepTypes: function() {
		Array.prototype.forEach.call(arguments, function(type) {
			this.stepTypes.push(type);
			this['start'+type.charAt(0).toUpperCase()+type.slice(1)] = function(label) {
				return this.start(label, type);
			}.bind(this);
			Step.prototype['start'+type.charAt(0).toUpperCase()+type.slice(1)] = function(label) {
				return Step.prototype.start.call(this, label, type);
			};
		}.bind(this));
	},

	toJSON: function() {
		var types = {};

		this.stepTypes.forEach(function (type) {
			types[type] = {
				timing: 0,
				count: 0
			};
		});

		var collect = function(step) {
			if (step.steps) step.steps.forEach(function (step) {
				types[step.type].timing += step.timings.duration;
				types[step.type].count++;
				collect(step);
			});
		};
		collect(this);

		return {
			types: types,
			steps: this.steps.map(function (step) {
				return step.toJSON();
			})
		};
	},

	disabled: function() {
		if (this.options._disabled) {
			this.options.disabled = this.options._disabled(this.options.req, this.options.res);
		}

		return this.options.disabled;
	}
};

module.exports = Profiler;