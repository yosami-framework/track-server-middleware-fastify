module.exports = function($, controller, pipe, _yield) {
  return $('html', [
    $('head', [
      $('title', 'MockTitle'),
    ]),
    $('body', [
      $('div', {class: 'hoge'}, 'MockPage'),
      $('div', {id: 'attrs'}, JSON.stringify(controller.attrs)),
    ]),
  ]);
};
