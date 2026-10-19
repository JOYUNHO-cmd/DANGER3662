'use strict';

/* Local interactions only. No transmission or persistence of form values. */
(function () {
  document.documentElement.classList.add('js');

  var menuToggle = document.getElementById('menu-toggle');
  var primaryNav = document.getElementById('primary-nav');

  if (menuToggle && primaryNav) {
    menuToggle.removeAttribute('hidden');

    function closeMenu(restoreFocus) {
      document.body.classList.remove('nav-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      if (restoreFocus) menuToggle.focus();
    }

    menuToggle.addEventListener('click', function () {
      var expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      document.body.classList.toggle('nav-open', !expanded);
      menuToggle.setAttribute('aria-expanded', String(!expanded));
    });

    primaryNav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && document.body.classList.contains('nav-open')) {
        closeMenu(true);
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeMenu(false);
    });
  }

  // 캐릭터 움직임 멈추기/켜기 (저장하지 않음, 페이지마다 기본값으로 시작)
  var motionToggle = document.getElementById('motion-toggle');
  if (motionToggle) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var setMotion = function (off) {
      document.documentElement.classList.toggle('motion-off', off);
      motionToggle.setAttribute('aria-pressed', String(off));
      motionToggle.textContent = off ? '▶ 움직임 켜기' : '■ 움직임 멈추기';
    };
    setMotion(Boolean(reduce));
    motionToggle.hidden = false;
    motionToggle.addEventListener('click', function () {
      setMotion(!document.documentElement.classList.contains('motion-off'));
    });
  }

  var form = document.getElementById('contact-form');
  if (!form) return;

  var fields = document.getElementById('contact-fields');
  var phone = document.getElementById('contact-phone');
  var helpOptions = Array.from(form.querySelectorAll('input[name="help"]'));
  var helpGroup = document.getElementById('help-group');
  var phoneError = document.getElementById('phone-error');
  var helpError = document.getElementById('help-error');
  var summary = document.getElementById('form-errors');
  var errorList = document.getElementById('form-error-list');
  var status = document.getElementById('contact-status');
  var attempted = false;

  // Keep Enter, scripts, and browser form behavior from submitting anything.
  form.addEventListener('submit', function (event) {
    event.preventDefault();
  });

  function hideStatus() {
    status.hidden = true;
    status.textContent = '';
  }

  function getErrors() {
    var errors = [];
    var phoneText = phone.value.trim();
    var digits = phoneText.replace(/\D/g, '');
    if (!phoneText) {
      errors.push({
        field: phone,
        message: '연락처 형식을 확인할 테스트용 값을 입력해 주세요.'
      });
    } else if (!/^[0-9+()\s-]+$/.test(phoneText) || digits.length < 7 || digits.length > 15) {
      errors.push({
        field: phone,
        message: '숫자 7~15자리와 공백, 하이픈(-), 괄호, +만 사용할 수 있습니다. 실제 번호 대신 테스트용 값을 입력해 주세요.'
      });
    }
    if (!helpOptions.some(function (option) { return option.checked; })) {
      errors.push({
        field: helpOptions[0],
        message: '필요한 도움을 하나 선택해 주세요. 아직 잘 모르겠다는 항목도 선택할 수 있습니다.'
      });
    }
    return errors;
  }

  function renderErrors(errors) {
    var phoneIssue = errors.find(function (issue) { return issue.field === phone; });
    var helpIssue = errors.find(function (issue) { return issue.field === helpOptions[0]; });
    phone.setAttribute('aria-invalid', String(Boolean(phoneIssue)));
    phone.setCustomValidity(phoneIssue ? phoneIssue.message : '');
    phoneError.textContent = phoneIssue ? phoneIssue.message : '';
    phoneError.hidden = !phoneIssue;
    helpGroup.setAttribute('aria-invalid', String(Boolean(helpIssue)));
    helpOptions.forEach(function (option) {
      option.setAttribute('aria-invalid', String(Boolean(helpIssue)));
    });
    helpError.textContent = helpIssue ? helpIssue.message : '';
    helpError.hidden = !helpIssue;
    errorList.replaceChildren();
    errors.forEach(function (issue) {
      var item = document.createElement('li');
      var link = document.createElement('a');
      link.href = '#' + issue.field.id;
      link.textContent = issue.message;
      item.appendChild(link);
      errorList.appendChild(item);
    });
    summary.hidden = errors.length === 0;
  }

  summary.addEventListener('click', function (event) {
    var link = event.target.closest('a');
    if (!link) return;
    var target = document.getElementById(link.getAttribute('href').slice(1));
    if (target) {
      event.preventDefault();
      target.focus();
    }
  });

  document.getElementById('check-contact').addEventListener('click', function () {
    attempted = true;
    hideStatus();
    var errors = getErrors();
    renderErrors(errors);
    if (errors.length) {
      errors[0].field.focus();
      return;
    }
    status.textContent = '입력 형식 확인이 끝났습니다. 아직 전송되지 않았습니다.';
    status.hidden = false;
    status.focus();
  });

  form.addEventListener('input', function () {
    hideStatus();
    if (attempted) renderErrors(getErrors());
  });

  document.getElementById('reset-contact').addEventListener('click', function () {
    form.reset();
    attempted = false;
    hideStatus();
    renderErrors([]);
    phone.removeAttribute('aria-invalid');
    helpGroup.removeAttribute('aria-invalid');
    helpOptions.forEach(function (option) { option.removeAttribute('aria-invalid'); });
    phone.focus();
  });

  var requestedHelp = new URLSearchParams(window.location.search).get('help');
  if (requestedHelp === 'learn') document.getElementById('help-start').checked = true;
  if (requestedHelp === 'business') document.getElementById('help-business').checked = true;

  // Without JavaScript, the disabled fieldset leaves a readable, non-submitting preview.
  fields.disabled = false;
}());
