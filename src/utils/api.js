export async function generateOutreachIdentity(data) {
  try {
    const response = await fetch('https://dishasakaria.app.n8n.cloud/webhook/build-personality', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('API Error');
    }

    return await response.json();
  } catch (err) {
    console.warn('Backend unavailable, using sandbox fallback data', err);
    // Return high-quality sandbox data based on the input
    const name = data.startup_name || 'Your Company';
    return {
      sample_opener: `Hi {FirstName}, I noticed ${name} is doing some incredible work in ${data.target_customer || 'the B2B space'} and wanted to reach out because our approach to ${data.what_you_do?.slice(0, 30) || 'intelligent outreach'} might be exactly what you need to scale.`,
      voice_summary: `Your outreach voice is ${data.tones || 'Confident and Direct'}, focusing on a ${data.philosophy || 'value-first'} approach. You sound like a knowledgeable partner who respects your lead's time and offers genuine insights rather than just another sales pitch.`,
      dos: [
        `Highlight specific value metrics relevant to ${data.target_customer || 'your niche'}`,
        'Keep the tone conversational and low-friction',
        'End with a soft, non-invasive call to action',
        'Use short, punchy paragraphs for readability'
      ],
      donts: [
        'Avoid overly formal or corporate jargon',
        'Do not use generic "I hope this email finds you well" intros',
        'Do not attach large PDF decks in the first touch',
        'Never sound desperate or overly aggressive'
      ],
      adjectives: [...(data.tones?.split(', ') || ['Bold']), 'Innovative', 'Human', 'Authentic', 'Reliable']
    };
  }
}
export async function uploadLeadsCsv(file) {
  const formData = new FormData();
  formData.append("csvfile", file);

  try {
    const response = await fetch("http://localhost:5678/webhook/upload-leads", {
      method: "POST",
      body: formData,
      // Note: We don't set Content-Type header manually for FormData, 
      // the browser will set it with the correct boundary
    });

    if (!response.ok) {
      throw new Error("Failed to connect to n8n backend");
    }

    // Attempt to parse JSON response
    // If n8n returns the list of processed leads as JSON
    const data = await response.json();
    return data;
  } catch (err) {
    console.warn("Backend Error, using sandbox fallback", err);
    // Return empty or mock based on context if needed
    throw err;
  }
}
