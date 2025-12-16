module.exports = {
  extends: [
    'stylelint-config-standard-scss'
  ],
  plugins: ['stylelint-order'],
  rules: {
    // allow unknown at-rules from external libs like @include, @mixin
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    // be permissive for now, tighten rules later
    'no-descending-specificity': null
  }
};

