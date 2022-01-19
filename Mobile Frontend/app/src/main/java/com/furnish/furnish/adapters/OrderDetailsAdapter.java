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
import com.furnish.furnish.models.OrderDetailsProductModel;
import com.furnish.furnish.models.OrderProductModel;
import com.furnish.furnish.models.ProductModel;
import com.furnish.furnish.utilities.Credentials;

import org.jetbrains.annotations.NotNull;

import java.util.List;

public class OrderDetailsAdapter extends RecyclerView.Adapter<OrderDetailsAdapter.OrderDetailsViewHolder> {
    private List<OrderDetailsProductModel> OrderList;

    public OrderDetailsAdapter(List<OrderDetailsProductModel> orderlist) {
        OrderList=orderlist;
    }


    @NonNull
    @Override
    public OrderDetailsViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view= LayoutInflater.from(parent.getContext()).inflate(R.layout.orderdetailslist,parent,false);
        OrderDetailsViewHolder OrderDetailsViewHolder=new OrderDetailsViewHolder(view);
        return OrderDetailsViewHolder;
    }

    @Override
    public void onBindViewHolder(@NonNull OrderDetailsAdapter.OrderDetailsViewHolder holder, int position) {
        OrderDetailsProductModel model=OrderList.get(position);
        holder.orderlistName.setText(model.getProductName());
        long price=(long) (model).getProductPrice();
        int count=(int) (model).getProductCount();
        long subtotal=price*count;
        String count_string=Long.toString(count);
        String price_string="PKR "+Long.toString(price);
        String subtotal_string="PKR "+Long.toString(subtotal);
        holder.orderlistPrice.setText(price_string);
        holder.orderlistCount.setText(count_string);
        holder.orderlistSubtotal.setText(subtotal_string);

    }


    @Override
    public int getItemCount() {
        return OrderList.size();
    }


    public static class OrderDetailsViewHolder extends RecyclerView.ViewHolder{

        public TextView orderlistPrice;
        public TextView orderlistName;
        public TextView orderlistCount;
        public TextView orderlistSubtotal;


        public OrderDetailsViewHolder(@NonNull @NotNull View itemView) {
            super(itemView);
            orderlistPrice=itemView.findViewById(R.id.orderdetailslist_price);
            orderlistName=itemView.findViewById(R.id.orderdetailslist_name);
            orderlistSubtotal=itemView.findViewById(R.id.orderdetailslist_subtotal);
            orderlistCount=itemView.findViewById(R.id.orderdetailslist_count);



        }
    }
}
