import Link from "next/link";
import {
  ArrowRight,
  Layers,
  MousePointerClick,
  Palette,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";
import { MarketingNavbar } from "@/components/layout/marketing-navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: MousePointerClick,
    title: "Drag & Drop Editor",
    description:
      "Build pages visually with an Elementor-inspired editor. Sections, columns, and widgets at your fingertips.",
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description:
      "Design for desktop, tablet, and mobile with device-specific controls and live preview.",
  },
  {
    icon: Palette,
    title: "Full Style Control",
    description:
      "Typography, spacing, colors, borders, and effects — all configurable from the properties panel.",
  },
  {
    icon: Zap,
    title: "JSON-Driven Rendering",
    description:
      "Every page is stored as a JSON tree and rendered recursively for maximum flexibility.",
  },
  {
    icon: Layers,
    title: "Widget Registry",
    description:
      "Extensible widget system where new widgets register themselves without editor modifications.",
  },
  {
    icon: Sparkles,
    title: "Publish & Version",
    description:
      "Save drafts, publish pages, and maintain revision history with one-click rollback.",
  },
];

const steps = [
  {
    step: "01",
    title: "Create a project",
    description: "Organize your websites into projects with multiple pages.",
  },
  {
    step: "02",
    title: "Design visually",
    description: "Drag widgets onto the canvas and customize every detail.",
  },
  {
    step: "03",
    title: "Publish instantly",
    description: "Preview your work and publish with versioning built in.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <MarketingNavbar />

      <section className="container mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            Visual website builder
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Build stunning websites{" "}
            <span className="text-primary">without code</span>
          </h1>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            PageCraft is a production-ready visual page builder with drag-and-drop
            editing, responsive controls, and a JSON-driven render engine.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/login">
                Start building
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Explore features</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="border-t bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Everything you need to build
            </h2>
            <p className="text-muted-foreground">
              A complete website builder with editor, renderer, and dashboard —
              built for production from day one.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border bg-card/50 backdrop-blur">
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              How it works
            </h2>
            <p className="text-muted-foreground">
              From project creation to published page in three simple steps.
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {steps.map((item) => (
              <Card key={item.step} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-2 text-3xl font-bold text-primary">
                    {item.step}
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to build?</h2>
          <p className="mb-8 text-primary-foreground/80">
            Sign in and create your first project in minutes.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/login">
              Get started free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Layers className="h-4 w-4" />
            PageCraft
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PageCraft. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
