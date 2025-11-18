package com.certificates.service.impl;

import com.certificates.service.CertificateService;
import com.certificates.service.PdfService;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class PdfServiceImpl implements PdfService {

    private final Path pdfRoot = Paths.get("generated-pdfs");

    @Override
    public Map<String, Object> generateCertificatePdf(String certificateId) {
        String filename = "certificate_" + certificateId + "_" +
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".pdf";

        Path pdfPath = pdfRoot.resolve(filename);

        try (PdfWriter writer = new PdfWriter(Files.newOutputStream(pdfPath));
             PdfDocument pdf = new PdfDocument(writer);
             Document document = new Document(pdf)) {

            document.add(new Paragraph("🎓 Certificate of Achievement\n"));
            document.add(new Paragraph("This is to certify that has successfully completed the required course of study.\n"));
            document.add(new Paragraph("Certificate ID: " + certificateId));
            document.add(new Paragraph("Issued On: " + LocalDateTime.now()));
            document.add(new Paragraph("\n\nAuthorized by: Certificate Management System"));

        } catch (IOException e) {
            throw new RuntimeException("Failed to generate PDF for certificate: " + certificateId, e);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("filename", filename);
        response.put("path", pdfPath.toString());
        response.put("message", "PDF generated successfully.");
        return response;
    }

    @Override
    public Resource getPdf(UUID certificateId) {
        try {
            // Load the latest generated PDF for that certificate ID
            Optional<Path> latestFile = Files.list(pdfRoot)
                    .filter(file -> file.getFileName().toString().contains(certificateId.toString()))
                    .max(Comparator.comparingLong(f -> f.toFile().lastModified()));

            if (latestFile.isEmpty()) {
                throw new RuntimeException("No PDF found for certificate ID: " + certificateId);
            }

            return new UrlResource(latestFile.get().toUri());
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error loading PDF!", e);
        } catch (IOException e) {
            throw new RuntimeException("Error accessing PDF storage!", e);
        }
    }

    @Override
    public void cleanUpTempFiles() {
        try (var files = Files.list(pdfRoot)) {
            files.filter(Files::isRegularFile)
                    .filter(path -> path.toFile().lastModified() <
                            System.currentTimeMillis() - (24 * 60 * 60 * 1000))
                    .forEach(path -> path.toFile().delete());
        } catch (IOException e) {
            throw new RuntimeException("Failed to clean up old PDF files.", e);
        }
    }
}
