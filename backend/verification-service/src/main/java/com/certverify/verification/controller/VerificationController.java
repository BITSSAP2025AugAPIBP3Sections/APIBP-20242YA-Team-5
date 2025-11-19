package com.certverify.verification.controller;

import com.certverify.verification.dto.BulkVerificationRequest;
import com.certverify.verification.dto.VerificationRequest;
import com.certverify.verification.dto.VerificationResponse;
import com.certverify.verification.model.VerificationResult;
import com.certverify.verification.service.VerificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/verify")
@RequiredArgsConstructor
@Validated
@Tag(name = "Verification", description = "Certificate verification endpoints")
public class VerificationController {

    private final VerificationService verificationService;

    /**
     * Verify certificate by ID or code
     */
    @PostMapping
    @Operation(summary = "Verify certificate", description = "Verify certificate by ID or verification code")
    public ResponseEntity<VerificationResponse> verify(@Valid @RequestBody VerificationRequest request) {

        VerificationResult result;

        if (request.getCertificateId() != null && !request.getCertificateId().isEmpty()) {
            result = verificationService.verifyById(request.getCertificateId());
        } else if (request.getVerificationCode() != null && !request.getVerificationCode().isEmpty()) {
            result = verificationService.verifyByCode(request.getVerificationCode());
        } else {
            return ResponseEntity.badRequest().body(
                    VerificationResponse.builder()
                            .success(false)
                            .message("Either certificateId or verificationCode must be provided")
                            .build()
            );
        }

        String message = result.getValid()
                ? "Certificate verified successfully"
                : "Certificate verification failed";

        return ResponseEntity.ok(
                VerificationResponse.builder()
                        .success(true)
                        .data(result)
                        .message(message)
                        .build()
        );
    }

    /**
     * Verify certificate by ID (GET)
     */
    @GetMapping("/{certificateId}")
    @Operation(summary = "Verify by ID", description = "Quick verification using certificate ID")
    public ResponseEntity<VerificationResponse> verifyById(
            @PathVariable
            @Pattern(regexp = "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$")
            String certificateId) {

        VerificationResult result = verificationService.verifyById(certificateId);

        String message = result.getValid()
                ? "Certificate verified successfully"
                : "Certificate verification failed";

        return ResponseEntity.ok(
                VerificationResponse.builder()
                        .success(true)
                        .data(result)
                        .message(message)
                        .build()
        );
    }

    /**
     * Verify certificate by code (GET)
     */
    @GetMapping("/code/{verificationCode}")
    @Operation(summary = "Verify by code", description = "Quick verification using verification code")
    public ResponseEntity<VerificationResponse> verifyByCode(
            @PathVariable
            @Pattern(regexp = "^[A-Z0-9]{6,8}$")
            String verificationCode) {

        VerificationResult result = verificationService.verifyByCode(verificationCode);

        String message = result.getValid()
                ? "Certificate verified successfully"
                : "Certificate verification failed";

        return ResponseEntity.ok(
                VerificationResponse.builder()
                        .success(true)
                        .data(result)
                        .message(message)
                        .build()
        );
    }

    /**
     * Bulk verification
     */
    @PostMapping("/bulk")
    @Operation(summary = "Bulk verification", description = "Verify multiple certificates at once")
    public ResponseEntity<Map<String, Object>> bulkVerify(@Valid @RequestBody BulkVerificationRequest request) {

        List<Map<String, Object>> results = new ArrayList<>();
        int validCount = 0;
        int invalidCount = 0;

        for (VerificationRequest certRequest : request.getCertificates()) {
            try {
                VerificationResult result;

                if (certRequest.getCertificateId() != null) {
                    result = verificationService.verifyById(certRequest.getCertificateId());
                } else {
                    result = verificationService.verifyByCode(certRequest.getVerificationCode());
                }

                if (result.getValid()) {
                    validCount++;
                } else {
                    invalidCount++;
                }

                Map<String, Object> resultMap = new HashMap<>();
                resultMap.put("certificateId", certRequest.getCertificateId());
                resultMap.put("verificationCode", certRequest.getVerificationCode());
                resultMap.put("valid", result.getValid());
                resultMap.put("reason", result.getReason());

                results.add(resultMap);

            } catch (Exception e) {
                invalidCount++;
                Map<String, Object> errorResult = new HashMap<>();
                errorResult.put("certificateId", certRequest.getCertificateId());
                errorResult.put("verificationCode", certRequest.getVerificationCode());
                errorResult.put("valid", false);
                errorResult.put("reason", "Verification failed due to internal error");
                results.add(errorResult);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);

        Map<String, Object> data = new HashMap<>();
        data.put("totalRequested", request.getCertificates().size());
        data.put("validCertificates", validCount);
        data.put("invalidCertificates", invalidCount);
        data.put("results", results);

        response.put("data", data);
        response.put("message", String.format("Bulk verification completed. %d/%d certificates are valid.",
                validCount, request.getCertificates().size()));

        return ResponseEntity.ok(response);
    }
}