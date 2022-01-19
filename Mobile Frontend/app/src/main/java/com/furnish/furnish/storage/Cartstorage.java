package com.furnish.furnish.storage;

import android.content.Context;
import android.content.SharedPreferences;
import android.widget.Toast;

import com.furnish.furnish.models.ProductModel;
import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Cartstorage {
    public static final String PREFS_NAME = "PRODUCTS";
    public static final String FAVORITES = "Product_CART";

    public static String getPrefsName() {
        return PREFS_NAME;
    }

    public static String getFAVORITES() {
        return FAVORITES;
    }



    public Cartstorage() {
        super();
    }

    public void saveFavorites(Context context,List<ProductModel> favorites) {
        SharedPreferences settings;
        SharedPreferences.Editor editor;
        settings = context.getSharedPreferences(PREFS_NAME,
                Context.MODE_PRIVATE);
        editor = settings.edit();
        Gson gson = new Gson();
        String jsonFavorites = gson.toJson(favorites);
        editor.putString(FAVORITES, jsonFavorites);
        editor.apply();

    }
    public int savetopref(Context context,ProductModel productModel) {
        List<ProductModel> favorites = getFavorites(context);
        if (favorites == null) {
            favorites = new ArrayList<ProductModel>();
        }
        if(productModel.getProductQuantity()==0){
            return 0;
        }

       else if(!check(context, productModel) && productModel.getProductQuantity()>0) {
            favorites.add(productModel);
            saveFavorites(context, favorites);
            return 1;
        }
        else {
            return 2;
        }
    }
    public boolean check(Context context, ProductModel productModel) {
        List<ProductModel> carted = getFavorites(context);
        if (carted==null){
            return false;
        }
        String s = productModel.get_id();
        for (ProductModel model : carted) {
            if (model.get_id().contains(s.toLowerCase())) {
                return true;
            }
        }
        return false;
    }


    public ArrayList<ProductModel> getFavorites(Context context) {
        SharedPreferences settings;
        List<ProductModel> favorites;

        settings = context.getSharedPreferences(PREFS_NAME,
                Context.MODE_PRIVATE);

        if (settings.contains(FAVORITES)) {
            String jsonFavorites = settings.getString(FAVORITES, null);
            Gson gson = new Gson();
            ProductModel[] favoriteItems = gson.fromJson(jsonFavorites,
                    ProductModel[].class);

            favorites = Arrays.asList(favoriteItems);
            favorites = new ArrayList<ProductModel>(favorites);
        } else
            return null;

        return (ArrayList<ProductModel>) favorites;
    }
    public void clearCart(Context context){
        SharedPreferences sharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.clear();
        editor.apply();
    }

}
