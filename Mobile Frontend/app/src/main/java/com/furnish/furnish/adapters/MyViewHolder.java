package com.furnish.furnish.adapters;

import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.furnish.furnish.R;

import org.jetbrains.annotations.NotNull;

public  class MyViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener {

    TextView name;
    TextView price;
    ImageView image;

    com.furnish.furnish.adapters.OnListener onListener;

    public MyViewHolder(@NonNull @NotNull View itemView, com.furnish.furnish.adapters.OnListener onListener) {
        super(itemView);
        this.onListener=onListener;

        name=itemView.findViewById(R.id.textTitle);
       price=itemView.findViewById(R.id.productpricehome);
        image=itemView.findViewById(R.id.productimage);


        itemView.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        onListener.onItemClick(getAdapterPosition());
    }
}
