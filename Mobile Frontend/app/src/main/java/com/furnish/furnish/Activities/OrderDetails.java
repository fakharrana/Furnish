package com.furnish.furnish.activities;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.widget.TextView;
import android.widget.Toast;

import com.furnish.furnish.R;
import com.furnish.furnish.adapters.OrderDetailsAdapter;
import com.furnish.furnish.adapters.OrderListRecyclerView;
import com.furnish.furnish.models.OrderDetailsProductModel;
import com.furnish.furnish.models.OrderProductModel;
import com.furnish.furnish.models.ProductModel;
import com.furnish.furnish.models.RecievingOrderlistModel;
import com.google.gson.Gson;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class OrderDetails extends AppCompatActivity {
    TextView orderDate,order_customerName,order_customerAddress,order_customerphoneNumber,orderTotal,orderId;
    RecyclerView recyclerView;
    OrderDetailsAdapter orderDetailsAdapter;
    List<OrderProductModel> ordered_productModels_list;
    private  RecyclerView.LayoutManager mlayoutmanager;
    private Boolean deliveredOrdersCheck;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_order_details);
        Objects.requireNonNull(getSupportActionBar()).setDisplayHomeAsUpEnabled(true);
        orderDate=findViewById(R.id.orderdetails_date);
        order_customerphoneNumber=findViewById(R.id.orderdetails_phonenumber);
        order_customerAddress=findViewById(R.id.orderdetails_address);
        order_customerName=findViewById(R.id.orderdetails_name);
        orderTotal=findViewById(R.id.orderdetails_total);
        orderId=findViewById(R.id.orderdetails_orderId);
        RecievingOrderlistModel order= getDataFromIntent();
        settingWidgetsValue(order);
        fillOrderDetailslist((ArrayList<OrderDetailsProductModel>) order.getProducts());
    }

    private void settingWidgetsValue(RecievingOrderlistModel order) {
        if(deliveredOrdersCheck){
            orderDate.setText("Delivered Date: "+order.getDeliverDate().substring(0,10));
        }
        else{
            orderDate.setText("Order Date: "+order.getOrderDate().substring(0,10));
        }
        order_customerName.setText("Name: "+order.getCustomerName());
        order_customerAddress.setText("Address: "+order.getCustomerAddress());
        order_customerphoneNumber.setText("Contact #: "+order.getCustomerNumber());
        String count_string=Long.toString((long) order.getOrderTotal());
        String price_string="PKR "+(count_string);
        orderTotal.setText("Order total: "+price_string);
        orderId.setText("Order ID: "+order.get_id());
    }

    private void fillOrderDetailslist(ArrayList<OrderDetailsProductModel> products) {
        recyclerView=findViewById(R.id.orderdetails_recyclerview);
        mlayoutmanager=new LinearLayoutManager(this,LinearLayoutManager.VERTICAL,false);
        orderDetailsAdapter=new OrderDetailsAdapter(products);
        recyclerView.setLayoutManager(mlayoutmanager);
        recyclerView.setAdapter(orderDetailsAdapter);
    }

    private RecievingOrderlistModel getDataFromIntent() {
        if (getIntent().hasExtra("orderDetails")) {
            RecievingOrderlistModel order1 = getIntent().getParcelableExtra("orderDetails");
            if(getIntent().hasExtra("DeliveredOrderCheck")){
                deliveredOrdersCheck=true;
            }
            else{
                deliveredOrdersCheck=false;
            }
            return order1;
        }
        else {
            return null;
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
}