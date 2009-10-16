;(function($) {
// Creates a pretty carousel (slideshow)
$.fn.dmCarousel = function(options) {
  var opts = $.extend({}, $.fn.dmCarousel.defaults, options);

  return this.each(function() {
      var $this = $(this),

      // Support for the Metadata Plugin.
      o = $.meta ? $.extend({}, opts, $this.data()) : opts,
      db = true,
      carousel = { slide: [] }, // = JSON.parse('{"query":{"collections":["\/snv"]},"resultsPage":1,"resultsPerPage":20,"numPages":83,"onThisPage":20,"total":1650,"results":[{"alias":"\/snv","ptr":"6290"},{"alias":"\/snv","ptr":"4868"},{"alias":"\/snv","ptr":"2678"},{"alias":"\/snv","ptr":"4838"},{"alias":"\/snv","ptr":"4827"},{"alias":"\/snv","ptr":"4731"},{"alias":"\/snv","ptr":"4834"},{"alias":"\/snv","ptr":"4729"},{"alias":"\/snv","ptr":"4812"},{"alias":"\/snv","ptr":"6603"},{"alias":"\/snv","ptr":"2539"},{"alias":"\/snv","ptr":"1173"},{"alias":"\/snv","ptr":"1321"},{"alias":"\/snv","ptr":"1313"},{"alias":"\/snv","ptr":"2561"},{"alias":"\/snv","ptr":"9"},{"alias":"\/snv","ptr":"204"},{"alias":"\/snv","ptr":"215"},{"alias":"\/snv","ptr":"130"},{"alias":"\/snv","ptr":"230"}],"querySeconds":0.39331,"version":"1.0"}');
      
      init = function() {
        $.ajax({
          url: o.carouselUrl,
          type: 'GET',
          dataType: 'text',
        
          complete: function() {
            if (db) debug("carouselURL Complete!");
            
          },
      
          success: function(data) {
            carousel.json = JSON.parse(data);
            if (db) debug(carousel.json);
            // buildCarousel();
         },
      
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (db) debug("Error: " + textStatus);
          }
        });
      }
      
      buildCarousel = function() {
        var resultLength = carousel.json.results.length;
        debug(carousel.json.results[0].alias);
        for (var i = 0; i < resultLength; i++) {
          $.ajax({
            url: '/hughes/dm.php' + carousel.json.results[i].alias + '/' + carousel.json.results[i].ptr + '?format=json',
            type: 'POST',
            dataType: 'json',          
            complete: function() {
              if (db) debug(carousel.slide);
              if (carousel.slide[(resultLength - 1)].dmObject.ptr == carousel.json.results[(resultLength - 1)].ptr) buildImages();
            },          
            success: function(json) {
              carousel.slide.push(json);
            },          
            error: function() {
              if (db) debug ("buildCarousel Error");
            }
          });
          
        }
        
      },
      
      buildImages = function() {
          if (db) console.log("Build images started");
          
          var i;
          carousel.list = "<ul>";
          
          for (i = 0; i < carousel.slide.length; i++) {
            if (carousel.slide[i].dmObject.width > 0 && carousel.slide[i].dmObject.height > 0) {            
              carousel.slide[i].zoom = (o.maxWidth / carousel.slide[i].dmObject.width) * 100; 
              carousel.slide[i].imageSrc = "http://digital.library.unlv.edu/cgi-bin/getimage.exe?CISOROOT=" + carousel.slide[i].dmObject.alias + "&CISOPTR=" + carousel.slide[i].dmObject.ptr + "&DMSCALE=" + carousel.slide[i].zoom + "&DMWIDTH=" + o.maxWidth + "&DMHEIGHT=" + o.maxHeight + "&DMROTATE=0";
              carousel.list += '<li><img src=' + carousel.slide[i].imageSrc + 'alt=' + carousel.slide[i].dmObject.metadata[0].value + ' /></li>';
            }
          }
          
          carousel.list += "</ul>";
          
          preloadImages(carousel.slide[0].imageSrc, carousel.slide[1].imageSrc, carousel.slide[2].imageSrc, carousel.slide[3].imageSrc, carousel.slide[4].imageSrc)                    
          
      },
      
      preloadImages = function()
      {
        for(var i = 0; i<arguments.length; i++)
        {
          $("<img>").attr("src", arguments[i]);
        } 
        startCarousel();
      },
            
      startCarousel = function(){
        if (db) console.log("Carousel Started!");
        $(carousel.list).appendTo($this).cycle();           
      };
      
      init();
    
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
  carouselUrl: "http://cdmtest.library.unlv.edu/api/1/objects/snv.json",
  rotationTime: 5000,
  maxWidth: 400,
  maxHeight: 400
};

})(jQuery);