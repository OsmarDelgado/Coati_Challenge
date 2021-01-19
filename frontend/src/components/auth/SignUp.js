import React, { Fragment, useState } from 'react';

const SignIn = () => {
    const [state , setState] = useState({
        email : "",
        username : "",
        first_name : "",
        last_name : "",
        password : ""
    });
    
    const handleChange = (e) => {
        const {id , value} = e.target;
        setState(prevState => ({
            ...prevState,
            [id] : value
        }));
    };

    const handleSubmitClick = async (e) => {
        e.preventDefault();
        try {
            if(state.email.length && state.password.length) {
                const payload={
                    "email":state.email,
                    "password":state.password,
                }

                const response = await fetch("http://127.0.0.1:5000/api/auth/signup", {
                    method : "POST",
                    headers : { "Content-Type" : "application/json" },
                    body : JSON.stringify(payload)
                });

                console.log(response);
            }

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Fragment>
            <h1 className="text-center mt-5">Sign Up</h1>
            <form className="mt-5" onSubmit="{handleSubmitClick}">
                <div className="form-group text-left">
                    <label htmlFor="exampleInputUsername">Username</label>
                    <input type="text"
                        className="form-control"
                        id="username"
                        aria-describedby="usernameHelp"
                        placeholder="Enter Username"
                        value={state.username}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email"
                        className="form-control"
                        id="email"
                        aria-describedby="emailHelp"
                        placeholder="Enter Email"
                        value={state.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputFirstName">First Name</label>
                    <input type="text"
                        className="form-control"
                        id="first_name"
                        aria-describedby="fisrtNameHelp"
                        placeholder="Enter First Name"
                        value={state.first_name}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputLastName">Last Name</label>
                    <input type="text"
                        className="form-control"
                        id="last_name"
                        aria-describedby="lastNameHelp"
                        placeholder="Enter Last Name"
                        value={state.last_name}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password"
                        className="form-control"
                        id="password"
                        placeholder="Password"
                        value={state.password}
                        onChange={handleChange}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                >
                    Sign In
                </button>
            </form>
        </Fragment>
    );
};

export default SignIn;