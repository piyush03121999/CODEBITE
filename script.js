

function loader() {
    var tl = gsap.timeline();
    tl
        .to(".square", {
            duration: 4,
        })
        .to(".square", {
            opacity: 0,
        })
    tl
        .to("#loaderr", {
            height: 0,
            duration: 1,
            ease: Power3.easeInOut
        });
}
loader();

function textScramble() {
    const shuffle = baffle('#left #lcontent #head h1');
    shuffle.set({
        characters: '`~!@#$%^&*()_+-=[]{}',
        speed: 150
    })
    shuffle.start();
    shuffle.reveal(20000);
}


const scrollers = document.querySelectorAll('.scroller');
const wrapper = document.querySelector('.wrapper');

function Scroller() {
    wrapper.classList.toggle("wrapper--vertical");
    [...scrollers].forEach(function (scroller) {
        scroller.classList.toggle("scroller--vertical");
    })
}


var circle = document.querySelector("#circle");
var frames = document.querySelectorAll(".frame");
const lerp = (x, y, a) => x * (1 - a) + y * a;

function hoverEffect() {
    frames.forEach(frame => {
        frame.addEventListener("mousemove", function (dets) {

            var dimensions = frame.getBoundingClientRect();
            // console.log(dimensions);

            var xstart = dimensions.x;
            var xend = dimensions.x + dimensions.width;

            var zerOne = gsap.utils.mapRange(xstart, xend, 0, 1, dets.clientX);

            // lerp(-50, 50, zerOne);

            gsap.to(circle, {
                scale: 4
            })

            gsap.to(frame.children, {
                // color: "#fff",
                color: "#ceda90",
                duration: .3,
                y: '-2vw',
            })

            gsap.to(frame.children, {
                x: lerp(-10, 10, zerOne),
                duration: .3,
            })
        })

        frame.addEventListener("mouseleave", function (dets) {
            gsap.to(circle, {
                scale: 1
            })

            gsap.to(frame.children, {
                color: "#aab476",
                duration: .5,
                y: 0,
            })

            gsap.to("#nright a", {
                color: "#17290e",
                duration: .5,
                y: 0,
            })

            gsap.to(frame.children, {
                x: 0,
                duration: .4,
            })
        })
    })
  
    window.addEventListener("mousemove", function (dets) {
        // console.log(dets.clientX, dets.clientY);
        // circle.style.transform = `translate(${dets.clientX}px,${dets.clientY}px)`
        circle.style.left = `${dets.clientX}px`
        circle.style.top = `${dets.clientY}px`
        
        gsap.to(circle, {
            // x: dets.clientX,
            // y: dets.clientY,
            duration: .2,
            ease: Expo
        })
    })

}


function tiltCard() {
    VanillaTilt.init(document.querySelectorAll(".boxess"), {
        max: 25,
        speed: 400,
        glare: true,
        "max-glare": .5,
    });
}





hoverEffect();
setTimeout(textScramble, 6000);
Scroller();
tiltCard();


var content = document.querySelector("#content")
function slideCircle() {
    document.querySelectorAll(".slide")
        .forEach(function (slide) {
            SVGTextContentElement.addEventListener("mousemove", function (dets) {
                var dim = slide.getBoundingClientRect();
                this.children[1].style.clipPath = ` circle(15% at ${dets.clientX - dim.left}px ${dets.clientY - dim.top}px)`;
            });

            slide.addEventListener("mouseleave", function (dets) {
                var dim = slide.getBoundingClientRect();
                this.children[1].style.clipPath = ` circle(0% at ${dets.clientX - dim.left}px ${dets.clientY - dim.top}px)`;
            });
        })

}

slideCircle();
// ----------------p5

function scrolleffect() {
    var $zoom;
    $(document).ready(function () {
        // Initiate magnification powers
        $zoom = $('.zoom').magnify({
            afterLoad: function () {
                console.log('Magnification powers activated!');
            }
        });
    });
    $('button').click(function () {
        $zoom.destroy();
    });
    $('html').on({
        magnifystart: function () {
            console.log('\'magnifystart\' event fired');
        },
        magnifyend: function () {
            console.log('\'magnifyend\' event fired');
        }
    });
    //WK4 Assessment
    $('#City').delay(1300).animate({ 'marginTop': '+=-80px', 'opacity': '1' }, 800);
    (function ($) {
        $.fn.magnify = function (oOptions) {
            // Default options
            oOptions = $.extend({
                'src': '',
                'speed': 100,
                'timeout': -1,
                'touchBottomOffset': 0,
                'finalWidth': null,
                'finalHeight': null,
                'magnifiedWidth': null,
                'magnifiedHeight': null,
                'limitBounds': false,
                'mobileCloseEvent': 'touchstart',
                'afterLoad': function () { }
            }, oOptions);

            var $that = this, // Preserve scope
                $html = $('html'),

                // Initiate
                init = function (el) {
                    var $image = $(el),
                        $anchor = $image.closest('a'),
                        oDataAttr = {};

                    // Get data attributes
                    for (var i in oOptions) {
                        oDataAttr[i] = $image.attr('data-magnify-' + i.toLowerCase());
                    }

                    // Disable zooming if no valid large image source
                    var sZoomSrc = oDataAttr['src'] || oOptions['src'] || $anchor.attr('href') || '';
                    if (!sZoomSrc) return;

                    var $container,
                        $lens,
                        nImageWidth,
                        nImageHeight,
                        nMagnifiedWidth,
                        nMagnifiedHeight,
                        nLensWidth,
                        nLensHeight,
                        nBoundX = 0,
                        nBoundY = 0,
                        nPosX, nPosY,
                        nX, nY,
                        oContainerOffset,
                        oImageOffset,

                        getOffset = function () {
                            var o = $container.offset();

                            oImageOffset = {
                                'top': ($image.offset().top - o.top) + parseInt($image.css('border-top-width')) + parseInt($image.css('padding-top')),
                                'left': ($image.offset().left - o.left) + parseInt($image.css('border-left-width')) + parseInt($image.css('padding-left'))
                            };
                            o.top += oImageOffset['top'];
                            o.left += oImageOffset['left'];
                            return o;
                        },
                        // Hide the lens
                        hideLens = function () {
                            if ($lens.is(':visible')) $lens.fadeOut(oOptions['speed'], function () {
                                $html.removeClass('magnifying').trigger('magnifyend'); // Reset overflow-x
                            });
                        },
                        moveLens = function (e) {
                            // Reinitialize if image initially hidden
                            if (!nImageHeight) {
                                refresh();
                                return;
                            }
                            if (e) {
                                e.preventDefault();

                                nPosX = e.pageX || e.originalEvent.touches[0].pageX;
                                nPosY = e.pageY || e.originalEvent.touches[0].pageY;
                                $image.data('lastPos', {
                                    'x': nPosX,
                                    'y': nPosY
                                });
                            } else {
                                nPosX = $image.data('lastPos').x;
                                nPosY = $image.data('lastPos').y;
                            }

                            nX = nPosX - oContainerOffset['left'],
                                nY = (nPosY - oContainerOffset['top']) - oOptions['touchBottomOffset'];
                            // Toggle magnifying lens
                            if (!$lens.is(':animated')) {
                                if (nX > nBoundX && nX < nImageWidth - nBoundX && nY > nBoundY && nY < nImageHeight - nBoundY) {
                                    if ($lens.is(':hidden')) {
                                        $html.addClass('magnifying').trigger('magnifystart'); // Hide overflow-x while zooming
                                        $lens.fadeIn(oOptions['speed']);
                                    }
                                } else {
                                    hideLens();
                                }
                            }
                            if ($lens.is(':visible')) {
                                // Move the magnifying lens with the mouse
                                var sBgPos = '';
                                if (nMagnifiedWidth && nMagnifiedHeight) {

                                    var nRatioX = -Math.round(nX / nImageWidth * nMagnifiedWidth - nLensWidth / 2),
                                        nRatioY = -Math.round(nY / nImageHeight * nMagnifiedHeight - nLensHeight / 2);
                                    if (oOptions['limitBounds']) {
                                        // Enforce bounds to ensure only image is visible in lens
                                        var nBoundRight = -Math.round((nImageWidth - nBoundX) / nImageWidth * nMagnifiedWidth - nLensWidth / 2),
                                            nBoundBottom = -Math.round((nImageHeight - nBoundY) / nImageHeight * nMagnifiedHeight - nLensHeight / 2);
                                        // Left and right edges
                                        if (nRatioX > 0) nRatioX = 0;
                                        else if (nRatioX < nBoundRight) nRatioX = nBoundRight;
                                        // Top and bottom edges
                                        if (nRatioY > 0) nRatioY = 0;
                                        else if (nRatioY < nBoundBottom) nRatioY = nBoundBottom;
                                    }
                                    sBgPos = nRatioX + 'px ' + nRatioY + 'px';
                                }

                                // lens in action.
                                $lens.css({
                                    'top': Math.round(nY - nLensHeight / 2) + oImageOffset['top'] + 'px',
                                    'left': Math.round(nX - nLensWidth / 2) + oImageOffset['left'] + 'px',
                                    'background-position': sBgPos
                                });
                            }
                        };

                    // Data attributes have precedence over options object
                    if (!isNaN(+oDataAttr['speed'])) oOptions['speed'] = +oDataAttr['speed'];
                    if (!isNaN(+oDataAttr['timeout'])) oOptions['timeout'] = +oDataAttr['timeout'];
                    if (!isNaN(+oDataAttr['finalWidth'])) oOptions['finalWidth'] = +oDataAttr['finalWidth'];
                    if (!isNaN(+oDataAttr['finalHeight'])) oOptions['finalHeight'] = +oDataAttr['finalHeight'];
                    if (!isNaN(+oDataAttr['magnifiedWidth'])) oOptions['magnifiedWidth'] = +oDataAttr['magnifiedWidth'];
                    if (!isNaN(+oDataAttr['magnifiedHeight'])) oOptions['magnifiedHeight'] = +oDataAttr['magnifiedHeight'];
                    if (oDataAttr['limitBounds'] === 'true') oOptions['limitBounds'] = true;
                    if (typeof window[oDataAttr['afterLoad']] === 'function') oOptions.afterLoad = window[oDataAttr['afterLoad']];

                    // this image object.
                    var elZoomImage = new Image();
                    $(elZoomImage).on({
                        'load': function () {

                            $image.css('display', 'block');
                            // Create container div if necessary
                            if (!$image.parent('.magnify').length) {
                                $image.wrap('<div class="magnify"></div>');
                            }
                            $container = $image.parent('.magnify');
                            // Create the magnifying lens div if necessary
                            if ($image.prev('.magnify-lens').length) {
                                $container.children('.magnify-lens').css('background-image', 'url(\'' + sZoomSrc + '\')');
                            } else {
                                $image.before('<div class="magnify-lens loading" style="background:url(\'' + sZoomSrc + '\') 0 0 no-repeat"></div>');
                            }
                            $lens = $container.children('.magnify-lens');
                            // Remove the "Loading..." text
                            $lens.removeClass('loading');

                            nImageWidth = oOptions['finalWidth'] || $image.width();
                            nImageHeight = oOptions['finalHeight'] || $image.height();
                            nMagnifiedWidth = oOptions['magnifiedWidth'] || elZoomImage.width;
                            nMagnifiedHeight = oOptions['magnifiedHeight'] || elZoomImage.height;
                            nLensWidth = $lens.width();
                            nLensHeight = $lens.height();
                            oContainerOffset = getOffset(); // Required by refresh()
                            // Set zoom boundaries
                            if (oOptions['limitBounds']) {
                                nBoundX = (nLensWidth / 2) / (nMagnifiedWidth / nImageWidth);
                                nBoundY = (nLensHeight / 2) / (nMagnifiedHeight / nImageHeight);
                            }
                            // Enforce non-native large image size?
                            if (nMagnifiedWidth !== elZoomImage.width || nMagnifiedHeight !== elZoomImage.height) {
                                $lens.css('background-size', nMagnifiedWidth + 'px ' + nMagnifiedHeight + 'px');
                            }

                            $image.data('zoomSize', {
                                'width': nMagnifiedWidth,
                                'height': nMagnifiedHeight
                            });
                            // Store mobile close event for mobile plugin
                            $container.data('mobileCloseEvent', oDataAttr['mobileCloseEvent'] || oOptions['mobileCloseEvent']);
                            // Clean up
                            elZoomImage = null;
                            // Execute callback
                            oOptions.afterLoad();

                            if ($lens.is(':visible')) moveLens();
                            // Handle mouse movements
                            $container.off().on({
                                'mousemove touchmove': moveLens,
                                'mouseenter': function () {
                                    // Need to update offsets here to support accordions
                                    oContainerOffset = getOffset();
                                },
                                'mouseleave': hideLens
                            });

                            // Prevent magnifying lens from getting "stuck"
                            if (oOptions['timeout'] >= 0) {
                                $container.on('touchend', function () {
                                    setTimeout(hideLens, oOptions['timeout']);
                                });
                            }
                            // Ensure lens is closed when tapping outside of it
                            $('body').not($container).on('touchstart', hideLens);

                            // Support image map click-throughs while zooming
                            var sUsemap = $image.attr('usemap');
                            if (sUsemap) {
                                var $map = $('map[name=' + sUsemap.slice(1) + ']');
                                // Image map needs to be on the same DOM level as image source
                                $image.after($map);
                                $container.click(function (e) {
                                    // Trigger click on image below lens at current cursor position
                                    if (e.clientX || e.clientY) {
                                        $lens.hide();
                                        var elPoint = document.elementFromPoint(
                                            e.clientX || e.originalEvent.touches[0].clientX,
                                            e.clientY || e.originalEvent.touches[0].clientY
                                        );
                                        if (elPoint.nodeName === 'AREA') {
                                            elPoint.click();
                                        } else {
                                            // Workaround for buggy implementation of elementFromPoint()
                                            // See https://bugzilla.mozilla.org/show_bug.cgi?id=1227469
                                            $('area', $map).each(function () {
                                                var a = $(this).attr('coords').split(',');
                                                if (nX >= a[0] && nX <= a[2] && nY >= a[1] && nY <= a[3]) {
                                                    this.click();
                                                    return false;
                                                }
                                            });
                                        }
                                    }
                                });
                            }

                            if ($anchor.length) {
                                // Make parent anchor inline-block to have correct dimensions
                                $anchor.css('display', 'inline-block');
                                // Disable parent anchor if it's sourcing the large image
                                if ($anchor.attr('href') && !(oDataAttr['src'] || oOptions['src'])) {
                                    $anchor.click(function (e) {
                                        e.preventDefault();
                                    });
                                }
                            }

                        },
                        'error': function () {
                            // Clean up
                            elZoomImage = null;
                        }
                    });

                    elZoomImage.src = sZoomSrc;
                }, // END init()

                // Simple debounce
                nTimer = 0,
                refresh = function () {
                    clearTimeout(nTimer);
                    nTimer = setTimeout(function () {
                        $that.destroy();
                        $that.magnify(oOptions);
                    }, 100);
                };

            /**
             * Public Methods
             */

            // Turn off zoom and reset to original state
            this.destroy = function () {
                this.each(function () {
                    var $this = $(this),
                        $lens = $this.prev('div.magnify-lens'),
                        sStyle = $this.data('originalStyle');
                    if ($this.parent('div.magnify').length && $lens.length) {
                        if (sStyle) $this.attr('style', sStyle);
                        else $this.removeAttr('style');
                        $this.unwrap();
                        $lens.remove();
                    }
                });
                // Unregister event handler
                $(window).off('resize', refresh);
                return $that;
            }

            // Handle window resizing
            $(window).resize(refresh);

            return this.each(function () {
                // Initiate magnification powers
                init(this);
            });

        };
    }(jQuery));


}

scrolleffect();


// const scroll = new LocomotiveScroll({
//     el: document.querySelector('#main'),
//     smooth: true
// });
window.onload = function () {
    var layout1 = document.getElementById("layout1"),
      layout2 = document.getElementById("layout2");
  
    function hideLeft(layout) {
      for (i = 0; i < layout.children.length; i++) {
        if (layout.children[i].classList.contains("show-left")) {
          layout.children[i].classList.remove("show-left");
        } else if (layout.children[i].classList.contains("show-right")) {
          layout.children[i].classList.remove("show-right");
        }
        layout.children[i].classList.add("hide-left");
      }
    }
    function hideRight(layout) {
      for (i = 0; i < layout.children.length; i++) {
        if (layout.children[i].classList.contains("show-left")) {
          layout.children[i].classList.remove("show-left");
        } else if (layout.children[i].classList.contains("show-right")) {
          layout.children[i].classList.remove("show-right");
        }
        layout.children[i].classList.add("hide-right");
      }
    }
    function showLeft(layout) {
      for (i = 0; i < layout.children.length; i++) {
        if (layout.children[i].classList.contains("hide-left")) {
          console.log("It had a hide left on it");
          layout.children[i].classList.remove("hide-left");
          console.log("but I removed it!");
        } else if (layout.children[i].classList.contains("hide-right")) {
          layout.children[i].classList.remove("hide-right");
        }
        // Add show right
        layout.children[i].classList.add("show-left");
      }
    }
    function showRight(layout) {
      for (i = 0; i < layout.children.length; i++) {
        if (layout.children[i].classList.contains("hide-left")) {
          layout.children[i].classList.remove("hide-left");
        } else if (layout.children[i].classList.contains("hide-right")) {
          layout.children[i].classList.remove("hide-right");
        }
        //Add show right
        layout.children[i].classList.add("show-right");
      }
    }
  
    // Initialize Layout 2 as hidden
    hideLeft(layout2);
  
    document.addEventListener(
      "click",
      function (event) {
        // If the clicked element doesn't have the right selector then bail
        if (!event.target.matches(".grid__item--nav span")) return;
        // Don't follow any links
        event.preventDefault();
        // Perform desired action once clicked
        if (event.target.matches(".grid--layout1 .grid__item--prev span")) {
          //Add hide LEFT to current grid items and show RIGHT other grid items
          console.log("Layout 1 Prev was clicked!");
          hideLeft(layout1);
          layout2.classList.remove("hide");
          setTimeout(function () {
            layout1.classList.add("hide");
          }, 750);
          showLeft(layout2);
          return;
        } else if (
          event.target.matches(".grid--layout1 .grid__item--next span")
        ) {
          //Add hide LEFT to current grid items and show RIGHT other grid items
          console.log("Layout 1 Next was pressed!");
          hideRight(layout1);
          setTimeout(function () {
            layout1.classList.add("hide");
            layout2.classList.remove("hide");
          }, 750);
          showRight(layout2);
          return;
        } else if (
          event.target.matches(".grid--layout2 .grid__item--prev span")
        ) {
          //Add hide LEFT to current grid items and show RIGHT other grid items
          console.log("Layout 2 Prev was clicked!");
          hideLeft(layout2);
          setTimeout(function () {
            layout1.classList.remove("hide");
            layout2.classList.add("hide");
          }, 750);
          showLeft(layout1);
          return;
        } else if (
          event.target.matches(".grid--layout2 .grid__item--next span")
        ) {
          //Add hide LEFT to current grid items and show RIGHT other grid items
          console.log("Layout 2 Next was clicked!");
          hideRight(layout2);
          setTimeout(function () {
            layout2.classList.add("hide");
            layout1.classList.remove("hide");
          }, 750);
          showRight(layout1);
          return;
        }
      },
      false
    );
  };
  