"use strict";

var Profiler = require('./profiler');

module.exports = function (options) {
	return function (req, res, next) {
		options.req = req;
		options.res = res;
		var profiler = new Profiler(options),
			proxy = res.end,
			pRequest = profiler.start(req.url);

		req.profiler = pRequest;
		req.profiler.top = profiler;

		if (!profiler.disabled()) {
			res.end = function (response, encoding) {
				var self = this;
				var done = function(args) {
					proxy.apply(self, args);
				};

				pRequest.stop();

				if (options.onResponse && typeof options.onResponse === 'function') {
					if (options.onResponse.length === 3)  {
						// takes callback
						options.onResponse.call({req: req, res: res}, response, profiler, function (body) {
							res.set('Content-Length', Buffer.isBuffer(body) ? body.length : Buffer.byteLength(body)); // onResponse might change the content length
							done([body, encoding]);
						});	
					} else {
						options.onResponse.call({req: req, res: res}, response, profiler);
						done(arguments);
					}
				} else {
					done(arguments);
				}
			};	
		}
		
		next();
	};
};