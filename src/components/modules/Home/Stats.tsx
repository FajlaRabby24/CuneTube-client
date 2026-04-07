import { NumberTicker } from "@/components/ui/number-ticker";

const stats = [
  { label: "Movies Reviewed", value: 50000, suffix: "+" },
  { label: "Active Users", value: 50000, suffix: "+" },
  { label: "TV Shows", value: 10000, suffix: "+" },
  { label: "Reviews Written", value: 100000, suffix: "+" },
];

const Stats = () => {
  return (
    <section className="w-full bg-background py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-4 text-center shadow-sm md:p-6"
            >
              <span className="mb-2 text-3xl font-bold tracking-wider text-foreground md:text-4xl lg:text-5xl">
                <NumberTicker value={stat.value} />
                {stat.suffix}
              </span>
              <span className="text-sm text-muted-foreground md:text-base">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
