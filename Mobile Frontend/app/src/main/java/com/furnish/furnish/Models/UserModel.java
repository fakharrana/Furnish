package com.furnish.furnish.models;

public class UserModel {
    private String email,name,_id;


    public UserModel(String email, String name, String _id) {
        this.email = email;
        this.name = name;
        this._id = _id;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String get_id() {
        return _id;
    }
}
