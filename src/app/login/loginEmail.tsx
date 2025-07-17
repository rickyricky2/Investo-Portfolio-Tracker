
export default function LoginForm( { email }: { email:string} ) {
    return(
        <div className={"my-4"}>
            <label>Email</label>
            <input type={"text"}
                   name={"email"}
                   defaultValue={ email }
                   className={"border-2 rounded-lg p-1 px-2 w-full text-2xl focus:border-[#49416D] focus:border-3"}/>
        </div>
    );
}