if ('navigation' in window) {
  window.addEventListener('pageswap', (e) => {
    if (e.viewTransition && navigation.activation?.navigationType === 'traverse') {
      document.documentElement.dataset.navDirection = 'back';
    }
  });

  window.addEventListener('pagereveal', (e) => {
    if (e.viewTransition && navigation.activation?.navigationType === 'traverse') {
      document.documentElement.dataset.navDirection = 'back';
    }
  });
}

history.scrollRestoration = 'auto';
