export const builtInButtons = {
  skip: {
      classes: 'sb-btn sb-btn-xs sb-btn-link sb-btn-link-tertiary skip-button',
      text: 'Skip',
      type: 'cancel'
  },
  cancel: {
      classes: 'sb-btn sb-btn-xs sb-btn-secondary cancel-button',
      text: 'Exit',
      type: 'cancel'
  },
  next: {
      classes: 'sb-btn sb-btn-xs sb-btn-secondary next-button',
      text: 'Next',
      type: 'next'
  },
  back: {
      classes: 'sb-btn sb-btn-xs sb-btn-outline-gray back-button',
      text: 'Back',
      type: 'back'
  }
};

export const defaultStepOptions = {
  scrollTo: false,
  showCancelLink: false,
  modal: true,
  highlightClass: 'highlight',
  classes: 'shadow-md bg-purple-dark',
  id: 'testID1',
  tippyOptions: {
      duration: 500,
  },
};
