package com.quotation.controller;

import com.quotation.dto.OrderRequest;
import com.quotation.dto.OrderResponse;
import com.quotation.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/quotations")
    public OrderResponse createQuotation(@RequestBody OrderRequest request) {
        return orderService.createOrder(request);
    }

    @GetMapping("/quotations")
    public List<OrderResponse> getAllQuotations() {
        return orderService.getAllOrders();
    }

    @GetMapping("/quotations/{id}")
    public OrderResponse getQuotation(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @GetMapping("/quotations/{id}/receipt")
    public OrderResponse getReceipt(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        OrderResponse order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderRequest request) {
        OrderResponse order = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderResponse> updateOrder(
            @PathVariable Long id,
            @Valid @RequestBody OrderRequest request) {
        OrderResponse order = orderService.updateOrder(id, request);
        return ResponseEntity.ok(order);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
