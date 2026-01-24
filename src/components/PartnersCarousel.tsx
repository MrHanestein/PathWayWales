import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const partners = [
  { name: "Welsh Government", logo: "🏛️" },
  { name: "Admiral", logo: "⚓" },
  { name: "DVLA", logo: "🚗" },
  { name: "ONS", logo: "📊" },
  { name: "NHS Wales", logo: "🏥" },
  { name: "BBC Wales", logo: "📺" },
  { name: "Principality", logo: "🏠" },
  { name: "Cardiff Uni", logo: "🎓" },
];

const PartnersCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % partners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const visiblePartners = [
    partners[currentIndex],
    partners[(currentIndex + 1) % partners.length],
    partners[(currentIndex + 2) % partners.length],
  ];

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-3">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 text-center">
        Partnered Companies
      </p>
      <div className="flex items-center justify-center gap-3 overflow-hidden">
        {visiblePartners.map((partner, index) => (
          <div
            key={`${partner.name}-${index}`}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-500",
              index === 1 ? "opacity-100 scale-100" : "opacity-60 scale-90"
            )}
          >
            <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-xl">
              {partner.logo}
            </div>
            <span className="text-[9px] text-muted-foreground text-center whitespace-nowrap">
              {partner.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnersCarousel;
