package com.furnish.furnish.models;

import android.os.Parcel;
import android.os.Parcelable;

public class ProductModel implements Parcelable {
    //Model Class for our Products kinda schema
    private String []  productImages;
    private String dateAdded;
    private int count;
    private int soldQuantity;
    private String _id;
    private String productName;
    private String productCategory;
    private String productDescription;
    private long productPrice;
    private int productQuantity;
    private String productThumbnail;
    private String productModel;
    private int __v;

    //Constructor
    public ProductModel(String[] productImages,int soldQuantity,int count, String dateAdded, String _id, String productName, String productCategory, String productDescription, long productPrice, int productQuantity, String productThumbnail, String productModel,int __v) {
        this.productImages = productImages;
        this.dateAdded = dateAdded;
        this._id = _id;
        this.count=count;
        this.soldQuantity=soldQuantity;
        this.productName = productName;
        this.productCategory = productCategory;
        this.productDescription = productDescription;
        this.productPrice = productPrice;
        this.productQuantity = productQuantity;
        this.productThumbnail = productThumbnail;
        this.productModel = productModel;
        this.__v=__v;
    }

    //Getter
    protected ProductModel(Parcel in) {
        productImages = in.createStringArray();
        dateAdded = in.readString();
        _id = in.readString();
        productName = in.readString();
        productCategory = in.readString();
        productDescription = in.readString();
        productPrice = in.readLong();
        productQuantity = in.readInt();
        productThumbnail = in.readString();
        productModel = in.readString();
        __v=in.readInt();
        count=in.readInt();
        soldQuantity=in.readInt();
    }

    public static final Creator<ProductModel> CREATOR = new Creator<ProductModel>() {
        @Override
        public ProductModel createFromParcel(Parcel in) {
            return new ProductModel(in);
        }

        @Override
        public ProductModel[] newArray(int size) {
            return new ProductModel[size];
        }
    };

    public String[] getProductImages() {
        return productImages;
    }

    public String getDateAdded() {
        return dateAdded;
    }

    public String get_id() {
        return _id;
    }

    public String getProductName() {
        return productName;
    }

    public String getProductCategory() {
        return productCategory;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public long getProductPrice() {
        return productPrice;
    }

    public int getProductQuantity() {
        return productQuantity;
    }

    public String getProductThumbnail() {
        return productThumbnail;
    }

    public String getProductModel() {
        return productModel;
    }

    public int get__v() {
        return __v;
    }

    public int getCount() {
        return count;
    }

    public int getSoldQuantity() {
        return soldQuantity;
    }

    @Override
    public int describeContents() {
        return 0;
    }

    public void setProductQuantity(int productQuantity) {
        this.productQuantity = productQuantity;
    }

    public void setCount(int count) {
        this.count = count;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeStringArray(productImages);
        dest.writeString(dateAdded);
        dest.writeString(_id);
        dest.writeString(productName);
        dest.writeString(productCategory);
        dest.writeString(productDescription);
        dest.writeLong(productPrice);
        dest.writeInt(productQuantity);
        dest.writeString(productThumbnail);
        dest.writeString(productModel);
        dest.writeInt(__v);
        dest.writeInt(count);
        dest.writeInt(soldQuantity);
    }
}


