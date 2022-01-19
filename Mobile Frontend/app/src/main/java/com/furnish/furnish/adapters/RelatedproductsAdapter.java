package com.furnish.furnish.adapters;

import android.content.Context;
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

public class RelatedproductsAdapter  extends RecyclerView.Adapter<RelatedproductsAdapter.RelatedproductsViewHolder>{

    private List<ProductModel> productlist;
    private OnItemClickListener onItemClickListener;
    Context context;

    public interface OnItemClickListener{
        void onClick(int position);

    }
    public void setOnItemClickListener(OnItemClickListener listener){
        onItemClickListener=listener;
    }


    public RelatedproductsAdapter (List<ProductModel> List) {
        productlist=List;
    }



    @NonNull
    @NotNull
    @Override
    public  RelatedproductsViewHolder onCreateViewHolder(@NonNull @NotNull ViewGroup parent, int viewType) {
        //pass layout
        View view= LayoutInflater.from(parent.getContext()).inflate(R.layout.relatedproductitem,parent,false);
        RelatedproductsViewHolder ViewHolder=new RelatedproductsViewHolder(view,onItemClickListener);
        return  ViewHolder;

    }

    @Override
    public void onBindViewHolder(@NonNull @NotNull RelatedproductsViewHolder holder, int position) {
        ProductModel product=productlist.get(position);
        holder.productname.setText(product.getProductName());
        Glide.with(holder.itemView.getContext())
                .load(Credentials.PRODUCTIMAGE_URL+productlist.get(position).getProductImages()[0])
                .into(((RelatedproductsViewHolder)holder).productimage);




    }
    @Override
    public int getItemCount() {
        return productlist.size();
    }

    public ProductModel getSelectedProduct(int position) {
        if (productlist != null) {
            if (productlist.size() > 0) {
                return productlist.get(position);
            }
        }
        return null;
    }

    public static class RelatedproductsViewHolder extends RecyclerView.ViewHolder{
        public ImageView productimage;
        public TextView productname;



        public RelatedproductsViewHolder(@NonNull @NotNull View itemView, RelatedproductsAdapter.OnItemClickListener listener) {
            super(itemView);
            productimage=itemView.findViewById(R.id.relatedproducts_image);
            productname=itemView.findViewById(R.id.relatedproducts_productname);

            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    listener.onClick(getAdapterPosition());
                }
            });



        }
    }
}
