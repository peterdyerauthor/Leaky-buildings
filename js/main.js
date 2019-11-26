(function($) {
  "use strict";

  // Preloader
  $(window).on('load', function() {
    if ($('#preloader').length) {
      $('#preloader').delay(100).fadeOut('slow', function() {
        $(this).remove();
      });
    }
  });

  function getCurrentSection() {
    var cutoff = $(window).scrollTop() - 92;
    var curIndex = 0;
    for (var index = 0; index < $('section').length; index++) {
      //console.log("section "+index+": "+$('section').eq(index).offset().top);
      if ($('section').eq(index).offset().top >= cutoff) {
        curIndex = index;
        break;
      }
    }
    //console.log($('section').eq(index).offset().top + ", " + cutoff);
    return curIndex;
  };

  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });

  $('#scrollWindowUp').click(function(e) {
    e.preventDefault();
    var curIndex = getCurrentSection();
    //console.log("up "+curIndex);
    if (curIndex === 0) {
      return;
    }
    $('html, body').animate({
      scrollTop: ($('section').eq(curIndex - 1).offset().top) - 10
    }, 1200);
  });

  $('#scrollWindowDown').click(function(e) {
    e.preventDefault();
    var curIndex = getCurrentSection();
    //console.log("down "+curIndex);
    if (curIndex === $('section').length) {
      return;
    }
    var cutoff = $(window).scrollTop();
    //if ($('section').eq(curIndex).offset().top !== cutoff+1) { curIndex = curIndex-1; } /* Check if the current section is at the top of the page or has been scrolled */

    $('html, body').animate({
      scrollTop: ($('section').eq(curIndex + 1).offset().top) - 10
    }, 1200);
  });

  // $('.back-to-top').click(function(){
  //   $('html, body').animate({scrollTop : 0},1200, 'easeInOutExpo');
  //   return false;
  // });
  // Initiate the wowjs animation library
  new WOW().init();

  // Initiate superfish on nav menu
  $('.nav-menu').superfish({
    animation: {
      opacity: 'show'
    },
    speed: 400
  });

  // Mobile Navigation
  if ($('#nav-menu-container').length) {
    var $mobile_nav = $('#nav-menu-container').clone().prop({
      id: 'mobile-nav'
    });
    $mobile_nav.find('> ul').attr({
      'class': '',
      'id': ''
    });

    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>');
    $('body').append('<div id="mobile-body-overly"></div>');
    $('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

    $(document).on('click', '.menu-has-children i', function(e) {
      $(this).next().toggleClass('menu-item-active');
      $(this).nextAll('ul').eq(0).slideToggle();
      $(this).toggleClass("fa-chevron-up fa-chevron-down");
    });

    $(document).on('click', '#mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
      $('#mobile-body-overly').toggle();
    });

    $(document).click(function(e) {
      var container = $("#mobile-nav, #mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
      }
    });
  } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
    $("#mobile-nav, #mobile-nav-toggle").hide();
  }

  // Header scroll class
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
    }
  });

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
  }

  // Smooth scroll for the menu and links with .scrollto classes
  $('.nav-menu a, #mobile-nav a, .scrollto').on('click', function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        var top_space = 0;

        if ($('#header').length) {
          top_space = $('#header').outerHeight();

          if (!$('#header').hasClass('header-scrolled')) {
            top_space = top_space - 20;
          }
        }

        $('html, body').animate({
          scrollTop: target.offset().top - top_space
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu').length) {
          $('.nav-menu .menu-active').removeClass('menu-active');
          $(this).closest('li').addClass('menu-active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Navigation active state on scroll
  var nav_sections = $('section');
  var main_nav = $('.nav-menu, #mobile-nav');
  var main_nav_height = $('#header').outerHeight();

  $(window).on('scroll', function() {
    var cur_pos = $(this).scrollTop();

    nav_sections.each(function() {
      var top = $(this).offset().top - main_nav_height,
        bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        main_nav.find('li').removeClass('menu-active menu-item-active');
        main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('menu-active menu-item-active');
      }
    });
  });

  // Intro carousel
  var introCarousel = $(".carousel");
  var introCarouselIndicators = $(".carousel-indicators");
  introCarousel.find(".carousel-inner").children(".carousel-item").each(function(index) {
    (index === 0) ?
    introCarouselIndicators.append("<li data-target='#introCarousel' data-slide-to='" + index + "' class='active'></li>"):
      introCarouselIndicators.append("<li data-target='#introCarousel' data-slide-to='" + index + "'></li>");

    $(this).css("background-image", "url('" + $(this).children('.carousel-background').children('img').attr('src') + "')");
    $(this).children('.carousel-background').remove();
  });

  $(".carousel").swipe({
    swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
      if (direction == 'left') $(this).carousel('next');
      if (direction == 'right') $(this).carousel('prev');
    },
    allowPageScroll: "vertical"
  });

  // Skills section
  $('#skills').waypoint(function() {
    $('.progress .progress-bar').each(function() {
      $(this).css("width", $(this).attr("aria-valuenow") + '%');
    });
  }, {
    offset: '80%'
  });

  // jQuery counterUp (used in Facts section)
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  // Porfolio isotope and filter
  var portfolioIsotope = $('.portfolio-container').isotope({
    itemSelector: '.portfolio-item',
    layoutMode: 'fitRows'
  });

  $('#portfolio-flters li').on('click', function() {
    $("#portfolio-flters li").removeClass('filter-active');
    $(this).addClass('filter-active');

    portfolioIsotope.isotope({
      filter: $(this).data('filter')
    });
  });

  // Clients carousel (uses the Owl Carousel library)
  $(".clients-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: {
      0: {
        items: 2
      },
      768: {
        items: 4
      },
      900: {
        items: 6
      }
    }
  });

  // Testimonials carousel (uses the Owl Carousel library)
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    autoplayTimeout: 1500,
    items: 1
  });

})(jQuery);

function displayChapters() {


  var chapterHTML = "";
  for (i = 1; i < 21; i++) {
    chapterHTML += '<div class="col-lg-3 col-sm-6 col-sm-1 ">';
    chapterHTML += '  <div class="chapter-text">';


    if (bookData[i].numberOfImages > 1) {
      chapterHTML += '      <h4>Chapter ' + i + '</h4>';
      chapterHTML += '    <p style="text-align: center; "><i>' + bookData[i].title + '</i></p>';
      chapterHTML += '    <figure>';
      chapterHTML += '    <div class="grid-multi">';
      for (j = 1; j <= bookData[i].numberOfImages; j++) {
        chapterHTML += '    <a href="img/Chapter-' + i + '/Chapter-' + i + '-' + j + '.jpg" data-fancybox="gallery" data-caption="' + bookData[i].captions[j - 1] + '"> <img src="img/Chapter-' + i + '/thumbnail_Chapter-' + i + '-' + j +
          '.jpg" class="image-chapter-multi" alt="Chapter ' + i + ' Image-' + j + '"></a>';
      }
      chapterHTML += '    </div>';
    } else {
      chapterHTML += '      <h4>Chapter ' + i + '</h4>';
      chapterHTML += '    <p style="text-align: center; "><i>' + bookData[i].title + '</i></p>';
      chapterHTML += '    <figure>';
      chapterHTML += '    <div class="chapter-grid">';
      chapterHTML += '    <a href="img/Chapter-' + i + '/Chapter-' + i + '.jpg" data-fancybox="gallery" data-caption="' + bookData[i].captions[0] + '"> <img src="img/Chapter-' + i + '/thumbnail_Chapter-' + i +
        '.jpg" class="image-chapter" alt="Chapter ' + i + ' Image"></a>';
      chapterHTML += '    </div>';
    }
    chapterHTML += '    </figure>';
    chapterHTML += '  </div>';
    chapterHTML += '  </div>';
  }
  return chapterHTML;
}

var resizeId;
window.addEventListener('resize', function() {
    clearTimeout(resizeId);
    resizeId = setTimeout(doneResizing, 500);
});

function doneResizing(){
  whenPageLoaded()
}


var galleryHTML = "";

function img_gallery_grid() {
  sum_width = 0;
  galleryRowPosition = 0;
  galleryHTML = '<div class="row_' + galleryRowArray[0] + ' galleryRow">'; // initialise first row of images
  for (i = 0; i < galleryItems.length; i++) {
    if(i>0) {
      if(galleryRowArray[i-1] != galleryRowArray[i]) {
    galleryHTML += '<div class="row_' + galleryRowArray[i] + ' galleryRow">'; // new

    }}
    galleryHTML += ' <div class="galleryRowItem box_' + i +'"  style="padding: 10px; width: ' + (galleryItems[i].width*galleryScaleArray[i]) + 'px;">';
    galleryHTML += '  <a href="' + galleryItems[i].src + '" class="photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
    galleryHTML += '   <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + galleryItems[i].height*galleryScaleArray[i] + 'px;">';
    galleryHTML += '   <div class="photo-text-more">';
    galleryHTML += '       <h3 class="heading" style="background-color: rgba(0, 0, 0, 0.6);">' + galleryItems[i].title + '</h3>';
    galleryHTML += '      <span class="icon icon-search"></span>';
    galleryHTML += '    </div>';
    galleryHTML += '  </a>';
    galleryHTML += '  </div>';
    sum_width += galleryItems[i].width*galleryScaleArray[i];
    if(galleryRowArray[i] != galleryRowArray[i+1]) {
      galleryHTML += ' </div>'; // close off the row div
      sum_width = 0; // reset the width for new row
      //galleryRowPosition += galleryItems[i].height*galleryScaleArray[i];
    }

  }
  return galleryHTML;
}


galleryRowArray = new Array(galleryItems.length);
galleryScaleArray = new Array(galleryItems.length);

var imageGap = 5; // matches the padding for individual image boxes

function calculate_image_rows(row_width_target, height_target) {

  var row_width_sum = 0;
  var current_row = 0;
  var number_images_in_row = 0;
  var next_i = 0;
  var hackVar = 0;
  if(row_width_target < 600) {
    height_target = height_target/2;
  }

  heightScale = height_target/galleryItems[0].height;
  for (i = 0; i < galleryItems.length; i++) {
    scaled_width = galleryItems[i].width * heightScale;
    if((scaled_width + 20)/2 > row_width_target){
      scaled_width = galleryItems[i].width * heightScale/2;
    }
    row_width_sum += scaled_width;
    number_images_in_row += 1;
    //console.log("i= "+i+" sum= "+row_width_sum);
    if (row_width_sum >= row_width_target) {

      under_guess = row_width_sum - row_width_target - scaled_width;
      over_guess = (row_width_sum - row_width_target);
      //console.log(over_guess + ", " + under_guess);
      if ((over_guess + under_guess) > 0) { //under_guess was closer
        //console.log("lower");
        next_i = -1; // need to back up i loop to pick up image not used
        number_images_in_row -=1;
        row_scale = (row_width_target - ((number_images_in_row-1)*imageGap)) / (row_width_sum - scaled_width);
        hackVar=0;
      } else {
        //console.log("higher");
        row_scale = (row_width_target - ((number_images_in_row-1)*imageGap)) / row_width_sum;
        next_i = 0;
        hackVar=1;
      }
      //console.log("i= "+i+" number_images_in_row= "+ number_images_in_row + " next_i= " + next_i);
      for (j = (i - number_images_in_row+hackVar); j < (i+hackVar); j++) {
        //console.log(j + ":  " + number_images_in_row  + ":  " + galleryItems[j].width);
        //galleryItems[j].width *= row_scale;
        //galleryItems[j].height *= row_scale;
        galleryRowArray[j] = current_row;
        galleryScaleArray[j] = row_scale*heightScale;
      }

      number_images_in_row = 0;
      current_row += 1;
      row_width_sum = 0;
      i = i + next_i;
      continue;

    } else if (i == (galleryItems.length-1)){
      for (j = (i - number_images_in_row+1); j <= i; j++) {
        //console.log(j + ":  " + number_images_in_row);
        //console.log(galleryItems[j].msrc);
        //galleryItems[j].width *= row_scale;
        //galleryItems[j].height *= row_scale;
        galleryRowArray[j] = current_row;
        galleryScaleArray[j] = 1.0*heightScale;
      }

    }

  }
  //console.log(galleryRowArray);
  //console.log(galleryScaleArray);
}

function img_gallery_tile_flex(size) { // old method of tiling images
  //console.log(items.length);
  if (size == "large") {
    var rowHeight = "300px";
    for (i = 0; i < galleryItems.length; i++) {
      //console.log(galleryItems[i].src + ", " + galleryItems[i].msrc);
      galleryHTML += '<div class="col-6 col-md-6 col-lg-3" data-aos="fade-up">';
      galleryHTML += '  <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '   <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '   <div class="photo-text-more">';
      galleryHTML += '       <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '      <span class="icon icon-search"></span>';
      galleryHTML += '    </div>';
      galleryHTML += '  </a>';
      galleryHTML += '</div>';
      if (i == items.length) break;
      galleryHTML += '<div class="col-6 col-md-6 col-lg-6" data-aos="fade-up" data-aos-delay="100">';
      galleryHTML += '  <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '    <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '    <div class="photo-text-more">';
      galleryHTML += '      <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '      <span class="icon icon-search"></span>';
      galleryHTML += '    </div>';
      galleryHTML += '  </a>';
      galleryHTML += '</div>';
      if (i == items.length) break;
      galleryHTML += '<div class="col-6 col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="200">';
      galleryHTML += ' <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '    <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '    <div class="photo-text-more">';
      galleryHTML += '      <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '      <span class="icon icon-search"></span>';
      galleryHTML += '    </div>';
      galleryHTML += '  </a>';
      galleryHTML += '</div>';
      if (i == items.length) break;
      galleryHTML += '<div class="col-6 col-md-6 col-lg-8" data-aos="fade-up">';
      galleryHTML += '  <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '    <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '    <div class="photo-text-more">';
      galleryHTML += '      <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '      <span class="icon icon-search"></span>';
      galleryHTML += '    </div>';
      galleryHTML += '  </a>';
      galleryHTML += '</div>';
      if (i == items.length) break;
      galleryHTML += '<div class="col-6 col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="100">';
      galleryHTML += '  <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '    <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '    <div class="photo-text-more">';
      galleryHTML += '      <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '      <span class="icon icon-search"></span>';
      galleryHTML += '    </div>';
      galleryHTML += '  </a>';
      galleryHTML += '</div>';
      if (i == items.length) break;
      galleryHTML += '<div class="col-6 col-md-6 col-lg-6" data-aos="fade-up">';
      galleryHTML += '  <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '    <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '    <div class="photo-text-more">';
      galleryHTML += '      <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '      <span class="icon icon-search"></span>';
      galleryHTML += '    </div>';
      galleryHTML += '  </a>';
      galleryHTML += '</div>';
      if (i == items.length) break;
      galleryHTML += '<div class="col-6 col-md-6 col-lg-6" data-aos="fade-up" data-aos-delay="100">';
      galleryHTML += ' <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '   <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '   <div class="photo-text-more">';
      galleryHTML += '      <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '     <span class="icon icon-search"></span>';
      galleryHTML += '    </div>';
      galleryHTML += '  </a>';
      galleryHTML += '</div>';
      if (i == items.length) break;
      galleryHTML += '<div class="col-6 col-md-6 col-lg-4" data-aos="fade-up">';
      galleryHTML += ' <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '   <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '   <div class="photo-text-more">';
      galleryHTML += '      <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '     <span class="icon icon-search"></span>';
      galleryHTML += '   </div>';
      galleryHTML += ' </a>';
      galleryHTML += '</div>';
      if (i == items.length) break;
      galleryHTML += '<div class="col-6 col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="100">';
      galleryHTML += ' <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '   <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '   <div class="photo-text-more">';
      galleryHTML += '      <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '     <span class="icon icon-search"></span>';
      galleryHTML += '   </div>';
      galleryHTML += ' </a>';
      galleryHTML += '</div>';
      if (i == items.length) break;
      galleryHTML += '<div class="col-6 col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="200">';
      galleryHTML += ' <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '   <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '   <div class="photo-text-more">';
      galleryHTML += '      <h3 class="heading">' + galleryItems[i].title + '</h3>';
      galleryHTML += '     <span class="icon icon-search"></span>';
      galleryHTML += '    </div>';
      galleryHTML += ' </a>';
      galleryHTML += '</div>';

    }
    return galleryHTML;
  } else if (size == "small") {
    var rowHeight = "125px";
    for (i = 0; i < items.length; i++) {
      //console.log(galleryItems[i].src + ", " + galleryItems[i].msrc);
      galleryHTML += '<div class="col-6 col-md-6 col-lg-2" data-aos="fade-up">';
      galleryHTML += '  <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '   <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '   <div class="photo-text-more">';
      galleryHTML += '       <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '      <span class="icon icon-search"></span>';
      galleryHTML += '    </div>';
      galleryHTML += '  </a>';
      galleryHTML += '</div>';
      if (i == items.length) break;
      galleryHTML += '<div class="col-6 col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="100">';
      galleryHTML += '  <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '    <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '    <div class="photo-text-more">';
      galleryHTML += '      <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '      <span class="icon icon-search"></span>';
      galleryHTML += '    </div>';
      galleryHTML += '  </a>';
      galleryHTML += '</div>';
      if (i == items.length) break;
      galleryHTML += '<div class="col-6 col-md-6 col-lg-2" data-aos="fade-up" data-aos-delay="200">';
      galleryHTML += ' <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '    <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '    <div class="photo-text-more">';
      galleryHTML += '      <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '      <span class="icon icon-search"></span>';
      galleryHTML += '    </div>';
      galleryHTML += '  </a>';
      galleryHTML += '</div>';
      if (i == items.length) break;
      galleryHTML += '<div class="col-6 col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="200">';
      galleryHTML += ' <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '    <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '    <div class="photo-text-more">';
      galleryHTML += '      <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '      <span class="icon icon-search"></span>';
      galleryHTML += '    </div>';
      galleryHTML += '  </a>';
      galleryHTML += '</div>';
      if (i == items.length) break;
      galleryHTML += '<div class="col-6 col-md-6 col-lg-2" data-aos="fade-up">';
      galleryHTML += '  <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '    <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '    <div class="photo-text-more">';
      galleryHTML += '      <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '      <span class="icon icon-search"></span>';
      galleryHTML += '    </div>';
      galleryHTML += '  </a>';
      galleryHTML += '</div>';
      if (i == items.length) break;

      galleryHTML += '<div class="col-6 col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="100">';
      galleryHTML += '  <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '    <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '    <div class="photo-text-more">';
      galleryHTML += '      <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '      <span class="icon icon-search"></span>';
      galleryHTML += '    </div>';
      galleryHTML += '  </a>';
      galleryHTML += '</div>';
      if (i == items.length) break;
      galleryHTML += '<div class="col-6 col-md-6 col-lg-2" data-aos="fade-up">';
      galleryHTML += '  <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '    <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '    <div class="photo-text-more">';
      galleryHTML += '      <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '      <span class="icon icon-search"></span>';
      galleryHTML += '    </div>';
      galleryHTML += '  </a>';
      galleryHTML += '</div>';
      if (i == items.length) break;
      galleryHTML += '<div class="col-6 col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="100">';
      galleryHTML += ' <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '   <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '   <div class="photo-text-more">';
      galleryHTML += '      <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '     <span class="icon icon-search"></span>';
      galleryHTML += '    </div>';
      galleryHTML += '  </a>';
      galleryHTML += '</div>';
      if (i == items.length) break;
      galleryHTML += '<div class="col-6 col-md-6 col-lg-2" data-aos="fade-up">';
      galleryHTML += ' <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '   <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '   <div class="photo-text-more">';
      galleryHTML += '      <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '     <span class="icon icon-search"></span>';
      galleryHTML += '   </div>';
      galleryHTML += ' </a>';
      galleryHTML += '</div>';
      if (i == items.length) break;
      galleryHTML += '<div class="col-6 col-md-6 col-lg-2" data-aos="fade-up" data-aos-delay="100">';
      galleryHTML += ' <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '   <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '   <div class="photo-text-more">';
      galleryHTML += '      <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '     <span class="icon icon-search"></span>';
      galleryHTML += '   </div>';
      galleryHTML += ' </a>';
      galleryHTML += '</div>';
      if (i == items.length) break;

      galleryHTML += '<div class="col-6 col-md-6 col-lg-3" data-aos="fade-up">';
      galleryHTML += '  <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '    <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '    <div class="photo-text-more">';
      galleryHTML += '      <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '      <span class="icon icon-search"></span>';
      galleryHTML += '    </div>';
      galleryHTML += '  </a>';
      galleryHTML += '</div>';
      if (i == items.length) break;
      galleryHTML += '<div class="col-6 col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="100">';
      galleryHTML += ' <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '   <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '   <div class="photo-text-more">';
      galleryHTML += '      <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '     <span class="icon icon-search"></span>';
      galleryHTML += '    </div>';
      galleryHTML += '  </a>';
      galleryHTML += '</div>';
      if (i == items.length) break;
      galleryHTML += '<div class="col-6 col-md-6 col-lg-3" data-aos="fade-up">';
      galleryHTML += ' <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '   <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '   <div class="photo-text-more">';
      galleryHTML += '      <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '     <span class="icon icon-search"></span>';
      galleryHTML += '   </div>';
      galleryHTML += ' </a>';
      galleryHTML += '</div>';
      if (i == items.length) break;
      galleryHTML += '<div class="col-6 col-md-6 col-lg-3" data-aos="fade-up">';
      galleryHTML += ' <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '   <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '   <div class="photo-text-more">';
      galleryHTML += '      <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '     <span class="icon icon-search"></span>';
      galleryHTML += '   </div>';
      galleryHTML += ' </a>';
      galleryHTML += '</div>';
      if (i == items.length) break;

      galleryHTML += '<div class="col-6 col-md-6 col-lg-4" data-aos="fade-up">';
      galleryHTML += '  <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '    <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '    <div class="photo-text-more">';
      galleryHTML += '      <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '      <span class="icon icon-search"></span>';
      galleryHTML += '    </div>';
      galleryHTML += '  </a>';
      galleryHTML += '</div>';
      if (i == items.length) break;
      galleryHTML += '<div class="col-6 col-md-6 col-lg-2" data-aos="fade-up" data-aos-delay="100">';
      galleryHTML += ' <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '   <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '   <div class="photo-text-more">';
      galleryHTML += '      <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '     <span class="icon icon-search"></span>';
      galleryHTML += '    </div>';
      galleryHTML += '  </a>';
      galleryHTML += '</div>';
      if (i == items.length) break;
      galleryHTML += '<div class="col-6 col-md-6 col-lg-3" data-aos="fade-up">';
      galleryHTML += ' <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '   <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '   <div class="photo-text-more">';
      galleryHTML += '      <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '     <span class="icon icon-search"></span>';
      galleryHTML += '   </div>';
      galleryHTML += ' </a>';
      galleryHTML += '</div>';
      if (i == items.length) break;
      galleryHTML += '<div class="col-6 col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="100">';
      galleryHTML += ' <a href="' + galleryItems[i].src + '" class="d-block photo-item" data-fancybox="gallery" data-caption="' + galleryItems[i].title + '">';
      galleryHTML += '   <img src="' + galleryItems[i].msrc + '" alt="Image" class="img-fluid" style="height: ' + rowHeight + ';">';
      galleryHTML += '   <div class="photo-text-more">';
      galleryHTML += '      <h3 class="heading">' + galleryItems[i++].title + '</h3>';
      galleryHTML += '     <span class="icon icon-search"></span>';
      galleryHTML += '   </div>';
      galleryHTML += ' </a>';
      galleryHTML += '</div>';

    }
    return galleryHTML;
  }
}
