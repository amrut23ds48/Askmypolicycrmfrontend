import { Link } from "react-router";
<img src="/images/logo.png" />
import { 
  Users, 
  FileText, 
  ClipboardList, 
  CheckSquare, 
  BarChart3, 
  Shield,
  Clock,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Users,
      title: "Client Management CRM",
      description: "Organize and track all your clients in one centralized dashboard with smart insights"
    },
    {
      icon: FileText,
      title: "Policy Management",
      description: "Manage policies, track renewals, and never miss important expiration dates"
    },
    {
      icon: ClipboardList,
      title: "Claims Tracker",
      description: "Monitor claim status, documents, and approvals in real-time"
    },
    {
      icon: CheckSquare,
      title: "Task & Follow-up System",
      description: "Automated reminders and task management to stay on top of your workflow"
    },
    {
      icon: BarChart3,
      title: "Reports & Analytics Dashboard",
      description: "Data-driven insights with beautiful charts and comprehensive reports"
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "IRDAI-verified platform with enterprise-grade security"
    }
  ];

  const stats = [
    { value: "10,000+", label: "Active Advisors" },
    { value: "500K+", label: "Clients Managed" },
    { value: "₹5000Cr+", label: "Policies Tracked" },
    { value: "99.9%", label: "Uptime" }
  ];

  const benefits = [
    "Automated policy renewal reminders",
    "AI-powered client insights",
    "Mobile-friendly interface",
    "Real-time claim tracking",
    "Custom report generation",
    "Multi-language support"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img src="/images/logo.png" alt="Ask My Policy" className="h-10" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Benefits
              </a>
              <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
              <Link 
                to="/login" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-accent"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-3 border-t border-border">
              <a href="#features" className="block text-sm text-muted-foreground hover:text-foreground">
                Features
              </a>
              <a href="#benefits" className="block text-sm text-muted-foreground hover:text-foreground">
                Benefits
              </a>
              <a href="#about" className="block text-sm text-muted-foreground hover:text-foreground">
                About
              </a>
              <a href="#contact" className="block text-sm text-muted-foreground hover:text-foreground">
                Contact
              </a>
              <Link to="/login" className="block text-sm text-muted-foreground hover:text-foreground">
                Login
              </Link>
              <Link 
                to="/signup" 
                className="block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm text-center"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm text-primary mb-6">
              <Sparkles className="size-4" />
              <span>Trusted by 10,000+ Insurance Professionals</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              The Smart CRM for Financial Advisors & Insurance Professionals
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Manage clients, policies, claims, follow-ups, and reports in one professional platform 
              designed for insurance advisors and financial consultants.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/signup" 
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg text-lg hover:opacity-90 transition-opacity flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Create Free Account
                <ArrowRight className="size-5" />
              </Link>
              <Link 
                to="/login" 
                className="px-8 py-4 bg-card border border-border rounded-lg text-lg hover:bg-accent transition-colors w-full sm:w-auto text-center"
              >
                Login
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <span>IRDAI Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <span>Bank-Grade Security</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Grow Your Practice
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed specifically for insurance and financial advisors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow"
                >
                  <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="size-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="bg-card py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Built for Modern Insurance Professionals
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Save time, increase productivity, and provide better service to your clients with our comprehensive platform.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link 
                  to="/signup" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Get Started Free
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 border border-border">
                <div className="space-y-4">
                  <div className="bg-background rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="size-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                        <div className="text-xl font-bold">₹84,250</div>
                      </div>
                    </div>
                    <div className="text-xs text-green-500 flex items-center gap-1">
                      <TrendingUp className="size-3" />
                      +18.2% vs last month
                    </div>
                  </div>
                  <div className="bg-background rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Users className="size-5 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Active Clients</div>
                        <div className="text-xl font-bold">16,341</div>
                      </div>
                    </div>
                    <div className="text-xs text-green-500 flex items-center gap-1">
                      <TrendingUp className="size-3" />
                      +15.3% growth
                    </div>
                  </div>
                  <div className="bg-background rounded-lg p-4 border border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="size-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <FileText className="size-5 text-green-500" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Active Policies</div>
                        <div className="text-xl font-bold">125</div>
                      </div>
                    </div>
                    <div className="text-xs text-green-500 flex items-center gap-1">
                      <TrendingUp className="size-3" />
                      +2.3% this week
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Advisory Practice?
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Join thousands of insurance professionals who trust Ask My Policy for their business management
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/signup" 
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg text-lg hover:opacity-90 transition-opacity flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Start Free Trial
              <ArrowRight className="size-5" />
            </Link>
            <a 
              href="#contact" 
              className="px-8 py-4 bg-card border border-border rounded-lg text-lg hover:bg-accent transition-colors w-full sm:w-auto text-center"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <img src={logoImage} alt="Ask My Policy" className="h-10 mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                The leading CRM platform for insurance advisors, financial consultants, and wealth managers across India.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="size-4" />
                <span>IRDAI Verified Platform</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#about" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#contact" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Ask My Policy. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">support@askmypolicy.com</a>
              <span>|</span>
              <a href="#" className="hover:text-foreground transition-colors">+91 98765 43210</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
