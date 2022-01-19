package com.furnish.furnish.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.furnish.furnish.R;
import com.furnish.furnish.models.ProductModel;
import com.furnish.furnish.models.RecievingOrderlistModel;
import com.furnish.furnish.models.ReviewModel;

import org.jetbrains.annotations.NotNull;

import java.util.List;

public class RecievingOrdersAdapter  extends RecyclerView.Adapter<RecievingOrdersAdapter.RecievingOrdersViewholder>{

    private List<RecievingOrderlistModel> orderlist;
    private OnItemClickListener onItemClickListener;
    Context context;
    public interface OnItemClickListener{
        void orderdetails(int position);

    }
    public void setOnItemClickListener(OnItemClickListener listener){
        onItemClickListener=listener;
    }

    public RecievingOrdersAdapter(List<RecievingOrderlistModel> List) {
        orderlist=List;
    }


    @NonNull
    @Override
    public RecievingOrdersViewholder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view= LayoutInflater.from(parent.getContext()).inflate(R.layout.recievingorderlist,parent,false);
        RecievingOrdersViewholder  ViewHolder=new RecievingOrdersViewholder (view,onItemClickListener);
        return  ViewHolder;
    }

    @Override
    public void onBindViewHolder(@NonNull RecievingOrdersAdapter.RecievingOrdersViewholder holder, int position) {
        RecievingOrderlistModel recievingOrderlistModel=orderlist.get(position);
        holder.orderDate.setText(position+1+"-"+" Order on "+ recievingOrderlistModel.getOrderDate().substring(0,10));
        String count_string=Long.toString((long) recievingOrderlistModel.getOrderTotal());
        String price_string="PKR "+(count_string);
        holder.orderTotal.setText(price_string);
        holder.orderStatus.setText(recievingOrderlistModel.getOrderStatus());

    }

    @Override
    public int getItemCount() {
        return orderlist.size();
    }

    public static class RecievingOrdersViewholder extends RecyclerView.ViewHolder{
        TextView orderStatus,orderTotal,orderDate,furtherDetails;

        public RecievingOrdersViewholder(@NonNull View itemView, OnItemClickListener listener) {
            super(itemView);
            orderStatus=itemView.findViewById(R.id.orderstatusTextview);
            orderTotal=itemView.findViewById(R.id.ordertoaltextview);
            orderDate=itemView.findViewById(R.id.orderDateTextview);
            furtherDetails=itemView.findViewById(R.id.clickhereforfurtherdetailslink);

            furtherDetails.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    listener.orderdetails(getAdapterPosition());
                }
            });
        }
    }
    public RecievingOrderlistModel getSelectedProduct(int position) {
        if (orderlist != null) {
            if (orderlist.size() > 0) {
                return orderlist.get(position);
            }
        }
        return null;
    }

}
