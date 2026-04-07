import { useState } from "react";
import { User, Bell, Palette, Download, Save, Mail, Phone, MapPin, Briefcase, Upload, Award, Globe, Languages } from "lucide-react";

export function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const toggleTheme = (isDark: boolean) => {
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const tabs = [
    { id: "profile", label: "Profile Information" },
    { id: "professional", label: "Professional Details" },
    { id: "notifications", label: "Notifications" },
    { id: "appearance", label: "Appearance" },
    { id: "data", label: "Data Management" },
  ];

  const specializations = [
    "Health Insurance",
    "Life Insurance",
    "Motor Insurance",
    "Travel Insurance",
    "Corporate Insurance",
  ];

  const companies = [
    "HDFC ERGO",
    "ICICI Lombard",
    "Star Health",
    "LIC",
    "Bajaj Allianz",
    "Max Life",
    "SBI General",
  ];

  const languages = [
    "English",
    "Hindi",
    "Marathi",
    "Tamil",
    "Telugu",
    "Bengali",
    "Gujarati",
    "Kannada",
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your account preferences and settings</p>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="border-b border-border">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Profile Information Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Profile Information</h3>
                  <p className="text-sm text-muted-foreground">Update your personal details</p>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-6">
                <div className="size-24 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-3xl text-primary-foreground font-semibold">JD</span>
                </div>
                <div>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm mb-2 flex items-center gap-2">
                    <Upload className="size-4" />
                    Upload Photo
                  </button>
                  <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Job Title</label>
                  <input
                    type="text"
                    defaultValue="Financial Advisor"
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="email"
                      defaultValue="john.doe@askmypolicy.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="tel"
                      defaultValue="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Office Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <textarea
                      defaultValue="123 Business Center, Suite 400, Mumbai, Maharashtra 400001"
                      rows={3}
                      className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Company Name</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      defaultValue="Ask My Policy Financial Services"
                      className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Short Bio / About</label>
                  <textarea
                    placeholder="Tell clients about yourself and your expertise..."
                    rows={4}
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    This will appear on your public advisor profile
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                  <Save className="size-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Professional Details Tab */}
          {activeTab === "professional" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-950/20 rounded-lg">
                  <Award className="size-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Professional Information</h3>
                  <p className="text-sm text-muted-foreground">Manage your credentials and expertise</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">IRDAI License Number</label>
                  <input
                    type="text"
                    defaultValue="DB 654321/2020"
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Years of Experience</label>
                  <input
                    type="number"
                    defaultValue="8"
                    min="0"
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Upload IRDAI License Certificate</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="size-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PDF, JPG or PNG (max. 5MB)</p>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Specialization</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {specializations.map((spec) => (
                      <label key={spec} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="size-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-sm">{spec}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Companies You Work With</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {companies.map((company) => (
                      <label key={company} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="size-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-sm">{company}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">City</label>
                  <input
                    type="text"
                    defaultValue="Mumbai"
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">State</label>
                  <input
                    type="text"
                    defaultValue="Maharashtra"
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Country</label>
                  <input
                    type="text"
                    defaultValue="India"
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Languages Spoken</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {languages.map((lang) => (
                      <label key={lang} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="size-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-sm">{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                  <Save className="size-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Notification Preferences Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 dark:bg-orange-950/20 rounded-lg">
                  <Bell className="size-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Notification Preferences</h3>
                  <p className="text-sm text-muted-foreground">Choose how you want to be notified</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive email updates about your clients and policies</p>
                  </div>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      emailNotifications ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 size-5 bg-white rounded-full transition-transform ${
                        emailNotifications ? "translate-x-6" : ""
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Get push notifications for important updates</p>
                  </div>
                  <button
                    onClick={() => setPushNotifications(!pushNotifications)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      pushNotifications ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 size-5 bg-white rounded-full transition-transform ${
                        pushNotifications ? "translate-x-6" : ""
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive text messages for urgent matters</p>
                  </div>
                  <button
                    onClick={() => setSmsNotifications(!smsNotifications)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      smsNotifications ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 size-5 bg-white rounded-full transition-transform ${
                        smsNotifications ? "translate-x-6" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Theme Preferences Tab */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-950/20 rounded-lg">
                  <Palette className="size-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Theme Preferences</h3>
                  <p className="text-sm text-muted-foreground">Customize your dashboard appearance</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => toggleTheme(false)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    !darkMode
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="aspect-video bg-white rounded-lg mb-4 border border-border flex items-center justify-center">
                    <div className="text-center">
                      <div className="size-12 bg-orange-500 rounded-lg mx-auto mb-2"></div>
                      <p className="text-xs text-gray-600">Light Theme</p>
                    </div>
                  </div>
                  <p className="font-medium text-center">Bright Orange + White</p>
                  <p className="text-sm text-muted-foreground text-center mt-1">Perfect for daytime use</p>
                </button>

                <button
                  onClick={() => toggleTheme(true)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    darkMode
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="aspect-video bg-gray-900 rounded-lg mb-4 border border-border flex items-center justify-center">
                    <div className="text-center">
                      <div className="size-12 bg-green-700 rounded-lg mx-auto mb-2"></div>
                      <p className="text-xs text-gray-300">Dark Theme</p>
                    </div>
                  </div>
                  <p className="font-medium text-center">Sage Green + Black</p>
                  <p className="text-sm text-muted-foreground text-center mt-1">Easy on the eyes at night</p>
                </button>
              </div>
            </div>
          )}

          {/* Data Management Tab */}
          {activeTab === "data" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-cyan-100 dark:bg-cyan-950/20 rounded-lg">
                  <Download className="size-5 text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Data Management</h3>
                  <p className="text-sm text-muted-foreground">Export and manage your data</p>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full p-4 rounded-lg border border-border hover:bg-accent transition-colors text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Export All Data</p>
                      <p className="text-sm text-muted-foreground">Download a complete backup of your data</p>
                    </div>
                    <Download className="size-5 text-muted-foreground" />
                  </div>
                </button>

                <button className="w-full p-4 rounded-lg border border-border hover:bg-accent transition-colors text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Export Client List</p>
                      <p className="text-sm text-muted-foreground">Download all client information as CSV</p>
                    </div>
                    <Download className="size-5 text-muted-foreground" />
                  </div>
                </button>

                <button className="w-full p-4 rounded-lg border border-border hover:bg-accent transition-colors text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Export Policy Records</p>
                      <p className="text-sm text-muted-foreground">Download all policy data and documents</p>
                    </div>
                    <Download className="size-5 text-muted-foreground" />
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-6 border border-red-200 dark:border-red-900">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">Irreversible actions that affect your account</p>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors">
            Delete All Data
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}