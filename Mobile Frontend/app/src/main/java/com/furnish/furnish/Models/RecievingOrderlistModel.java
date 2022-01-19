package com.furnish.furnish.models;

import android.os.Parcel;
import android.os.Parcelable;

import com.furnish.furnish.activities.OrderDetails;

import java.util.ArrayList;
import java.util.List;

public class RecievingOrderlistModel implements Parcelable {
    private  String orderDate;
    private  String deliverDate;
    private  String orderStatus;
    private  String _id;
    private  String customerName;
    private  String customerEmail;
    private  String customerNumber;
    private String customerAddress;
    private String postalCode;
    private  double orderTotal;
    private List<OrderDetailsProductModel> products;

    public String getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(String orderDate) {
        this.orderDate = orderDate;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

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

    public List<OrderDetailsProductModel> getProducts() {
        return products;
    }

    public void setProducts(List<OrderDetailsProductModel> products) {
        this.products = products;
    }

    public static Creator<RecievingOrderlistModel> getCREATOR() {
        return CREATOR;
    }

    public String getDeliverDate() {
        return deliverDate;
    }

    public void setDeliverDate(String deliverDate) {
        this.deliverDate = deliverDate;
    }


    protected RecievingOrderlistModel(Parcel in) {
        orderDate = in.readString();
        deliverDate = in.readString();
        orderStatus = in.readString();
        _id = in.readString();
        customerName = in.readString();
        customerEmail = in.readString();
        customerNumber = in.readString();
        customerAddress = in.readString();
        postalCode = in.readString();
        orderTotal = in.readDouble();
        products = in.createTypedArrayList(OrderDetailsProductModel.CREATOR);
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(orderDate);
        dest.writeString(deliverDate);
        dest.writeString(orderStatus);
        dest.writeString(_id);
        dest.writeString(customerName);
        dest.writeString(customerEmail);
        dest.writeString(customerNumber);
        dest.writeString(customerAddress);
        dest.writeString(postalCode);
        dest.writeDouble(orderTotal);
        dest.writeTypedList(products);
    }

    @Override
    public int describeContents() {
        return 0;
    }

    public static final Creator<RecievingOrderlistModel> CREATOR = new Creator<RecievingOrderlistModel>() {
        @Override
        public RecievingOrderlistModel createFromParcel(Parcel in) {
            return new RecievingOrderlistModel(in);
        }

        @Override
        public RecievingOrderlistModel[] newArray(int size) {
            return new RecievingOrderlistModel[size];
        }
    };
}
