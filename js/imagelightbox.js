/*
	By Osvaldas Valutis, www.osvaldas.info
	Available for use under the MIT License
*/

;
(function(e, t, n, r) {
    "use strict";
    var i = function() {
        var e = n.body || n.documentElement, e = e.style;
        if (e.WebkitTransition == "")
            return "-webkit-";
        if (e.MozTransition == "")
            return "-moz-";
        if (e.OTransition == "")
            return "-o-";
        if (e.transition == "")
            return "";
        return false
    }, s = i() === false ? false: true, o = function(e, t, n) {
        var r = {}, s = i();
        r[s + "transform"] = "translateX(" + t + ")";
        r[s + "transition"] = s + "transform " + n + "s linear";
        e.css(r)
    }, u = "ontouchstart"in t, a = t.navigator.pointerEnabled || t.navigator.msPointerEnabled, f = function(e) {
        if (u)
            return true;
        if (!a || typeof e === "undefined" || typeof e.pointerType === "undefined")
            return false;
        if (typeof e.MSPOINTER_TYPE_MOUSE !== "undefined") {
            if (e.MSPOINTER_TYPE_MOUSE != e.pointerType)
                return true
        } else if (e.pointerType != "mouse")
            return true;
        return false
    };
    e.fn.imageLightbox = function(r) {
        var r = e.extend({
            selector: 'id="imagelightbox"',
            allowedTypes: "png|jpg|jpeg|gif",
            animationSpeed: 250,
            preloadNext: true,
            enableKeyboard: true,
            quitOnEnd: false,
            quitOnImgClick: false,
            quitOnDocClick: true,
            onStart: false,
            onEnd: false,
            onLoadStart: false,
            onLoadEnd: false
        }, r), i = e([]), l = e(), c = e(), h = 0, p = 0, d = 0, v = false, m = function(t) {
            return e(t).prop("tagName").toLowerCase() == "a" && (new RegExp(".(" + r.allowedTypes + ")$", "i")).test(e(t).attr("href"))
        }, g = function() {
            if (!c.length)
                return true;
            var n = e(t).width() * .8, r = e(t).height() * .9, i = new Image;
            i.src = c.attr("src");
            i.onload = function() {
                h = i.width;
                p = i.height;
                if (h > n || p > r) {
                    var s = h / p > n / r ? h / n: p / r;
                    h/=s;
                    p/=s
                }
                c.css({
                    width: h + "px",
                    height: p + "px",
                    top: (e(t).height() - p) / 2 + "px",
                    left: (e(t).width() - h) / 2 + "px"
                })
            }
        }, y = function(t) {
            if (v)
                return false;
            t = typeof t === "undefined" ? false : t == "left" ? 1 : -1;
            if (c.length) {
                if (t !== false && (i.length < 2 || r.quitOnEnd === true && (t===-1 && i.index(l) == 0 || t === 1 && i.index(l) == i.length-1))) {
                    w();
                    return false
                }
                var n = {
                    opacity: 0
                };
                if (s)
                    o(c, 100 * t - d + "px", r.animationSpeed / 1e3);
                else 
                    n.left = parseInt(c.css("left")) + 100 * t + "px";
                c.animate(n, r.animationSpeed, function() {
                    b()
                });
                d = 0
            }
            v = true;
            if (r.onLoadStart !== false)
                r.onLoadStart();
            setTimeout(function() {
                c = e("<img " + r.selector + " />").attr("src", l.attr("href")).load(function() {
                    c.appendTo("body");
                    g();
                    var n = {
                        opacity: 1
                    };
                    c.css("opacity", 0);
                    if (s) {
                        o(c, -100 * t + "px", 0);
                        setTimeout(function() {
                            o(c, 0 + "px", r.animationSpeed / 1e3)
                        }, 50)
                    } else {
                        var u = parseInt(c.css("left"));
                        n.left = u + "px";
                        c.css("left", u-100 * t + "px")
                    }
                    c.animate(n, r.animationSpeed, function() {
                        v = false;
                        if (r.onLoadEnd !== false)
                            r.onLoadEnd()
                    });
                    if (r.preloadNext) {
                        var a = i.eq(i.index(l) + 1);
                        if (!a.length)
                            a = i.eq(0);
                        e("<img />").attr("src", a.attr("href")).load()
                    }
                }).error(function() {
                    if (r.onLoadEnd !== false)
                        r.onLoadEnd()
                });
                var n = 0, u = 0, p = 0;
                c.on(a ? "pointerup MSPointerUp" : "click", function(e) {
                    e.preventDefault();
                    if (r.quitOnImgClick) {
                        w();
                        return false
                    }
                    if (f(e.originalEvent))
                        return true;
                    var t = (e.pageX || e.originalEvent.pageX) - e.target.offsetLeft;
                    l = i.eq(i.index(l) - (h / 2 > t ? 1 : -1));
                    if (!l.length)
                        l = i.eq(h / 2 > t ? i.length : 0);
                    y(h / 2 > t ? "left" : "right")
                }).on("touchstart pointerdown MSPointerDown", function(e) {
                    if (!f(e.originalEvent) || r.quitOnImgClick)
                        return true;
                    if (s)
                        p = parseInt(c.css("left"));
                    n = e.originalEvent.pageX || e.originalEvent.touches[0].pageX
                }).on("touchmove pointermove MSPointerMove", function(e) {
                    if (!f(e.originalEvent) || r.quitOnImgClick)
                        return true;
                    e.preventDefault();
                    u = e.originalEvent.pageX || e.originalEvent.touches[0].pageX;
                    d = n - u;
                    if (s)
                        o(c, - d + "px", 0);
                    else 
                        c.css("left", p - d + "px")
                }).on("touchend touchcancel pointerup pointercancel MSPointerUp MSPointerCancel", function(e) {
                    if (!f(e.originalEvent) || r.quitOnImgClick)
                        return true;
                    if (Math.abs(d) > 50) {
                        l = i.eq(i.index(l) - (d < 0 ? 1 : -1));
                        if (!l.length)
                            l = i.eq(d < 0 ? i.length : 0);
                        y(d > 0 ? "right" : "left")
                    } else {
                        if (s)
                            o(c, 0 + "px", r.animationSpeed / 1e3);
                        else 
                            c.animate({
                                left: p + "px"
                            }, r.animationSpeed / 2)
                    }
                })
            }, r.animationSpeed + 100)
        }, b = function() {
            if (!c.length)
                return false;
            c.remove();
            c = e()
        }, w = function() {
            if (!c.length)
                return false;
            c.animate({
                opacity: 0
            }, r.animationSpeed, function() {
                b();
                v = false;
                if (r.onEnd !== false)
                    r.onEnd()
            })
        };
        e(t).on("resize", g);
        if (r.quitOnDocClick) {
            e(n).on(u ? "touchend" : "click", function(t) {
                if (c.length&&!e(t.target).is(c))
                    w()
            })
        }
        if (r.enableKeyboard) {
            e(n).on("keyup", function(e) {
                if (!c.length)
                    return true;
                e.preventDefault();
                if (e.keyCode == 27)
                    w();
                if (e.keyCode == 37 || e.keyCode == 39) {
                    l = i.eq(i.index(l) - (e.keyCode == 37 ? 1 : -1));
                    if (!l.length)
                        l = i.eq(e.keyCode == 37 ? i.length : 0);
                    y(e.keyCode == 37 ? "left" : "right")
                }
            })
        }
        e(n).on("click", this.selector, function(t) {
            if (!m(this))
                return true;
            t.preventDefault();
            if (v)
                return false;
            v = false;
            if (r.onStart !== false)
                r.onStart();
            l = e(this);
            y()
        });
        this.each(function() {
            if (!m(this))
                return true;
            i = i.add(e(this))
        });
        this.switchImageLightbox = function(e) {
            var t = i.eq(e);
            if (t.length) {
                var n = i.index(l);
                l = t;
                y(e < n ? "left" : "right")
            }
            return this
        };
        this.quitImageLightbox = function() {
            w();
            return this
        };
        return this
    }
})(jQuery, window, document);







	jQuery( function()
	{
            var $ = jQuery;
		var activityIndicatorOn = function()
			{
				$( '<div id="imagelightbox-loading"><div></div></div>' ).appendTo( 'body' );
			},
			activityIndicatorOff = function()
			{
				$( '#imagelightbox-loading' ).remove();
			},

			overlayOn = function()
			{
				$( '<div id="imagelightbox-overlay"></div>' ).appendTo( 'body' );
			},
			overlayOff = function()
			{
				$( '#imagelightbox-overlay' ).remove();
			},

			closeButtonOn = function( instance )
			{
				$( '<a href="#" id="imagelightbox-close">Close</a>' ).appendTo( 'body' ).on( 'click touchend', function(){ $( this ).remove(); instance.quitImageLightbox(); return false; });
			},
			closeButtonOff = function()
			{
				$( '#imagelightbox-close' ).remove();
			},

			captionOn = function()
			{
				var description = $( 'a[href="' + $( '#imagelightbox' ).attr( 'src' ) + '"] img' ).attr( 'alt' );
				if( description.length > 0 )
					$( '<div id="imagelightbox-caption">' + description + '</div>' ).appendTo( 'body' );
			},
			captionOff = function()
			{
				$( '#imagelightbox-caption' ).remove();
			},

			navigationOn = function( instance, selector )
			{
				var images = $( selector );
				if( images.length )
				{
					var nav = $( '<div id="imagelightbox-nav"></div>' );
					for( var i = 0; i < images.length; i++ )
						nav.append( '<a href="#"></a>' );

					nav.appendTo( 'body' );
					nav.on( 'click touchend', function(){ return false; });

					var navItems = nav.find( 'a' );
					navItems.on( 'click touchend', function()
					{
						var $this = $( this );
						if( images.eq( $this.index() ).attr( 'href' ) != $( '#imagelightbox' ).attr( 'src' ) )
							instance.switchImageLightbox( $this.index() );

						navItems.removeClass( 'active' );
						navItems.eq( $this.index() ).addClass( 'active' );

						return false;
					})
					.on( 'touchend', function(){ return false; });
				}
			},
			navigationUpdate = function( selector )
			{
				var items = $( '#imagelightbox-nav a' );
				items.removeClass( 'active' );
				items.eq( $( selector ).filter( '[href="' + $( '#imagelightbox' ).attr( 'src' ) + '"]' ).index( selector ) ).addClass( 'active' );
			},
			navigationOff = function()
			{
				$( '#imagelightbox-nav' ).remove();
			};


		//	WITH ACTIVITY INDICATION

		$( 'a[data-imagelightbox="a"]' ).imageLightbox(
		{
			onLoadStart:	function() { activityIndicatorOn(); },
			onLoadEnd:		function() { activityIndicatorOff(); },
			onEnd:	 		function() { activityIndicatorOff(); }
		});


		//	WITH OVERLAY & ACTIVITY INDICATION

		$( 'a[data-imagelightbox="b"]' ).imageLightbox(
		{
			onStart: 	 function() { overlayOn(); },
			onEnd:	 	 function() { overlayOff(); activityIndicatorOff(); },
			onLoadStart: function() { activityIndicatorOn(); },
			onLoadEnd:	 function() { activityIndicatorOff(); }
		});


		//	WITH "CLOSE" BUTTON & ACTIVITY INDICATION

		var instanceC = $( 'a[data-imagelightbox="c"]' ).imageLightbox(
		{
			quitOnDocClick:	false,
			onStart:		function() { closeButtonOn( instanceC ); },
			onEnd:			function() { closeButtonOff(); activityIndicatorOff(); },
			onLoadStart: 	function() { activityIndicatorOn(); },
			onLoadEnd:	 	function() { activityIndicatorOff(); }
		});


		//	WITH CAPTION & ACTIVITY INDICATION

		$( 'a[data-imagelightbox="d"]' ).imageLightbox(
		{
			onLoadStart: function() { captionOff(); activityIndicatorOn(); },
			onLoadEnd:	 function() { captionOn(); activityIndicatorOff(); },
			onEnd:		 function() { captionOff(); activityIndicatorOff(); }
		});


		//	WITH DIRECTION REFERENCE

		var selectorE = 'a[data-imagelightbox="e"]';
		var instanceE = $( selectorE ).imageLightbox(
		{
			onStart:	 function() { navigationOn( instanceE, selectorE ); },
			onEnd:		 function() { navigationOff(); activityIndicatorOff(); },
			onLoadStart: function() { activityIndicatorOn(); },
			onLoadEnd:	 function() { navigationUpdate( selectorE ); activityIndicatorOff(); }
		});


		//	ALL COMBINED

		var instanceF = $( 'a' ).imageLightbox(
		{
			onStart:		function() { overlayOn(); closeButtonOn( instanceF ); },
			onEnd:			function() { overlayOff(); captionOff(); closeButtonOff(); activityIndicatorOff(); },
			onLoadStart: 	function() { captionOff(); activityIndicatorOn(); },
			onLoadEnd:	 	function() { captionOn(); activityIndicatorOff(); }
		});

	});
