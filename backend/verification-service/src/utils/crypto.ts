import crypto from 'crypto';
import forge from 'node-forge';

/**
 * Verify digital signature using RSA public key
 */
export const verifyDigitalSignature = (
  data: string,
  signature: string,
  publicKey: string
): boolean => {
  try {
    // Convert PEM public key to forge format
    const publicKeyForge = forge.pki.publicKeyFromPem(publicKey);
    
    // Create SHA-256 hash of data
    const md = forge.md.sha256.create();
    md.update(data, 'utf8');
    
    // Decode base64 signature
    const signatureBytes = forge.util.decode64(signature);
    
    // Verify signature
    const verified = publicKeyForge.verify(
      md.digest().bytes(),
      signatureBytes
    );
    
    return verified;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
};

/**
 * Compute SHA-256 hash of certificate data
 */
export const computeCertificateHash = (data: any): string => {
  try {
    // Sort keys for consistent hashing
    const sortedData = JSON.stringify(data, Object.keys(data).sort());
    
    // Create SHA-256 hash
    return crypto
      .createHash('sha256')
      .update(sortedData)
      .digest('hex');
  } catch (error) {
    console.error('Hash computation error:', error);
    throw error;
  }
};

/**
 * Validate certificate hash matches computed hash
 */
export const validateCertificateHash = (
  certificateData: any,
  providedHash: string
): boolean => {
  try {
    const computedHash = computeCertificateHash(certificateData);
    return computedHash === providedHash;
  } catch (error) {
    console.error('Hash validation error:', error);
    return false;
  }
};
