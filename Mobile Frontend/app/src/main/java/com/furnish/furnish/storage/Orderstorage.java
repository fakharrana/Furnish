package com.furnish.furnish.storage;

import android.content.Context;
import android.content.SharedPreferences;

import com.furnish.furnish.models.OrderlistModel;
import com.furnish.furnish.models.ProductModel;
import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Orderstorage {
    public static final String PREFS_NAME = "My_ORDER";
    public static final String ORDER_KEY = "ORDER";
    public Orderstorage() {
        super();
    }

    public void saveOrder(Context context, OrderlistModel order) {
        SharedPreferences settings;
        SharedPreferences.Editor editor;
        settings = context.getSharedPreferences(PREFS_NAME,
                Context.MODE_PRIVATE);
        editor = settings.edit();
        Gson gson = new Gson();
        String jsonOrder = gson.toJson(order);
        editor.putString(ORDER_KEY, jsonOrder);
        editor.apply();

    }
    public OrderlistModel getOrder(Context context) {
        SharedPreferences settings;
        OrderlistModel order;

        settings = context.getSharedPreferences(PREFS_NAME,
                Context.MODE_PRIVATE);

        if (settings.contains(ORDER_KEY)) {
            String jsonFavorites = settings.getString(ORDER_KEY, null);
            Gson gson = new Gson();
            order = gson.fromJson(jsonFavorites,
                    OrderlistModel.class);

        } else
            return null;

        return order;
    }
    public void clearOrderStorage(Context context){
        SharedPreferences sharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.clear();
        editor.apply();
    }
}
