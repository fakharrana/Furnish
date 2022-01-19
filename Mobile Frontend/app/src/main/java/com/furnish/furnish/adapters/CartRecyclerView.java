package com.furnish.furnish.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
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

public class CartRecyclerView extends RecyclerView.Adapter<CartRecyclerView.CartViewHolder> {
    private List<ProductModel> ProductList;
    private OnItemClickListener onItemClickListener;

    public interface OnItemClickListener{
        void increaseQuantity(int position);
        void decreaseQuantity(int position);
        void removeItem(int position);
    }
    public void setOnItemClickListener(OnItemClickListener listener){
        onItemClickListener=listener;
    }


    public CartRecyclerView(List<ProductModel> productList) {
        ProductList=productList;
    }



    @NonNull
    @NotNull
    @Override
    public CartViewHolder onCreateViewHolder(@NonNull @NotNull ViewGroup parent, int viewType) {
        //pass layout
        View view= LayoutInflater.from(parent.getContext()).inflate(R.layout.cart_list_item,parent,false);
        CartViewHolder cartViewHolder=new CartViewHolder(view,onItemClickListener);
        return  cartViewHolder;

    }

    @Override
    public void onBindViewHolder(@NonNull @NotNull CartViewHolder holder, int position) {
        ProductModel productModel=ProductList.get(position);
        holder.cartproductName.setText(productModel.getProductName());
        long price=(long) (productModel).getProductPrice();
        String price_string="PKR "+Long.toString(price);
        holder.cartproductPrice.setText(price_string);
        holder.count.setText((String.valueOf(productModel.getCount())));
        Glide.with(holder.itemView.getContext())
                .load(Credentials.PRODUCTTHUMBNAIL_URL +productModel.getProductThumbnail())
                .into(holder.cartproductimg);


    }

    @Override
    public int getItemCount() {
        return ProductList.size();
    }

    public static class CartViewHolder extends RecyclerView.ViewHolder{
        public TextView cartproductName;
        public TextView cartproductPrice;
        public ImageView cartproductimg;
        public ImageButton cartdeleteButton;
        public ImageButton incbtn;
        public TextView count;
        public ImageButton decbtn;

        public CartViewHolder(@NonNull @NotNull View itemView,OnItemClickListener listener) {
            super(itemView);
            cartproductName=itemView.findViewById(R.id.cart_product_name);
            cartproductPrice=itemView.findViewById(R.id.cart_product_price);
            cartproductimg=itemView.findViewById(R.id.cart_image);
            cartdeleteButton=itemView.findViewById(R.id.deleteitem);
            incbtn=itemView.findViewById(R.id.incrementcountbtn);
            count=itemView.findViewById(R.id.count);
            decbtn=itemView.findViewById(R.id.decrementcountbtn);

            incbtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if(listener != null){
                        int position=getAdapterPosition();
                        if (position!=RecyclerView.NO_POSITION){
                            listener.increaseQuantity(position);
                        }
                    }

                }
            });
            decbtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if(listener != null){
                        int position=getAdapterPosition();
                        if (position!=RecyclerView.NO_POSITION){
                            listener.decreaseQuantity(position);
                        }
                    }
                }
            });
            cartdeleteButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if(listener != null){
                        int position=getAdapterPosition();
                        if (position!=RecyclerView.NO_POSITION){
                            listener.removeItem(position);
                        }
                    }

                }
            });




        }
    }

}
