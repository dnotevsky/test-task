var form = $('.subscription');

form.on('submit', function(e) {
  e.preventDefault();

  var currentForm = $(this);
  var fields = currentForm.find('.subscription__input');
  var submitBtn = currentForm.find('.subscription__submit');
  var isErrors = validateFields(fields);

  if(checkErrors(isErrors, submitBtn)) {
    cleanField(fields);
    submitBtn.attr('disabled', 'disabled');
    submitBtn.text('Отправляем...');

    // submit form
    var jqxhr = $.post( "/codebase/index.php", currentForm.serialize());
    jqxhr.done(function() {
      submitBtn.removeAttr('disabled');
      submitBtn.text('Подписаться');
      currentForm.addClass('successfully');
    })
    .fail(function(xhr, status, error) {
      // error handle
      submitBtn.removeAttr('disabled');
      submitBtn.text('Подписаться');
      console.log(error);
    });
    // setTimeout(function() {
    //   // submit form
    //   submitBtn.removeAttr('disabled');
    //   submitBtn.text('Подписаться')
    //   currentForm.addClass('successfully');
    // }, 2000)
  } else {
    errorHandle(fields, isErrors);
    checkErrors(isErrors, submitBtn);
  }

  fields.on('input', function() {
    isErrors = validateFields(fields);
    errorHandle(fields, isErrors);
    checkErrors(isErrors, submitBtn);
  })
})

function errorHandle(fields, errors) {
  fields.each(function(_, el) {
    if(errors[el.name].length > 0) {
      $(el).parent().find('.subscription__invalid-desc').text(errors[el.name]);
      $(this).parent().addClass('error');
    } else {
      $(el).parent().find('.subscription__invalid-desc').text(errors[el.name]);
      $(this).parent().removeClass('error');
    }
  })
}

function checkErrors(errors, button) {
  var errorStatus = false;
  for (var error in errors) {
    if(errors[error].length > 0) {
      button.attr('disabled', 'disabled');
      return errorStatus = false;
    } else {
      button.removeAttr('disabled');
      errorStatus = true;
    }
  }

  return errorStatus;
}

function validateFields(fields) {
  var errors = {};
  fields.each(function(_, el) {
    if(el.value.length > 0) {
      var errorName = el.name;
      errors[errorName] = '';
    } else {
      var errorName = el.name;
      errors[errorName] = 'Поле должно быть заполнено';
      return;
    }

    if(el.name === 'user_email' && !validateEmail(el.value)) {
      var errorName = el.name;
      errors[errorName] = 'Кажется, вы ввели несуществующий email';
    }
  })

  return errors;
}

function cleanField(fields) {
  fields.each(function(_, el) {
    $(el).parent().removeClass('error');
  })
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
