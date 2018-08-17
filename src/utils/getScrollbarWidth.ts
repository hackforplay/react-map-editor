let _scrollbarWidth: number | null = null;
export default function getScrollbarWidth() {
  if (_scrollbarWidth !== null) {
    return _scrollbarWidth;
  }
  try {
    _scrollbarWidth = actuallyGetWidth();
  } catch (error) {}
  return _scrollbarWidth || 0;
}

/**
 * https://stackoverflow.com/questions/13382516/getting-scroll-bar-width-using-javascript
 */
function actuallyGetWidth() {
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps

  document.body.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;
  // force scrollbars
  outer.style.overflow = 'scroll';

  // add innerdiv
  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  const widthWithScroll = inner.offsetWidth;

  // remove divs
  if (outer.parentNode) {
    outer.parentNode.removeChild(outer);
  }

  return widthNoScroll - widthWithScroll;
}
