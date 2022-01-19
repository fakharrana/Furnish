package com.furnish.furnish.dialogs;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Patterns;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatDialogFragment;

import com.furnish.furnish.R;
import com.furnish.furnish.request.RetrofitClient;
import com.furnish.furnish.utilities.SourceApi;

import org.jetbrains.annotations.NotNull;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class Forgotpassword extends AppCompatDialogFragment {
    TextView email;
    @NonNull
    @NotNull
    @Override
    public Dialog onCreateDialog(@Nullable @org.jetbrains.annotations.Nullable Bundle savedInstanceState) {

        AlertDialog.Builder builder=new AlertDialog.Builder(getActivity());
        LayoutInflater inflater=getActivity().getLayoutInflater();
        View view=inflater.inflate(R.layout.forgotpassword_dialog,null);
        email=view.findViewById(R.id.EmailAddress_forgotpassword);
        builder.setView(view)
                .setTitle("Reset password")
                .setNegativeButton("cancel", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {

                    }
                }).setPositiveButton("done", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                if(validateemail(view)){
                    forgetpassword(view,email.getText().toString());
                }

            }
        });
        return builder.create();

    }

    private void forgetpassword(View view ,String email) {
        RetrofitClient retrofitClient=new RetrofitClient();
        SourceApi sourceApi=retrofitClient.getSourceApi();
        Call<ResponseBody> call=sourceApi.sendEmail(email);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                JSONObject jsonObject = null;
                try {
                    String message=response.body().string();
                    jsonObject=new JSONObject(message);
                } catch (IOException | JSONException e) {
                    e.printStackTrace();
                }
                if(response.isSuccessful()){
                    if(jsonObject.has("Error")){
                        try {
                            Toast.makeText(view.getContext(), jsonObject.getString("Error"), Toast.LENGTH_SHORT).show();
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                    else{
                        Toast.makeText(view.getContext(), "Password successfully reset, kindly check your email", Toast.LENGTH_SHORT).show();
                    }
                }
                else {
                    Toast.makeText(view.getContext(), "Problem connecting to server", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Toast.makeText(view.getContext(), t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });




    }
    private boolean validateemail(View view){
        if(TextUtils.isEmpty(email.getText())){
            Toast.makeText(view.getContext(),"Email required", Toast.LENGTH_LONG).show();
            return false;
        }
        else if(!Patterns.EMAIL_ADDRESS.matcher(email.getText()).matches()){
            Toast.makeText(view.getContext(),"Enter a valid email", Toast.LENGTH_LONG).show();
            return false;
        }
        else {
            return true;
        }

    }
}
