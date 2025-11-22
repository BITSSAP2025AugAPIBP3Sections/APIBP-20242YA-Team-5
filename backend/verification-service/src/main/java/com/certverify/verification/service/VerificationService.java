package com.certverify.verification.service;

import com.certverify.verification.model.Certificate;
import com.certverify.verification.model.VerificationResult;
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
    private final ObjectMapper objectMapper;

    /**
     * Verify certificate by certificate number
     */
    public VerificationResult verifyByCertificateNumber(String certificateNumber) {
        logger.info("Verifying certificate by number: {}", certificateNumber);

        try {
            // Fetch certificate
            Certificate certificate = fetchCertificateByCertificateNumber(certificateNumber);

            if (certificate == null) {
                return buildInvalidResult("Certificate not found with provided certificate number");
            }

            // Check certificate status
            if (!"active".equalsIgnoreCase(certificate.getStatus())) {
                String reason = "revoked".equalsIgnoreCase(certificate.getStatus())
                        ? "Certificate has been revoked. Reason: " + certificate.getRevocationReason()
                        : "Certificate is currently suspended";
                return buildInvalidResult(reason, certificate);
            }

            // Build successful result
            return VerificationResult.builder()
                    .valid(true)
                    .certificate(certificate)
                    .verificationMethod("certificateNumber")
                    .timestamp(LocalDateTime.now())
                    .reason("Certificate is valid and active")
                    .build();

        } catch (Exception e) {
            logger.error("Verification failed: {}", e.getMessage());
            return buildErrorResult("Verification failed due to internal error");
        }
    }

    /**
     * Fetch certificate from Certificate Service by certificate number
     */
    // private Certificate fetchCertificateByCertificateNumber(String certificateNumber) {
    //     try {
    //         Map<String, Object> response = certificateClient.getCertificateByCertificateNumber(certificateNumber);
    //         logger.info("checking response : {}" ,response);

    //         if (response != null && response.get("data") != null) {
    //             logger.info("checking response : {}" ,response);
    //             return objectMapper.convertValue(response.get("data"), Certificate.class);
    //         }

    //         return null;

    //     } catch (FeignException.NotFound e) {
    //         logger.warn("Certificate not found with certificate number: {}", certificateNumber);
    //         return null;
    //     } catch (Exception e) {
    //         logger.error("Failed to fetch certificate: {}", e.getMessage());
    //         throw new RuntimeException("Failed to fetch certificate", e);
    //     }
    // }

    private Certificate fetchCertificateByCertificateNumber(String certificateNumber) {
        try {
            Certificate certificate = certificateClient.getCertificateByCertificateNumber(certificateNumber);
            return certificate;
        } catch (FeignException.NotFound e) {
            logger.warn("Certificate not found: {}", certificateNumber);
            return null;
        } catch (Exception e) {
            logger.error("Failed to fetch certificate: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch certificate", e);
        }
    }


    /**
     * Build invalid result
     */
    private VerificationResult buildInvalidResult(String reason) {
        return VerificationResult.builder()
                .valid(false)
                .verificationMethod("certificateNumber")
                .timestamp(LocalDateTime.now())
                .reason(reason)
                .build();
    }

    private VerificationResult buildInvalidResult(String reason, Certificate certificate) {
        return VerificationResult.builder()
                .valid(false)
                .certificate(certificate)
                .verificationMethod("certificateNumber")
                .timestamp(LocalDateTime.now())
                .reason(reason)
                .build();
    }

    /**
     * Build error result
     */
    private VerificationResult buildErrorResult(String reason) {
        return VerificationResult.builder()
                .valid(false)
                .verificationMethod("certificateNumber")
                .timestamp(LocalDateTime.now())
                .reason(reason)
                .build();
    }
}