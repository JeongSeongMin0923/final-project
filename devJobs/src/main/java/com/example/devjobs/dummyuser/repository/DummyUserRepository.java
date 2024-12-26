package com.example.devjobs.dummyuser.repository;

import com.example.devjobs.dummyuser.entity.DummyUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DummyUserRepository extends JpaRepository<DummyUser, Long> {
}
