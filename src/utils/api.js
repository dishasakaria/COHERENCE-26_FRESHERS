export async function generateOutreachIdentity(data) {
  const response = await fetch('https://dishasakaria.app.n8n.cloud/webhook/build-personality', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to generate outreach identity. Please check if the backend is running.');
  }

  return response.json();
}
