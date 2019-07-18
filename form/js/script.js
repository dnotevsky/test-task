var form = $('.subscription')

form.on('submit', function(e) {
  e.preventDefault();

  var currentForm = $(this);
  var fields = currentForm.find('.subscription__input');
  var submitBtn = currentForm.find('.subscription__submit');
  var isErrors = validateFields(currentForm, fields);

  if(Object.keys(isErrors).length === 0 ) {
    cleanField(currentForm, fields);
    submitBtn.attr('disabled', 'disabled');
    submitBtn.text('Отправляем...');

    // submit form
    var jqxhr = $.post( "/codebase/index.php", currentForm.serialize());
    jqxhr.done(function() {
      submitBtn.removeAttr('disabled');
      submitBtn.text('Подписаться');
      form.addClass('successfully');
    })
    .fail(function(xhr, status, error) {
      // error handle
      submitBtn.removeAttr('disabled');
      submitBtn.text('Подписаться');
      console.log(error);
    });
    /*
    setTimeout(function() {
      submitBtn.removeAttr('disabled');
      submitBtn.text('Подписаться')
      form.addClass('successfully');
    }, 2000)*/
  } else {
    submitBtn.attr('disabled', 'disabled');
  }

  fields.on('input', function() {
    isErrors = validateFields(currentForm, fields);
    $(this).parent().removeClass('error');

    if(!isErrors.user_email) {
      currentForm.removeClass('invalid-email');
    }

    if(Object.keys(isErrors).length === 0 ) {
      submitBtn.removeAttr('disabled');
    }
  })
})

function validateFields(ctx, fields) {
  var errors = {}
  fields.each(function(_, el) {
    if(el.value.length > 0) {
      $(el).parent().removeClass('error');
    } else {
      var errorName = el.name;
      errors[errorName] = 'Поле должно быть заполнено';
      ctx.removeClass('invalid-email');
      $(el).parent().addClass('error');
      return;
    }

    if(el.name === 'user_email' && !validateEmail(el.value)) {
      var errorName = el.name;
      errors[errorName] = 'Кажется, вы ввели несуществующий email';
      ctx.addClass('invalid-email');
      $(el).parent().addClass('error');
    }
  })

  return errors
}

function cleanField(ctx, fields) {
  ctx.removeClass('invalid-email');
  fields.each(function(_, el) {
    $(el).parent().removeClass('error');
  })
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}