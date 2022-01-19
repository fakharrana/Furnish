package com.furnish.furnish.activities;

import android.content.Intent;
import android.os.Bundle;
import android.os.Parcelable;
import android.text.TextUtils;
import android.util.Log;
import android.util.Patterns;
import android.view.MenuItem;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.furnish.furnish.R;
import com.furnish.furnish.adapters.OrderListRecyclerView;
import com.furnish.furnish.dialogs.Orderplaced;
import com.furnish.furnish.models.OrderProductModel;
import com.furnish.furnish.models.OrderlistModel;
import com.furnish.furnish.models.ProductModel;
import com.furnish.furnish.storage.Cartstorage;
import com.furnish.furnish.storage.Orderstorage;
import com.furnish.furnish.storage.UserStorage;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class OrderConfirmation extends AppCompatActivity {
    private RecyclerView recyclerView;
    private OrderListRecyclerView orderListadapter ;
    private  RecyclerView.LayoutManager mlayoutmanager;
    Cartstorage cartstorage = new Cartstorage();
    ProductModel productModel;
    private  double total;
    private Button place_order_btn;
    private ProgressBar progressBar;
    private TextView total_price_view,address,contactNumber,postalCode;
    List<ProductModel> favorites;
    ArrayList<OrderProductModel> ordered_productModels_list;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_order_confirmation);
        Objects.requireNonNull(getSupportActionBar()).setDisplayHomeAsUpEnabled(true);
        OrderConfirmation.this.getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN);
        place_order_btn=findViewById(R.id.continueToPaymentBtn);
        total_price_view=findViewById(R.id.order_totalamount);
        address=findViewById(R.id.addresstxt);
        contactNumber=findViewById(R.id.contactnumbertext);
        postalCode=findViewById(R.id.zipcodetxt);
        progressBar=findViewById(R.id.progressBar_order);

        fillOrderedList();

        totalPrice();

        place_order_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(validateInputs()){
                    continueToPayment();
                }
            }
        });
    }

    private void continueToPayment() {
        progressBar.setVisibility(View.VISIBLE);
        place_order_btn.setEnabled(false);
        Log.v("Product","Working.... "+ UserStorage.getInstance(this).getToken() );
        fillOrderedProductsList();
        OrderlistModel orderlistModel= createOrderModel();
        Orderstorage orderstorage=new Orderstorage();
        orderstorage.saveOrder(this,orderlistModel);
        Intent intent = new Intent(this, Payment.class);
       // intent.putExtra("ordered", (Parcelable) orderlistModel);
        progressBar.setVisibility(View.INVISIBLE);
        place_order_btn.setEnabled(true);
        startActivity(intent);
    }



    private OrderlistModel createOrderModel() {
        String name= UserStorage.getInstance(this).getUser().getName();
        String email= UserStorage.getInstance(this).getUser().getEmail();
        //creating orderModel object
        OrderlistModel orderlistModel=new OrderlistModel();
        orderlistModel.setCustomerEmail(email);
        orderlistModel.setCustomerName(name);
        orderlistModel.setCustomerNumber(contactNumber.getText().toString());
        orderlistModel.setCustomerAddress(address.getText().toString());
        orderlistModel.setPostalCode(postalCode.getText().toString());
        orderlistModel.setOrderTotal(total);
        orderlistModel.setProducts(ordered_productModels_list);
        return orderlistModel;
    }

    private void fillOrderedProductsList() {
        ordered_productModels_list = new ArrayList<OrderProductModel>();
        for (ProductModel productModel:favorites){
            OrderProductModel orderProductModel = new OrderProductModel(productModel.getProductName(), productModel.get_id(), productModel.getCount(), productModel.getProductPrice());
            ordered_productModels_list.add(orderProductModel);
        }
    }
    private void totalPrice() {
        for (ProductModel productModel:favorites){
           total+=productModel.getCount()*productModel.getProductPrice();
        }
        String total_string="PKR "+total;
        total_price_view.setText(total_string);
    }
    private boolean validateInputs(){
        if(TextUtils.isEmpty(address.getText())){
            Toast.makeText(OrderConfirmation.this,"Address required", Toast.LENGTH_LONG).show();
            return false;
        }
        else if(TextUtils.isEmpty(contactNumber.getText())){
            Toast.makeText(OrderConfirmation.this,"Contact number required", Toast.LENGTH_LONG).show();
            return false;
        }
        else if(!Patterns.PHONE.matcher(contactNumber.getText()).matches()){
            Toast.makeText(OrderConfirmation.this,"Enter a valid contact number", Toast.LENGTH_LONG).show();
            return false;
        }
        else if(TextUtils.isEmpty(postalCode.getText())){
            Toast.makeText(OrderConfirmation.this,"Password required", Toast.LENGTH_LONG).show();
            return false;
        }
        else {
            return true;
        }
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
    private void fillOrderedList() {
        favorites = cartstorage.getFavorites(this);
        recyclerView=findViewById(R.id.orderlistrecyclerview);
        mlayoutmanager=new LinearLayoutManager(this,LinearLayoutManager.VERTICAL,false);
        orderListadapter=new OrderListRecyclerView(favorites);
        recyclerView.setLayoutManager(mlayoutmanager);
        recyclerView.setAdapter(orderListadapter);
    }
}