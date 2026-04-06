package com.example.employeemanagement.controller;

import com.example.employeemanagement.model.Employee;
import com.example.employeemanagement.payload.ApiResponse;
import com.example.employeemanagement.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    private final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Employee>>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String direction
    ) {
        List<Employee> employees = service.getAll(search, department, sortBy, direction);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Employees retrieved", employees));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Employee>> getById(@PathVariable Long id) {
        Employee employee = service.getById(id);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Employee retrieved", employee));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Employee>> create(@Valid @RequestBody(required = false) Employee employee) {
        if (employee == null) {
            return new ResponseEntity<>(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), "Request body is required", null), HttpStatus.BAD_REQUEST);
        }
        Employee created = service.create(employee);
        return new ResponseEntity<>(new ApiResponse<>(HttpStatus.CREATED.value(), "Employee created", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Employee>> update(@PathVariable Long id, @Valid @RequestBody(required = false) Employee employee) {
        if (employee == null) {
            return new ResponseEntity<>(new ApiResponse<>(HttpStatus.BAD_REQUEST.value(), "Request body is required", null), HttpStatus.BAD_REQUEST);
        }
        Employee updated = service.update(id, employee);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Employee updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Employee deleted", null));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> dashboard() {
        long total = service.countAll();
        Map<String, Object> data = new HashMap<>();
        data.put("totalEmployees", total);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), "Dashboard data retrieved", data));
    }
}
