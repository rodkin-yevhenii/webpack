import { setLoader, showPopup } from './main'

const $ = window.jQuery
const API = {
  sendForm: function (data) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        type: 'POST',
        url: '/wp-admin/admin-ajax.php',
        cache: false,
        dataType: 'json',
        data
      }).done(function (response) {
        if (!response.status) {
          reject({
            title: response.error.title,
            text: response.error.message
          })
        }
        resolve(response.data)
      }).fail(function (err) {
        reject(err)
      })
    })
  }
}
// eslint-disable-next-line no-undef
jQuery(document).ready(function ($) {
  const contactsForm = $('#contacts-form form')

  contactsForm.validate({
    ignore: '.not-validate',
    submitHandler: handleFormSubmit,
    focusInvalid: false,
    invalidHandler: function (form, validator) {
    },
    highlight: function (element, errorClass, validClass) {
      $(element).addClass(errorClass).removeClass(validClass)
      $(element).closest('.form__field')
        .addClass(errorClass)
    },
    unhighlight: function (element, errorClass, validClass) {
      $(element).removeClass(errorClass).addClass(validClass)
      $(element).closest('.form__field')
        .removeClass(errorClass)
    },
    rules: {
      name: {
        required: true,
        minlength: 2,
        maxlength: 48
      },
      phone: {
        required: true,
        minlength: 18
      }
    },
    messages: {
      name: {
        required: 'Заполните поле',
        minlength: 'Слишком короткое имя',
        maxlength: 'Слишком длинное имя, макс. 48 символов'
      },
      phone: {
        required: 'Заполните поле',
        minlength: 'Мобильный телефон слишком короткий'
      }
    }
  })

  contactsForm.on('submit', function (e) {
    e.preventDefault()
  })

  function handleFormSubmit (form) {
    const formEl = $(form)
    setLoader(formEl, true)
    API.sendForm(formEl.serialize()).then(function () {
      setLoader(formEl, false)
      showPopup('#popup-success', null, false, {
        showCloseBtn: false
      })
    }).catch(function () {
      setLoader(formEl, false)
      showPopup('#popup-error', null, false, {
        showCloseBtn: false
      })
    })
  }
})
