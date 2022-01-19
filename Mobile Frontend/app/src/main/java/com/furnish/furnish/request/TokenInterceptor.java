package com.furnish.furnish.request;

import android.content.Context;

import com.furnish.furnish.storage.UserStorage;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

public class TokenInterceptor implements Interceptor {
    private Context context;


    @Override
    public Response intercept(Chain chain) throws IOException {
        //rewrite the request to add bearer token
        Request newRequest=chain.request().newBuilder()
                .header("Authorization","Bearer "+ UserStorage.getInstance(context).getToken())
                .build();

        return chain.proceed(newRequest);
    }
}

