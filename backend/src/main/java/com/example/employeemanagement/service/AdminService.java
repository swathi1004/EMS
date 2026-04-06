package com.example.employeemanagement.service;

import com.example.employeemanagement.model.Admin;

import java.util.List;
import java.util.Optional;

public interface AdminService {
    List<Admin> getAll();
    Optional<Admin> getById(Long id);
    Optional<Admin> getByUsername(String username);
    Admin create(Admin admin);
    Admin update(Long id, Admin admin);
    void delete(Long id);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}