if ('navigation' in window) {
  window.addEventListener('pageswap', () => {
    delete document.documentElement.dataset.navDirection;
  });

  window.addEventListener('pagereveal', (e) => {
    if (e.viewTransition && navigation.activation?.navigationType === 'traverse') {
      document.documentElement.dataset.navDirection = 'back';
    }
  });
}

