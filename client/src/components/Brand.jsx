import { BRAND } from '../brand.js';
import { Link } from 'react-router-dom';

export default function Brand() {
  return (
    <Link className="cjir-brand" to="/" aria-label={`${BRAND.name} home`}>
      <img className="cjir-logo" src={BRAND.logo} alt={BRAND.name} />
    </Link>
  );
}
