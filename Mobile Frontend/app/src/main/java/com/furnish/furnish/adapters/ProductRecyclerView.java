package com.furnish.furnish.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.furnish.furnish.R;
import com.furnish.furnish.models.ProductModel;
import com.furnish.furnish.utilities.Credentials;

import org.jetbrains.annotations.NotNull;

import java.util.List;

public class ProductRecyclerView extends RecyclerView.Adapter<RecyclerView.ViewHolder>{

    private List<ProductModel> ProductList;
    private OnListener onListener;

    public ProductRecyclerView(List<ProductModel> productList, OnListener onListener) {
        this.ProductList = productList;
        this.onListener = onListener;
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull @NotNull ViewGroup parent, int viewType) {

        View view=LayoutInflater.from(parent.getContext()).inflate(R.layout.product_item,parent,false);
        return new MyViewHolder(view,onListener);
    }

    @Override
    public void onBindViewHolder(@NonNull @NotNull RecyclerView.ViewHolder holder, int position) {

        long priceToString=(long) (ProductList.get(position)).getProductPrice();
        String price_string="PKR "+Long.toString(priceToString);

        ((MyViewHolder)holder).price.setText(price_string);
        ((MyViewHolder)holder).name.setText(ProductList.get(position).getProductName());

        Glide.with(holder.itemView.getContext())
                .load(Credentials.PRODUCTIMAGE_URL+ProductList.get(position).getProductImages()[0])

                .into(((MyViewHolder)holder).image);
    }







    @Override
    public int getItemCount() {
        return ProductList.size();
    }

    //Getting the ID of the movie


    public ProductModel getSelectedProduct(int position) {
        if (ProductList != null) {
            if (ProductList.size() > 0) {
                return ProductList.get(position);
            }
        }
        return null;
    }









}
