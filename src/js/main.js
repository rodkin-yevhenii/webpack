const $ = window.jQuery

jQuery(document).ready(function ($) {
  const header = $('.header')
  const sectionSlider = $('.section__slider .slider')
  const article = $('.article')
  const btnToTop = $('.btn-to-top')
  const btnMenu = $('.btn-menu')
  const mobileMenu = $('.menu-mobile')

  initPopupImageGallery($('.gallery'))

  if (sectionSlider.length > 0) {
    sectionSlider.each(function (i, slider) {
      const sliderDOM = $(slider)
      const sliderDOMPrevBtn = sliderDOM.closest('.section').find('.btn-arrow--left')
      const sliderDOMNextBtn = sliderDOM.closest('.section').find('.btn-arrow--right')

      sliderDOMPrevBtn.on('click', function () {
        sliderDOM.slick('slickPrev')
      })

      sliderDOMNextBtn.on('click', function () {
        sliderDOM.slick('slickNext')
      })

      sliderDOM.slick({
        rows: 0,
        slidesToShow: 4,
        arrows: false,
        slidesToScroll: 1,
        dots: false,
        infinite: true,
        speed: 200,
        adaptiveHeight: false,
        autoplay: false,
        cssEase: 'linear',
        responsive: [
          {
            breakpoint: 1700,
            settings: {
              slidesToShow: 3
            }
          },
          {
            breakpoint: 1260,
            settings: {
              slidesToShow: sliderDOM.hasClass('slider-projects') ? 3 : 5
            }
          },
          {
            breakpoint: 1023,
            settings: {
              slidesToShow: sliderDOM.hasClass('slider-projects') ? 2 : 4
            }
          },
          {
            breakpoint: 560,
            settings: {
              slidesToShow: sliderDOM.hasClass('slider-projects') ? 1 : 2,
              swipeToSlide: true
            }
          }
        ]
      })
    })
  }

  if (article.length > 0) {
    article.fitVids()
  }

  header.on('click', '.btn-menu', function () {
    if (!mobileMenu.hasClass('open')) {
      openMobileMenu()
    } else {
      closeMobileMenu()
    }
  })

  header.on('click', '.btn-search', function (e) {
    e.stopPropagation()
    $('.header__search .form').toggleClass('visible')
  })

  header.on('click', '.menu-mobile__content', function (e) {
    e.stopPropagation()
  })

  $(document).on('click', function (e) {
    const target = $(e.target)

    const isCloseMenu =
      (!(target.hasClass('.btn-menu') || target.closest('.btn-menu').length) ||
      (target.hasClass('.btn-close') || target.closest('.btn-close').length)) &&
      !(target.hasClass('.menu-mobile__content') || target.closest('.menu-mobile__content').length)

    if (isCloseMenu) {
      e.stopPropagation()
      closeMobileMenu()
    }
  })

  $(window).on('scroll', function () {
    if (window.scrollY > 0) {
      header.addClass('header--sticky')
    } else {
      header.removeClass('header--sticky')
    }

    if (window.scrollY > window.innerHeight) {
      btnToTop.addClass('visible')
    } else {
      btnToTop.removeClass('visible')
    }
  })

  function openMobileMenu () {
    btnMenu.addClass('active')
    header.addClass('active')
    mobileMenu.fadeIn(function () {
      $(this).addClass('open')
    })
    $(document.body).addClass('not-scrolling')
  }

  function closeMobileMenu () {
    btnMenu.removeClass('active')
    header.removeClass('active')
    mobileMenu.removeClass('open')
    setTimeout(function () {
      mobileMenu.fadeOut()
    }, 300)
    $(document.body).removeClass('not-scrolling')
  }

  $(document).on('click', '[data-popup-open]', function (e) {
    e.preventDefault()

    const popupId = $(e.currentTarget).data('popup-open')
    let title = $(e.currentTarget).data('popup-title')
    title = title || null
    showPopup(popupId, title)
  })

  $(document).on('click', '[data-popup-close]', function (e) {
    e.preventDefault()
    const popup = $(e.currentTarget).closest('popup')
    popup.magnificPopup('close')
  })

  mobileMenu.on('click', '.nav > ul > li', function (e) {
    const target = $(e.target)
    const submenu = target.closest('li').find('.nav__sub')

    if (!target.is('a')) {
      e.preventDefault()
      const item = submenu.closest('li')
      target.closest('.nav').find('li').not(item[0]).removeClass('visible-submenu')

      if (submenu.length > 0) {
        if (!item.hasClass('visible-submenu')) {
          item.addClass('visible-submenu')
        } else {
          item.removeClass('visible-submenu')
        }
      }
    }
  })

  mobileMenu.on('click', '.nav__sub', function (e) {
    e.stopPropagation()
  })

  const phoneInputDOM = $('input[name="phone"]')
  initInputMask(phoneInputDOM)

  $('.form__field').on('focusout', 'input', function (e) {
    const input = $(e.target)

    if (input.val() === '') {
      input.removeClass('is-not-empty')
    } else {
      input.addClass('is-not-empty')
    }
  })

  btnToTop.on('click', function (e) {
    e.preventDefault()
    scrollTo(0)
  })

  initScrollToAnchor()

  initToggleMenu()
})

function safePropValueOr (obj, path, defaultValue = null) {
  if (!path) return defaultValue
  let val = path.split('.').reduce((acc, item) => {
    if (!acc) return acc

    return acc[item]
  }, obj)

  if (val === undefined || val === null || val === '') {
    val = defaultValue
  }

  return val
}

function setPopupContent (id, data) {
  const popup = jQuery(id)

  if ($.isEmptyObject(data)) {
    return false
  }

  const title = safePropValueOr(data, 'title', null)
  const text = safePropValueOr(data, 'message', null)

  title && popup.find('.popup-title-js').text(title)
  text && popup.find('.popup-text-js').text(text)
}

function callbackBeforeOpen () {
  this.st.mainClass = 'mfp-zoom-in'
  document.body.classList.add('fixed')
}

function callbackBeforeClose () {
  const cart = this.contentContainer.find('.cart')
  if (cart.length > 0) {
    $('.product .quantity__input').val(1)
  }
}

function callbackOpen () {
  document.body.insertAdjacentHTML(
    'beforeend',
    '<div class="mfp-overlay"></div>'
  )
}

function callbackClose () {
  const el = document.querySelector('.mfp-overlay')
  document.body.removeChild(el)
  document.body.classList.remove('fixed')
}

export function showPopup (id, data, disabledClose, options) {
  setPopupContent(id, data)
  const baseOptions = {
    items: {
      src: id
    },
    type: 'inline',
    removalDelay: 500,
    closeOnBgClick: !disabledClose && true,
    showCloseBtn: !disabledClose && true,
    enableEscapeKey: !disabledClose && true,
    midClick: !disabledClose && true,
    callbacks: {
      beforeOpen: callbackBeforeOpen,
      beforeClose: callbackBeforeClose,
      open: callbackOpen,
      close: callbackClose
    },
    ...options
  }

  $.magnificPopup.open(baseOptions)
}

function scrollTo (offset) {
  $('html, body').stop().animate({
    scrollTop: offset
  }, 1000, 'linear')
}

function initInputMask (inputPhone) {
  if (inputPhone.length) {
    $.each(inputPhone, function (index, input) {
      if (!$(input).inputmask('hasMaskedValue')) {
        $(input).inputmask(
          '+38 (999) 999-99-99',
          { placeholder: '_' }
        )
      }
    })
  } else {
    return false
  }
}

function destroySlider (slider) {
  if (slider.length && slider.hasClass('slick-initialized')) {
    slider.slick('unslick')
  }
}

function initPopupImageGallery (gallery) {
  if (!(gallery.length > 0)) {
    return false
  }

  gallery.each(function () {
    $(this).magnificPopup({
      delegate: 'a',
      type: 'image',
      closeOnContentClick: false,
      closeBtnInside: false,
      mainClass: 'mfp-with-zoom mfp-img-mobile',
      image: {
        verticalFit: true,
        titleSrc: function (item) {
          return item.el.attr('title') || ''
        }
      },
      gallery: {
        enabled: true,
        arrowMarkup: setBtnTemplate('%dir%')
      },
      zoom: {
        enabled: true,
        duration: 300,
        opener: function (element) {
          return element.find('img')
        }
      }
    })
  })
}

function initScrollToAnchor () {
  $(document).on('click', 'a[data-anchor]', function (e) {
    e.preventDefault()
    const link = $(e.currentTarget)
    const id = link.attr('href')
    const current = $(id)

    if (!id) {
      return false
    }

    let offset = current.offset().top + 2
    offset -= getFirstChildTopOffset(current)

    scrollTo(offset)
  })

  $(window).on('load scroll', function () {
    const scrollTop = window.pageYOffset

    $('[data-anhor-item]').each(function (i, el) {
      const id = $(el).attr('id')

      if (!id) {
        return false
      }

      const current = $(el)
      let min = Math.ceil(current.offset().top)
      const max = Math.ceil(current.offset().top + current.outerHeight())

      min -= getFirstChildTopOffset(current)

      const link = $('[data-anchor][href="#' + id + '"]')

      if (min <= scrollTop && max >= scrollTop) {
        link.addClass('active')
        link.parent().addClass('current')
      } else {
        link.removeClass('active')
        link.parent().removeClass('current')
      }
    })
  })

  function getFirstChildTopOffset (el) {
    if (el.is(':first-child')) {
      if (parseInt(el.css('padding-top'), 10) === 0) {
        return parseInt(el.closest('section').css('padding-top'))
      } else {
        return parseInt(el.css('padding-top')) + parseInt(el.closest('section').css('padding-top'))
      }
    } else {
      return 0
    }
  }
}

function initToggleMenu () {
  $(document).on('click', '[data-toggle]', function (e) {
    const el = $(e.target)
    const menu = $(e.currentTarget)
    const menuItems = $(e.currentTarget).find('ul')
    const condition = (el.is('[data-toggle-menu]') || el.closest('[data-toggle-menu]').length > 0) ||
                      (el.is('a[data-anchor]'))
    const wWidth = $(window).width()

    if (condition && wWidth < 560) {
      if (menu.hasClass('opened')) {
        menu.removeClass('opened')
        menuItems.slideUp()
      } else {
        menu.addClass('opened')
        menuItems.slideDown()
      }
    }
  })

  $(window).on('resize', function () {
    const menu = $('[data-toggle]')
    menu.removeClass('opened')
    menu.find('ul').attr('style', '')
  })
}

function setBtnTemplate (dir = 'left') {
  return `<span class="btn btn--secondary btn--square btn-arrow btn-arrow--${dir}">
                <svg class="icon">
                    <use xlink:href="/wp-content/themes/tigerpro/frontend/src/img/icons-sprite.svg#icon-arrow-${dir}"></use>
                </svg>
            </span>`
}

const getLoaderTemplate = function () {
  return '<div class="loader">\n' +
    '    <div ></div>\n' +
    '    <svg class="icon icon--extra-lg"\n' +
    '         version="1.1" id="L9"\n' +
    '         xmlns="http://www.w3.org/2000/svg"\n' +
    '         xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n' +
    '         viewBox="0 0 100 100" enable-background="new 0 0 0 0"\n' +
    '         xml:space="preserve">\n' +
    '            <path fill="#30609A" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">\n' +
    '                  <animateTransform\n' +
    '                          attributeName="transform"\n' +
    '                          attributeType="XML"\n' +
    '                          type="rotate"\n' +
    '                          dur="1s"\n' +
    '                          from="0 50 50"\n' +
    '                          to="360 50 50"\n' +
    '                          repeatCount="indefinite" />\n' +
    '          </path>\n' +
    '    </svg>\n' +
    '</div>'
}

export function setLoader (container, loading) {
  if (container.length <= 0) {
    return false
  }

  const loader = getLoaderTemplate()
  if (loading) {
    $(container).append(loader)
  } else {
    $(container).find('.loader').remove()
  }
}

(function ($) {
  $.fn.inputNumber = function (inputNumber) {
    this.addClass('number')
    this.on('input keydown keyup mousedown mouseup select contextmenu drop', function () {
      if (inputNumber(this.value)) {
        this.oldValue = this.value
        this.oldSelectionStart = this.selectionStart
        this.oldSelectionEnd = this.selectionEnd
        // eslint-disable-next-line no-prototype-builtins
      } else if (this.hasOwnProperty('oldValue')) {
        this.value = this.oldValue
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd)
      } else {
        this.value = ''
      }
    })

    this.on('input keydown keyup mousedown mouseup', function () {
      const min = +this.getAttribute('min')
      const max = +this.getAttribute('max')

      if (this.value > max) {
        this.value = max
      }

      if (this.value < min) {
        this.value = min
      }
    })

    return this
  }
}(jQuery))
