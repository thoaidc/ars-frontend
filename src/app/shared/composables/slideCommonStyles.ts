export function slideToggle(element: HTMLElement) {
  if (window.getComputedStyle(element).display === 'none') {
    slideDown(element);
  } else {
    slideUp(element);
  }
}

export function slideDown(element: HTMLElement) {
  if (!element.classList.contains('transitioning')) {
    element.classList.add('transitioning');
    element.style.removeProperty('display');
    const height = element.offsetHeight;
    let display = window.getComputedStyle(element).display;

    if (display === 'none') {
      display = 'block'
    }

    element.style.display = display;
    slideHideStyles(element)
    element.offsetHeight;
    element.style.boxSizing = 'border-box';
    element.style.transitionProperty = 'height, margin, padding';
    element.style.height = height + 'px';
    element.style.removeProperty('padding-top');
    element.style.removeProperty('padding-bottom');
    element.style.removeProperty('margin-top');
    element.style.removeProperty('margin-bottom');
    element.style.removeProperty('height');
    element.style.removeProperty('overflow');
    element.style.removeProperty('transition-duration');
    element.style.removeProperty('transition-property');
    element.classList.remove('transitioning');
  }
}

export function slideUp(element: HTMLElement) {
  if (!element.classList.contains('transitioning')) {
    element.classList.add('transitioning');
    element.style.transitionProperty = 'height, margin, padding';
    element.style.boxSizing = 'border-box';
    element.style.height = element.offsetHeight + 'px';

    slideHideStyles(element)
    element.style.display = 'none';
    element.style.removeProperty('height');
    element.style.removeProperty('padding-top');
    element.style.removeProperty('padding-bottom');
    element.style.removeProperty('margin-top');
    element.style.removeProperty('margin-bottom');
    element.style.removeProperty('overflow');
    element.style.removeProperty('transition-duration');
    element.style.removeProperty('transition-property');
    element.classList.remove('transitioning');
  }
}

export function slideHideStyles(element: HTMLElement) {
  element.style.overflow = 'hidden';
  element.style.height = '0';
  element.style.paddingTop = '0';
  element.style.paddingBottom = '0';
  element.style.marginTop = '0';
  element.style.marginBottom = '0';
}
