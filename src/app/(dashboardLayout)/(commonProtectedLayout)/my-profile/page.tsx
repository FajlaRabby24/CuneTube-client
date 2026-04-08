import { Card, CardContent } from "@/components/ui/card";

const tabs = [
  { id: "watchlist", label: "Watchlist", count: 2 },
  { id: "favorites", label: "Favorites", count: 3 },
  { id: "followers", label: "Followers", count: 0 },
  { id: "following", label: "Following", count: 0 },
];

const mockWatchlist = [
  {
    id: 1,
    title: "Inception",
    year: 2010,
    poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
  },
  {
    id: 2,
    title: "The Dark Knight",
    year: 2008,
    poster:
      "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
  },
];

const mockFavorites = [
  {
    id: 1,
    title: "Interstellar",
    year: 2014,
    poster:
      "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmMxNzk1MzMwXkEyXkFqcGc@._V1_.jpg",
  },
  {
    id: 2,
    title: "The Prestige",
    year: 2006,
    poster:
      "https://m.media-amazon.com/images/M/MV5BMjIyODQwMzY4Nl5BMl5BanBnXkFtZTcwMTE4MzcwNw@@._V1_.jpg",
  },
  {
    id: 3,
    title: "Dunkirk",
    year: 2017,
    poster:
      "https://m.media-amazon.com/images/M/MV5BN2YyZjUxZDYtNDBlZi00NmM4LWIzMWItNGE2NGUzYjE3ZDQ5XkEyXkFqcGc@._V1_.jpg",
  },
];

const MyProfilePage = () => {
  //   const { data: adminDashboardData } = useQuery({
  //     queryKey: ["admin-dashboard-data"],
  //     queryFn: getUserInfo,
  //     refetchOnWindowFocus: "always", // Refetch the data when the window regains focus
  //   });
  //   console.log(adminDashboardData);
  return (
    <div className="min-h-svh bg-muted p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card className="overflow-hidden">
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-3xl font-bold text-primary-foreground">
              J
            </div>
            <div>
              <h2 className="text-xl font-semibold">John Doe</h2>
              <p className="text-sm text-muted-foreground">
                john.doe@example.com
              </p>
              <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Free Plan
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex gap-6 border-b px-6 py-4">
            {tabs?.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  tab.id === "watchlist"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {[...mockWatchlist, ...mockFavorites].map((movie) => (
                <div
                  key={movie.id}
                  className="group relative aspect-[2/3] overflow-hidden rounded-lg bg-muted"
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="truncate text-xs font-medium text-white">
                      {movie.title}
                    </p>
                    <p className="text-xs text-white/70">{movie.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyProfilePage;
