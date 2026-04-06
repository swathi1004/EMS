package com.example.employeemanagement.controller;

import com.example.employeemanagement.model.Admin;
import com.example.employeemanagement.payload.ApiResponse;
import com.example.employeemanagement.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService service;

    public AdminController(AdminService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Admin>>> getAll() {
        List<Admin> admins = service.getAll();
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Admins retrieved", admins));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Admin>> getById(@PathVariable Long id) {
        Optional<Admin> admin = service.getById(id);
        if (admin.isPresent()) {
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Admin retrieved", admin.get()));
        } else {
            return new ResponseEntity<>(new ApiResponse<>(HttpStatus.NOT_FOUND.value(), "Admin not found", null), HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Admin>> create(@Valid @RequestBody(required = false) Admin admin) {
        if (admin == null) {
            return new ResponseEntity<>(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), "Request body is required", null), HttpStatus.BAD_REQUEST);
        }
        if (service.existsByUsername(admin.getUsername())) {
            return new ResponseEntity<>(new ApiResponse<>(HttpStatus.CONFLICT.value(), "Username already exists", null), HttpStatus.CONFLICT);
        }
        if (service.existsByEmail(admin.getEmail())) {
            return new ResponseEntity<>(new ApiResponse<>(HttpStatus.CONFLICT.value(), "Email already exists", null), HttpStatus.CONFLICT);
        }
        Admin created = service.create(admin);
        return new ResponseEntity<>(new ApiResponse<>(HttpStatus.CREATED.value(), "Admin created", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Admin>> update(@PathVariable Long id, @Valid @RequestBody Admin admin) {
        Admin updated = service.update(id, admin);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Admin updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Admin deleted", null));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        String role = credentials.get("role");

        if (username == null || password == null || role == null) {
            return new ResponseEntity<>(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), "Username, password, and role are required", null), HttpStatus.BAD_REQUEST);
        }

        Optional<Admin> admin = service.getByUsername(username);
        if (admin.isPresent() && admin.get().getPassword().equals(password) && admin.get().getRole().equals(role)) {
            Map<String, Object> response = new HashMap<>();
            response.put("id", admin.get().getId());
            response.put("name", admin.get().getName());
            response.put("email", admin.get().getEmail());
            response.put("username", admin.get().getUsername());
            response.put("role", admin.get().getRole());
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Login successful", response));
        } else {
            return new ResponseEntity<>(new ApiResponse<>(HttpStatus.UNAUTHORIZED.value(), "Invalid credentials", null), HttpStatus.UNAUTHORIZED);
        }
    }
}