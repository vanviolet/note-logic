import { Link } from "react-router";
import { Card, CardContent } from "./templates/components/ui/card";
import { Button } from "./templates/components/ui/button";
import { Home, ArrowLeft, AlertCircle } from "lucide-react";

export default function CatchAll() {
  return (
    <div className="pt-20 w-full flex items-center justify-center  p-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Animated 404 */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          </div>
          <div className="relative">
            <h1 className="text-[12rem] font-black leading-none bg-linear-to-br from-primary via-primary/80 to-primary/40 bg-clip-text text-transparent select-none">
              404
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <AlertCircle className="size-24 text-primary/20 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Content Card */}
        <Card className="border-2 shadow-xl bg-card/95 backdrop-blur-sm">
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-foreground">
                Halaman Tidak Ditemukan
              </h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
                Mari kembali ke jalur yang benar!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
              <Link to="/">
                <Button size="lg" className="w-full sm:w-auto min-w-40">
                  <Home />
                  Kembali ke Home
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto min-w-40"
                onClick={() => window.history.back()}
              >
                <ArrowLeft />
                Halaman Sebelumnya
              </Button>
            </div>

            {/* Decorative Elements */}
            <div className="pt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <div className="h-px w-16 bg-border" />
              <span>Error Code: 404</span>
              <div className="h-px w-16 bg-border" />
            </div>
          </CardContent>
        </Card>

        {/* Helpful Links */}
        <div className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
          <Link
            to="/"
            className="hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Home className="size-3.5" />
            Beranda
          </Link>
          <span className="text-border">•</span>
          <button
            onClick={() => window.history.back()}
            className="hover:text-foreground transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="size-3.5" />
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
