// coza-init.js
// Initialize various plugins after vendor scripts (jQuery, slick, etc.) are loaded
(function($){
  function initSelect2(){
    try {
      $(".js-select2").each(function(){
        try {
          if (!$(this).data('select2')) {
            $(this).select2({
              minimumResultsForSearch: 20,
              dropdownParent: $(this).next('.dropDownSelect2')
            });
          }
        } catch(e) {
          // ignore
        }
      });
    } catch(e){}
  }

  function initParallax(){ try { $('.parallax100').parallax100(); } catch(e){} }
  function initMagnific(){
    try {
      $('.gallery-lb').each(function() {
        if (!$(this).data('magnific')) {
          $(this).magnificPopup({
            delegate: 'a',
            type: 'image',
            gallery: { enabled: true },
            mainClass: 'mfp-fade'
          });
          $(this).data('magnific', true);
        }
      });
    } catch(e){}
  }

  function initWishlist(){
    try {
      $('.js-addwish-b2').off('click.coza').on('click.coza', function(e){ e.preventDefault(); });

      $('.js-addwish-b2').each(function(){
        var $el = $(this);
        if (!$el.data('coza-wishlist')){
          var nameProduct = $el.parent().parent().find('.js-name-b2').html();
          $el.on('click.coza.action', function(){
            swal(nameProduct, "is added to wishlist !", "success");
            $el.addClass('js-addedwish-b2');
            $el.off('click.coza.action');
          });
          $el.data('coza-wishlist', true);
        }
      });

      $('.js-addwish-detail').each(function(){
        var $el = $(this);
        if (!$el.data('coza-wishlist-detail')){
          var nameProduct = $el.parent().parent().parent().find('.js-name-detail').html();
          $el.on('click.coza.action', function(){
            swal(nameProduct, "is added to wishlist !", "success");
            $el.addClass('js-addedwish-detail');
            $el.off('click.coza.action');
          });
          $el.data('coza-wishlist-detail', true);
        }
      });

      $('.js-addcart-detail').each(function(){
        var $el = $(this);
        if (!$el.data('coza-addcart')){
          var nameProduct = $el.parent().parent().parent().parent().find('.js-name-detail').html();
          $el.on('click.coza.action', function(){
            swal(nameProduct, "is added to cart !", "success");
          });
          $el.data('coza-addcart', true);
        }
      });
    } catch(e){}
  }

  function initPerfectScroll(){
    try{
      $('.js-pscroll').each(function(){
        try {
          if (!$(this).data('ps')){
            $(this).css('position','relative');
            $(this).css('overflow','hidden');
            var ps = new PerfectScrollbar(this, {
              wheelSpeed: 1,
              scrollingThreshold: 1000,
              wheelPropagation: false,
            });
            $(this).data('ps', ps);
            $(window).on('resize.coza', function(){ ps.update(); });
          }
        } catch(e){}
      });
    } catch(e){}
  }

  function initSlicks(){
    try{
      // Slick1 (main slider)
      $('.wrap-slick1').each(function(){
        var wrapSlick1 = $(this);
        var slick1 = $(this).find('.slick1');
        if (slick1.length && !slick1.hasClass('slick-initialized')){
          console.debug('coza-init: initializing slick1', slick1);
          var itemSlick1 = $(slick1).find('.item-slick1');
          var layerSlick1 = $(slick1).find('.layer-slick1');
          var actionSlick1 = [];

          $(slick1).on('init.coza', function(){
            var layerCurrentItem = $(itemSlick1[0]).find('.layer-slick1');
            for(var i=0; i<actionSlick1.length; i++) { clearTimeout(actionSlick1[i]); }
            $(layerSlick1).each(function(){ $(this).removeClass($(this).data('appear') + ' visible-true'); });
            for(var i=0; i<layerCurrentItem.length; i++) {
              actionSlick1[i] = setTimeout((function(index){
                return function(){ $(layerCurrentItem[index]).addClass($(layerCurrentItem[index]).data('appear') + ' visible-true'); };
              })(i), $(layerCurrentItem[i]).data('delay'));
            }
          });

          var showDot = false; if($(wrapSlick1).find('.wrap-slick1-dots').length > 0) showDot = true;

          $(slick1).slick({
            pauseOnFocus: false,
            pauseOnHover: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            fade: true,
            speed: 1000,
            infinite: true,
            autoplay: true,
            autoplaySpeed: 6000,
            arrows: true,
            appendArrows: $(wrapSlick1),
            prevArrow:'<button class="arrow-slick1 prev-slick1"><i class="zmdi zmdi-caret-left"></i></button>',
            nextArrow:'<button class="arrow-slick1 next-slick1"><i class="zmdi zmdi-caret-right"></i></button>',
            dots: showDot,
            appendDots: $(wrapSlick1).find('.wrap-slick1-dots'),
            dotsClass:'slick1-dots',
            customPaging: function(slick, index) {
              var linkThumb = $(slick.$slides[index]).data('thumb');
              var caption = $(slick.$slides[index]).data('caption');
              return  '<img src="' + linkThumb + '">' + '<span class="caption-dots-slick1">' + caption + '</span>';
            },
          });

          $(slick1).on('afterChange.coza', function(event, slick, currentSlide){
            var layerCurrentItem = $(itemSlick1[currentSlide]).find('.layer-slick1');
            for(var i=0; i<actionSlick1.length; i++) { clearTimeout(actionSlick1[i]); }
            $(layerSlick1).each(function(){ $(this).removeClass($(this).data('appear') + ' visible-true'); });
            for(var i=0; i<layerCurrentItem.length; i++) {
              actionSlick1[i] = setTimeout((function(index){ return function(){ $(layerCurrentItem[index]).addClass($(layerCurrentItem[index]).data('appear') + ' visible-true'); }; })(i), $(layerCurrentItem[i]).data('delay'));
            }
          });
        }
      });

      // Slick2 and Slick3 re-init similar approach (only init if not initialized)
      $('.wrap-slick2').each(function(){
        var slick2 = $(this).find('.slick2');
        if (slick2.length && !slick2.hasClass('slick-initialized')){
          $(slick2).slick({
            slidesToShow: 4, slidesToScroll: 4, infinite: false, autoplay: false, autoplaySpeed: 6000, arrows: true,
            appendArrows: $(this), prevArrow:'<button class="arrow-slick2 prev-slick2"><i class="fa fa-angle-left" aria-hidden="true"></i></button>', nextArrow:'<button class="arrow-slick2 next-slick2"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
            responsive: [{breakpoint:1200,settings:{slidesToShow:4,slidesToScroll:4}},{breakpoint:992,settings:{slidesToShow:3,slidesToScroll:3}},{breakpoint:768,settings:{slidesToShow:2,slidesToScroll:2}},{breakpoint:576,settings:{slidesToShow:1,slidesToScroll:1}}]
          });
        }
      });

      $('.wrap-slick3').each(function(){
        var slick3 = $(this).find('.slick3');
        if (slick3.length && !slick3.hasClass('slick-initialized')){
          $(slick3).slick({
            slidesToShow:1,slidesToScroll:1,fade:true,infinite:true,autoplay:false,autoplaySpeed:6000,arrows:true,
            appendArrows: $(this).find('.wrap-slick3-arrows'), prevArrow:'<button class="arrow-slick3 prev-slick3"><i class="fa fa-angle-left" aria-hidden="true"></i></button>', nextArrow:'<button class="arrow-slick3 next-slick3"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
            dots:true, appendDots: $(this).find('.wrap-slick3-dots'), dotsClass:'slick3-dots', customPaging: function(slick,index){ var portrait = $(slick.$slides[index]).data('thumb'); return '<img src=" ' + portrait + ' "/><div class="slick3-dot-overlay"></div>'; }
          });
        }
      });

    } catch(e){}
  }

  // adjust main padding based on header height to prevent overlap
  function adjustMainPadding(){
    try{
      var header = document.querySelector('header');
      var main = document.querySelector('main');
      if (!header || !main) return;
      var headerHeight = header.offsetHeight || 0;
      // ensure at least the wrap-menu-desktop height is considered when header is fixed
      var containerDesktop = header.querySelector('.container-menu-desktop');
      if (containerDesktop && containerDesktop.offsetHeight > headerHeight) headerHeight = containerDesktop.offsetHeight;
      main.style.paddingTop = headerHeight + 'px';
    } catch(e){}
  }

  /* New: UI interaction inits that originally lived in main.js but need to be bound after Angular renders views */
  function initBackToTop(){
    try{
      // show/hide on scroll
      $(window).off('scroll.coza-backtotop').on('scroll.coza-backtotop', function(){
        var windowH = $(window).height()/2;
        if ($(this).scrollTop() > windowH) {
          $('#myBtn').css('display','flex');
        } else {
          $('#myBtn').css('display','none');
        }
      });

      // click handler
      $(document).off('click.coza-backtotop', '#myBtn').on('click.coza-backtotop', '#myBtn', function(){
        $('html, body').animate({scrollTop: 0}, 300);
      });
    } catch(e){}
  }

  function initFixedHeader(){
    try{
      var $headerDesktop = $('.container-menu-desktop');
      var $wrapMenu = $('.wrap-menu-desktop');
      var posWrapHeader = $('.top-bar').length > 0 ? $('.top-bar').height() : 0;

      // run once to set initial state
      function updateFixed(){
        if ($(window).scrollTop() > posWrapHeader) {
          $headerDesktop.addClass('fix-menu-desktop');
          $wrapMenu.css('top',0);
        } else {
          $headerDesktop.removeClass('fix-menu-desktop');
          $wrapMenu.css('top', posWrapHeader - $(window).scrollTop());
        }
        // ensure padding adjustment
        adjustMainPadding();
      }

      $(window).off('scroll.coza-fixedheader').on('scroll.coza-fixedheader', updateFixed);
      // call once
      updateFixed();
    } catch(e){}
  }

  function initMenuMobile(){
    try{
      $(document).off('click.coza-showmenu', '.btn-show-menu-mobile').on('click.coza-showmenu', '.btn-show-menu-mobile', function(){
        $(this).toggleClass('is-active');
        $('.menu-mobile').slideToggle();
      });

      // arrow submenus
      $(document).off('click.coza-arrowMain', '.arrow-main-menu-m').on('click.coza-arrowMain', '.arrow-main-menu-m', function(){
        $(this).parent().find('.sub-menu-m').slideToggle();
        $(this).toggleClass('turn-arrow-main-menu-m');
      });

      $(window).off('resize.coza-menu').on('resize.coza-menu', function(){
        if($(window).width() >= 992){
          if($('.menu-mobile').css('display') == 'block') {
            $('.menu-mobile').css('display','none');
            $('.btn-show-menu-mobile').toggleClass('is-active');
          }

          $('.sub-menu-m').each(function(){
            if($(this).css('display') == 'block') {
              $(this).css('display','none');
              $('.arrow-main-menu-m').removeClass('turn-arrow-main-menu-m');
            }
          });
        }
      });
    } catch(e){}
  }

  function initModalSearch(){
    try{
      $(document).off('click.coza-showsearch', '.js-show-modal-search').on('click.coza-showsearch', '.js-show-modal-search', function(){
        $('.modal-search-header').addClass('show-modal-search');
        $(this).css('opacity','0');
      });

      $(document).off('click.coza-hidesearch', '.js-hide-modal-search').on('click.coza-hidesearch', '.js-hide-modal-search', function(){
        $('.modal-search-header').removeClass('show-modal-search');
        $('.js-show-modal-search').css('opacity','1');
      });

      // prevent container click closing
      $(document).off('click.coza-searchcontainer', '.container-search-header').on('click.coza-searchcontainer', '.container-search-header', function(e){ e.stopPropagation(); });
    } catch(e){}
  }

  function initCartPanel(){
    try{
      $(document).off('click.coza-showcart', '.js-show-cart').on('click.coza-showcart', '.js-show-cart', function(){
        $('.js-panel-cart').addClass('show-header-cart');
      });
      $(document).off('click.coza-hidecart', '.js-hide-cart').on('click.coza-hidecart', '.js-hide-cart', function(){
        $('.js-panel-cart').removeClass('show-header-cart');
      });
    } catch(e){}
  }

  function initQuickViewModal(){
    try{
      $(document).off('click.coza-quickview', '.js-show-modal1').on('click.coza-quickview', '.js-show-modal1', function(e){
        e.preventDefault();
        $('.js-modal1').addClass('show-modal1');
      });

      $(document).off('click.coza-hidequickview', '.js-hide-modal1').on('click.coza-hidequickview', '.js-hide-modal1', function(){
        $('.js-modal1').removeClass('show-modal1');
      });
    } catch(e){}
  }

  function initQtyButtons(){
    try{
      $(document).off('click.coza-qtydown', '.btn-num-product-down').on('click.coza-qtydown', '.btn-num-product-down', function(){
        var $input = $(this).next();
        var numProduct = Number($input.val());
        if(numProduct > 0) $input.val(numProduct - 1);
      });

      $(document).off('click.coza-qtyup', '.btn-num-product-up').on('click.coza-qtyup', '.btn-num-product-up', function(){
        var $input = $(this).prev();
        var numProduct = Number($input.val());
        $input.val(numProduct + 1);
      });
    } catch(e){}
  }

  function initFilterSearchToggles(){
    try{
      $(document).off('click.coza-showfilter', '.js-show-filter').on('click.coza-showfilter', '.js-show-filter', function(){
        $(this).toggleClass('show-filter');
        $('.panel-filter').slideToggle(400);
        if($('.js-show-search').hasClass('show-search')) {
          $('.js-show-search').removeClass('show-search');
          $('.panel-search').slideUp(400);
        }
      });

      $(document).off('click.coza-showsearch2', '.js-show-search').on('click.coza-showsearch2', '.js-show-search', function(){
        $(this).toggleClass('show-search');
        $('.panel-search').slideToggle(400);
        if($('.js-show-filter').hasClass('show-filter')) {
          $('.js-show-filter').removeClass('show-filter');
          $('.panel-filter').slideUp(400);
        }
      });
    } catch(e){}
  }

  // expose global init function so Angular can call after navigation
  window.initCozaPlugins = function(){
    initSelect2(); initParallax(); initMagnific(); initWishlist(); initPerfectScroll(); initSlicks();
    try { adjustMainPadding(); } catch(e){}
    // bind UI interactions
    initBackToTop(); initFixedHeader(); initMenuMobile(); initModalSearch(); initCartPanel(); initQuickViewModal(); initIsotopeFilter(); initQtyButtons(); initFilterSearchToggles();
  };

  // auto init on DOM ready
  $(function(){
    try { window.initCozaPlugins(); } catch(e){}
    // adjust on resize
    $(window).on('resize.coza', function(){ try { adjustMainPadding(); } catch(e){} });
  });

})(jQuery);
