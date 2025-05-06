import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const { interventions, agents } = req.body;

  if (!interventions || !Array.isArray(interventions)) {
    return res.status(400).json({ error: 'Liste invalide' });
  }

  const prompt = `Tu es un assistant charge d'optimiser des interventions. Priorise-les intelligemment en tenant compte de l'urgence, du lieu, de la meteo, des vacances scolaires et du nombre d'agents (${agents}/jour).

` +
    interventions.map((i, idx) => (
      `Intervention ${idx + 1}:
- Lieu: ${i.lieu}
- Urgence: ${i.urgence}
- Type: ${i.type}
- Description: ${i.description}
`
    )).join('\n');

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4
    });

    const output = completion.choices[0].message.content;
    res.status(200).json({ resultat: output });
  } catch (err) {
    res.status(500).json({ error: 'Erreur GPT' });
  }
}