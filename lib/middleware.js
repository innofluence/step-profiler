var Profiler = require('./profiler');

module.exports = function (options) {
	return function (req, res, next) {
		var profiler = new Profiler(options),
			proxy = res.end,
			pRequest = profiler.start(req.url);

		req.profiler = pRequest;

		res.end = function () {
			pRequest.stop();

			//console.log(req.url);
			//console.log(JSON.stringify(profiler, null, '  '));
			proxy.apply(this, arguments);
		};

		next();
	};
};