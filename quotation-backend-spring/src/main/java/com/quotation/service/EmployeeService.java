package com.quotation.service;

import com.quotation.dto.EmployeeRequest;
import com.quotation.dto.EmployeeResponse;
import com.quotation.entity.Employee;
import com.quotation.entity.User;
import com.quotation.exception.ResourceNotFoundException;
import com.quotation.repository.EmployeeRepository;
import com.quotation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    public List<EmployeeResponse> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public EmployeeResponse getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        return convertToResponse(employee);
    }

    public EmployeeResponse createEmployee(EmployeeRequest request) {
        User currentUser = getCurrentUser();

        Employee employee = new Employee();
        employee.setName(request.getName());
        employee.setPhone(request.getPhone());
        employee.setPosition(request.getPosition());
        employee.setEmail(request.getEmail());
        employee.setCreatedBy(currentUser);

        Employee saved = employeeRepository.save(employee);
        return convertToResponse(saved);
    }

    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));

        employee.setName(request.getName());
        employee.setPhone(request.getPhone());
        employee.setPosition(request.getPosition());
        employee.setEmail(request.getEmail());

        Employee updated = employeeRepository.save(employee);
        return convertToResponse(updated);
    }

    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        employeeRepository.delete(employee);
    }

    private EmployeeResponse convertToResponse(Employee employee) {
        EmployeeResponse response = new EmployeeResponse();
        response.setId(employee.getId());
        response.setName(employee.getName());
        response.setPhone(employee.getPhone());
        response.setPosition(employee.getPosition());
        response.setEmail(employee.getEmail());
        response.setCreatedAt(employee.getCreatedAt());
        response.setUpdatedAt(employee.getUpdatedAt());
        return response;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }
}
