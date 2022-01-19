package com.furnish.furnish.models;

public class OrderProductModel {

    private String productName;
    private String productID;
    private int productCount;
    private long productPrice;

    public OrderProductModel(String productName, String productID, int productCount, long productPrice) {
        this.productName = productName;
        this.productID = productID;
        this.productCount = productCount;
        this.productPrice = productPrice;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductID() {
        return productID;
    }

    public void setProductID(String productID) {
        this.productID = productID;
    }

    public int getProductCount() {
        return productCount;
    }

    public void setProductCount(int productCount) {
        this.productCount = productCount;
    }

    public long getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(long productPrice) {
        this.productPrice = productPrice;
    }
}
