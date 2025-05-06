import { useState } from 'react';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph } from 'docx';

export default function InterventionPlanner() {
  const [interventions, setInterventions] = useState([]);
  const [newInter, setNewInter] = useState({ lieu: '', urgence: '', type: '', description: '' });
  const [agents, setAgents] = useState(1);
  const [resultat, setResultat] = useState('');

  const ajouter = () => {
    setInterventions([...interventions, newInter]);
    setNewInter({ lieu: '', urgence: '', type: '', description: '' });
  };

  const generer = async () => {
    const res = await fetch('/api/gpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ interventions, agents })
    });
    const data = await res.json();
    setResultat(data.resultat);
  };

  const exporterWord = () => {
    const doc = new Document({
      sections: [{
        children: resultat.split('\n').map(line => new Paragraph(line))
      }]
    });
    Packer.toBlob(doc).then(blob => saveAs(blob, 'planning.docx'));
  };

  return (
    <div>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
        <input placeholder='Établissement ou adresse' value={newInter.lieu} onChange={e => setNewInter({ ...newInter, lieu: e.target.value })} />
        <select value={newInter.urgence} onChange={e => setNewInter({ ...newInter, urgence: e.target.value })}>
          <option value=''>Niveau d'urgence</option>
          <option>Faible</option>
          <option>Moyenne</option>
          <option>Élevée</option>
        </select>
        <input placeholder='Type de travaux (plomberie, etc.)' value={newInter.type} onChange={e => setNewInter({ ...newInter, type: e.target.value })} />
        <textarea placeholder='Description complète' value={newInter.description} onChange={e => setNewInter({ ...newInter, description: e.target.value })} />
      </div>
      <button onClick={ajouter} style={{ marginTop: '1rem' }}>➕ Ajouter</button>
      <div style={{ marginTop: '2rem' }}>
        <label>👥 Agents disponibles par jour : </label>
        <input type='number' value={agents} onChange={e => setAgents(e.target.value)} />
      </div>
      <button onClick={generer} style={{ marginTop: '1rem' }}>🧠 Générer</button>
      {resultat && (
        <div style={{ marginTop: '2rem', background: '#f9f9f9', padding: '1rem', borderRadius: 8 }}>
          <pre>{resultat}</pre>
          <button onClick={exporterWord}>📄 Exporter en Word</button>
        </div>
      )}
    </div>
  );
}