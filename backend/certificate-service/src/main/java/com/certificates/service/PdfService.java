package com.certificates.service;

import org.springframework.core.io.Resource;
import java.util.Map;
import java.util.UUID;

public interface PdfService {

    /**
     * Generates a certificate PDF and returns its metadata.
     */
    Map<String, Object> generateCertificatePdf(String certificateId);

    /**
     * Fetches an existing PDF file for download.
     */
    Resource getPdf(UUID certificateId);

    /**
     * Cleans up temporary files.
     */
    void cleanUpTempFiles();
}
