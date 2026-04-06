package com.example.employeemanagement.service.impl;

import com.example.employeemanagement.exception.ResourceNotFoundException;
import com.example.employeemanagement.model.Admin;
import com.example.employeemanagement.repository.AdminRepository;
import com.example.employeemanagement.service.AdminService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminServiceImpl implements AdminService {

    private final AdminRepository repository;

    public AdminServiceImpl(AdminRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Admin> getAll() {
        return repository.findAll();
    }

    @Override
    public Optional<Admin> getById(Long id) {
        return repository.findById(id);
    }

    @Override
    public Optional<Admin> getByUsername(String username) {
        return repository.findByUsername(username);
    }

    @Override
    public Admin create(Admin admin) {
        return repository.save(admin);
    }

    @Override
    public Admin update(Long id, Admin admin) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Admin not found with id: " + id);
        }
        admin.setId(id);
        return repository.save(admin);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Admin not found with id: " + id);
        }
        repository.deleteById(id);
    }

    @Override
    public boolean existsByUsername(String username) {
        return repository.findByUsername(username).isPresent();
    }

    @Override
    public boolean existsByEmail(String email) {
        return repository.findByEmail(email).isPresent();
    }
}