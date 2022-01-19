package com.furnish.furnish.activities;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextUtils;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.FragmentManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.furnish.furnish.R;
import com.furnish.furnish.adapters.RelatedproductsAdapter;
import com.furnish.furnish.adapters.ReviewlistAdapter;
import com.furnish.furnish.fragments.Cart;
import com.furnish.furnish.models.ProductModel;
import com.furnish.furnish.models.ReviewModel;
import com.furnish.furnish.request.RetrofitClient;
import com.furnish.furnish.storage.Cartstorage;
import com.furnish.furnish.storage.UserStorage;
import com.furnish.furnish.utilities.Credentials;
import com.furnish.furnish.utilities.SourceApi;
import com.google.android.material.textfield.TextInputLayout;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ProductDetails extends AppCompatActivity  {
    public static final String PREFS_NAME = "PRODUCTS";
    public static final String FAVORITES = "Product_CART";
    ProductModel productModel;
    //Widgets
    private ImageView image_product1;
    private ImageView image_product2;
    private ImageView image_product3;
    private TextView name_product,noreviewmsg;
    private TextView price_product;
    private TextView description_product;
    private Button addTocart,reviews_btn,related_searches_btn,viewInAr,addReview;
    private ConstraintLayout reviews_layout,related_searches_layout;
    private List<ProductModel> cartlist,recommendedproductlist;
    private RecyclerView recyclerView,relatedproductsRecyclerView;
    private List<ReviewModel> reviewlist;
    private ReviewlistAdapter reviewlistAdapter;
    private RelatedproductsAdapter relatedproductsAdapter;

    Context context;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_product_details);

        //starts from here

        Objects.requireNonNull(getSupportActionBar()).setDisplayHomeAsUpEnabled(true);
        image_product1 = findViewById(R.id.imageView1);
        image_product2 = findViewById(R.id.imageView2);
        image_product3 = findViewById(R.id.imageView3);
        name_product = findViewById(R.id.p_name);
        price_product=findViewById(R.id.p_price);
        description_product=findViewById(R.id.p_description);
        addTocart=findViewById(R.id.addtocartbtn);
        viewInAr=findViewById(R.id.viewinarbtn);
        cartlist=new ArrayList<>();
        reviews_btn=findViewById(R.id.reviews_button);
        related_searches_btn=findViewById(R.id.related_products_button);
        reviews_layout=findViewById(R.id.reviews_layout);
        related_searches_layout=findViewById(R.id.related_products_layout);
        addReview=findViewById(R.id.add_review);
        noreviewmsg=findViewById(R.id.emptylist_txt);
        relatedproductsRecyclerView=findViewById(R.id.recyclerview_relatedproducts);




        //get width and height of screen
        DisplayMetrics metrics = new DisplayMetrics();
        getWindowManager().getDefaultDisplay().getMetrics(metrics);
        int width = metrics.widthPixels;
        reviews_btn.setWidth(width/2);
        related_searches_btn.setWidth(width/2);



       ProductModel product= getDataFromIntent();

        addTocart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                addToCart(product);

            }
        });

        viewInAr.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(v.getContext(), ARView.class);
                Toast.makeText(ProductDetails.this, "Opening Camera", Toast.LENGTH_SHORT).show();
                intent.putExtra("product",productModel);
                startActivity(intent);
            }
        });

        related_searches_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                getRelatedProducts(product);
                related_searches_btn.setEnabled(false);
                reviews_btn.setEnabled(true);
                reviews_layout.setVisibility(View.INVISIBLE);
                related_searches_layout.setVisibility(View.VISIBLE);
            }
        });

        reviews_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                reviews_btn.setEnabled(false);
                related_searches_btn.setEnabled(true);
                reviews_layout.setVisibility(View.VISIBLE);
                related_searches_layout.setVisibility(View.INVISIBLE);
                if(reviewlist.isEmpty()){
                    noreviewmsg.setVisibility(View.VISIBLE);
                }

            }
        });

        //getting reviews
        getReviewsFromApi();

        addReview.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                addReviewFun();
            }
        });



    }

    private void getRelatedProducts(ProductModel product) {
        recommendedproductlist=new ArrayList<>();
        String productDetails=product.getProductName()+","+product.getProductCategory();
        RetrofitClient retrofitClient =new RetrofitClient();
        SourceApi sourceApi= retrofitClient.getSourceApi();
        Call<List<ProductModel>> call=sourceApi.getRecommendedProducts(productDetails);
        call.enqueue(new Callback<List<ProductModel>>() {
            @Override
            public void onResponse(Call<List<ProductModel>> call, Response<List<ProductModel>> response) {
                if(response.code() != 200){
                    Log.v("recommendation","Not Working....");
                    return;
                }
                Log.v("recommendation","Working....");
                List<ProductModel> Products=response.body();
                for (ProductModel productModel:Products){
                    recommendedproductlist.add(productModel);
                }
                putDatainRelatedProductsRecyclerView(recommendedproductlist);
            }
            @Override
            public void onFailure(Call<List<ProductModel>> call, Throwable t) {
                Log.v("recommendation","aight");
            }
        });
    }

    private void putDatainRelatedProductsRecyclerView(List<ProductModel> productlist) {
        relatedproductsAdapter=new RelatedproductsAdapter(productlist);
        relatedproductsRecyclerView.setLayoutManager(new LinearLayoutManager(this,LinearLayoutManager.HORIZONTAL,false));
        relatedproductsRecyclerView.setAdapter(relatedproductsAdapter);

        relatedproductsAdapter.setOnItemClickListener(new RelatedproductsAdapter.OnItemClickListener() {
            @Override
            public void onClick(int position) {
                Intent intent = new Intent(ProductDetails.this, ProductDetails.class);
                intent.putExtra("product",relatedproductsAdapter.getSelectedProduct(position));
                startActivity(intent);
            }
        });
    }

    private void addReviewFun() {
        //open dialog
        AlertDialog dialog;
        TextInputLayout review;
        AlertDialog.Builder builder=new AlertDialog.Builder(this);
        LayoutInflater inflater=this.getLayoutInflater();
        View view=inflater.inflate(R.layout.add_review_dialog,null);
        review=view.findViewById(R.id.review_edittext_dialog);
        builder.setView(view)
                .setTitle(UserStorage.getInstance(context).getUser().getEmail())
                .setNegativeButton("cancel", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {

                    }
                }).setPositiveButton("done", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                if (TextUtils.isEmpty(review.getEditText().getText())){
                    Toast.makeText(ProductDetails.this, "Review not added", Toast.LENGTH_SHORT).show();
                }
                else{
                    //put review
                    AddNewReviewinDB(review.getEditText().getText());
                    noreviewmsg.setVisibility(View.INVISIBLE);
                }
            }
        });
        dialog=builder.create();
        dialog.show();

    }



    private void AddNewReviewinDB(Editable review) {
        String newReview=review.toString();
        RetrofitClient retrofitClient=new RetrofitClient();
        SourceApi sourceApi=retrofitClient.getSourceApi();
        Call<ResponseBody> call=sourceApi.addReview(productModel.get_id(),UserStorage.getInstance(this).getUser().getEmail(),newReview);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {

                if(response.isSuccessful()){
                    Toast.makeText(ProductDetails.this, "Review added successfully!", Toast.LENGTH_SHORT).show();
                    getReviewsFromApi();
                    reviewlistAdapter.notifyDataSetChanged();
                }
                else {
                    try {
                        Toast.makeText(ProductDetails.this, response.errorBody().string(), Toast.LENGTH_SHORT).show();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {

            }
        });
    }


    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                finish();
                return true;
        }

        return super.onOptionsItemSelected(item);
    }
    public boolean onCreateOptionsMenu(Menu menu) {
        return true;
    }

    private ProductModel getDataFromIntent() {
        if (getIntent().hasExtra("product")) {
            productModel = getIntent().getParcelableExtra("product");
            name_product.setText(productModel.getProductName());
            description_product.setText(productModel.getProductDescription());
            long price=(long) productModel.getProductPrice();
            String price_string=Long.toString(price);
            price_product.setText("PKR "+price_string);
            cartlist.add(productModel);
            Glide.with(this).load(Credentials.PRODUCTIMAGE_URL +productModel.getProductImages()[0]).into(image_product1);
            Glide.with(this).load(Credentials.PRODUCTIMAGE_URL+productModel.getProductImages()[1]).into(image_product2);
            Glide.with(this).load(Credentials.PRODUCTIMAGE_URL+productModel.getProductImages()[2]).into(image_product3);
            return productModel;
        }
        else {
            return null;
        }
    }
    private void addToCart(ProductModel productModel) {
        Cartstorage cartstorage=new Cartstorage();
       int isAddedtoCart= cartstorage.savetopref(ProductDetails.this,productModel);
       if(isAddedtoCart==1){
           openAddedtoCartDialog(productModel);
       }
       else if(isAddedtoCart==0) {
           Toast.makeText(ProductDetails.this, "This Product is out of stock", Toast.LENGTH_SHORT).show();
       }
       else if(isAddedtoCart==2){
           Toast.makeText(ProductDetails.this, "This item is already present in your cart", Toast.LENGTH_SHORT).show();
       }

    }

    private void openAddedtoCartDialog(ProductModel productModel) {
        //open dialog
        AlertDialog dialog;
        TextView addedTocartMessage;
        AlertDialog.Builder builder=new AlertDialog.Builder(this);
        LayoutInflater inflater=this.getLayoutInflater();
        View view=inflater.inflate(R.layout.addedtocart_dialog,null);
        addedTocartMessage=view.findViewById(R.id.addedTocartmessage);
        addedTocartMessage.setText(productModel.getProductName()+"\nis added to your cart.");
        builder.setView(view)
                .setTitle("Added to Cart!")
                .setNeutralButton("Continue Shopping", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        Intent i = new Intent(ProductDetails.this, MainActivity.class);
                        i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                        startActivity(i);
                    }
                }).setPositiveButton("Cart", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {

                Intent i = new Intent(ProductDetails.this, MainActivity.class);
                i.putExtra("cartCheck","notNull" );
                startActivity(i);
                startActivity(i);

            }
        });
        dialog=builder.create();
        dialog.show();
    }

    private void getReviewsFromApi() {
        reviewlist=new ArrayList<ReviewModel>();
        RetrofitClient retrofitClient =new RetrofitClient();
        SourceApi sourceApi=retrofitClient.getSourceApi();
        Call<List<ReviewModel>> call=sourceApi.getReviews(productModel.get_id());
        call.enqueue(new Callback<List<ReviewModel>>() {
            @Override
            public void onResponse(Call<List<ReviewModel>> call, Response<List<ReviewModel>> response) {
                if (response.code() != 200) {
                    Log.v("Reviews", "Not Working....");
                    return;
                } else {
                    Log.v("Reviews", "Working");
                    List<ReviewModel> Reviews=response.body();
                    for (ReviewModel Model:Reviews){
                        reviewlist.add(Model);
                    }
                    if(reviewlist.isEmpty()){
                        noreviewmsg.setVisibility(View.VISIBLE);
                    }
                        putDatainRecyclerView(reviewlist);


                }
            }
            @Override
            public void onFailure(Call<List<ReviewModel>> call, Throwable t) {
            }
        });


    }

    private void putDatainRecyclerView(List<ReviewModel> reviewlist) {
        recyclerView=findViewById(R.id.recyclerview_review);
        reviewlistAdapter=new ReviewlistAdapter(reviewlist);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recyclerView.setAdapter(reviewlistAdapter);

        reviewlistAdapter.setOnItemClickListener(new ReviewlistAdapter.OnItemClickListener() {
            @Override
            public void deletereview(int position) {
                    String reviewdetails=productModel.get_id()+","+reviewlist.get(position).get_id();
                    RetrofitClient retrofitClient=new RetrofitClient();
                    SourceApi sourceApi=retrofitClient.getSourceApi();
                    Call<ResponseBody> call=sourceApi.deleteReview(reviewdetails);
                    call.enqueue(new Callback<ResponseBody>() {
                        @Override
                        public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                            if(response.isSuccessful()){
                                Toast.makeText(ProductDetails.this, "Review deleted successfully!", Toast.LENGTH_SHORT).show();
                                getReviewsFromApi();
                                reviewlistAdapter.notifyDataSetChanged();

                            }
                            else {
                                Toast.makeText(ProductDetails.this, "Problem Connecting to server!", Toast.LENGTH_SHORT).show();
                            }
                        }

                        @Override
                        public void onFailure(Call<ResponseBody> call, Throwable t) {

                        }
                    });

            }
        });




    }

}