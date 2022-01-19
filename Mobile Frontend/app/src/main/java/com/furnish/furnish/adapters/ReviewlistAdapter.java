package com.furnish.furnish.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.furnish.furnish.R;
import com.furnish.furnish.models.ReviewModel;
import com.furnish.furnish.storage.UserStorage;

import org.jetbrains.annotations.NotNull;

import java.util.List;

public class ReviewlistAdapter extends RecyclerView.Adapter<ReviewlistAdapter.ReviewlistViewHolder> {
    private List<ReviewModel> reviewlist;
    private OnItemClickListener onItemClickListener;
    Context context;

    public interface OnItemClickListener{
        void deletereview(int position);

    }
    public void setOnItemClickListener(OnItemClickListener listener){
        onItemClickListener=listener;
    }


    public ReviewlistAdapter(List<ReviewModel> List) {
        reviewlist=List;
    }



    @NonNull
    @NotNull
    @Override
    public ReviewlistViewHolder onCreateViewHolder(@NonNull @NotNull ViewGroup parent, int viewType) {
        //pass layout
        View view= LayoutInflater.from(parent.getContext()).inflate(R.layout.reviewlist,parent,false);
        ReviewlistViewHolder  ViewHolder=new ReviewlistViewHolder (view,onItemClickListener);
        return  ViewHolder;

    }

    @Override
    public void onBindViewHolder(@NonNull @NotNull ReviewlistViewHolder holder, int position) {
        ReviewModel reviewModel=reviewlist.get(position);
        holder.user_email.setText(reviewModel.getUserEmail());
        holder.user_review.setText(reviewModel.getReview());
        holder.date.setText(reviewModel.getDate().substring(0,10));

        if (!reviewModel.getUserEmail().equals(UserStorage.getInstance(context).getUser().getEmail())){
            holder.delete_review_button.setVisibility(View.INVISIBLE);
        }
        else {
            holder.delete_review_button.setVisibility(View.VISIBLE);
        }



    }
    @Override
    public int getItemCount() {
        return reviewlist.size();
    }

    public static class ReviewlistViewHolder extends RecyclerView.ViewHolder{
        public TextView user_review;
        public TextView date;
        public TextView user_email;
        public Button delete_review_button ;


        public ReviewlistViewHolder(@NonNull @NotNull View itemView,OnItemClickListener listener) {
            super(itemView);
            user_review=itemView.findViewById(R.id.review);
            date=itemView.findViewById(R.id.review_date);
            delete_review_button=itemView.findViewById(R.id.delete_review);
            user_email=itemView.findViewById(R.id.review_email);

            delete_review_button.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    listener.deletereview(getAdapterPosition());
                }
            });



        }
    }


}
