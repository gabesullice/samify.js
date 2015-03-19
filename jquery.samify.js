!function ($) {
  "use strict";

  $.fn.samify = function (options) {
    var base = this;
    var $win = $(window);
    var slices, numCols;

    // Apply default settings overrides
    var settings = $.extend({
      'height'  : true,  // Equalize by height
      'width'   : false, // Equalize by width
      'vshrink' : false, // Shrink each row, ignores height
      'hshrink' : false, // Shrink each column, ignores width
      'cols'    : 0,     // Either a fixed number or a function returning a number of columns (useful for breakpoints)
      'resize'  : false, // Whether or not to recalculate on window resize
      'throttle': 250,   // Throttle delay for resize
    }, settings, options);

    // Entry point
    this.init = function () {
      if (settings.resize) {
        $win.resize(throttle(function () {
          reset();
          base.calculate();
        }, settings.throttle));
      }
      this.calculate();
      this.addClass('samified');
    }

    this.calculate = function () {
      // Get slices, if any
      var cols = getNumCols();
      switch (cols) {
        case 0:
          if (settings.height) equalize(base, 'height');
          if (settings.width) equalize(base, 'width');
          break;
        case 1:
          reset();
          break;
        default:
          if (numCols != cols) {
            numCols = cols;
            slices = slice();
          }
          process();
      }
    };

    function process () {
      // Process rows, then cols
      for (var direction in slices) {
        // Each row or col as a slice
        for (var key in slices[direction]) {
          var slice = slices[direction][key];
          var prop;
          switch (direction) {
            case 'rows':
              prop = 'height';
              break;
            case 'cols':
              prop = 'width';
              break;
          }
          // Equalize row or col by height or width
          equalize(slice, prop)
        }
      }
    }

    function reset () {
      base.height('auto');
    }

    // Equalizes the given slices property (Either 'height' or 'width')
    function equalize (slice, prop) {
      var max = getMax(slice, prop);
      slice[prop](max);
    }

    // Gets the max height or width value from the given slice
    function getMax(slice, prop) {
      var max = 0;
      slice.each(function () {
        var size = $(this)[prop]();
        if (size > max) max = size;
      });
      return max;
    }

    // Returns a set of row and col slices, or null if we don't care
    function slice () {
      if (settings.vshrink || settings.hshrink) {
        var slices = {};
        if (settings.vshrink) {
          slices['rows'] = getRows();
        }
        if (settings.hshrink) {
          slices['cols'] = getCols();
        }
        return slices;
      }
      else {
        return null;
      }
    };

    // Returns an array of objects corresponding to each row
    function getRows () {
      var start = 0, end = numCols;
      var rows = [];
      while (end <= base.length) {
        rows.push(base.slice(start, end));
        start += numCols;
        end += numCols;
      }
      var remainder = base.length % numCols;
      if (remainder > 0) rows.push(base.slice(-remainder));
      return rows;
    };

    // Returns an array of objects corresponding to each column
    function getCols () {
      var col = 1;
      var cols = [];
      while (col <= numCols) {
        var selector = ':nth-child(' + numCols + 'n+' + col + ')';
        cols.push(base.filter(selector));
        col++;
      }
      return cols;
    };

    // Gets the current number of colums
    function getNumCols () {
      if (typeof settings.cols === 'function') {
        return settings.cols($win.width());
      }
      else if (typeof settings.cols === 'number') {
        return settings.cols;
      }
      else {
        return base.length;
      }
    };

    // Throttle function by Remy Sharp.
    // https://remysharp.com/2010/07/21/throttling-function-calls
    function throttle(fn, threshhold, scope) {
      threshhold || (threshhold = 250);
      var last,
      deferTimer;
      return function () {
        var context = scope || this;

        var now = +new Date,
        args = arguments;
        if (last && now < last + threshhold) {
          // hold on to it
          clearTimeout(deferTimer);
          deferTimer = setTimeout(function () {
            last = now;
            fn.apply(context, args);
          }, threshhold);
        } else {
          last = now;
          fn.apply(context, args);
        }
      };
    }

    // Start equalizing
    this.init();
    return this;
  };

}(jQuery);
