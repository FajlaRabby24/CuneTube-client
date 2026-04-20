"use client";

import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircleIcon } from "lucide-react";

const faqData = [
  {
    question: "What is included in the premium membership?",
    answer: "Premium membership grants you unlimited access to our entire library of movies and TV shows, entirely ad-free. You also get exclusive early access to highly anticipated releases, behind-the-scenes content, and the ability to stream in stunning 4K Ultra HD resolution.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Absolutely. We believe in no commitments. You can easily cancel your subscription at any time through your account settings with just two clicks. There are no cancellation fees or hidden charges.",
  },
  {
    question: "How many devices can I watch on simultaneously?",
    answer: "Depending on your plan, you can stream on up to 4 devices at the same time. Our basic plan allows 1 device, standard allows 2, and our premium family plan allows up to 4 simultaneous streams, perfect for sharing.",
  },
  {
    question: "Can I download movies for offline viewing?",
    answer: "Yes! Our mobile and tablet applications support offline viewing. You can download your favorite movies and episodes while on Wi-Fi and watch them anywhere, ensuring you're never bored on a long flight or commute.",
  },
  {
    question: "Do you offer subtitles and multiple audio languages?",
    answer: "We strive for full accessibility. Almost all of our titles come with multiple subtitle options, and many internationally popular titles feature dubbed audio in several languages to suit your preference.",
  }
];

const FAQSection = () => {
  return (
    <section className="relative w-full bg-slate-950 py-24 border-b border-white/5 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
      <div className="absolute right-0 top-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-4xl">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl mb-4 border border-white/10 shadow-xl">
             <HelpCircleIcon className="size-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase font-outfit tracking-tighter">
            Frequently Asked <span className="text-primary italic">Questions</span>
          </h2>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Everything you need to know about our platform and services.
          </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.2 }}
           className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/10 p-4 md:p-8 shadow-2xl"
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem 
                 key={index} 
                 value={`item-${index}`} 
                 className="border border-white/5 bg-white/5 rounded-2xl px-6 data-[state=open]:bg-white/10 data-[state=open]:border-primary/30 transition-all duration-300"
              >
                <AccordionTrigger className="text-left text-white hover:text-primary hover:no-underline py-6 font-bold text-lg [&[data-state=open]>svg]:text-primary">
                   {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-400 leading-relaxed text-base pb-6">
                   {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
