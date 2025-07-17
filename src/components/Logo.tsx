

export default function Logo({scrolled}: {scrolled: boolean}) {
    return(
        <div className={"text-6xl text-center text-white font-semibold pb-5 relative"}>
            <span className={`text-7xl sm:absolute transition-all duration-1000
             ${scrolled ? "sm:scale-90 -left-4 bottom-4" : "sm:text-8xl -left-6 bottom-4"}`}>i</span>nvesto
        </div>
    );
}