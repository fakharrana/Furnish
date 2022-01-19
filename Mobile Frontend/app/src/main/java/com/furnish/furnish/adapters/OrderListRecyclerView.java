package com.furnish.furnish.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.furnish.furnish.R;
import com.furnish.furnish.models.ProductModel;
import com.furnish.furnish.utilities.Credentials;

import org.jetbrains.annotations.NotNull;

import java.util.List;

public class OrderListRecyclerView extends RecyclerView.Adapter<OrderListRecyclerView.OrderListViewHolder> {
    private List<ProductModel> ProductList;

    public OrderListRecyclerView(List<ProductModel> productList) {
        ProductList=productList;
    }

    @NonNull
    @NotNull
    @Override
    public OrderListViewHolder onCreateViewHolder(@NonNull @NotNull ViewGroup parent, int viewType) {
        View view= LayoutInflater.from(parent.getContext()).inflate(R.layout.orderedlist,parent,false);
        OrderListViewHolder OrderListViewHolder=new OrderListViewHolder(view);
        return OrderListViewHolder;
    }

    @Override
    public void onBindViewHolder(@NonNull @NotNull OrderListViewHolder holder, int position) {
        ProductModel productModel=ProductList.get(position);
        holder.orderlistName.setText(productModel.getProductName());
        long price=(long) (productModel).getProductPrice();
        int count=(int) (productModel).getCount();
        long subtotal=price*count;
        String count_string=Long.toString(count);
        String price_string="PKR "+Long.toString(price);
        String subtotal_string="PKR "+Long.toString(subtotal);
        holder.orderlistPrice.setText(price_string);
        holder.orderlistCount.setText(count_string);
        holder.orderlistSubtotal.setText(subtotal_string);
        Glide.with(holder.itemView.getContext())
                .load(Credentials.PRODUCTTHUMBNAIL_URL +productModel.getProductThumbnail())
                .into(holder.orderlistimg);

    }

    @Override
    public int getItemCount() {
        return ProductList.size();
    }


    public static class OrderListViewHolder extends RecyclerView.ViewHolder{

    public TextView orderlistPrice;
    public TextView orderlistName;
    public ImageView orderlistimg;
    public TextView orderlistCount;
    public TextView orderlistSubtotal;


    public OrderListViewHolder(@NonNull @NotNull View itemView) {
        super(itemView);
        orderlistPrice=itemView.findViewById(R.id.orderlist_price);
        orderlistName=itemView.findViewById(R.id.orderlist_name);
        orderlistimg=itemView.findViewById(R.id.orderlistimage);
        orderlistSubtotal=itemView.findViewById(R.id.orderlist_subtotal);
        orderlistCount=itemView.findViewById(R.id.orderlist_count);



    }
}

}
