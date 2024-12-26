package com.example.devjobs.user.repository;

import com.example.devjobs.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    boolean existsByUserId(String userId);

    boolean existsByEmail(String email);

    User findByUserCode(String userCode);

    Optional<User> findOptionalByUserCode(String userCode);

    User findByUserId(String userId);

    Optional<User> findByUserIdOrUserCode(String userId, String userCode);




}


