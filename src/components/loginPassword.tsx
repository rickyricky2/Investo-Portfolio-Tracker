"use client";
import {FaRegEye, FaRegEyeSlash} from "react-icons/fa";
import {useState,forwardRef} from "react";

type LoginPasswordProps = {
    id:string;
    name:string;
    required:boolean;
    isError: boolean;
}

const LoginPassword = forwardRef<HTMLInputElement, LoginPasswordProps>( (props,ref) => {
    const [showPassword, setShowPassword] = useState(false);


    return(
        <div className={"my-4 relative"}>
            <label className={`${props.isError ? "text-light-error-text dark:text-dark-error-text" : 'text-light-text dark:text-dark-text-secondary'}`}>{props.name}</label>
            <input type={showPassword ? "text" : "password"}
                   name={props.id}
                   ref={ref}
                   required={props.required}
                   className={`border-2 pr-11 rounded-lg p-1 px-2 w-full text-lg lg:text-2xl outline-none focus:border-3 ${props.isError ? "border-light-error-border focus:border-light-error-border bg-light-error-bg text-light-error-text dark:text-dark-error-text dark:bg-dark-error-bg dark:border-dark-error dark:focus:border-dark-error" : ' dark:focus:border-dark-tertiary '}`}/>
            <span className={`absolute top-11 right-3 ${props.isError ? "text-light-error-text dark:text-dark-error-text" : 'text-light-text dark:text-dark-text-secondary' }`}
                  onClick={ () => setShowPassword( (prev) => !prev)}>
                        {showPassword ? <FaRegEyeSlash/> : <FaRegEye/> }
                    </span>
        </div>
    );
});

LoginPassword.displayName = "LoginPassword";

export default LoginPassword;