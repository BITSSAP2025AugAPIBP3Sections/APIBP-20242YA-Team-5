package com.certificates.controller;

import com.certificates.dto.*;
import com.certificates.model.Certificate;
import com.certificates.service.CertificateFileService;
import com.certificates.service.CertificateService;
import com.certificates.service.PdfService;
import jakarta.validation.Valid;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/certificates")
@RequiredArgsConstructor
public class CertificateController {
   private final CertificateService service;
    private final CertificateFileService fileService;
    private final PdfService pdfService;
    Logger logger = LoggerFactory.getLogger(CertificateController.class);

    @PostMapping
    public ResponseEntity<Certificate> issueCertificate(@Valid @RequestBody CertificateIssueRequest req) {
        logger.info("Issuing certificate with certificate data: {}", req);
        return ResponseEntity.status(HttpStatus.CREATED).body(service.issueCertificate(req));
    }

    @GetMapping
    public ResponseEntity<List<Certificate>> listCertificates(@RequestParam(required = false) String status) {
        logger.info("listing certificates");
        return ResponseEntity.ok(service.listCertificates(status));
    }

    @GetMapping("/{certificateNumber}")
    public ResponseEntity<?> getCertificate(@PathVariable String certificateNumber) {

        if (certificateNumber == null || certificateNumber.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Certificate number is required");
        }

        certificateNumber = certificateNumber.trim();

        return ResponseEntity.ok(service.getCertificateByCertificateNumber(certificateNumber));
    }

    @PutMapping
    public ResponseEntity<Certificate> updateCertificate(@Validated @RequestBody CertificateUpdateRequest req) {
        logger.info("update certificate given data: {}", req.toString());
        return ResponseEntity.ok(service.updateCertificate(req));
    }

    @PostMapping("/revoke")
    public ResponseEntity<String> revokeCertificate(@RequestBody CertificateRevocationRequest req) {
        service.revokeCertificate(req);
        return ResponseEntity.ok("Certificate revoked successfully");
    }

    @PostMapping("/batch-issue")
    public ResponseEntity<?> batchIssueCertificates(
            @RequestBody Map<String, List<CertificateIssueRequest>> request) {

        List<CertificateIssueRequest> certs = request.get("certificates");
        if(certs == null || certs.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "No certificates provided for batch issuance");
        }
        int success = 0, failed = 0;

        List<Map<String, Object>> results = new ArrayList<>();

        for (CertificateIssueRequest req : certs) {

            // BASIC MANDATORY VALIDATION
            if (req.getStudentName() == null || req.getStudentName().isBlank() ||
                    req.getStudentEmail() == null || req.getStudentEmail().isBlank() ||
                    req.getCourseName() == null || req.getCourseName().isBlank() ||
                    req.getGrade() == null || req.getGrade().isBlank() ||
                    req.getIssueDate() == null ||
                    req.getCgpa() == null) {

                failed++;
                results.add(Map.of(
                        "success", false,
                        "certificate", req,
                        "error", "Mandatory fields missing"
                ));
                continue;
            }

            try {
                Certificate cert = service.issueCertificate(req);
                success++;
                results.add(Map.of("success", true, "certificate", cert));
            } catch (Exception e) {
                failed++;
                results.add(Map.of("success", false, "error", e.getMessage()));
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of(
                        "success", true,
                        "data", Map.of(
                                "totalRequested", certs.size(),
                                "successfullyIssued", success,
                                "failed", failed,
                                "results", results
                        ),
                        "message", "Batch issuance completed"
                )
        );
    }


    @PostMapping("/upload")
   // @PreAuthorize("hasAnyRole('ADMIN','ISSUER')")
    public ResponseEntity<FileUploadResponse> uploadFile(
            @RequestPart("file") MultipartFile file,
            @RequestParam("type") String type) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(fileService.uploadFile(file, type));
    }

    @GetMapping("/{certificateId}/pdf")
    //@PreAuthorize("hasAnyRole('ADMIN','ISSUER','STUDENT')")
    public ResponseEntity<org.springframework.core.io.Resource> generateAndDownloadPdf(@PathVariable UUID certificateId) throws IOException {
        pdfService.generateCertificatePdf(certificateId.toString());
        org.springframework.core.io.Resource pdf = pdfService.getPdf(certificateId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=certificate.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
