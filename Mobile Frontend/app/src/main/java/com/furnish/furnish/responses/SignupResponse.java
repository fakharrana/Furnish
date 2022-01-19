package com.furnish.furnish.responses;

import com.furnish.furnish.models.UserModel;

public class SignupResponse {
    private boolean success;
    private String status;
    private String token;
    private UserModel user;

    public SignupResponse(boolean success, String status, String token, UserModel user) {
        this.success = success;
        this.status = status;
        this.token = token;
        this.user = user;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getStatus() {
        return status;
    }

    public String getToken() {
        return token;
    }

    public UserModel getUser() {
        return user;
    }
}


