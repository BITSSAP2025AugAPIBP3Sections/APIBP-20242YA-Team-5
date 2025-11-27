package com.universities.controller;

import com.universities.dto.*;
import com.universities.service.UniversityService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/universities")
@RequiredArgsConstructor
public class UniversityController {

    private final UniversityService service;
    private static final Logger logger = LoggerFactory.getLogger(UniversityController.class);

    @PostMapping
    public ResponseEntity<UniversityResponse> registerUniversity(
            @Validated @RequestBody UniversityRegisterRequest req) {

        logger.info("Registering new university: {}", req.getUniversityName());
        UniversityResponse created = service.registerUniversity(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<UniversityResponse>> listUniversities(
            @RequestParam(required = false) Boolean verified) {

        logger.info("Listing universities. Verified filter: {}", verified);
        return ResponseEntity.ok(service.listUniversities(verified));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UniversityResponse> getUniversity(@PathVariable String id) {

        logger.info("Fetching university with ID {}", id);
        return ResponseEntity.ok(service.getUniversity(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UniversityResponse> updateUniversity(
            @PathVariable String id,
            @Validated @RequestBody UniversityUpdateRequest req) {

        logger.info("Updating university {}", id);
        return ResponseEntity.ok(service.updateUniversity(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUniversity(@PathVariable String id) {

        logger.info("Deleting university {}", id);
        service.deleteUniversity(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/verify")
    public ResponseEntity<VerifyUniversityResponse> verifyUniversity(@PathVariable String id) {

        logger.info("Verifying university {}", id);
        return ResponseEntity.ok(service.verifyUniversity(id));
    }

    @PostMapping("/{id}/unverify")
    public ResponseEntity<VerifyUniversityResponse> unverifyUniversity(@PathVariable String id) {

        logger.info("Unverifying university {}", id);
        return ResponseEntity.ok(service.unverifyUniversity(id));
    }

    @GetMapping("/{id}/public-key")
    public ResponseEntity<PublicKeyResponse> getUniversityPublicKey(@PathVariable String id) {

        logger.info("Getting public key for university {}", id);
        return ResponseEntity.ok(service.getUniversityPublicKey(id));
    }
}
