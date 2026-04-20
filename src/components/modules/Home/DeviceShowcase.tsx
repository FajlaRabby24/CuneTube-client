"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { MonitorIcon, TvIcon, SmartphoneIcon, LaptopIcon } from "lucide-react";

const devices = [
  { icon: TvIcon, name: "Smart TV" },
  { icon: LaptopIcon, name: "Laptop & Web" },
  { icon: SmartphoneIcon, name: "Mobile & Tablet" }
];

const DeviceShowcase = () => {
  return (
    <section className="relative w-full bg-slate-950 py-24 overflow-hidden border-y border-white/5">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -left-1/4 top-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute -right-1/4 bottom-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 w-full max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
          
          {/* Text Content */}
          <div className="flex-1 space-y-8 text-center lg:text-left z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase font-outfit tracking-tighter">
                Watch <span className="text-primary italic">Everywhere</span>
              </h2>
              <div className="h-1 w-20 bg-primary mx-auto lg:mx-0 rounded-full" />
              <p className="text-slate-400 text-lg md:text-xl font-medium max-w-md mx-auto lg:mx-0">
                Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV without paying more.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4"
            >
              {devices.map((device, index) => {
                const Icon = device.icon;
                return (
                  <div key={index} className="flex flex-col items-center gap-3 group">
                    <div className="size-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-300 shadow-xl">
                      <Icon className="size-8 text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{device.name}</span>
                  </div>
                )
              })}
            </motion.div>
          </div>

          {/* Device Mockups Visuals */}
          <div className="flex-1 w-full relative min-h-[450px] md:min-h-[550px] flex items-center justify-center lg:justify-end mt-12 lg:mt-0">
            
            {/* TV Mockup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
              className="absolute right-auto md:right-10 top-10 md:top-20 w-[300px] md:w-[480px] aspect-video bg-slate-900 rounded-lg md:rounded-2xl border-[6px] md:border-[10px] border-slate-800 shadow-2xl shadow-black/50 overflow-hidden z-10"
            >
              <Image 
                src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80" 
                alt="TV Screen" 
                fill 
                className="object-cover opacity-90"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="size-12 md:size-16 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center group cursor-pointer hover:bg-black/60 transition-colors">
                     <div className="w-0 h-0 border-y-[8px] md:border-y-[10px] border-y-transparent border-l-[12px] md:border-l-[16px] border-l-white ml-1 group-hover:scale-110 transition-transform"></div>
                  </div>
               </div>
            </motion.div>

            {/* Laptop Mockup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, x: -50 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="absolute left-4 md:-left-4 bottom-24 md:bottom-20 w-[240px] md:w-[350px] z-20 group"
            >
              {/* Screen */}
              <div className="relative aspect-video bg-slate-900 rounded-t-lg md:rounded-t-xl border-[5px] md:border-[6px] border-b-0 border-slate-700 shadow-2xl overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=600&q=80" 
                  alt="Laptop Screen" 
                  fill 
                  className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              {/* Base */}
              <div className="h-4 md:h-5 w-[110%] -ml-[5%] bg-slate-600 rounded-b-xl border-t border-slate-500 shadow-2xl shadow-black flex justify-center">
                  <div className="w-1/4 h-1 md:h-1.5 bg-slate-400 rounded-b-md"></div>
              </div>
            </motion.div>

            {/* Mobile Mockup */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
              className="absolute right-1/4 md:right-1/3 -bottom-5 md:-bottom-10 w-[90px] md:w-[130px] aspect-[9/19] bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] border-[4px] md:border-[6px] border-slate-700 shadow-2xl shadow-black overflow-hidden z-30 group"
            >
              <Image 
                 src="https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=400&q=80" 
                 alt="Mobile Screen" 
                 fill 
                 className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
              />
              {/* Dynamic Island / Notch */}
              <div className="absolute top-2 w-full flex justify-center">
                 <div className="w-1/3 h-3.5 bg-black rounded-full" />
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default DeviceShowcase;
