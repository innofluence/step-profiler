var Profiler = require('./profiler');

module.exports = function (options) {
	return function (req, res, next) {
		var profiler = new Profiler(options),
			proxy = res.end,
			pRequest = profiler.start(req.url);

		req.profiler = profiler;

		res.end = function () {
			pRequest.stop();

			console.log(profiler.toJSON());
			proxy.apply(this, arguments);
		};

		next();
	};
};