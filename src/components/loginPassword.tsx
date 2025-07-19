"use client";
import {FaRegEye, FaRegEyeSlash} from "react-icons/fa";
import {useState,forwardRef} from "react";

type LoginPasswordProps = React.InputHTMLAttributes<HTMLInputElement>;

const LoginPassword = forwardRef<HTMLInputElement, LoginPasswordProps>( (props,ref) => {
    const [showPassword, setShowPassword] = useState(false);


    return(
        <div className={"my-4 relative"}>
            <label>{props.name}</label>
            <input type={showPassword ? "text" : "password"}
                   name={props.id}
                   ref={ref}
                   required={props.required}
                   className={"border-2 pr-11 rounded-lg p-1 px-2 w-full text-2xl focus:border-[#49416D] focus:border-3"}/>
            <span className={"absolute top-11 right-3"}
                  onClick={ () => setShowPassword( (prev) => !prev)}>
                        {showPassword ? <FaRegEyeSlash/> : <FaRegEye/> }
                    </span>
        </div>
    );
});

LoginPassword.displayName = "LoginPassword";

export default LoginPassword;