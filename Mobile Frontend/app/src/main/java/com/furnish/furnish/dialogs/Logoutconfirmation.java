package com.furnish.furnish.dialogs;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatDialogFragment;

import com.furnish.furnish.R;
import com.furnish.furnish.activities.MainActivity;
import com.furnish.furnish.activities.Registration;
import com.furnish.furnish.storage.Cartstorage;
import com.furnish.furnish.storage.Orderstorage;
import com.furnish.furnish.storage.UserStorage;

import org.jetbrains.annotations.NotNull;

public class Logoutconfirmation extends AppCompatDialogFragment {

    @NonNull
    @NotNull
    @Override
    public Dialog onCreateDialog(@Nullable @org.jetbrains.annotations.Nullable Bundle savedInstanceState) {
        AlertDialog.Builder builder=new AlertDialog.Builder(getActivity());
        LayoutInflater inflater=getActivity().getLayoutInflater();
        View view=inflater.inflate(R.layout.logout_confirmation_dialog,null);
        builder.setView(view)
                .setTitle("Log Out")
                .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        UserStorage.getInstance(view.getContext()).clear();
                        UserStorage.getInstance(view.getContext()).clearToken();
                        Cartstorage cartstorage=new Cartstorage();
                        cartstorage.clearCart(view.getContext());
                        Orderstorage orderstorage=new Orderstorage();
                        orderstorage.clearOrderStorage(view.getContext());
                        Intent i = new Intent(view.getContext(), Registration.class);
                        i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                        startActivity(i);
                    }
                })
                .setNegativeButton("No", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {

                    }
                });
        return builder.create();
    }

}
