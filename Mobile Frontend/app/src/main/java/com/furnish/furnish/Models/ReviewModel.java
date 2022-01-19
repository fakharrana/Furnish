package com.furnish.furnish.models;

public class ReviewModel {
    private int analyzed;
    private String _id;
    private String date;
    private String userEmail;
    private String review;


    public ReviewModel(int analyzed, String _id, String date, String userEmail, String review) {
        this.analyzed = analyzed;
        this._id = _id;
        this.date = date;
        this.userEmail = userEmail;
        this.review = review;
    }

    public int getAnalyzed() {
        return analyzed;
    }

    public void setAnalyzed(int analyzed) {
        this.analyzed = analyzed;
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }
}
