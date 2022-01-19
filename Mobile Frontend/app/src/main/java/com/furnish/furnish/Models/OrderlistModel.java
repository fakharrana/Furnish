package com.furnish.furnish.models;

import java.util.ArrayList;

public class OrderlistModel {
            private  String customerName;
            private String paymentMethod="";
             private  String customerEmail="";
             private  String customerNumber="";
             private String customerAddress="";
             private String postalCode="";
             private  double orderTotal=0;
             private ArrayList<OrderProductModel> products;
    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getCustomerNumber() {
        return customerNumber;
    }

    public void setCustomerNumber(String customerNumber) {
        this.customerNumber = customerNumber;
    }

    public String getCustomerAddress() {
        return customerAddress;
    }

    public void setCustomerAddress(String customerAddress) {
        this.customerAddress = customerAddress;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public double getOrderTotal() {
        return orderTotal;
    }

    public void setOrderTotal(double orderTotal) {
        this.orderTotal = orderTotal;
    }

    public ArrayList<OrderProductModel> getProducts() {
        return products;
    }

    public void setProducts(ArrayList<OrderProductModel> products) {
        this.products = products;
    }
}
