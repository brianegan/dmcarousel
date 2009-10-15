;(function($) {
// Creates a pretty carousel (slideshow)
$.fn.dmCarousel = function(options) {
  var opts = $.extend({}, $.fn.dmCarousel.defaults, options);

  return this.each(function() {
      var $this = $(this),

      // Support for the Metadata Plugin.
      o = $.meta ? $.extend({}, opts, $this.data()) : opts,
      carouselJSON = JSON.parse('{"query":{"collections":["\/snv"]},"resultsPage":1,"resultsPerPage":20,"numPages":83,"onThisPage":20,"total":1650,"results":[{"alias":"\/snv","ptr":"6290"},{"alias":"\/snv","ptr":"4868"},{"alias":"\/snv","ptr":"2678"},{"alias":"\/snv","ptr":"4838"},{"alias":"\/snv","ptr":"4827"},{"alias":"\/snv","ptr":"4731"},{"alias":"\/snv","ptr":"4834"},{"alias":"\/snv","ptr":"4729"},{"alias":"\/snv","ptr":"4812"},{"alias":"\/snv","ptr":"6603"},{"alias":"\/snv","ptr":"2539"},{"alias":"\/snv","ptr":"1173"},{"alias":"\/snv","ptr":"1321"},{"alias":"\/snv","ptr":"1313"},{"alias":"\/snv","ptr":"2561"},{"alias":"\/snv","ptr":"9"},{"alias":"\/snv","ptr":"204"},{"alias":"\/snv","ptr":"215"},{"alias":"\/snv","ptr":"130"},{"alias":"\/snv","ptr":"230"}],"querySeconds":0.39331,"version":"1.0"}');
      
      alert(carouselJSON.results[0].alias);
      
      
      
  });

  // private function for debugging
  function debug($obj) {
      if (window.console && window.console.log) {
          window.console.log($obj);
      }
  }
};

// default options
$.fn.dmCarousel.defaults = {
  carouselUrl: "/Users/brian/Sites/dmcarousel/sampleJson.txt",
  rotationTime: 5000,
  maxWidth: $(window).width(),
  maxHeight: $(window).height()
};

})(jQuery);