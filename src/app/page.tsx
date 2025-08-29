
import Link from "next/link";
import "./global.css";
import { AiFillPieChart, AiOutlineFund } from "react-icons/ai";
import { MdAttachMoney } from "react-icons/md";
import ScrollReveal from "../components/scrollAnimation";
import HeaderOnScroll from "../components/headerOnScroll";
import {subscriptionPlans} from "@/lib/subscriptionPlans";

const aboutContent: {icons: React.ReactNode; info:string}[] = [
    {
        icons: <AiFillPieChart className={"w-30 h-20 mb-10 lg:m-0"}/> ,
        info: "Track all your investments in one place – no more spreadsheets."
    },
    {
        icons: <AiOutlineFund className={"w-30 h-20 mb-10 lg:m-0"} /> ,
        info: "Get real-time market data and insights on your portfolio."
    },
    {
        icons: <MdAttachMoney className={"w-30 h-20 mb-10 lg:m-0"} /> ,
        info: "Start for free with powerful features and no hidden fees."
    }
]

export default async function Home() {

    return (
      <div className={"w-full min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text-secondary"}>
          <HeaderOnScroll/>
      {/*    Hero*/}
          <div className={"text-center p-5 md:p-20 sm:w-9/10 m-auto"}>
              <h1 className={"text-5xl dark:text-dark-text-secondary sm:text-6xl md:text-8xl my-10"}>All your investments in one place</h1>
              <p className={"text-4xl dark:text-dark-text-tertiary md:text-5xl mb-15"}> investo is your private finanse assistant</p>
              <Link href={"/product"} className={"text-4xl inline-block bg-light-secondary dark:bg-dark-bg-tertiary py-4 px-5 rounded-lg text-light-text-secondary dark:text-dark-text-secondary transition-all hover:scale-110"}>Register Now</Link>

          </div>
      {/*    About*/}
          <ScrollReveal>
          <div className={"text-center mt-20 p-10 w-9/10 m-auto"}>
              <h2 className={"text-5xl dark:text-dark-text-secondary"}>Three reasons why u should register now</h2>
              <div className={"flex flex-col flex-wrap w-full lg:max-w-[60%] m-auto text-4xl justify-center items-left my-20"}>
                  {aboutContent.map((item,index) => {
                      return(
                          <article key={index} className={"dark:text-dark-main hover:scale-110 hover:-translate-y-5 transition-all duration-600 flex flex-col lg:flex-row w-full justify-start items-center border-gray-400 dark:border-dark-main border-b-1 rounded-1 pb-10 my-10"}>
                              {item.icons}
                              <p className={"dark:text-dark-text-tertiary"}>{item.info}</p>
                          </article>
                      );
                  })}
              </div>
          </div>
          </ScrollReveal>
      {/*    Pricing */}
          <ScrollReveal>
          <div className={"text-center p-10 w-9/10 m-auto"}>
              <h2 className={"text-5xl dark:text-dark-text-secondary text-center"}>Checkout our plans</h2>
              <div className={"flex flex-wrap gap-15 justify-center items-center my-10"}>
                  {subscriptionPlans.map((item,index) => {
                      return(
                          <div key={index} className={`shadow-2xl p-10 min-w-70 w-90 max-w-100 min-h-[500px] dark:bg-dark-bg-tertiary rounded-4xl
                              transition-all hover:scale-101 hover:-translate-y-3 hover:shadow-2xl`}>
                              <div className={"text-left border-b-1 border-gray-400 dark:border-dark-secondary py-1 pb-2"}>
                                  <h2 className={"text-5xl dark:text-dark-text-secondary"}>{item.name}</h2>
                                  <p className={"text-4xl"}>{item.monthlyPrice}$/<span className={"text-3xl text-dark-text-tertiary"}>Month</span></p>
                              </div>
                              <div className={"py-2 mb-1"}>
                                  <p className={"text-3xl py-3"}>Includes</p>
                                  <ul className={"text-2xl text-left p-5 dark:text-dark-text-secondary"}>
                                      {item.includes.map((item,index) => {
                                          return(
                                              <li key={index} className={"relative"}><span className={"w-2 h-2 rounded-full bg-black dark:bg-dark-main absolute bottom-3 -left-5 "}></span>{item}</li>
                                          );
                                      })}
                                  </ul>
                              </div>
                              {item.name === "Free" ? (
                                  <p className={"text-light-text dark:text-dark-text-tertiary tracking-normal text-lg"}>No credit card info needed!</p>
                              ) : ""}
                              <Link href={"/product"} className={"mt-4 inline-block text-3xl bg-light-secondary dark:bg-dark-main text-light-text-secondary dark:text-dark-text-secondary py-2 px-5 rounded-lg font-medium hover:bg-light-secondary dark:hover:bg-dark-secondary"}>Select</Link>
                          </div>
                      );
                  })}
              </div>
          </div>
          </ScrollReveal>
      {/*    Contact*/}
          <ScrollReveal>
          <div className={"text-center mt-20 p-10 w-full sm:w-9/10 m-auto"}>
              <h2 className={"text-5xl"}>Any questions? Contact us using form below ;)</h2>
              <div className={" w-full sm:w-9/10 lg:w-8/10 m-auto"}>
                  <form method="post" className={"contactForm"}>
                      <div className={"text-3xl py-10 sm:px-10 w-full"}>
                          <div className={"flex flex-col md:flex-row sm:gap-5 lg:gap-10 mb-5"}>
                              <section className={"flex flex-col items-start gap-3 w-full md:w-1/2"}>
                                  <label>First Name</label>
                                  <input type="text" placeholder={"Enter your name"} required
                                  className={"border-1 rounded-sm w-full px-2 py-1 focus:border-light-secondary dark:focus:border-dark-secondary"}/>
                              </section>
                              <section className={"flex flex-col items-start gap-3 w-full md:w-1/2"}>
                                  <label>Last Name</label>
                                  <input type={"text"} placeholder={"Enter your last name"} required
                                         className={"border-1 rounded-sm w-full px-2 py-1 focus:border-light-secondary dark:focus:border-dark-secondary"}/>
                              </section>
                          </div>
                          <div  className={"flex flex-col gap-3 w-full mb-10"}>
                              <section  className={"flex flex-col items-start gap-3 p-2 w-full"}>
                                  <label>E-mail</label>
                                  <input type="email" placeholder={"Enter your e-mail"} required
                                         className={"border-1 rounded-sm px-2 py-1 focus:border-light-secondary dark:focus:border-dark-secondary w-full"}/>
                              </section>
                              <section className={"flex flex-col items-start gap-3 p-2 w-full"}>
                                  <label>Topic</label>
                                  <input type="text" placeholder={"Enter topic"} required
                                         className={"border-1 rounded-sm px-2 py-1 focus:border-light-secondary dark:focus:border-dark-secondary w-full"}/>
                              </section>
                              <section className={"flex flex-col items-start gap-3 p-2 w-full"}>
                                  <label>Your message</label>
                                  <textarea placeholder={"Enter message"} required rows={7}
                                            className={"border-1 rounded-sm px-2 py-1 focus:border-light-secondary dark:focus:border-dark-secondary w-full"}/>
                              </section>
                          </div>
                          <input className={"bg-light-secondary dark:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary px-5 py-3 my-5 rounded-lg text-4xl transition-all hover:scale-105 hover:shadow-2xl active:bg-[#4a426ec9]"}
                          type={"submit"} value={"Submit"}/>
                      </div>
                  </form>
              </div>
          </div>
          </ScrollReveal>
          <footer className={"bg-light-main dark:bg-dark-bg-tertiary px-4 font-medium "}>
                <p className={"text-lg p-2 text-light-text-secondary dark:text-dark-text-tertiary"}>Copyright &copy; 2025 Investo.pl All rights reserved </p>
          </footer>
      </div>
  );
}
