package com.certverify.verification.util;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Component
public class CryptoUtil {

    private static final Logger logger = LoggerFactory.getLogger(CryptoUtil.class);

    static {
        Security.addProvider(new BouncyCastleProvider());
    }

    /**
     * Verify digital signature using RSA public key
     */
    public boolean verifyDigitalSignature(String data, String signatureBase64, String publicKeyPem) {
        try {
            // Parse public key
            PublicKey publicKey = parsePublicKey(publicKeyPem);

            // Decode signature
            byte[] signatureBytes = Base64.getDecoder().decode(signatureBase64);

            // Verify signature
            Signature signature = Signature.getInstance("SHA256withRSA", "BC");
            signature.initVerify(publicKey);
            signature.update(data.getBytes(StandardCharsets.UTF_8));

            return signature.verify(signatureBytes);

        } catch (Exception e) {
            logger.error("Signature verification failed: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Parse PEM format public key
     */
    private PublicKey parsePublicKey(String publicKeyPem) throws Exception {
        // Remove PEM headers and whitespace
        String publicKeyContent = publicKeyPem
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replace("-----BEGIN RSA PUBLIC KEY-----", "")
                .replace("-----END RSA PUBLIC KEY-----", "")
                .replaceAll("\\s", "");

        // Decode Base64
        byte[] keyBytes = Base64.getDecoder().decode(publicKeyContent);

        // Generate public key
        X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");

        return keyFactory.generatePublic(spec);
    }

    /**
     * Compute SHA-256 hash
     */
    public String computeHash(String data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(data.getBytes(StandardCharsets.UTF_8));

            // Convert to hex string
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();

        } catch (Exception e) {
            logger.error("Hash computation failed: {}", e.getMessage());
            throw new RuntimeException("Failed to compute hash", e);
        }
    }
}