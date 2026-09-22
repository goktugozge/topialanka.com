const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('nav');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', open);
});
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));
document.querySelector('#year').textContent = new Date().getFullYear();

const bookingModal = document.querySelector('.booking-modal');
const bookingForm = document.querySelector('#booking-form');
const bookingError = document.querySelector('.booking-error');
const bookingToast = document.querySelector('.booking-toast');
const bookingOpeners = document.querySelectorAll('[data-booking-open]');
const bookingClosers = document.querySelectorAll('[data-booking-close]');

const setBookingModal = (open) => {
  bookingModal?.classList.toggle('is-open', open);
  bookingModal?.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('booking-open', open);
  if (open) bookingModal?.querySelector('input')?.focus();
};

bookingOpeners.forEach((button) => button.addEventListener('click', () => setBookingModal(true)));
bookingClosers.forEach((button) => button.addEventListener('click', () => setBookingModal(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setBookingModal(false);
});

bookingForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const interests = [...bookingForm.querySelectorAll('input[name="interests"]:checked')]
    .map((input) => input.value);
  if (!interests.length) {
    bookingError.textContent = 'Please select at least one interest.';
    return;
  }

  bookingError.textContent = '';
  const data = new FormData(bookingForm);
  const submitButton = bookingForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Sending…';

  try {
    const response = await fetch('https://formsubmit.co/ajax/goktug.ozge@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: `Wellness booking request — ${data.get('firstName')} ${data.get('lastName')}`,
        _template: 'table',
        first_name: data.get('firstName'),
        last_name: data.get('lastName'),
        phone: data.get('phone'),
        email: data.get('email'),
        corporate_partner: data.get('corporatePartner'),
        interests: interests.join(', '),
        message: data.get('message') || '—',
        _honey: data.get('_honey'),
      }),
    });
    if (!response.ok) throw new Error('Submission failed');
    bookingForm.reset();
    setBookingModal(false);
    bookingToast?.classList.add('is-visible');
    window.setTimeout(() => bookingToast?.classList.remove('is-visible'), 5000);
  } catch {
    bookingError.textContent = 'Something went wrong. Please try again or email us directly.';
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Send booking request <span>↗</span>';
  }
});
