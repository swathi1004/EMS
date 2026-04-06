package com.example.employeemanagement.service;

import com.example.employeemanagement.model.Employee;

import java.util.List;

public interface EmployeeService {
    List<Employee> getAll(String search, String department, String sortBy, String direction);
    Employee getById(Long id);
    Employee create(Employee employee);
    Employee update(Long id, Employee employee);
    void delete(Long id);
    long countAll();
}
