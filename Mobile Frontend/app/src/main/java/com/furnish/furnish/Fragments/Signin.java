package com.furnish.furnish.fragments;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Patterns;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.furnish.furnish.R;
import com.furnish.furnish.activities.MainActivity;
import com.furnish.furnish.dialogs.Forgotpassword;
import com.furnish.furnish.request.RetrofitClient;
import com.furnish.furnish.responses.SigninResponse;
import com.furnish.furnish.storage.UserStorage;
import com.furnish.furnish.utilities.SourceApi;
import com.google.android.material.textfield.TextInputLayout;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link Signin#newInstance} factory method to
 * create an instance of this fragment.
 */
public class Signin extends Fragment {
    private TextView createaccount,forgotpassword;
    private FrameLayout parentframeLayout;
    private TextInputLayout password,email;
    private ProgressBar progressBar;
    private  Button signinbtn;

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public Signin() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment Signin.
     */
    // TODO: Rename and change types and number of parameters
    public static Signin newInstance(String param1, String param2) {
        Signin fragment = new Signin();
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
        View view = inflater.inflate(R.layout.fragment_signin, container, false);
        ((AppCompatActivity) getActivity()).getSupportActionBar().hide();


        createaccount = view.findViewById(R.id.create_account);
        forgotpassword=view.findViewById(R.id.forgetpassword);
        parentframeLayout = getActivity().findViewById(R.id.register_frame_layout);
        email = view.findViewById(R.id.signin_emailAddress);
        password = view.findViewById(R.id.signin_password);
        signinbtn = view.findViewById(R.id.signinbtn);
        progressBar=view.findViewById(R.id.signin_progressbar);



        signinbtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(validation(view)) {
                    //proceed to signup
                    userSignIn(view);
                }

            }
        });
        return view;
    }
    private boolean validation(View view){

         if(TextUtils.isEmpty(email.getEditText().getText())){
            Toast.makeText(view.getContext(),"Email required", Toast.LENGTH_LONG).show();
            return false;
        }
        else if(!Patterns.EMAIL_ADDRESS.matcher(email.getEditText().getText()).matches()){
            Toast.makeText(view.getContext(),"Enter a valid email", Toast.LENGTH_LONG).show();
            return false;
        }
        else if(TextUtils.isEmpty(password.getEditText().getText())){
            Toast.makeText(view.getContext(),"Password required", Toast.LENGTH_LONG).show();
            return false;
        }
        else {
            return true;
        }

    }


    private void userSignIn(View view) {

        progressBar.setVisibility(View.VISIBLE);

        RetrofitClient retrofitClient =new RetrofitClient();
        SourceApi sourceApi= retrofitClient.getSourceApi();
        Call<SigninResponse> call=sourceApi
                .userLogin(email.getEditText().getText().toString(),password.getEditText().getText().toString());
        call.enqueue(new Callback<SigninResponse>() {
            @Override
            public void onResponse(Call<SigninResponse> call, Response<SigninResponse> response) {
                SigninResponse loginResponse=response.body();
                if(response.isSuccessful()){
                    Toast.makeText(view.getContext(),loginResponse.getStatus(), Toast.LENGTH_LONG).show();
                    UserStorage.getInstance(view.getContext())
                            .saveUser(loginResponse.getUser());
                    UserStorage.getInstance(view.getContext()).saveToken(loginResponse.getToken());
                    Intent i = new Intent(getActivity(), MainActivity.class);
                    i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    startActivity(i);
                }
                else {
                    progressBar.setVisibility(View.INVISIBLE);
                    Toast.makeText(view.getContext(), response.message(), Toast.LENGTH_SHORT).show();
                }

            }

            @Override
            public void onFailure(Call<SigninResponse> call, Throwable t) {
                progressBar.setVisibility(View.INVISIBLE);
                Toast.makeText(view.getContext(), t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });

    }




    @Override
    public void onViewCreated(@NonNull @org.jetbrains.annotations.NotNull View view, @Nullable @org.jetbrains.annotations.Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        createaccount.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                FragmentTransaction fragmentTransaction = getActivity().getSupportFragmentManager().beginTransaction();
                fragmentTransaction.replace(parentframeLayout.getId(),new Signup());
                fragmentTransaction.commit();

            }
        });
        forgotpassword.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //open dialog
                Forgotpassword forgotpassword=new Forgotpassword();
                forgotpassword.show(getActivity().getSupportFragmentManager(),"forget password dialog");


            }
        });
    }
}