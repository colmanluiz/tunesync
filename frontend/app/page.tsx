import Link from "next/link";
import { ArrowRight, Shield, Star, Share, Sparkles } from "lucide-react";
import {
  MdDevices,
  MdEmail,
  MdEqualizer,
  MdLibraryMusic,
  MdMusicNote,
  MdPlaylistAdd,
  MdRefresh,
  MdShuffle,
  MdSupportAgent,
  MdSync,
  MdSyncAlt,
} from "react-icons/md";
import { SiYoutubemusic } from "react-icons/si";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      {/* Hero Section */}
      <section
        id="hero"
        className="pb-16 px-4 sm:px-6 lg:px-8 bg-(--background-light) min-h-[90vh] flex flex-col justify-center"
      >
        <div className="relative max-w-7xl mx-auto text-center flex flex-col items-center justify-center">
          {/* Floating Music Service Icons */}
          <img
            src="/spotify.svg"
            alt="Spotify"
            className="absolute left-[125px] top-[-120px] bg-(--spotify-primary) rounded-2xl p-2 w-15 h-15 z-0 rotate-[-12deg] shadow-lg"
            draggable={false}
          />
          <img
            src="/apple-music.svg"
            alt="Apple Music"
            className="absolute right-[250px] top-[-120px] rounded-2xl p-2 w-17 h-17 z-0 rotate-[10deg]"
            draggable={false}
          />
          <SiYoutubemusic className="absolute right-[-128px] bottom-[110px] text-white bg-(--youtube-primary) rounded-2xl p-2 w-14 h-14 z-0 rotate-[-8deg] shadow-lg" />
          <img
            src="/deezer.svg"
            alt="Deezer"
            className="absolute left-[-32px] bottom-[-32px] bg-(--deezer-primary) rounded-2xl p-2.5 w-15 h-15 z-0 rotate-[8deg] shadow-lg"
            draggable={false}
          />
          <img
            src="/amazon-music.svg"
            alt="Amazon Music"
            className="absolute left-[-120px] top-[20px] bg-[#232F3E] rounded-2xl p-2 w-14 h-14 z-0 rotate-[-6deg] shadow-lg"
            draggable={false}
          />
          <img
            src="/tidal.svg"
            alt="Tidal"
            className="absolute right-[-120px] top-[-32px] bg-black rounded-2xl p-2 w-14 h-14 z-0 rotate-[6deg] shadow-lg"
            draggable={false}
          />
          <img
            src="/soundcloud.svg"
            alt="SoundCloud"
            className="absolute right-[100px] bottom-[-100px] bg-[#ff5500] rounded-2xl p-2 w-14 h-14 z-0 rotate-[-10deg] shadow-lg"
            draggable={false}
          />

          {/* Special Offer Button */}
          <div className="inline-flex items-center gap-2 border-1 rounded-full px-4 py-2 text-center text-(--honeysuckle-950) border-(--honeysuckle-950) mb-4 text-sm">
            <Star className="h-4 w-4" />
            <span>1000+ people have already synced their music</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-(--silver-600) mb-6 font-satoshi">
            Your Music, Everywhere.
            <br />
            <span className="text-(--honeysuckle-150) block mt-3">
              Finally.
            </span>
          </h1>

          <p className="text-(--silver-600) text-center max-w-4xl mx-auto mb-6 text-md">
            Seamlessly sync and transfer your playlists across all major
            streaming platforms in minutes. No more rebuilding your carefully
            curated music collection from scratch.
          </p>
          <div className="flex gap-4">
            <Button variant="cta" size="custom" className="mt-6 w-1/2">
              Sync My Music Now
            </Button>
            <Button variant="none" size="custom" className="mt-6 w-1/2">
              See How It Works
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* value proposition & benefits */}
      <section
        id="value-prop"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-(--background-dark) flex flex-col items-center min-h-auto" // bg-(--honeysuckle-100)
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            <div className="col-span-1 mt-24">
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 font-satoshi text-(--silver-100) text-left max-w-4xl">
                <span className="text-(--honeysuckle-150) font-bold">
                  TuneSync
                </span>{" "}
                is the easiest and most reliable way to keep your music
                playlists perfectly synchronized across your favorite streaming
                services.
              </h2>
            </div>
            <div className="col-span-1">
              <div className="bg-white rounded-4xl p-6 min-h-[90vh]">
                <span>
                  here will be a video showing a screen starting the playlist
                  sync
                </span>
              </div>
            </div>
            <div className="col-span-1 grid grid-rows-4 gap-10">
              <div className="p-4 flex items-start gap-4">
                <MdLibraryMusic className="w-8 h-8 text-(--honeysuckle-150) flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-(--honeysuckle-150)">
                    Never lose your playlists again
                  </h3>
                  <p className="text-white">
                    Your music memories are safe with us.
                  </p>
                </div>
              </div>
              <div className="p-4 flex items-start gap-4">
                <MdShuffle className="w-8 h-8 text-(--honeysuckle-150) flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-(--honeysuckle-150)">
                    Cross-platform freedom
                  </h3>
                  <p className="text-white">
                    Switch services without losing your carefully curated
                    collections.
                  </p>
                </div>
              </div>
              <div className="p-4 flex items-start gap-4">
                <MdRefresh className="w-8 h-8 text-(--honeysuckle-150) flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-(--honeysuckle-150)">
                    Effortless synchronization
                  </h3>
                  <p className="text-white">
                    Set it once, and we keep everything in sync automatically.
                  </p>
                </div>
              </div>
              <div className="p-4 flex items-start gap-4">
                <MdDevices className="w-8 h-8 text-(--honeysuckle-150) flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-(--honeysuckle-150)">
                    Universal compatibility
                  </h3>
                  <p className="text-white">
                    Works with all major streaming platforms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-(--background-dark) min-h-screen relative overflow-hidden"
      >
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-white text-center font-satoshi">
              How It Works
            </h2>
            <p className="text-lg text-(--silver-300) max-w-2xl mx-auto">
              Three simple steps to sync your music across all platforms
            </p>
          </div>

          {/* Step 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 items-center">
            <div className="order-2 lg:order-1">
              <div className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 transform transition-all duration-300 hover:bg-white/15 border border-white/10">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-(--honeysuckle-150) flex items-center justify-center">
                      <MdDevices className="w-6 h-6 text-(--honeysuckle-950)" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-medium text-(--honeysuckle-150)">
                        STEP 1
                      </span>
                      <h3 className="text-2xl font-bold text-white">
                        Connect Your Services
                      </h3>
                    </div>
                    <p className="text-(--silver-300) text-lg leading-relaxed">
                      Link your favorite music services to TuneSync. We support
                      all major platforms including Spotify, Apple Music,
                      YouTube Music, and more. Your credentials are securely
                      encrypted.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="aspect-[4/3] rounded-3xl bg-white/5 overflow-hidden">
                {/* Replace the following div with an actual image */}
                <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
                  Illustration: Service Connection Interface
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 items-center">
            <div className="order-1">
              <div className="aspect-[4/3] rounded-3xl bg-white/5 overflow-hidden">
                {/* Replace the following div with an actual image */}
                <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
                  Illustration: Playlist Selection Process
                </div>
              </div>
            </div>
            <div className="order-2">
              <div className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 transform transition-all duration-300 hover:bg-white/15 border border-white/10">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-(--honeysuckle-150) flex items-center justify-center">
                      <MdLibraryMusic className="w-6 h-6 text-(--honeysuckle-950)" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-medium text-(--honeysuckle-150)">
                        STEP 2
                      </span>
                      <h3 className="text-2xl font-bold text-white">
                        Select Your Music
                      </h3>
                    </div>
                    <p className="text-(--silver-300) text-lg leading-relaxed">
                      Choose which playlists to sync or transfer. Select all
                      your music or customize exactly what moves over. Our smart
                      matching ensures your songs are correctly identified
                      across platforms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 transform transition-all duration-300 hover:bg-white/15 border border-white/10">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-(--honeysuckle-150) flex items-center justify-center">
                      <MdRefresh className="w-6 h-6 text-(--honeysuckle-950)" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-medium text-(--honeysuckle-150)">
                        STEP 3
                      </span>
                      <h3 className="text-2xl font-bold text-white">
                        Sync and Enjoy
                      </h3>
                    </div>
                    <p className="text-(--silver-300) text-lg leading-relaxed">
                      Sit back and relax while we handle the rest. Your
                      playlists will be available across all your connected
                      platforms, automatically updated whenever you make
                      changes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="aspect-[4/3] rounded-3xl bg-white/5 overflow-hidden">
                {/* Replace the following div with an actual image */}
                <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
                  Illustration: Syncing Animation
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-(--background-light) min-h-screen overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-(--silver-950) mb-20 text-center font-satoshi">
            Why Music Lovers Choose TuneSync
          </h2>

          <div className="grid grid-cols-12 gap-6">
            {/* Feature 1: Smart Playlist Matching - Large Card */}
            <div className="col-span-12 md:col-span-8 group">
              <div className="bg-(--background-dark) rounded-3xl p-10 h-full transform transition-all duration-300 hover:scale-[1.02] border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-(--honeysuckle-150)/10 to-transparent"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-(--honeysuckle-150) flex items-center justify-center mb-6">
                    <MdLibraryMusic className="w-8 h-8 text-(--honeysuckle-950)" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    Intelligent Song Matching
                  </h3>
                  <p className="text-lg text-(--silver-300) leading-relaxed max-w-xl">
                    Our advanced algorithms ensure your songs are correctly
                    matched across platforms, preserving your playlist
                    integrity.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2: Auto-Sync - Medium Card */}
            <div className="col-span-12 md:col-span-4 group">
              <div className="bg-(--background-dark) rounded-3xl p-8 h-full transform transition-all duration-300 hover:scale-[1.02] border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-(--honeysuckle-150) flex items-center justify-center mb-6">
                  <MdRefresh className="w-6 h-6 text-(--honeysuckle-950)" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Keep Everything Updated
                </h3>
                <p className="text-md text-(--silver-300) leading-relaxed">
                  Changes on one platform automatically sync to all others. Add
                  a song on Spotify, and it appears on Apple Music too.
                </p>
              </div>
            </div>

            {/* Feature 3: Bulk Transfer - Medium Card */}
            <div className="col-span-12 md:col-span-4 group">
              <div className="bg-(--background-dark) rounded-3xl p-8 h-full transform transition-all duration-300 hover:scale-[1.02] border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-(--honeysuckle-150) flex items-center justify-center mb-6">
                  <MdShuffle className="w-6 h-6 text-(--honeysuckle-950)" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Move Everything at Once
                </h3>
                <p className="text-md text-(--silver-300) leading-relaxed">
                  Transfer entire music libraries or select specific playlists.
                  Perfect for switching services or maintaining multiple
                  accounts.
                </p>
              </div>
            </div>

            {/* Feature 4: Cross-Platform Sharing - Medium Card */}
            <div className="col-span-12 md:col-span-4 group">
              <div className="bg-(--background-dark) rounded-3xl p-8 h-full transform transition-all duration-300 hover:scale-[1.02] border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-(--honeysuckle-150) flex items-center justify-center mb-6">
                  <Share className="w-6 h-6 text-(--honeysuckle-950)" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Share with Anyone
                </h3>
                <p className="text-md text-(--silver-300) leading-relaxed">
                  Share your playlists with friends regardless of which
                  streaming service they use. Music brings people together.
                </p>
              </div>
            </div>

            {/* Feature 5: Privacy & Security - Medium Card */}
            <div className="col-span-12 md:col-span-4 group">
              <div className="bg-(--background-dark) rounded-3xl p-8 h-full transform transition-all duration-300 hover:scale-[1.02] border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-(--honeysuckle-150) flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-(--honeysuckle-950)" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Your Data is Safe
                </h3>
                <p className="text-md text-(--silver-300) leading-relaxed">
                  Bank-level encryption and secure API connections. We never
                  store your music or personal data permanently.
                </p>
              </div>
            </div>

            {/* Feature 6: Platform Coverage - Full Width Card with Service Icons */}
            <div className="col-span-12 group">
              <div className="bg-(--background-dark) rounded-3xl p-10 h-full transform transition-all duration-300 hover:scale-[1.02] border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-(--honeysuckle-150)/10 to-transparent"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-(--honeysuckle-150) flex items-center justify-center mb-6">
                    <MdDevices className="w-8 h-8 text-(--honeysuckle-950)" />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2">
                        Universal Compatibility
                      </h3>
                      <p className="text-lg text-(--silver-300) leading-relaxed max-w-2xl">
                        Works with all major streaming services. Seamlessly sync
                        your music across any platform.
                      </p>
                    </div>
                    <Button variant="cta" size="lg" className="mt-4 md:mt-0">
                      Start Syncing Now
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
                    <div className="flex flex-col items-center gap-3 group/item">
                      <div className="w-20 h-20 rounded-2xl bg-(--spotify-primary) p-4 flex items-center justify-center transform transition-all duration-300 group-hover/item:scale-110">
                        <img
                          src="/spotify.svg"
                          alt="Spotify"
                          className="w-full h-full"
                          draggable={false}
                        />
                      </div>
                      <span className="text-sm text-(--silver-300)">
                        Spotify
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-3 group/item">
                      <div className="w-20 h-20 rounded-2xl bg-black p-4 flex items-center justify-center transform transition-all duration-300 group-hover/item:scale-110">
                        <img
                          src="/apple-music.svg"
                          alt="Apple Music"
                          className="w-full h-full"
                          draggable={false}
                        />
                      </div>
                      <span className="text-sm text-(--silver-300)">
                        Apple Music
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-3 group/item">
                      <div className="w-20 h-20 rounded-2xl bg-(--youtube-primary) p-4 flex items-center justify-center transform transition-all duration-300 group-hover/item:scale-110">
                        <SiYoutubemusic className="w-12 h-12 text-white" />
                      </div>
                      <span className="text-sm text-(--silver-300)">
                        YouTube Music
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-3 group/item">
                      <div className="w-20 h-20 rounded-2xl bg-(--deezer-primary) p-4 flex items-center justify-center transform transition-all duration-300 group-hover/item:scale-110">
                        <img
                          src="/deezer.svg"
                          alt="Deezer"
                          className="w-full h-full"
                          draggable={false}
                        />
                      </div>
                      <span className="text-sm text-(--silver-300)">
                        Deezer
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-3 group/item">
                      <div className="w-20 h-20 rounded-2xl bg-[#232F3E] p-4 flex items-center justify-center transform transition-all duration-300 group-hover/item:scale-110">
                        <img
                          src="/amazon-music.svg"
                          alt="Amazon Music"
                          className="w-full h-full"
                          draggable={false}
                        />
                      </div>
                      <span className="text-sm text-(--silver-300)">
                        Amazon Music
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-3 group/item">
                      <div className="w-20 h-20 rounded-2xl bg-black p-4 flex items-center justify-center transform transition-all duration-300 group-hover/item:scale-110">
                        <img
                          src="/tidal.svg"
                          alt="Tidal"
                          className="w-full h-full"
                          draggable={false}
                        />
                      </div>
                      <span className="text-sm text-(--silver-300)">Tidal</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 group/item">
                      <div className="w-20 h-20 rounded-2xl bg-[#ff5500] p-4 flex items-center justify-center transform transition-all duration-300 group-hover/item:scale-110">
                        <img
                          src="/soundcloud.svg"
                          alt="SoundCloud"
                          className="w-full h-full"
                          draggable={false}
                        />
                      </div>
                      <span className="text-sm text-(--silver-300)">
                        SoundCloud
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* social proof & testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-(--background-light) min-h-screen overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-(--silver-950) mb-6 text-center font-satoshi">
              Loved by Music Enthusiasts Everywhere
            </h2>
            <p className="text-lg text-(--silver-600) max-w-2xl mx-auto">
              Join thousands of music lovers who've discovered the freedom of
              platform-independent playlists
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Testimonial Card */}
            <div className="group">
              <div className="bg-(--background-dark) rounded-3xl p-8 h-full transform transition-all duration-300 hover:scale-[1.02] border border-white/10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-(--honeysuckle-200) to-(--honeysuckle-400) flex items-center justify-center text-white text-xl font-bold">
                    SM
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Sarah M.</h3>
                    <p className="text-(--silver-300)">Music Blogger</p>
                  </div>
                </div>
                <blockquote className="text-lg text-white leading-relaxed mb-6">
                  "Finally! I can switch between Apple Music and Spotify without
                  losing my decade of playlists. TuneSync saved me countless
                  hours."
                </blockquote>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-white/5">
                    Music Blogger
                  </Badge>
                  <Badge variant="outline" className="bg-white/5">
                    Playlist Creator
                  </Badge>
                </div>
              </div>
            </div>

            {/* Testimonial Card */}
            <div className="group">
              <div className="bg-(--background-dark) rounded-3xl p-8 h-full transform transition-all duration-300 hover:scale-[1.02] border border-white/10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-(--jonquil-200) to-(--jonquil-400) flex items-center justify-center text-white text-xl font-bold">
                    MK
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Marcus K.</h3>
                    <p className="text-(--silver-300)">Professional DJ</p>
                  </div>
                </div>
                <blockquote className="text-lg text-white leading-relaxed mb-6">
                  "As a DJ, I needed my sets available everywhere. TuneSync made
                  it effortless to keep everything in sync across all platforms.
                  The automatic playlist updates are a game-changer for my live
                  sets."
                </blockquote>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-white/5">
                    DJ
                  </Badge>
                  <Badge variant="outline" className="bg-white/5">
                    Pro User
                  </Badge>
                </div>
              </div>
            </div>

            {/* Testimonial Card */}
            <div className="group">
              <div className="bg-(--background-dark) rounded-3xl p-8 h-full transform transition-all duration-300 hover:scale-[1.02] border border-white/10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-(--honeysuckle-300) to-(--honeysuckle-500) flex items-center justify-center text-white text-xl font-bold">
                    JR
                  </div>
                  <div>
                    <h3 className="text-white font-bold">James R.</h3>
                    <p className="text-(--silver-300)">Indie Artist</p>
                  </div>
                </div>
                <blockquote className="text-lg text-white leading-relaxed mb-6">
                  "Managing my band's playlists across different platforms was a
                  nightmare until TuneSync. Now we can focus on making music,
                  not managing it."
                </blockquote>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-white/5">
                    Artist
                  </Badge>
                  <Badge variant="outline" className="bg-white/5">
                    Verified
                  </Badge>
                </div>
              </div>
            </div>

            {/* Testimonial Card */}
            <div className="group">
              <div className="bg-(--background-dark) rounded-3xl p-8 h-full transform transition-all duration-300 hover:scale-[1.02] border border-white/10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-(--jonquil-300) to-(--jonquil-500) flex items-center justify-center text-white text-xl font-bold">
                    EL
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Emma L.</h3>
                    <p className="text-(--silver-300)">Playlist Curator</p>
                  </div>
                </div>
                <blockquote className="text-lg text-white leading-relaxed mb-6">
                  "I curate playlists for a living, and TuneSync has
                  revolutionized my workflow. The smart matching feature is
                  incredibly accurate, and the automatic syncing saves me hours
                  every week. It's become an essential tool in my arsenal."
                </blockquote>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-white/5">
                    Curator
                  </Badge>
                  <Badge variant="outline" className="bg-white/5">
                    Power User
                  </Badge>
                  <Badge variant="outline" className="bg-white/5">
                    Early Adopter
                  </Badge>
                </div>
              </div>
            </div>

            {/* Testimonial Card */}
            <div className="group">
              <div className="bg-(--background-dark) rounded-3xl p-8 h-full transform transition-all duration-300 hover:scale-[1.02] border border-white/10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-(--honeysuckle-400) to-(--honeysuckle-600) flex items-center justify-center text-white text-xl font-bold">
                    TN
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Tom N.</h3>
                    <p className="text-(--silver-300)">Music Producer</p>
                  </div>
                </div>
                <blockquote className="text-lg text-white leading-relaxed mb-6">
                  "The platform coverage is impressive. Being able to sync
                  reference tracks across all services has streamlined my
                  production process significantly."
                </blockquote>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-white/5">
                    Producer
                  </Badge>
                  <Badge variant="outline" className="bg-white/5">
                    Pro User
                  </Badge>
                </div>
              </div>
            </div>

            {/* Testimonial Card */}
            <div className="group">
              <div className="bg-(--background-dark) rounded-3xl p-8 h-full transform transition-all duration-300 hover:scale-[1.02] border border-white/10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-(--jonquil-400) to-(--jonquil-600) flex items-center justify-center text-white text-xl font-bold">
                    AH
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Alex H.</h3>
                    <p className="text-(--silver-300)">Radio Host</p>
                  </div>
                </div>
                <blockquote className="text-lg text-white leading-relaxed mb-6">
                  "TuneSync helps me prepare my radio shows seamlessly. I can
                  create playlists on any platform and know they'll be ready on
                  our station's system. A real time-saver for broadcast
                  professionals."
                </blockquote>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-white/5">
                    Broadcaster
                  </Badge>
                  <Badge variant="outline" className="bg-white/5">
                    Media Pro
                  </Badge>
                </div>
              </div>
            </div>

            {/* Testimonial Card */}
            <div className="group">
              <div className="bg-(--background-dark) rounded-3xl p-8 h-full transform transition-all duration-300 hover:scale-[1.02] border border-white/10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-(--honeysuckle-300) to-(--honeysuckle-500) flex items-center justify-center text-white text-xl font-bold">
                    RM
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Rachel M.</h3>
                    <p className="text-(--silver-300)">Fitness Instructor</p>
                  </div>
                </div>
                <blockquote className="text-lg text-white leading-relaxed mb-6">
                  "Creating workout playlists used to take forever because my
                  clients use different music services. TuneSync lets me create
                  once and share everywhere. My clients love having the same
                  playlist regardless of their preferred platform."
                </blockquote>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-white/5">
                    Fitness Pro
                  </Badge>
                  <Badge variant="outline" className="bg-white/5">
                    Business User
                  </Badge>
                </div>
              </div>
            </div>

            {/* Testimonial Card */}
            <div className="group">
              <div className="bg-(--background-dark) rounded-3xl p-8 h-full transform transition-all duration-300 hover:scale-[1.02] border border-white/10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-(--jonquil-200) to-(--jonquil-400) flex items-center justify-center text-white text-xl font-bold">
                    KT
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Kevin T.</h3>
                    <p className="text-(--silver-300)">Music Student</p>
                  </div>
                </div>
                <blockquote className="text-lg text-white leading-relaxed mb-6">
                  "Perfect for my music theory studies. I can organize pieces by
                  composer, period, or technique, and access them on whatever
                  platform I'm using that day."
                </blockquote>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-white/5">
                    Student
                  </Badge>
                  <Badge variant="outline" className="bg-white/5">
                    Classical
                  </Badge>
                </div>
              </div>
            </div>

            {/* Testimonial Card */}
            <div className="group">
              <div className="bg-(--background-dark) rounded-3xl p-8 h-full transform transition-all duration-300 hover:scale-[1.02] border border-white/10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-(--honeysuckle-200) to-(--honeysuckle-400) flex items-center justify-center text-white text-xl font-bold">
                    LC
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Lisa C.</h3>
                    <p className="text-(--silver-300)">Event Planner</p>
                  </div>
                </div>
                <blockquote className="text-lg text-white leading-relaxed mb-6">
                  "TuneSync is a lifesaver for event planning. I can prepare
                  different playlists for various parts of an event and share
                  them with venues and DJs regardless of their preferred
                  platform."
                </blockquote>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-white/5">
                    Events
                  </Badge>
                  <Badge variant="outline" className="bg-white/5">
                    Professional
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* pricing section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-(--background-light) min-h-screen overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 font-satoshi">
            Choose Your Plan
          </h2>
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 p-2 bg-(--background-dark) rounded-full border border-white/10">
              <button className="px-4 py-2 rounded-full text-(--silver-300) hover:text-white transition-colors billing-toggle-active">
                Monthly
              </button>
              <button className="px-4 py-2 rounded-full text-(--silver-300) hover:text-white transition-colors">
                Annual
              </button>
            </div>
            <p className="text-(--silver-300) mt-4 mb-8">
              Save 20% with annual billing
            </p>
          </div>
          <div className="flex justify-center items-center relative">
            <div className="p-10 rounded-4xl bg-(--background-dark) border border-white/10 w-[420px] transform transition-transform hover:scale-[1.02] relative z-0">
              <div className="flex flex-col items-start justify-center">
                <h3 className="text-3xl font-bold text-(--silver-100) mb-6 text-left font-satoshi">
                  Get Started
                </h3>
                <div className="flex flex-col items-start justify-center">
                  <ul className="list-none list-inside text-(--silver-300) space-y-4">
                    <li className="flex items-center gap-2">
                      <MdPlaylistAdd className="w-5 h-5 text-(--honeysuckle-150)" />
                      5 playlist conversions per month
                    </li>
                    <li className="flex items-center gap-2">
                      <MdMusicNote className="w-5 h-5 text-(--honeysuckle-150)" />
                      Up to 50 songs per playlist
                    </li>
                    <li className="flex items-center gap-2">
                      <MdEqualizer className="w-5 h-5 text-(--honeysuckle-150)" />
                      Basic matching algorithm
                    </li>
                    <li className="flex items-center gap-2">
                      <MdEmail className="w-5 h-5 text-(--honeysuckle-150)" />
                      Email support
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col items-start justify-center mt-10">
                  <h5 className="text-(--silver-100) mb-2 text-left font-satoshi text-5xl font-bold">
                    $0
                  </h5>
                  <p className="text-(--silver-300) mb-2 text-left font-satoshi">
                    Forever Free
                  </p>
                  <Button
                    variant="cta"
                    size="xl"
                    className="mt-6 w-full rounded-full"
                  >
                    Start Free
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-12 rounded-4xl bg-(--background-dark) border-2 border-(--honeysuckle-150) w-[480px] relative transform -translate-y-6 -translate-x-12 transition-all hover:scale-[1.02] shadow-[0_0_40px_-15px_rgba(255,182,193,0.3)] z-10">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-(--honeysuckle-150) text-(--honeysuckle-950) px-6 py-1.5 rounded-full text-md font-medium">
                Most Popular
              </div>
              <div className="flex flex-col items-start justify-center">
                <h3 className="text-5xl font-bold text-(--silver-100) mb-6 text-left font-satoshi">
                  Go Unlimited
                </h3>
                <div className="flex flex-col items-start justify-center">
                  <ul className="list-none list-inside text-(--silver-300) space-y-4 text-md font-medium">
                    <li className="flex items-center gap-2">
                      <MdPlaylistAdd className="w-5 h-5 text-(--honeysuckle-150)" />
                      Unlimited playlist conversions
                    </li>
                    <li className="flex items-center gap-2">
                      <MdMusicNote className="w-5 h-5 text-(--honeysuckle-150)" />
                      Unlimited songs per playlist
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-(--honeysuckle-150)" />
                      Advanced AI matching
                    </li>
                    <li className="flex items-center gap-2">
                      <MdSyncAlt className="w-5 h-5 text-(--honeysuckle-150)" />
                      Auto-sync across all platforms
                    </li>
                    <li className="flex items-center gap-2">
                      <MdSupportAgent className="w-5 h-5 text-(--honeysuckle-150)" />
                      Priority support
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col items-start justify-center mt-10">
                  <div className="flex items-end gap-2">
                    <h5 className="text-(--silver-100) text-left font-satoshi text-6xl font-bold">
                      $9
                    </h5>
                    <span className="text-(--silver-300) mb-1">/month</span>
                  </div>
                  <p className="text-(--silver-300) text-left font-satoshi">
                    billed monthly
                  </p>
                  <Button
                    variant="cta"
                    size="xl"
                    className="mt-6 w-full rounded-full"
                  >
                    Upgrade Now
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <p className="text-(--silver-400) text-left font-satoshi text-sm mt-2">
                    Cancel anytime
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="inline-block px-6 py-3 bg-(--background-dark) rounded-full border border-white/10 text-(--silver-100)">
              🎵 Limited Time: Get 30% off your first year with code{" "}
              <span className="font-mono font-bold text-(--honeysuckle-150)">
                MUSIC30
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-(--background-light)">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 font-satoshi">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="p-6 rounded-2xl bg-(--background-dark) border border-white/10 [&[data-state=open]]:rounded-b-none hover:no-underline">
                <div className="flex items-center gap-2 text-left">
                  <MdMusicNote className="text-(--honeysuckle-150) w-5 h-5 flex-shrink-0" />
                  <h3 className="text-xl font-bold text-(--silver-100) font-satoshi">
                    How does TuneSync work?
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-3 bg-(--background-dark) border border-t-0 border-white/10 rounded-b-2xl">
                <p className="text-(--silver-300) text-lg">
                  TuneSync automatically syncs your playlists across different
                  music platforms. Simply connect your accounts, select the
                  playlists you want to sync, and we'll handle the rest -
                  keeping your music in harmony across all services.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-none">
              <AccordionTrigger className="p-6 rounded-2xl bg-(--background-dark) border border-white/10 [&[data-state=open]]:rounded-b-none hover:no-underline">
                <div className="flex items-center gap-2 text-left">
                  <MdSyncAlt className="text-(--honeysuckle-150) w-5 h-5 flex-shrink-0" />
                  <h3 className="text-xl font-bold text-(--silver-100) font-satoshi">
                    Which platforms are supported?
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-3 bg-(--background-dark) border border-t-0 border-white/10 rounded-b-2xl">
                <p className="text-(--silver-300) text-lg">
                  We currently support Spotify, Apple Music, YouTube Music,
                  Amazon Music, Deezer, Tidal and SoundCloud. We're constantly
                  working on adding more platforms to ensure your music is
                  available everywhere you listen.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-none">
              <AccordionTrigger className="p-6 rounded-2xl bg-(--background-dark) border border-white/10 [&[data-state=open]]:rounded-b-none hover:no-underline">
                <div className="flex items-center gap-2 text-left">
                  <MdSupportAgent className="text-(--honeysuckle-150) w-5 h-5 flex-shrink-0" />
                  <h3 className="text-xl font-bold text-(--silver-100) font-satoshi">
                    What if a song isn't available on all platforms?
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-3 bg-(--background-dark) border border-t-0 border-white/10 rounded-b-2xl">
                <p className="text-(--silver-300) text-lg">
                  TuneSync uses advanced matching algorithms to find the closest
                  match for your songs across platforms. If a song isn't
                  available, we'll notify you and suggest the best alternative
                  to keep your playlist complete.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-none">
              <AccordionTrigger className="p-6 rounded-2xl bg-(--background-dark) border border-white/10 [&[data-state=open]]:rounded-b-none hover:no-underline">
                <div className="flex items-center gap-2 text-left">
                  <MdPlaylistAdd className="text-(--honeysuckle-150) w-5 h-5 flex-shrink-0" />
                  <h3 className="text-xl font-bold text-(--silver-100) font-satoshi">
                    Can I sync my existing playlists?
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-3 bg-(--background-dark) border border-t-0 border-white/10 rounded-b-2xl">
                <p className="text-(--silver-300) text-lg">
                  Yes! You can sync any of your existing playlists from any
                  supported platform. Whether it's your workout mix or your
                  favorite study playlist, TuneSync makes it available
                  everywhere.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-(--background-dark) border-t border-white/10">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {/* Logo Column */}
            <div className="col-span-2">
              <Logo />
              <p className="mt-4 text-(--silver-300) max-w-xs">
                Keep your music in harmony across all your favorite streaming
                platforms.
              </p>
            </div>

            {/* Links Column */}
            <div className="col-span-1">
              <h3 className="text-sm font-semibold text-(--silver-200) tracking-wider uppercase mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-(--silver-300) hover:text-(--honeysuckle-150) transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-(--silver-300) hover:text-(--honeysuckle-150) transition-colors"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-1">
              <h3 className="text-sm font-semibold text-(--silver-200) tracking-wider uppercase mb-4">
                Support
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-(--silver-300) hover:text-(--honeysuckle-150) transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-(--silver-300) hover:text-(--honeysuckle-150) transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-1">
              <h3 className="text-sm font-semibold text-(--silver-200) tracking-wider uppercase mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-(--silver-300) hover:text-(--honeysuckle-150) transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-(--silver-300) hover:text-(--honeysuckle-150) transition-colors"
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="col-span-1">
              <h3 className="text-sm font-semibold text-(--silver-200) tracking-wider uppercase mb-4">
                Social
              </h3>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/colmanluiz"
                  className="text-(--silver-300) hover:text-(--honeysuckle-150) transition-colors"
                >
                  <span className="sr-only">GitHub</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/luiz-henrique-colman-6a04bb257/"
                  className="text-(--silver-300) hover:text-(--honeysuckle-150) transition-colors"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-center text-(--silver-400) text-sm">
              © 2025 TuneSync. A project by{" "}
              <a
                href="https://github.com/colmanluiz"
                className="text-(--honeysuckle-150) font-bold hover:text-(--honeysuckle-200) transition-colors"
              >
                Luiz Colman
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
