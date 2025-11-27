package com.universities.service.impl;

import com.universities.dto.*;
import com.universities.exception.InvalidRequestException;
import com.universities.exception.ResourceNotFoundException;
import com.universities.model.University;
import com.universities.repository.UniversityRepository;
import com.universities.service.UniversityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UniversityServiceImpl implements UniversityService {

    private final UniversityRepository repository;

    @Override
    public UniversityResponse registerUniversity(UniversityRegisterRequest request) {
        log.info("Registering university: {}", request.getUniversityName());

        repository.findByUniversityName(request.getUniversityName())
                .ifPresent(u -> {
                    throw new InvalidRequestException("University name already exists");
                });

        repository.findByEmail(request.getEmail())
                .ifPresent(u -> {
                    throw new InvalidRequestException("University email already exists");
                });

        String publicKey = generatePublicKey();

        University university = University.builder()
                .universityId(request.getUniversityId())
                .universityName(request.getUniversityName())
                .email(request.getEmail())
                .address(request.getAddress())
                .phone(request.getPhone())
                .publicKey(publicKey)
                .verified(false)
                .build();

        University saved = repository.save(university);
        return toResponse(saved);
    }

    @Override
    public List<UniversityResponse> listUniversities(Boolean verified) {
        List<University> universities;

        if (verified == null) {
            universities = repository.findAll();
        } else {
            universities = repository.findAll().stream()
                    .filter(u -> u.isVerified() == verified)
                    .collect(Collectors.toList());
        }

        return universities.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UniversityResponse getUniversity(String id) {
        University university = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("University not found"));
        return toResponse(university);
    }

    @Override
    public UniversityResponse updateUniversity(String id, UniversityUpdateRequest request) {
        University university = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("University not found"));

        // Check for duplicates only if the field is being updated
        if (request.getUniversityName() != null && !university.getUniversityName().equals(request.getUniversityName())) {
            repository.findByUniversityName(request.getUniversityName())
                    .ifPresent(u -> {
                        throw new InvalidRequestException("University name already exists");
                    });
        }

        if (request.getEmail() != null && !university.getEmail().equals(request.getEmail())) {
            repository.findByEmail(request.getEmail())
                    .ifPresent(u -> {
                        throw new InvalidRequestException("University email already exists");
                    });
        }

        // Only update fields that are provided (not null)
        // DO NOT touch publicKey, verified, or createdAt
        if (request.getUniversityName() != null) {
            university.setUniversityName(request.getUniversityName());
        }
        if (request.getEmail() != null) {
            university.setEmail(request.getEmail());
        }
        if (request.getAddress() != null) {
            university.setAddress(request.getAddress());
        }
        if (request.getPhone() != null) {
            university.setPhone(request.getPhone());
        }

        // Save will only update changed fields due to dirty checking
        University saved = repository.save(university);
        return toResponse(saved);
    }

    @Override
    public void deleteUniversity(String id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("University not found");
        }
        repository.deleteById(id);
    }

    @Override
    public VerifyUniversityResponse verifyUniversity(String id) {
        University university = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("University not found"));

        if (university.isVerified()) {
            throw new InvalidRequestException("University is already verified");
        }

        university.setVerified(true);
        University saved = repository.save(university);

        VerifyUniversityResponse response = new VerifyUniversityResponse();
        response.setUniversityId(saved.getUniversityId());
        response.setVerified(true);
        response.setMessage("University verified successfully");

        return response;
    }

    @Override
    public VerifyUniversityResponse unverifyUniversity(String id) {
        University university = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("University not found"));

        if (!university.isVerified()) {
            throw new InvalidRequestException("University is already unverified");
        }

        university.setVerified(false);
        University saved = repository.save(university);

        VerifyUniversityResponse response = new VerifyUniversityResponse();
        response.setUniversityId(saved.getUniversityId());
        response.setVerified(false);
        response.setMessage("University unverified successfully");

        return response;
    }

    @Override
    public PublicKeyResponse getUniversityPublicKey(String id) {
        University university = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("University not found"));

        PublicKeyResponse response = new PublicKeyResponse();
        response.setUniversityId(university.getUniversityId());
        response.setUniversityName(university.getUniversityName());
        response.setPublicKey(university.getPublicKey());
        return response;
    }

    private UniversityResponse toResponse(University university) {
        UniversityResponse response = new UniversityResponse();
        response.setUniversityId(university.getUniversityId());
        response.setUniversityName(university.getUniversityName());
        response.setEmail(university.getEmail());
        response.setAddress(university.getAddress());
        response.setPhone(university.getPhone());
        response.setVerified(university.isVerified());
        response.setPublicKey(university.getPublicKey());
        response.setCreatedAt(university.getCreatedAt());
        response.setUpdatedAt(university.getUpdatedAt());
        return response;
    }

    private String generatePublicKey() {
        try {
            KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
            generator.initialize(2048);
            KeyPair pair = generator.generateKeyPair();
            return Base64.getEncoder().encodeToString(pair.getPublic().getEncoded());
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate public key", e);
        }
    }
}
