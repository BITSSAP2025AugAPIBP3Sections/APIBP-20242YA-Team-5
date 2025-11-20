package com.universities.service;

import com.universities.dto.*;

import java.util.List;
import java.util.UUID;

public interface UniversityService {

    UniversityResponse registerUniversity(UniversityRegisterRequest request);

    List<UniversityResponse> listUniversities(Boolean verified);

    UniversityResponse getUniversity(UUID id);

    UniversityResponse updateUniversity(UUID id, UniversityUpdateRequest request);

    void deleteUniversity(UUID id);

    VerifyUniversityResponse verifyUniversity(UUID id);

    PublicKeyResponse getUniversityPublicKey(UUID id);
}
