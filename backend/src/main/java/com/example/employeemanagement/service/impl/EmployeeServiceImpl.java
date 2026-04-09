package com.example.employeemanagement.service.impl;

import com.example.employeemanagement.exception.ResourceNotFoundException;
import com.example.employeemanagement.model.Employee;
import com.example.employeemanagement.repository.EmployeeRepository;
import com.example.employeemanagement.service.EmployeeService;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository repository;

    public EmployeeServiceImpl(EmployeeRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Employee> getAll(String search, String department, String sortBy, String direction) {
        Sort sort = Sort.by(Sort.Direction.ASC, "id");
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            Sort.Direction dir = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
            sort = Sort.by(dir, sortBy);
        }

        List<Employee> employees = repository.findAll(sort);

        if (department != null && !department.trim().isEmpty() && !"all".equalsIgnoreCase(department.trim())) {
            String departmentTrimmed = department.trim();
            employees = employees.stream()
                    .filter(e -> departmentTrimmed.equalsIgnoreCase(e.getDepartment()))
                    .collect(Collectors.toList());
        }

        if (search != null && !search.trim().isEmpty()) {
            String key = search.trim().toLowerCase();
            employees = employees.stream().filter(e ->
                    e.getFirstName().toLowerCase().contains(key)
                            || e.getLastName().toLowerCase().contains(key)
                            || e.getEmail().toLowerCase().contains(key)
                            || e.getDepartment().toLowerCase().contains(key)
            ).collect(Collectors.toList());
        }

        return employees;
    }

    @Override
    public Employee getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    @Override
    public Employee create(Employee employee) {
        if (employee.getStatus() == null || employee.getStatus().isEmpty()) {
            employee.setStatus("Active");
        }
        return repository.save(employee);
    }

    @Override
    public Employee register(Employee employee) {
        if (employee.getEmail() != null && repository.existsByEmail(employee.getEmail())) {
            throw new IllegalArgumentException("An account with that email already exists.");
        }
        employee.setStatus("Pending");
        return repository.save(employee);
    }

    @Override
    public Employee authenticate(String email, String password) {
        Employee employee = repository.findByEmailAndPassword(email, password);
        if (employee == null) {
            throw new ResourceNotFoundException("Invalid email or password");
        }
        if ("Pending".equalsIgnoreCase(employee.getStatus())) {
            throw new IllegalStateException("Your account is still pending approval");
        }
        return employee;
    }

    @Override
    public Employee update(Long id, Employee employee) {
        Employee existing = getById(id);
        existing.setFirstName(employee.getFirstName());
        existing.setLastName(employee.getLastName());
        existing.setEmail(employee.getEmail());
        if (employee.getPassword() != null && !employee.getPassword().isEmpty()) {
            existing.setPassword(employee.getPassword());
        }
        existing.setDepartment(employee.getDepartment());
        existing.setSalary(employee.getSalary());
        existing.setPhone(employee.getPhone());
        existing.setStatus(employee.getStatus());
        return repository.save(existing);
    }

    @Override
    public void delete(Long id) {
        Employee existing = getById(id);
        repository.delete(existing);
    }

    @Override
    public long countAll() {
        return repository.count();
    }
}
