async function testRegister() {
  const payload = {
    name: "Test User",
    email: `test_${Date.now()}@example.com`,
    password: "Password123",
    role: "PATIENT"
  };

  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Registration API check: SUCCESS", data.user.email);
    } else {
      console.error("Registration API check: FAILED", data);
    }
  } catch (err) {
    console.error("Registration call error:", err.message);
  }
}

testRegister();
