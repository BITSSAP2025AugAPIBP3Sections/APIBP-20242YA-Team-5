package com.universities.repository;

import com.universities.model.University;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UniversityRepository extends JpaRepository<University, UUID> {

    Optional<University> findByUniversityName(String universityName);

    Optional<University> findByEmail(String email);
}
