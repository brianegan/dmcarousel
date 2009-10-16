/**************************************
 *
 *	dmCarousel .4
 *	by Brian Egan
 *	
 *	Copyright (c) 2009 Board of Regents of the Nevada System of Higher Education, on behalf, of the University of Nevada, Las Vegas
 *  MIT License
 *  http://www.opensource.org/licenses/mit-license.php
 * 
 **************************************/

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
        
        // Grab the collection json then Start building the Carousel
        $.ajax({
          url: o.carouselUrl,
          type: 'GET',
          dataType: 'text',
          complete: function() {
            if (db) debug("carouselURL Complete!");
          },
          success: function(data) {
            carousel.json = JSON.parse(data);
            buildCarousel();
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            if (db) debug("Error: " + textStatus);
          }
        });
      }
      
      buildCarousel = function() {
        
        // Run through and Grab each object's metadata
        $.each(carousel.json.dmBridgeResponse.results, function(i) {
          $.ajax({
            url: this.href,
            type: 'GET',
            dataType: 'text',
            complete: function() {
              if (i == (carousel.json.dmBridgeResponse.results.length - 1)) buildImages();
            },
            success: function(data) {
              carousel.slide[i] = JSON.parse(data);
            },
            error: function() {
              if (db) debug ("buildCarousel Error");
            }
          });
        });

      },
      
      buildImages = function() {
          
          // Append Necesary DOM elements
          $('<div id="dmCarouselSlides"></div>').appendTo('body');
          $('<div class="simple_overlay" id="dmGallery"><a class="prev">prev</a><a class="next">next</a><div class="info"></div><img class="progress" src="http://static.flowplayer.org/tools/img/overlay/loading.gif" /></div>').appendTo('body');
          
          // Run through each object, and if it is an image, build the necessary link to it for the overlay gallery plugin.
          $.each(carousel.slide, function(i) {
            
            // @TODO - Improve this if statement to reference "format" metadata instead of w & h
            if (this.dmBridgeResponse.dmObject.file.width > 0 && this.dmBridgeResponse.dmObject.file.height > 0) {   
                       
              this.wRatio = o.maxWidth / this.dmBridgeResponse.dmObject.file.width;
              this.hRatio = o.maxHeight / this.dmBridgeResponse.dmObject.file.height;

              if (this.wRatio >= this.hRatio) {
                this.zoom = this.hRatio * 100;
                this.width = this.hRatio * this.dmBridgeResponse.dmObject.file.width + 500;
                this.height = this.hRatio * this.dmBridgeResponse.dmObject.file.height + 500;                
              } else {
                this.zoom = this.wRatio * 100;
                this.width = this.wRatio * this.dmBridgeResponse.dmObject.file.width + 500;
                this.height = this.wRatio * this.dmBridgeResponse.dmObject.file.height + 500;
              }
              
              this.imageSrc = "/cgi-bin/getimage.exe?CISOROOT=" + this.dmBridgeResponse.dmObject.alias + "&CISOPTR=" + this.dmBridgeResponse.dmObject.ptr + "&DMSCALE=" + this.zoom + "&DMWIDTH=" + this.width + "&DMHEIGHT=" + this.width + "&DMROTATE=0";              
              this.imageLink = '<a href="' + this.imageSrc + '" title="' + this.dmBridgeResponse.dmObject.metadata[0].value + '" class="dmCarouselImage-' + i + '">&nbsp;</a>';
              $(this.imageLink).appendTo('#dmCarouselSlides');
              if (db) debug(this.hRatio);
              if (db) debug(this.imageLink);
            }
          });
          
          startCarousel();
      },
      
      startCarousel = function() {
        
        // Bind jQuery Tools Overlay to the Image Links just Created
        $('#dmCarouselSlides a').overlay({
          target: '#dmGallery',
          effect: 'apple'
        })
        .gallery({
          speed: 1500
        });
        
        // Create a trigger for the slideshow, which "clicks" the first Slideshow link, triggering the slideshow to start
        $('<a href="#" onclick="javascript:void(0);" class="dmCarouselView" rel="#dmCarouselSlides">View Slideshow</a>')          
          .appendTo('body')
          .bind('click', function() {                       
            $('#dmCarouselSlides a:first').click();          
          });
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
  maxWidth: ($(window).width() - 200),
  maxHeight: ($(window).height() - 100)
};

})(jQuery);