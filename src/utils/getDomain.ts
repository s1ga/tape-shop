export default function getDomain() {
  return process.env.NODE_ENV === 'production'
    ? process.env.DOMAIN
    : 'http://localhost:3000';
}
