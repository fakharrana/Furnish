package com.furnish.furnish.models;

import android.os.Parcel;
import android.os.Parcelable;

public class OrderDetailsProductModel  implements Parcelable {
    private String productName;
    private String productID;
    private int productCount;
    private long productPrice;
    private String _id;

    public OrderDetailsProductModel(String productName, String productID, int productCount, long productPrice, String _id) {
        this.productName = productName;
        this.productID = productID;
        this.productCount = productCount;
        this.productPrice = productPrice;
        this._id = _id;
    }


    protected OrderDetailsProductModel(Parcel in) {
        productName = in.readString();
        productID = in.readString();
        productCount = in.readInt();
        productPrice = in.readLong();
        _id = in.readString();
    }

    public static final Creator<OrderDetailsProductModel> CREATOR = new Creator<OrderDetailsProductModel>() {
        @Override
        public OrderDetailsProductModel createFromParcel(Parcel in) {
            return new OrderDetailsProductModel(in);
        }

        @Override
        public OrderDetailsProductModel[] newArray(int size) {
            return new OrderDetailsProductModel[size];
        }
    };

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
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

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(productName);
        dest.writeString(productID);
        dest.writeInt(productCount);
        dest.writeLong(productPrice);
        dest.writeString(_id);
    }
}
