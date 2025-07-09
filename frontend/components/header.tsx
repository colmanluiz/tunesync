import { Navigation } from "./navigation";
import { Button } from "./ui/button";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="top-0 z-50 bg-(--background-light)">
      <div className="w-full mx-auto px-6">
        <div className="grid grid-cols-3 items-center h-20">
          <div className="flex items-center space-x-2 justify-start">
            <Logo />
          </div>
          <div className="flex justify-center">
            <Navigation />
          </div>
          <div className="flex items-center space-x-2 justify-end">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
            <Button variant="primary" size="lg">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
