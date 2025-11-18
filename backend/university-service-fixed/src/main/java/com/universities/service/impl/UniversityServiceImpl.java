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
import java.util.Base64;
import java.util.List;
import java.util.UUID;
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
    public UniversityResponse getUniversity(UUID id) {
        University university = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("University not found"));
        return toResponse(university);
    }

    @Override
    public UniversityResponse updateUniversity(UUID id, UniversityUpdateRequest request) {
        University university = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("University not found"));

        if (!university.getUniversityName().equals(request.getUniversityName())) {
            repository.findByUniversityName(request.getUniversityName())
                    .ifPresent(u -> {
                        throw new InvalidRequestException("University name already exists");
                    });
        }

        if (!university.getEmail().equals(request.getEmail())) {
            repository.findByEmail(request.getEmail())
                    .ifPresent(u -> {
                        throw new InvalidRequestException("University email already exists");
                    });
        }

        university.setUniversityName(request.getUniversityName());
        university.setEmail(request.getEmail());
        university.setAddress(request.getAddress());
        university.setPhone(request.getPhone());

        University saved = repository.save(university);
        return toResponse(saved);
    }

    @Override
    public void deleteUniversity(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("University not found");
        }
        repository.deleteById(id);
    }

    @Override
    public VerifyUniversityResponse verifyUniversity(UUID id) {
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
    public PublicKeyResponse getUniversityPublicKey(UUID id) {
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
