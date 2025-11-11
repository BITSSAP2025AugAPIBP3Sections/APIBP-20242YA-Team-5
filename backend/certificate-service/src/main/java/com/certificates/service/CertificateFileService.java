package com.certificates.service;

import com.certificates.dto.FileUploadResponse;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface CertificateFileService {

    /**
     * Uploads a file related to a certificate (e.g., PDF, image).
     *
     * @param file the file to upload
     * @param type the file type (optional: could be 'certificate', 'template', etc.)
     * @return a structured response with file metadata and success status
     */
    FileUploadResponse uploadFile(MultipartFile file, String type);

    /**
     * Loads a file as a Spring Resource for download or viewing.
     *
     * @param filename the name of the file to load
     * @return the file as a Resource
     */
    Resource load(String filename);
}
