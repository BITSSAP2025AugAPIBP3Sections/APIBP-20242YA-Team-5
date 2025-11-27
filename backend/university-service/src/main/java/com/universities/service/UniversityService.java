package com.universities.service;

import com.universities.dto.*;

import java.util.List;

public interface UniversityService {

    UniversityResponse registerUniversity(UniversityRegisterRequest request);

    List<UniversityResponse> listUniversities(Boolean verified);

    UniversityResponse getUniversity(String id);

    UniversityResponse updateUniversity(String id, UniversityUpdateRequest request);

    void deleteUniversity(String id);

    VerifyUniversityResponse verifyUniversity(String id);

    VerifyUniversityResponse unverifyUniversity(String id);

    PublicKeyResponse getUniversityPublicKey(String id);
}
