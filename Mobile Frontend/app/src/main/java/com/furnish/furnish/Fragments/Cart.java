package com.furnish.furnish.fragments;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.furnish.furnish.R;
import com.furnish.furnish.activities.OrderConfirmation;
import com.furnish.furnish.adapters.CartRecyclerView;
import com.furnish.furnish.models.ProductModel;
import com.furnish.furnish.storage.Cartstorage;
import com.google.android.material.floatingactionbutton.ExtendedFloatingActionButton;

import java.util.List;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link Cart#newInstance} factory method to
 * create an instance of this fragment.
 */
public class Cart extends Fragment  {

    Cartstorage cartstorage= new Cartstorage();
    ProductModel productModel;
    List<ProductModel> favorites;
    Activity activity;
    ExtendedFloatingActionButton checkOutbtn;
    LinearLayout EmptyCartView;
    private RecyclerView recyclerView;
    private CartRecyclerView mAdapter;
    private  RecyclerView.LayoutManager mlayoutmanager;
    TextView textView;


    public static final String PREFS_NAME = "PRODUCTS";
    public static final String FAVORITES = "Product_CART";

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public Cart() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment Cart.
     */
    // TODO: Rename and change types and number of parameters
    public static Cart newInstance(String param1, String param2) {
        Cart fragment = new Cart();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        activity=getActivity();
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view= inflater.inflate(R.layout.fragment_cart, container, false);


            //starts from here
        favorites = cartstorage.getFavorites(activity);
        checkOutbtn=view.findViewById(R.id.extended_fab);
        EmptyCartView=view.findViewById(R.id.EmtptyCart);




        try {

            if (favorites.isEmpty()) {
                EmptyCartView.setVisibility(View.VISIBLE);
            } else if (!favorites.isEmpty()) {
                checkOutbtn.setVisibility(View.VISIBLE);
                checkOutbtn.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Intent intent = new Intent(getActivity(), OrderConfirmation.class);
                        startActivity(intent);
                    }
                });

                Fillcart(view);

                mAdapter.setOnItemClickListener(new CartRecyclerView.OnItemClickListener() {

                    @Override
                    public void increaseQuantity(int position) {
                        productModel = favorites.get(position);
                        if(productModel.getProductQuantity()<=1){
                            Toast.makeText(activity, "Not enough left in the store", Toast.LENGTH_SHORT).show();
                        }
                        else {
                            productModel.setCount(productModel.getCount() + 1);
                            productModel.setProductQuantity(productModel.getProductQuantity()-1);
                            //updating in shared preference
                            cartstorage.saveFavorites(activity, favorites);
                            mAdapter.notifyDataSetChanged();
                        }

                    }

                    @Override
                    public void decreaseQuantity(int position) {
                        productModel = favorites.get(position);
                        if (productModel.getCount() <= 1) {
                            Toast.makeText(activity, "cant get less than 1", Toast.LENGTH_SHORT).show();
                        } else {
                            productModel.setCount(productModel.getCount() - 1);
                            productModel.setProductQuantity(productModel.getProductQuantity()+1);
                            //updating in shared preference
                            cartstorage.saveFavorites(activity,favorites);
                            mAdapter.notifyDataSetChanged();

                        }
                    }

                    @Override
                    public void removeItem(int position) {
                        productModel = favorites.get(position);
                        favorites.remove(productModel);
                        cartstorage.saveFavorites(activity, favorites);
                        if (favorites.isEmpty()) {
                            checkOutbtn.setVisibility(View.INVISIBLE);
                            EmptyCartView.setVisibility(View.VISIBLE);
                        }
                        Toast.makeText(activity, "Removed " + productModel.getProductName() + " from your cart!", Toast.LENGTH_SHORT).show();
                        mAdapter.notifyDataSetChanged();

                    }
                });

            }
        }
        catch (NullPointerException e){
            Log.v("Exception","Null exceptiion....");
            EmptyCartView.setVisibility(View.VISIBLE);
        }



    return view;
    }

    private void Fillcart(View view) {
        recyclerView=view.findViewById(R.id.cartrecyclerview);
        mlayoutmanager=new LinearLayoutManager(getContext());
        mAdapter=new CartRecyclerView(favorites);
        recyclerView.setLayoutManager(mlayoutmanager);
        recyclerView.setAdapter(mAdapter);


    }
}