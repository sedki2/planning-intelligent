import InterventionPlanner from '../components/InterventionPlanner';

export default function Home() {
  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: 'auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧠 Planification intelligente des interventions</h1>
      <InterventionPlanner />
    </div>
  );
}