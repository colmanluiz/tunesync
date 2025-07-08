import { Music } from "lucide-react";
import { Navigation } from "./navigation";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Music className="h-6 w-6" />
            <span className="text-xl font-bold text-gray-900">TuneSync</span>
          </div>
          <Navigation />
          <div>
            <Button variant="primary">Get Started</Button>
          </div>
        </div>
      </div>
    </header>
  );
}

{
  /* <div className="max-w-7xl mx-auto6px-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Music className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">TuneSync</span>
          </div>
        </div>
      </div> */
}
