package com.furnish.furnish.activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.navigation.NavController;
import androidx.navigation.NavGraph;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import com.furnish.furnish.R;
import com.furnish.furnish.databinding.ActivityMainBinding;
import com.furnish.furnish.dialogs.Logoutconfirmation;
import com.furnish.furnish.storage.Cartstorage;
import com.furnish.furnish.storage.Orderstorage;
import com.furnish.furnish.storage.UserStorage;
import com.google.android.material.navigation.NavigationView;

public class MainActivity extends AppCompatActivity  {

    private AppBarConfiguration mAppBarConfiguration;
    private ActivityMainBinding binding;
    private TextView user_name,user_email;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        setSupportActionBar(binding.appBarMain.toolbar);
        //getSupportActionBar().setDisplayShowTitleEnabled();
        DrawerLayout drawer = binding.drawerLayout;
        NavigationView navigationView = binding.navView;
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        mAppBarConfiguration = new AppBarConfiguration.Builder(
                R.id.nav_home, R.id.nav_arMultiple, R.id.nav_cart,R.id.nav_orderHistory,R.id.nav_settings,R.id.nav_logout)
                .setDrawerLayout(drawer)
                .build();
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_main);
        NavigationUI.setupActionBarWithNavController(this, navController, mAppBarConfiguration);
        NavigationUI.setupWithNavController(navigationView, navController);
        //condition on opening cart if customers presses cart
        NavGraph navGraph = navController.getNavInflater().inflate(R.navigation.mobile_navigation);
        if(getIntent().hasExtra("cartCheck")){
            navGraph.setStartDestination(R.id.nav_cart);
        }
        navController.setGraph(navGraph);
        //setting user name and email in drawer
        user_email=(TextView) navigationView.getHeaderView(0).findViewById(R.id.user_email_drawer);
        user_email.setText(UserStorage.getInstance(this).getUser().getEmail());
        navigationView.getMenu().findItem(R.id.nav_logout).setOnMenuItemClickListener(new MenuItem.OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem item) {
                logout();
                return false;
            }
        });
        navigationView.getMenu().findItem(R.id.nav_arMultiple).setOnMenuItemClickListener(new MenuItem.OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem item) {
                Intent i = new Intent(MainActivity.this, MultipleArView.class);
                startActivity(i);
                return false;
            }
        });
    }
    private void logout() {
        Logoutconfirmation logoutconfirmation=new Logoutconfirmation();
        logoutconfirmation.show(MainActivity.this.getSupportFragmentManager(),"log out confirmation");
    }
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }
    @Override
    public boolean onSupportNavigateUp() {
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_main);
        return NavigationUI.navigateUp(navController, mAppBarConfiguration)
                || super.onSupportNavigateUp();
    }
}