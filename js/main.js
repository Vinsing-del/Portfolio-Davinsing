
// Works grouped to follow the PDF's section order.
const works = [
  { cat: 'Even 2Sen', title: '', n: [4] },
  { cat: 'Photo Shoot', title: '', n: [5, 6, 7] },
  { cat: 'Album Design', title: '', n: [8, 9, 10, 11, 12, 13, 14, 15] },
  { cat: 'Color Grading', title: '', n: [17, 18] }
].flatMap(group =>
  group.n.map((n, i) => ({
    cat: group.cat,
    src: `assets/works/page-${String(n).padStart(2, '0')}.jpg`,
    thumb: `assets/thumbs/page-${String(n).padStart(2, '0')}.jpg`,
    title: `${group.title} ${group.n.length > 1 ? i + 1 : ''}`.trim()
  }))
);

const cats = ['All', ...new Set(works.map(w => w.cat))];

const tabs = document.getElementById('tabs');
const gal = document.getElementById('gallery');

let current = works;
let idx = 0;

// Render portfolio gallery
function render(cat) {
  current = cat === 'All'
    ? works
    : works.filter(w => w.cat === cat);

  gal.innerHTML = current.map((w, i) => `
    <figure
      class="stage"
      data-i="${i}"
      tabindex="0"
      role="button"
      aria-label="Open ${w.title || w.cat}"
    >
      <div class="shot">
        <img
          src="${w.thumb}"
          width="1920"
          height="1080"
          loading="lazy"
          alt="${w.title || w.cat} — poster board by Da Vinsing"
        >
      </div>
    </figure>
  `).join('');

  [...tabs.children].forEach(button => {
    button.classList.toggle('on', button.dataset.c === cat);
  });
}

// Create category filter buttons
tabs.innerHTML = cats.map(cat => `
  <button
    class="tab"
    data-c="${cat}"
    role="tab"
  >${cat}</button>
`).join('');

// Filter categories
tabs.onclick = event => {
  const button = event.target.closest('[data-c]');

  if (button) {
    render(button.dataset.c);
  }
};

// Lightbox elements
const lb = document.getElementById('lb');
const img = document.getElementById('lb-img');
const cap = document.getElementById('lb-cap');

// Display selected poster
function show(i) {
  idx = (i + current.length) % current.length;

  img.src = current[idx].src;
  img.alt = current[idx].title || current[idx].cat;

  // Keep the image dimensions but remove numbered captions
  cap.textContent = '';
}

// Open lightbox
function open(i) {
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
  show(i);
}

// Close lightbox
function close() {
  lb.hidden = true;
  document.body.style.overflow = '';
}

// Open poster when clicked
gal.onclick = event => {
  const figure = event.target.closest('.stage');

  if (figure) {
    open(Number(figure.dataset.i));
  }
};

// Open poster with Enter or Space
gal.onkeydown = event => {
  const figure = event.target.closest('.stage');

  if (figure && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    open(Number(figure.dataset.i));
  }
};

// Lightbox controls
lb.querySelector('.lb-x').onclick = close;

lb.querySelector('.prev').onclick = () => show(idx - 1);
lb.querySelector('.next').onclick = () => show(idx + 1);

// Close when clicking outside the poster
lb.onclick = event => {
  if (event.target === lb) {
    close();
  }
};

// Keyboard navigation
document.addEventListener('keydown', event => {
  if (lb.hidden) return;

  if (event.key === 'Escape') close();
  if (event.key === 'ArrowLeft') show(idx - 1);
  if (event.key === 'ArrowRight') show(idx + 1);
});

// Initial gallery
render('All');

// Navigation background on scroll
const nav = document.getElementById('nav');

addEventListener('scroll', () => {
  nav.classList.toggle('sc', scrollY > 20);
}, { passive: true });

// Scroll reveal animations
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.rv').forEach(element => {
  io.observe(element);
});
