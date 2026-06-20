// Replace the handleEmailSubmit function in index.html with this version
// This connects to the real Express backend

async function handleEmailSubmit() {
  const email = document.getElementById('emailInput').value.trim();
  if (!email || !email.includes('@')) {
    alert('Please enter a valid email address.');
    return;
  }

  const btn = document.querySelector('.btn-gold-lg');
  const originalText = btn.textContent;
  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();

    if (data.success) {
      document.getElementById('pdfSuccess').style.display = 'block';
      document.getElementById('emailInput').value = '';
    } else {
      alert('Something went wrong: ' + (data.error || 'Please try again.'));
    }
  } catch (err) {
    alert('Network error. Please check your connection and try again.');
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}
