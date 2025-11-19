package com.certverify.verification.service;

import com.certverify.verification.dto.VerificationRequest;
import com.certverify.verification.model.Certificate;
import com.certverify.verification.model.University;
import com.certverify.verification.model.VerificationResult;
import com.certverify.verification.util.CryptoUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private static final Logger logger = LoggerFactory.getLogger(VerificationService.class);

    private final CertificateServiceClient certificateClient;
    private final UniversityServiceClient universityClient;
    private final CryptoUtil cryptoUtil;
    private final ObjectMapper objectMapper;

    /**
     * Verify certificate by ID
     */
    public VerificationResult verifyById(String certificateId) {
        logger.info("Verifying certificate by ID: {}", certificateId);

        try {
            // Fetch certificate
            Certificate certificate = fetchCertificate(certificateId, null);

            if (certificate == null) {
                return buildInvalidResult("Certificate not found", "id");
            }

            // Verify certificate
            return performVerification(certificate, "id");

        } catch (Exception e) {
            logger.error("Verification failed: {}", e.getMessage());
            return buildErrorResult("Verification failed due to internal error", "id");
        }
    }

    /**
     * Verify certificate by code
     */
    public VerificationResult verifyByCode(String verificationCode) {
        logger.info("Verifying certificate by code: {}", verificationCode);

        try {
            // Fetch certificate by code
            Certificate certificate = fetchCertificate(null, verificationCode);

            if (certificate == null) {
                return buildInvalidResult("Certificate not found with provided verification code", "code");
            }

            // Verify certificate
            return performVerification(certificate, "code");

        } catch (Exception e) {
            logger.error("Verification failed: {}", e.getMessage());
            return buildErrorResult("Verification failed due to internal error", "code");
        }
    }

    /**
     * Perform actual verification
     */
    private VerificationResult performVerification(Certificate certificate, String method) {
        // Check certificate status
        if (!"active".equalsIgnoreCase(certificate.getStatus())) {
            String reason = "revoked".equalsIgnoreCase(certificate.getStatus())
                    ? "Certificate has been revoked. Reason: " + certificate.getRevocationReason()
                    : "Certificate is currently suspended";
            return buildInvalidResult(reason, method, certificate);
        }

        // Fetch university
        University university = fetchUniversity(certificate.getUniversityId());

        if (university == null) {
            return buildInvalidResult("University not found", method, certificate);
        }

        // Verify digital signature
        boolean signatureValid = cryptoUtil.verifyDigitalSignature(
                certificate.getCertificateHash(),
                certificate.getDigitalSignature(),
                university.getPublicKey()
        );

        if (!signatureValid) {
            return buildInvalidResult("Digital signature verification failed", method, certificate);
        }

        // Build successful result
        return VerificationResult.builder()
                .valid(true)
                .certificate(certificate)
                .university(university)
                .verificationMethod(method)
                .timestamp(LocalDateTime.now())
                .build();
    }

    /**
     * Fetch certificate from Certificate Service
     */
    private Certificate fetchCertificate(String id, String code) {
        try {
            Map<String, Object> response;

            if (id != null) {
                response = certificateClient.getCertificateById(id);
            } else {
                response = certificateClient.getCertificateByCode(code);
            }

            if (response != null && response.get("data") != null) {
                return objectMapper.convertValue(response.get("data"), Certificate.class);
            }

            return null;

        } catch (FeignException.NotFound e) {
            logger.warn("Certificate not found");
            return null;
        } catch (Exception e) {
            logger.error("Failed to fetch certificate: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch certificate", e);
        }
    }

    /**
     * Fetch university from University Service
     */
    private University fetchUniversity(String universityId) {
        try {
            Map<String, Object> response = universityClient.getUniversityById(universityId);

            if (response != null && response.get("data") != null) {
                return objectMapper.convertValue(response.get("data"), University.class);
            }

            return null;

        } catch (FeignException.NotFound e) {
            logger.warn("University not found: {}", universityId);
            return null;
        } catch (Exception e) {
            logger.error("Failed to fetch university: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch university", e);
        }
    }

    /**
     * Build invalid result
     */
    private VerificationResult buildInvalidResult(String reason, String method) {
        return VerificationResult.builder()
                .valid(false)
                .verificationMethod(method)
                .timestamp(LocalDateTime.now())
                .reason(reason)
                .build();
    }

    private VerificationResult buildInvalidResult(String reason, String method, Certificate certificate) {
        return VerificationResult.builder()
                .valid(false)
                .certificate(certificate)
                .verificationMethod(method)
                .timestamp(LocalDateTime.now())
                .reason(reason)
                .build();
    }

    /**
     * Build error result
     */
    private VerificationResult buildErrorResult(String reason, String method) {
        return VerificationResult.builder()
                .valid(false)
                .verificationMethod(method)
                .timestamp(LocalDateTime.now())
                .reason(reason)
                .build();
    }
}