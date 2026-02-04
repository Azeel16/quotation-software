package com.quotation.service;

import com.quotation.dto.CustomerRequest;
import com.quotation.dto.CustomerResponse;
import com.quotation.entity.Customer;
import com.quotation.entity.User;
import com.quotation.exception.ResourceNotFoundException;
import com.quotation.repository.CustomerRepository;
import com.quotation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserRepository userRepository;

    public List<CustomerResponse> getAllCustomers(String search) {
        List<Customer> customers;
        if (search != null && !search.isEmpty()) {
            customers = customerRepository.findByNameContainingIgnoreCaseOrPhoneContaining(search, search);
        } else {
            customers = customerRepository.findAll();
        }
        return customers.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));
        return convertToResponse(customer);
    }

    public CustomerResponse createCustomer(CustomerRequest request) {
        User currentUser = getCurrentUser();

        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setPhone(request.getPhone());
        customer.setGst(request.getGst());
        customer.setAddress(request.getAddress());
        customer.setCreatedBy(currentUser);

        Customer saved = customerRepository.save(customer);
        return convertToResponse(saved);
    }

    public CustomerResponse updateCustomer(Long id, CustomerRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));

        customer.setName(request.getName());
        customer.setPhone(request.getPhone());
        customer.setGst(request.getGst());
        customer.setAddress(request.getAddress());

        Customer updated = customerRepository.save(customer);
        return convertToResponse(updated);
    }

    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));
        customerRepository.delete(customer);
    }

    private CustomerResponse convertToResponse(Customer customer) {
        CustomerResponse response = new CustomerResponse();
        response.setId(customer.getId());
        response.setName(customer.getName());
        response.setPhone(customer.getPhone());
        response.setGst(customer.getGst());
        response.setAddress(customer.getAddress());
        response.setCreatedAt(customer.getCreatedAt());
        response.setUpdatedAt(customer.getUpdatedAt());
        return response;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }
}
