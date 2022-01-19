package com.furnish.furnish.responses;

import com.furnish.furnish.models.UserModel;

public class SigninResponse {
    private boolean success;
    private String token;
    private String status;
    private boolean admin;
    private UserModel user;




    public SigninResponse(boolean success, String token, String status, boolean admin, UserModel user) {
        this.success = success;
        this.token = token;
        this.status = status;
        this.admin = admin;
        this.user = user;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getToken() {
        return token;
    }

    public String getStatus() {
        return status;
    }

    public boolean isAdmin() {
        return admin;
    }

    public UserModel getUser() {
        return user;
    }
}
