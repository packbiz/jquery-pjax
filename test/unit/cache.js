
suite("Cache", function () {
  this.timeout(5000);

  test("enable", function (done) {
    var query = '?jquery=' + env.jquery + '&test=cache-enable.js';

    var iframe = $('<iframe/>', { 'class': "fixture" }).width(1024).height(960).appendTo('body')[0];
    var url = iframe.src = (window.__karma__ ? "/base/test/" : "./") + "fixture/index.html" + query;

    iframe.onload = function () {
      iframe.onload = null;
      var window, document, $, defer;

      self.$.Deferred().resolve()
      .pipe(function () {
        window = iframe.contentWindow;
        document = window.document;
        $ = window.$;

        defer = self.$.Deferred();
        window.$(window).one('pjax:load', function () { setTimeout(defer.resolve, 0); });
        window.$('#secondary a:eq(1)', document).each(function () { url = this.href; }).click();

        return defer;
      })
      .pipe(function () {
        $.pjax.removeCache();

        defer = self.$.Deferred();
        window.$(window).one('pjax:load', function () { setTimeout(defer.resolve, 0); });
        window.history.back();

        return defer;
      })
      .pipe(function () {
        defer = self.$.Deferred();
        window.$(window).one('pjax:load', function () { setTimeout(defer.resolve, 0); });
        window.history.forward();

        return defer;
      })
      .pipe(function () {
        done();
      });
    };
  });

});
