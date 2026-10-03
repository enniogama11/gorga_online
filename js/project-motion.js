(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js');
  const header = document.querySelector('header');
  const menuButton = document.querySelector('.hamburger');
  const menu = document.querySelector('.nav-links');
  const timeline = document.querySelector('#projectTimeline');
  const svg = document.querySelector('#timelineSvg');
  const track = document.querySelector('#timelineTrack');
  const progressPath = document.querySelector('#timelineProgress');
  const head = document.querySelector('#timelineHead');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pathLength = 0;
  let pendingFrame = false;

  function closeMenu() {
    if (!menuButton || !menu) return;
    menu.classList.remove('active');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    menuButton.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
  }
  if (menuButton && menu) {
    menuButton.type = 'button';
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    menuButton.addEventListener('click', () => {
      const open = menu.classList.toggle('active');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      menuButton.innerHTML = open ? '<i class="fas fa-times" aria-hidden="true"></i>' : '<i class="fas fa-bars" aria-hidden="true"></i>';
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  }

  function updateHeader() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 24);
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 420);
  }
  function updateProgress() {
    if (!timeline || !progressPath || !pathLength) return;
    const box = timeline.getBoundingClientRect();
    const anchor = window.innerHeight * .72;
    const fraction = Math.max(0, Math.min(1, (anchor - box.top) / Math.max(1, box.height)));
    const distance = pathLength * fraction;
    progressPath.style.strokeDashoffset = `${pathLength - distance}`;
    if (head) {
      const point = progressPath.getPointAtLength(Math.min(pathLength, distance));
      head.setAttribute('cx', point.x);
      head.setAttribute('cy', point.y);
      head.setAttribute('visibility', 'visible');
    }
  }
  function scheduleUpdate() {
    if (pendingFrame) return;
    pendingFrame = true;
    requestAnimationFrame(() => {
      pendingFrame = false;
      updateHeader();
      updateProgress();
    });
  }
  function rebuildLine() {
    if (!timeline || !svg || !track || !progressPath) return;
    const bounds = timeline.getBoundingClientRect();
    const width = Math.max(1, bounds.width);
    const height = Math.max(1, timeline.offsetHeight);
    const mobile = matchMedia('(max-width: 680px)').matches;
    const x = mobile ? 20 : width / 2;
    const yPoints = [...timeline.querySelectorAll('.project-node')].map(node => {
      const rect = node.getBoundingClientRect();
      return Math.max(8, Math.min(height - 8, rect.top + rect.height / 2 - bounds.top));
    });
    if (!yPoints.length) return;
    const path = `M ${x} ${yPoints.join(` L ${x} `)}`;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('preserveAspectRatio', 'none');
    track.setAttribute('d', path);
    progressPath.setAttribute('d', path);
    pathLength = progressPath.getTotalLength();
    progressPath.style.strokeDasharray = `${pathLength}`;
    progressPath.style.strokeDashoffset = `${pathLength}`;
    updateProgress();
  }

  const steps = [...document.querySelectorAll('.project-step')];
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .14, rootMargin: '0px 0px -5% 0px' });
    steps.forEach(step => observer.observe(step));
  } else {
    steps.forEach(step => step.classList.add('is-visible'));
  }

  if (timeline && svg && track && progressPath) {
    if ('ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver(rebuildLine);
      resizeObserver.observe(timeline);
      steps.forEach(step => resizeObserver.observe(step));
    }
    window.addEventListener('load', rebuildLine, { once: true });
    window.addEventListener('resize', rebuildLine, { passive: true });
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    rebuildLine();
  }
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  updateHeader();
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) backToTop.addEventListener('click', event => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
})();
