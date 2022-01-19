package com.furnish.furnish.storage;

import android.content.Context;
import android.content.SharedPreferences;

import com.furnish.furnish.models.UserModel;

public class UserStorage {
    private static final String SHARED_PREF_NAME="my_shared_pref";
    private static final String TOKEN_PREF="token_";

    private static UserStorage mInstance;
    private Context context;

    private UserStorage(Context context){
        this.context=context;

    }

    public static synchronized UserStorage getInstance(Context context){
        if (mInstance==null){
            mInstance=new UserStorage(context);
        }
        return mInstance;
    }
    public  void saveUser(UserModel user){
        SharedPreferences sharedPreferences=context.getSharedPreferences(SHARED_PREF_NAME,Context.MODE_PRIVATE);
        SharedPreferences.Editor editor=sharedPreferences.edit();
        editor.putString("_id",user.get_id());
        editor.putString("name",user.getName());
        editor.putString("email",user.getEmail());
        editor.apply();

    }



    public boolean isLoggedIn(){
        SharedPreferences sharedPreferences=context.getSharedPreferences(SHARED_PREF_NAME,Context.MODE_PRIVATE);
        return  sharedPreferences.getString("_id",null)!=null;

    }

    public  UserModel getUser(){
        SharedPreferences sharedPreferences=context.getSharedPreferences(SHARED_PREF_NAME, Context.MODE_PRIVATE);
        UserModel user=new UserModel(

                sharedPreferences.getString("email",null),
                sharedPreferences.getString("name",null),
                sharedPreferences.getString("_id",null)

        );
        return user;

    }

    public void clear() {
        SharedPreferences sharedPreferences = context.getSharedPreferences(SHARED_PREF_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.clear();
        editor.apply();
    }

    public void saveToken(String token){
        SharedPreferences sharedPreferences=context.getSharedPreferences(TOKEN_PREF,Context.MODE_PRIVATE);
        SharedPreferences.Editor editor=sharedPreferences.edit();
        editor.putString("token",token);
        editor.apply();
    }
    public String getToken(){
        SharedPreferences sharedPreferences=context.getSharedPreferences(TOKEN_PREF,Context.MODE_PRIVATE);
        String token=sharedPreferences.getString("token",null);
        return token;

    }
    public void clearToken(){
        SharedPreferences sharedPreferences=context.getSharedPreferences(TOKEN_PREF,Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.clear();
        editor.apply();

    }
    public void changename(String name){
        SharedPreferences sharedPreferences=context.getSharedPreferences(SHARED_PREF_NAME,Context.MODE_PRIVATE);
        SharedPreferences.Editor editor=sharedPreferences.edit();
        editor.putString("name",name);
        editor.apply();
    }
}
