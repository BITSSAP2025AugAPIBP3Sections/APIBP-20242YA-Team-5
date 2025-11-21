package com.certverify.verification.controller;

import com.certverify.verification.dto.BulkVerificationRequest;
import com.certverify.verification.dto.VerificationRequest;
import com.certverify.verification.dto.VerificationResponse;
import com.certverify.verification.model.VerificationResult;
import com.certverify.verification.service.VerificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
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
     * Verify certificate by certificate number
     */
    @PostMapping
    @Operation(summary = "Verify certificate", description = "Verify certificate by certificate number")
    public ResponseEntity<VerificationResponse> verify(@Valid @RequestBody VerificationRequest request) {

        VerificationResult result = verificationService.verifyByCertificateNumber(request.getCertificateNumber());

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
     * Verify certificate by certificate number (GET)
     */
    @GetMapping("/{certificateNumber}")
    @Operation(summary = "Verify by certificate number", description = "Quick verification using certificate number")
    public ResponseEntity<VerificationResponse> verifyByCertificateNumber(
            @PathVariable @NotBlank String certificateNumber) {

        VerificationResult result = verificationService.verifyByCertificateNumber(certificateNumber);

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
                VerificationResult result = verificationService.verifyByCertificateNumber(
                        certRequest.getCertificateNumber()
                );

                if (result.getValid()) {
                    validCount++;
                } else {
                    invalidCount++;
                }

                Map<String, Object> resultMap = new HashMap<>();
                resultMap.put("certificateNumber", certRequest.getCertificateNumber());
                resultMap.put("valid", result.getValid());
                resultMap.put("reason", result.getReason());

                // Include certificate details if available
                if (result.getCertificate() != null) {
                    resultMap.put("studentName", result.getCertificate().getStudentName());
                    resultMap.put("courseName", result.getCertificate().getCourseName());
                    resultMap.put("issueDate", result.getCertificate().getIssueDate());
                }

                results.add(resultMap);

            } catch (Exception e) {
                invalidCount++;
                Map<String, Object> errorResult = new HashMap<>();
                errorResult.put("certificateNumber", certRequest.getCertificateNumber());
                errorResult.put("valid", false);
                errorResult.put("reason", "Verification failed due to internal error: " + e.getMessage());
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