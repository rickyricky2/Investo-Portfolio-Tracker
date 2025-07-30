
export default function LoginForm( { email, isError }: { email:string; isError: boolean } ) {
    return(
        <div className={"my-4"}>
            <label className={`${isError ? "text-light-error-text dark:text-dark-error-text" : 'text-light-text dark:text-dark-text'}`}>Email</label>
            <input type={"text"}
                   name={"email"}
                   defaultValue={ email }
                   className={`border-2 text-lg rounded-lg p-1 px-2 w-full sm:text-2xl outline-none focus:border-3 ${isError ? "border-light-error-border focus:border-light-error-border bg-light-error-bg text-light-error-text dark:text-dark-error-text dark:bg-dark-error-bg dark:border-dark-error dark:focus:border-dark-error" : 'focus:border-light-secondary dark:focus:border-dark-secondary '}`}/>
        </div>
    );
}