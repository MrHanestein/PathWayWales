import { cn } from "@/lib/utils";

const partners = [
  { name: "Welsh Government", color: "bg-red-500" },
  { name: "Admiral", color: "bg-blue-600" },
  { name: "DVLA", color: "bg-green-600" },
  { name: "ONS", color: "bg-purple-600" },
  { name: "NHS Wales", color: "bg-sky-500" },
  { name: "BBC Wales", color: "bg-pink-500" },
  { name: "Principality", color: "bg-amber-500" },
  { name: "Cardiff Uni", color: "bg-indigo-500" },
];

const PartnersCarousel = () => {
  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-3 overflow-hidden" data-tour="partners">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 text-center font-semibold">
        Hiring Partners
      </p>
      
      {/* Marquee container */}
      <div className="relative overflow-hidden">
        <div className="flex animate-marquee gap-4 hover:[animation-play-state:paused]">
          {/* Double the partners for seamless loop */}
          {[...partners, ...partners].map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex flex-col items-center gap-1 flex-shrink-0"
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                partner.color
              )}>
                <span className="text-white font-bold text-xs">
                  {partner.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </span>
              </div>
              <span className="text-[8px] text-muted-foreground text-center whitespace-nowrap max-w-[50px] truncate">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnersCarousel;
