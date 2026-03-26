"use client";

import AppLayout from "@/components/layout/AppLayout";
import FingerMap from "@/components/lessons/FingerMap";
import { ChevronLeft, Info, BookOpen, Target, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ReferencePage() {
  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto bg-bg">
        <div className="layout-container py-12 px-6 max-w-[1000px] mx-auto">
          
          <div className="mb-10 flex flex-col gap-6">
            <Link 
              href="/lessons" 
              className="group flex items-center gap-2 text-ink-3 hover:text-accent transition-colors font-mono text-[10px] uppercase tracking-widest font-bold"
            >
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to Lessons
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-accent shadow-sm">
                <BookOpen size={24} />
              </div>
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-ink tracking-tight">Reference Guide</h1>
                <p className="text-ink-3 text-sm italic">Master the art of touch typing with proper technique</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Main Finger Map */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <FingerMap />
              
              <div className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
                 <h3 className="text-xl font-bold text-ink mb-6 flex items-center gap-3">
                    <Sparkles size={20} className="text-accent" />
                    Pro Tips for Speed
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TipCard 
                      title="Don't Look Down" 
                      description="The goal of touch typing is to trust your finger memory. If you must look, use this reference guide instead of your physical keyboard."
                    />
                    <TipCard 
                      title="Rhythm Over Speed" 
                      description="Speed comes from a steady rhythm. Avoid 'bursting' through easy words and slowing down for hard ones. Strive for constant pace."
                    />
                    <TipCard 
                      title="Fix errors immediately" 
                      description="When you miss a key, stop. Feel the distance to the correct one, then proceed. This reinforces the correct muscle memory."
                    />
                    <TipCard 
                      title="Relax your shoulders" 
                      description="Tension is the enemy of speed. Keep your shoulders down and your breathing deep."
                    />
                 </div>
              </div>
            </div>

            {/* Sidebar with Technique */}
            <div className="flex flex-col gap-6">
               <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
                  <h4 className="font-mono text-[10px] uppercase tracking-widest font-bold text-ink-4 mb-4">Technique Basics</h4>
                  <ul className="flex flex-col gap-4">
                     <TechniqueItem 
                        icon={<Target size={16} />}
                        title="Anchor Points"
                        text="Your index fingers are your anchors. F and J have small bumps to help you feel your way back without looking."
                     />
                     <TechniqueItem 
                        icon={<Info size={16} />}
                        title="Curved Fingers"
                        text="Keep your fingers arched. This allows for more precise movement and faster reaction times."
                     />
                  </ul>
               </div>

               <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 text-accent shadow-sm">
                  <h4 className="font-bold text-sm mb-2">Ready to practice?</h4>
                  <p className="text-xs opacity-80 mb-4 leading-relaxed">The best way to learn is by doing. Head back to the lesson map to start your journey.</p>
                  <Link 
                    href="/lessons" 
                    className="block w-full text-center py-2.5 bg-accent text-white rounded-xl text-xs font-bold shadow-lg shadow-accent/20 hover:scale-[1.02] transition-transform"
                  >
                    Enter Lesson Map
                  </Link>
               </div>
            </div>

          </div>

        </div>
      </div>
    </AppLayout>
  );
}

function TipCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-2 p-5 rounded-2xl bg-surface-2 border border-border hover:border-accent/30 transition-colors">
       <span className="font-bold text-ink text-sm">{title}</span>
       <p className="text-xs text-ink-3 leading-relaxed">{description}</p>
    </div>
  );
}

function TechniqueItem({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <li className="flex gap-4">
       <div className="shrink-0 w-8 h-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-ink-3">
          {icon}
       </div>
       <div className="flex flex-col">
          <span className="text-xs font-bold text-ink">{title}</span>
          <p className="text-[11px] text-ink-3 leading-tight">{text}</p>
       </div>
    </li>
  );
}
