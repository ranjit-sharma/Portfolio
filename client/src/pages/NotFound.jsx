import { Link } from 'react-router-dom';
import { Button } from '../components/ui/index';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          fontSize: '6rem',
          fontWeight: 900,
          color: 'var(--accent)',
          lineHeight: 1,
          marginBottom: '1rem',
          letterSpacing: '-0.04em',
        }}
      >
        404
      </div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
        Page Not Found
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '36ch' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="primary">← Back to Home</Button>
      </Link>
    </div>
  );
}
