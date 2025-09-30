import crypto from 'crypto';

export function computeSHA512Hash(data: string): string {
  const secret = process.env.SECRET_KEY || '';

  const dataWithSecret = data + secret;
  const hash = crypto.createHash('sha512').update(dataWithSecret, 'utf8').digest('hex');
  return hash;
}
