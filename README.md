step-profiler
=============

Javascript step profiler



## Uses
* Seperately, using the ``.profiler`` 
* As middleware in an Express.js application.

When used as middleware the profiler automatically times each function in a route. When request. ``end/send/json`` is called the middleware intercepts the response and calls the ``onResponse`` function to allow you to modify the request and attach profiling data.


## Options:
* disabled: a bool or a function returning a bool. Determines whether profiling is enabled, i.e. if you only want to enable it in development
* onResponse: a function that is called right before the response is sent to the user. See below for details


# onResponse(response: string, profiler, [callback: function(response: string))])
This function is called for each response. It is called after data has been converted to a string in order to send it to the user, so if you want to access, modify or add properties you will need to call ``JSON.parse`` first. Note that this function is called for all request, also those that fail, so if the user accesses a route that does not exist so the response could also be "could not GET /blalblaa". Remember that check that the content-type is actually JSON before you ``JSON.parse``! The function is called with res and req as its context, so a simple implementation that attaches profiling data to a response could look like this:
``javascript
	app.use(profiler.middleware({disabled: function() {
		return app.get('environment') == 'production';
	}, onResponse: function (response, profiling) {
		if (this.res.get('Content-Type') && this.res.get('Content-Type').indexOf('json') !== -1) {
			response = JSON.parse(response);
			if (!response.result) response = {result: response};
			response.profiling = profiling;
			response = JSON.stringify(response);
		}
	}}));
``

The function also takes an optional callback. If a third parameter is declared, the server will not respond before this callback is called! This is useful if you need to do async work, i.e. ensuring that logging data has been saved to persistent storage before responding to the client. The callback must be called with a string - that is if you parse the response, you WILL need to ``JSON.stringify`` it before calling the callback.