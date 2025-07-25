export const registerUser = async (email, password) =>
  fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }).then(res => res.json());

export const loginUser = async (email, password) =>
  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then(async res => {
    const contentType = res.headers.get('content-type');
    if (!res.ok) {
      let message = 'Login failed';
      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json();
        message = errorData.message || message;
      } else {
        message = await res.text() || message;
      }
      // Throw an Error object with status
      const error = new Error(message);
      error.status = res.status;
      throw error;
    }
    return res.json();
  });

