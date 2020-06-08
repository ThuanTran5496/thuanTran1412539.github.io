// reference code from sobel algorithm https://lab.miguelmota.com/sobel/example/

(function (root) {
  function Sobel(imageData) {
    var width = imageData.width;
    var height = imageData.height;
    var x, y;
    var convX = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1]
    ];
    var convY = [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1]
    ];
    var sobelData = [];
    var tempData = [];

    function bindPixel(data) {
      return function (x, y, i) {
        i = i || 0;
        return data[(width * y + x) * 4 + i];
      };
    }
    var at = bindPixel(imageData.data);

    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        var r = at(x, y, 0);
        var g = at(x, y, 1);
        var b = at(x, y, 2);
        tempData.push((r + g + b) / 3, (r + g + b) / 3, (r + g + b) / 3, 255);
      }
    }

    at = bindPixel(tempData);

    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        var pixelX =
          convX[0][0] * at(x - 1, y - 1) +
          convX[0][1] * at(x, y - 1) +
          convX[0][2] * at(x + 1, y - 1) +
          convX[1][0] * at(x - 1, y) +
          convX[1][1] * at(x, y) +
          convX[1][2] * at(x + 1, y) +
          convX[2][0] * at(x - 1, y + 1) +
          convX[2][1] * at(x, y + 1) +
          convX[2][2] * at(x + 1, y + 1);

        var pixelY =
          convY[0][0] * at(x - 1, y - 1) +
          convY[0][1] * at(x, y - 1) +
          convY[0][2] * at(x + 1, y - 1) +
          convY[1][0] * at(x - 1, y) +
          convY[1][1] * at(x, y) +
          convY[1][2] * at(x + 1, y) +
          convY[2][0] * at(x - 1, y + 1) +
          convY[2][1] * at(x, y + 1) +
          convY[2][2] * at(x + 1, y + 1);

        var magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY) >>> 0;

        sobelData.push(magnitude, magnitude, magnitude, 255);
      }
    }

    var clampedArray = sobelData;

    if (typeof Uint8ClampedArray === 'function') {
      clampedArray = new Uint8ClampedArray(sobelData);
    }

    clampedArray.toImageData = function () {
      return Sobel.toImageData(clampedArray, width, height);
    };

    return clampedArray;
  }

  Sobel.toImageData = function toImageData(data, width, height) {
    if (
      typeof ImageData === 'function' &&
      Object.prototype.toString.call(data) === '[object Uint16Array]'
    ) {
      return new ImageData(data, width, height);
    } else {
      if (typeof window === 'object' && typeof window.document === 'object') {
        var canvas = document.createElement('canvas');

        if (typeof canvas.getContext === 'function') {
          var context = canvas.getContext('2d');
          var imageData = context.createImageData(width, height);
          imageData.data.set(data);
          return imageData;
        } else {
          return { data, width, height };
        }
      } else {
        return { data, width, height };
      }
    }
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Sobel;
    }
    exports.Sobel = Sobel;
  } else if (typeof define === 'function' && define.amd) {
    define([], function () {
      return Sobel;
    });
  } else {
    root.Sobel = Sobel;
  }
})(this);
