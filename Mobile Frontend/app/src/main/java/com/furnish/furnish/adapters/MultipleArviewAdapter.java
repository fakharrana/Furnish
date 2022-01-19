package com.furnish.furnish.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.furnish.furnish.R;
import com.furnish.furnish.models.ProductModel;
import com.furnish.furnish.utilities.Credentials;

import org.jetbrains.annotations.NotNull;

import java.util.List;

    public class MultipleArviewAdapter extends RecyclerView.Adapter<MultipleArviewAdapter.MutipleArviewViewHolder> {
        private List<ProductModel> productlist;
        private OnItemClickListener onItemClickListener;
        Context context;

        public interface OnItemClickListener{
            void onClick(int position);

        }
        public void setOnItemClickListener(OnItemClickListener listener){
            onItemClickListener=listener;
        }


        public MultipleArviewAdapter(List<ProductModel> List) {
            productlist = List;
        }


        @NonNull
        @NotNull
        @Override
        public MutipleArviewViewHolder onCreateViewHolder(@NonNull @NotNull ViewGroup parent, int viewType) {
            //pass layout
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.multiple_arview_list_item, parent, false);
            MutipleArviewViewHolder ViewHolder = new MultipleArviewAdapter.MutipleArviewViewHolder(view, onItemClickListener);
            return ViewHolder;

        }

        @Override
        public void onBindViewHolder(@NonNull @NotNull MutipleArviewViewHolder holder, int position) {
            ProductModel product = productlist.get(position);
            Glide.with(holder.itemView.getContext())
                    .load(Credentials.PRODUCTTHUMBNAIL_URL +product.getProductThumbnail())
                    .into(holder.modelImage);
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

        public static class MutipleArviewViewHolder extends RecyclerView.ViewHolder {
            public ImageView modelImage;


            public MutipleArviewViewHolder(@NonNull @NotNull View itemView, OnItemClickListener listener) {
                super(itemView);
                modelImage=itemView.findViewById(R.id.multi_ar_item);
                itemView.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        listener.onClick(getAdapterPosition());

                    }
                });



            }

        }
    }
