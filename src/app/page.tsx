
import Link from "next/link";
import "./global.css";
import { AiFillPieChart, AiOutlineFund } from "react-icons/ai";
import { MdAttachMoney } from "react-icons/md";
import ScrollReveal from "../components/scrollAnimation";
import HeaderOnScroll from "../components/headerOnScroll";

// A882DD
// 49416D
export default async function Home() {

    return (
      <div className={"container min-h-screen min-w-screen"}>
          <HeaderOnScroll/>
      {/*    Hero*/}
          <div className={"text-center my-10 p-5 md:p-20 sm:w-9/10 m-auto"}>
              <h1 className={"text-5xl sm:text-6xl md:text-8xl my-10"}>All your investments in one place</h1>
              <p className={"text-4xl md:text-5xl mb-15"}> investo is your private finanse assistant</p>
              <Link href={"/product"} className={"text-4xl bg-[#49416D] py-4 px-5 rounded-lg text-gray-100 transition-all hover:scale-110"}>Register Now</Link>

          </div>
      {/*    About*/}
          <ScrollReveal>
          <div className={"text-center mt-20 p-10 w-9/10 m-auto"}>
              <h2 className={"text-5xl"}>Three reasons why u should register now</h2>
              <div className={"flex flex-col flex-wrap w-full lg:max-w-[60%] m-auto text-4xl justify-center items-left my-20"}>
                  <article className={"hover:scale-110 hover:-translate-y-5 transition-all duration-600 flex flex-col lg:flex-row w-full justify-start items-center border-gray-400 border-b-1 rounded-1 pb-10 my-10"}>
                      <AiFillPieChart className={"w-30 h-20 mb-10 lg:m-0"} />
                      <p>Track all your investments in one place – no more spreadsheets.</p>
                  </article>
                  <article className={"hover:scale-110 hover:-translate-y-5 transition-all duration-600 flex gap-5 flex-col lg:flex-row w-full justify-left items-center border-gray-400 border-b-1 rounded-1 pb-10 my-10"}>
                      <AiOutlineFund className={"w-30 h-20 mb-10 lg:m-0"} />
                      <p>Get real-time market data and insights on your portfolio.</p>
                  </article>
                  <article className={"hover:scale-110 hover:-translate-y-5 transition-all duration-600 flex gap-5 flex-col lg:flex-row w-full justify-left items-center border-gray-400 border-b-1 rounded-1 pb-10 mt-10"}>
                      <MdAttachMoney className={"w-30 h-20 mb-10 lg:m-0"} />
                      <p>Start for free with powerful features and no hidden fees.</p>
                  </article>
              </div>
          </div>
          </ScrollReveal>
      {/*    Pricing */}
          <ScrollReveal>
          <div className={"text-center p-10 w-9/10 m-auto"}>
              <h2 className={"text-5xl"}>Checkout our plans</h2>
              <div className={"flex flex-wrap gap-15 justify-center items-center my-10"}>
                  <div className={`p-4 pt-5 pb-10 min-w-70 w-90 max-w-100 rounded-sm border-2 border-gray-400 
                   transition-all hover:border-[#A882DD] hover:-translate-y-3 hover:shadow-2xl`}>
                      <div className={"text-left border-b-1 border-gray-400 py-1 pb-2"}>
                          <h2 className={"text-5xl"}>Free</h2>
                          <p className={"text-4xl"}>00.00/<span className={"text3xl"}>Month</span></p>
                      </div>
                      <div className={"py-2 mb-5"}>
                          <p className={"text-3xl py-3"}>Includes</p>
                          <ul className={"text-2xl text-left p-5"}>
                              <li className={"relative"}><span className={"w-2 h-2 rounded-full bg-black absolute bottom-3 -left-5 "}></span>Add all your assets</li>
                              <li className={"relative"}><span className={"w-2 h-2 rounded-full bg-black absolute bottom-3 -left-5 "}></span>Trace your investments</li>
                              <li className={"relative"}><span className={"w-2 h-2 rounded-full bg-black absolute bottom-3 -left-5 "}></span>Watch your money growth</li>
                          </ul>
                      </div>
                      <Link href={"/product"} className={"text-3xl bg-[#49416D] text-white py-2 px-5 rounded-lg font-medium hover:bg-[#4a426ec9]"}>Select</Link>
                  </div>
                  <div className={`p-4 pt-5 pb-10 min-w-70 w-90  max-w-100 rounded-sm border-2 border-gray-400 
                   transition-all hover:border-[#A882DD] hover:-translate-y-3 hover:shadow-2xl`}>
                      <div className={"text-left border-b-1 border-gray-400 py-1"}>
                          <h2 className={"text-5xl"}>Standard</h2>
                          <p className={"text-4xl"}>04.00/<span className={"text3xl"}>Month</span></p>
                      </div>
                      <div className={"py-2 mb-5"}>
                          <p className={"text-3xl py-3"}>Includes</p>
                          <ul className={"text-2xl text-left p-5"}>
                              <li className={"relative"}><span className={"w-2 h-2 rounded-full bg-black absolute bottom-3 -left-5 "}></span>Add all your assets</li>
                              <li className={"relative"}><span className={"w-2 h-2 rounded-full bg-black absolute bottom-3 -left-5 "}></span>Trace your investments</li>
                              <li className={"relative"}><span className={"w-2 h-2 rounded-full bg-black absolute bottom-3 -left-5 "}></span>Watch your money growth</li>
                          </ul>
                      </div>
                      <Link href={"/product"} className={"text-3xl bg-[#49416D] text-white py-2 px-5 rounded-lg font-medium hover:bg-[#4a426ec9]"}>Select</Link>
                  </div>
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
                                  className={"border-1 rounded-sm w-full px-2 py-1 focus:border-[#49416D]"}/>
                              </section>
                              <section className={"flex flex-col items-start gap-3 w-full md:w-1/2"}>
                                  <label>Last Name</label>
                                  <input type={"text"} placeholder={"Enter your last name"} required
                                         className={"border-1 rounded-sm w-full px-2 py-1 focus:border-[#49416D]"}/>
                              </section>
                          </div>
                          <div  className={"flex flex-col gap-3 w-full mb-10"}>
                              <section  className={"flex flex-col items-start gap-3 p-2 w-full"}>
                                  <label>E-mail</label>
                                  <input type="email" placeholder={"Enter your e-mail"} required
                                         className={"border-1 rounded-sm px-2 py-1 focus:border-[#49416D] w-full"}/>
                              </section>
                              <section className={"flex flex-col items-start gap-3 p-2 w-full"}>
                                  <label>Topic</label>
                                  <input type="text" placeholder={"Enter topic"} required
                                         className={"border-1 rounded-sm px-2 py-1 focus:border-[#49416D] w-full"}/>
                              </section>
                              <section className={"flex flex-col items-start gap-3 p-2 w-full"}>
                                  <label>Your message</label>
                                  <textarea placeholder={"Enter message"} required rows={7}
                                            className={"border-1 rounded-sm px-2 py-1 focus:border-[#49416D] w-full"}/>
                              </section>
                          </div>
                          <input className={"bg-[#49416D] text-gray-100 px-5 py-3 my-5 rounded-lg text-4xl transition-all hover:scale-120 hover:shadow-2xl active:bg-[#4a426ec9]"}
                          type={"submit"} value={"Submit"}/>
                      </div>
                  </form>
              </div>
          </div>
          </ScrollReveal>
          <footer className={"bg-[#A882DD] p-4"}>
                <p className={"text-2xl p-2 text-gray-100"}>Copyright &copy 2025 investo.pl All rights reserved </p>
          </footer>
      </div>
  );
}
