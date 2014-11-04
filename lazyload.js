/**
 * jQuery lazyload Plugin (version 0.0.1)
 *
 * @author Chris Brousseau (cbrousseau@optaros.com)
 * @url https://github.com/christhebrews/jQuery-lazyload
 * This plugin is designed to handle pages where elements are positioned dynamically using absolute/relative positioning.
 *
 * @param fn callback function for lazy load trigger
 * @param delay time (ms) to wait on page load before setting up the lazy loader, sometimes other things need to happen
 */
(function($){
    $.fn.lazyload = function(fn, delay){
        var el = this;
        var debounceTime = 300;

        /**
         * event
         * triggers specified event fn if element is visible
         * todo allow different callbacks for each item in el
         */
        function event(){
            var scrollDepth = window.pageYOffset;
            if(scrollDepth === undefined){
                // from https://developer.mozilla.org/en-US/docs/Web/API/Element.getBoundingClientRect
                scrollDepth = (((t = document.documentElement) || (t = document.body.parentNode)) && typeof t.ScrollTop == 'number' ? t : document.body).ScrollTop
            }
            var windowBottom = scrollDepth + window.innerHeight;
            el.each(function(){
                var elementTop = this.getBoundingClientRect().top;
                if(windowBottom > elementTop){
                    fn.bind(this)();
                    detachEvents();
                }
            });
        }

        /**
         * Internal debouncing mechanic for triggering change in page
         * This just is a utility function for making sure that we are not triggering the event() function too often
         */
        var debounce = (function(){
            var timer = 0;
            return function(fn, ms){
                clearTimeout(timer);
                timer = setTimeout(fn,ms);
            }
        })();

        /**
         * trigger event (debounced) on scroll
         */
        function triggerScroll(){
            debounce(event,debounceTime);
        }

        /**
         * trigger event (debounced) on resize
         * some browsers intepret the window resize call incorrectly so we are simply checking for
         * actual browser height change before we attempt to trigger the (debounced) event
         */
        var lastWindowHeight = window.innerHeight;
        function triggerResize(){
            debounce(function(){
                if(window.innerHeight != lastWindowHeight){
                    lastWindowHeight = window.innerHeight;
                    event();
                }
            }, debounceTime);
        }

        /**
         * attach the callback function to relevant browser actions
         * scroll & resize
         */
        function attachEvents(){
            $(window).scroll(triggerScroll).resize(triggerResize);
        }

        /**
         * once the callback has been made we will clean up the events we added
         */
        function detachEvents(){
            $(window).off('scroll', triggerScroll).off('resize', triggerResize);
        }

        /**
         * main initialization
         */
        if(delay){
            setTimeout(attachEvents, delay);
        } else {
            attachEvents();
        }
    }
}(jQuery));
