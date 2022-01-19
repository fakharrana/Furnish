package com.furnish.furnish.fragments;

import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.HorizontalScrollView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.furnish.furnish.R;
import com.furnish.furnish.activities.ProductDetails;
import com.furnish.furnish.adapters.OnListener;
import com.furnish.furnish.adapters.ProductRecyclerView;
import com.furnish.furnish.models.ProductModel;
import com.furnish.furnish.request.RetrofitClient;
import com.furnish.furnish.utilities.SourceApi;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link Home#newInstance} factory method to
 * create an instance of this fragment.
 */
public class Home extends Fragment implements OnListener {
    private RecyclerView recyclerView;
    private ProductRecyclerView productsAdapter;


    List<ProductModel> productList;
    List<ProductModel> filtered;
    ProgressBar progressBar;
    List<ProductModel> categoryfiltered;
    Button bedcat,chaircat,tablecat,sofacat,deskcat,allcat;
    HorizontalScrollView horizontalScrollView;
    TextView noInternet;


    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public Home() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment Home.
     */
    // TODO: Rename and change types and number of parameters
    public static Home newInstance(String param1, String param2) {
        Home fragment = new Home();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }



    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view= inflater.inflate(R.layout.fragment_home, container, false);

        //----------Starts from here------------
        horizontalScrollView=view.findViewById(R.id.scrollviewCategories);
        horizontalScrollView.setHorizontalScrollBarEnabled(false);
        progressBar=view.findViewById(R.id.progressbar);
        recyclerView=view.findViewById(R.id.recyclerview);
        productList=new ArrayList<>();
        noInternet=view.findViewById(R.id.Errormsg);

            // Getting the data from api
            GetDataFromAPI();
            //Search for specific products
            filterByName(view);
            //filter of category btn press
            filterByCategory(view);

            if(!isNetworkAvailable()){
                noInternet.setText("No Internet Connection");
            }


        return view;

    }

    private void filterByCategory(View view) {
        bedcat=view.findViewById(R.id.bedcategorybtn);
        chaircat=view.findViewById(R.id.chaircategorybtn);
        tablecat=view.findViewById(R.id.tablecategorybtn);
        sofacat=view.findViewById(R.id.sofacategorybtn);
        deskcat=view.findViewById(R.id.deskcategorybtn);
        allcat=view.findViewById(R.id.allcategorybtn);

        bedcat.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                filtercategory(bedcat.getText());
            }
        });
        chaircat.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                filtercategory(chaircat.getText());
            }
        });
        tablecat.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                filtercategory(tablecat.getText());
            }
        });
        sofacat.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                filtercategory(sofacat.getText());
            }
        });
        deskcat.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                filtercategory(deskcat.getText());
            }
        });
        allcat.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                filtercategory(allcat.getText());
            }
        });
    }

    private void filtercategory(CharSequence text) {
        String btntxt=text.toString();
        categoryfiltered=new ArrayList<>();
        if (btntxt.toLowerCase().equals("all")){
            putDatainRecyclerView(productList);
        }
        else {
           ;
            for (ProductModel productModel : productList) {
                if (productModel.getProductCategory().toLowerCase().contains(btntxt.substring(0,text.length()-1).toLowerCase())) {
                    categoryfiltered.add(productModel);
                }
            }
            putDatainRecyclerView(categoryfiltered);
        }

    }

    private void filterByName(View view) {
        EditText searchView=view.findViewById(R.id.searchview);
        this.getActivity().getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN);
        searchView.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) { }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) { }

            @Override
            public void afterTextChanged(Editable s) {
                String query=s.toString();
                filtered=new ArrayList<>();
                for (ProductModel productModel:productList){
                    if(productModel.getProductName().toLowerCase().contains(query.toLowerCase())){
                        filtered.add(productModel);
                    }
                }
                putDatainRecyclerView(filtered);
            }
        });
    }

    private void GetDataFromAPI() {
        RetrofitClient retrofitClient =new RetrofitClient();
        SourceApi sourceApi= retrofitClient.getSourceApi();
        Call<List<ProductModel>> call=sourceApi.getProducts();
            call.enqueue(new Callback<List<ProductModel>>() {
                @Override
                public void onResponse(Call<List<ProductModel>> call, Response<List<ProductModel>> response) {
                    if(response.code() != 200){
                        Log.v("Product","Not Working....");
                        return;
                    }
                    Log.v("Product","Working....");
                    List<ProductModel> Products=response.body();
                    for (ProductModel productModel:Products){
                        productList.add(productModel);
                    }
                    progressBar.setVisibility(View.INVISIBLE);
                    putDatainRecyclerView(productList);

                }
                @Override
                public void onFailure(Call<List<ProductModel>> call, Throwable t) {
                    progressBar.setVisibility(View.INVISIBLE);
                    noInternet.setVisibility(View.VISIBLE);
                }
            });
    }


    private void putDatainRecyclerView(List<ProductModel> productList) {
        productsAdapter=new ProductRecyclerView(productList,  this);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        recyclerView.setAdapter(productsAdapter);
    }


    @Override
    public void onItemClick(int position) {

        Intent intent = new Intent(getActivity(), ProductDetails.class);
        intent.putExtra("product",productsAdapter.getSelectedProduct(position));
        startActivity(intent);
    }

    private boolean isNetworkAvailable() {
        ConnectivityManager connectivityManager
                = (ConnectivityManager) getContext().getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
        return activeNetworkInfo != null && activeNetworkInfo.isConnected();
    }


}