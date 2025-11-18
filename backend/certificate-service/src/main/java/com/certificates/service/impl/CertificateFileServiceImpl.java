package com.certificates.service.impl;

import com.certificates.dto.FileUploadResponse;
import com.certificates.service.CertificateFileService;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@Service
public class CertificateFileServiceImpl implements CertificateFileService {


    private final Path root = Paths.get("src/main/resources/static/certificates");
    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage!", e);
        }
    }

    @Override
    public FileUploadResponse uploadFile(MultipartFile file, String type) {
        try {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = this.root.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            Map<String, Object> data = Map.of(
                    "filename", filename,
                    "path", filePath.toString(),
                    "size", file.getSize(),
                    "mimetype", file.getContentType()
            );

            return new FileUploadResponse(true, data, "File uploaded successfully.");
        } catch (IOException e) {
            throw new RuntimeException("File upload failed!", e);
        }
    }

    @Override
    public Resource load(String filename) {
        try {
            Path file = root.resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("File not found!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error loading file!", e);
        }
    }
}
