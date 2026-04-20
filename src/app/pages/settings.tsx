import { useState, useEffect, useRef } from "react";
import { User, Bell, Palette, Download, Save, Mail, Phone, MapPin, Briefcase, Upload, Award, Globe, Languages, Video, FileCheck, X, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingProfessional, setIsEditingProfessional] = useState(false);
  
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    shortBio: "",
    profileUrl: "",
    jobTitle: "Financial Advisor",
  });

  const [professionalData, setProfessionalData] = useState({
    irdaiLicense: "",
    experience: "",
    companyName: "",
    certUrl: "",
    aadharUrl: "",
    videoUrl: "",
    specializationId: "",
    languages: [] as string[],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        fetchUserData();
      }
    });

    fetchUserData();
    
    return () => subscription.unsubscribe();
  }, []);
  const fetchUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;
      setUser(authUser);

      // 1. Fetch Advisor data
      const { data: advisorDataArray, error: advisorError } = await supabase
        .from("advisors")
        .select("*")
        .eq("id", authUser.id)
        .limit(1);

      const advisor = (advisorDataArray && advisorDataArray.length > 0) ? advisorDataArray[0] : null;
      if (advisorError) console.error("Advisor fetch error:", advisorError);

      // 2. Fetch Role
      let roleName = "Financial Advisor";
      if (advisor?.role_id) {
        const { data: roleData } = await supabase
          .from("roles")
          .select("name")
          .eq("id", advisor.role_id)
          .maybeSingle();
        if (roleData) roleName = roleData.name;
      }

      // 3. Fetch Profile data - Try advisor_id then id as fallback
      let profileDataRaw = null;
      
      const { data: profilesByAdvisorId } = await supabase
        .from("profiles")
        .select("*")
        .eq("advisor_id", authUser.id)
        .limit(1);
      
      if (profilesByAdvisorId && profilesByAdvisorId.length > 0) {
        profileDataRaw = profilesByAdvisorId[0];
      } else {
        // Fallback: try by id
        const { data: profilesById } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .limit(1);
        if (profilesById && profilesById.length > 0) profileDataRaw = profilesById[0];
      }

      // 4. Fetch Company data with company name join
      const { data: companies } = await supabase
        .from("advisor_companies")
        .select("*, insurance_companies(company_name)")
        .eq("advisor_id", authUser.id)
        .limit(1);
      
      const company = (companies && companies.length > 0) ? companies[0] : null;

      // 5. Update state with all available info
      setProfileData({
        fullName: advisor?.full_name || authUser?.user_metadata?.full_name || "Sana Shaikh",
        email: advisor?.email || authUser?.email || "",
        phone: advisor?.mobile_number || "",
        address: profileDataRaw?.address || "",
        city: profileDataRaw?.city || "",
        state: profileDataRaw?.state || "",
        shortBio: profileDataRaw?.short_bio || "",
        profileUrl: profileDataRaw?.profile_url || "",
        jobTitle: roleName,
      });

      setProfessionalData({
        irdaiLicense: advisor?.irdai_licence || "",
        experience: profileDataRaw?.experience_years?.toString() || "",
        companyName: (company?.insurance_companies as any)?.company_name || "", 
        certUrl: profileDataRaw?.certificate_url || "",
        aadharUrl: profileDataRaw?.aadhar_url || "", 
        videoUrl: profileDataRaw?.video_url || profileDataRaw?.verification_url || "",
        specializationId: "", 
        languages: profileDataRaw?.languages_spoken?.split(",")?.filter(Boolean) || [],
      });

      // 6. Specialization
      if (advisor?.specialization_id) {
        const { data: spec } = await supabase
          .from("specializations")
          .select("name")
          .eq("id", advisor.specialization_id)
          .maybeSingle();
        if (spec) {
          setProfessionalData(prev => ({ ...prev, specializationId: spec.name }));
        }
      }

    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setSaving(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("advisor-assets")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("advisor-assets")
        .getPublicUrl(filePath);

      if (type === "profile-pic") {
        setProfileData(prev => ({ ...prev, profileUrl: publicUrl }));
        await supabase.from("profiles").upsert({
          advisor_id: user.id,
          profile_url: publicUrl
        });
      } else if (type === "irdai_cert") {
        setProfessionalData(prev => ({ ...prev, certUrl: publicUrl }));
        await supabase.from("profiles").upsert({
          advisor_id: user.id,
          certificate_url: publicUrl
        });
      } else if (type === "aadhar") {
        setProfessionalData(prev => ({ ...prev, aadharUrl: publicUrl }));
        await supabase.from("profiles").upsert({
          advisor_id: user.id,
          aadhar_url: publicUrl
        });
      } else if (type === "verification_video") {
        setProfessionalData(prev => ({ ...prev, videoUrl: publicUrl }));
        await supabase.from("profiles").upsert({
          advisor_id: user.id,
          video_url: publicUrl
        });
      }

      toast.success(`${type.replace('_', ' ')} uploaded successfully`);
    } catch (err: any) {
      toast.error(`Error uploading file: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // Update Advisor
      await supabase.from("advisors").update({
        full_name: profileData.fullName,
        mobile_number: profileData.phone,
      }).eq("id", user.id);

      // Update Profile
      await supabase.from("profiles").upsert({
        advisor_id: user.id,
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
        short_bio: profileData.shortBio,
      });

      // Update Company
      // Moved to professional save

      toast.success("Personal info updated");
      setIsEditingProfile(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDocumentClick = (type: string, url: string) => {
    if (url) {
      window.open(url, '_blank');
      return;
    }
    if (!isEditingProfessional) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    if (type === "verification_video") {
      input.accept = "video/*";
    } else {
      input.accept = "image/*,application/pdf";
    }
    input.onchange = (e: any) => handleFileUpload(e, type);
    input.click();
  };

  const handleSaveProfessional = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // 1. Get Specialization ID for the selected name
      let specId = null;
      if (professionalData.specializationId) {
        const { data: specData } = await supabase
          .from("specializations")
          .select("id")
          .eq("name", professionalData.specializationId)
          .single();
        specId = specData?.id;
      }

      // Update Advisor Specialization
      await supabase.from("advisors").update({
        specialization_id: specId
      }).eq("id", user.id);

      // Update Profile Languages and Experience
      await supabase.from("profiles").upsert({
        advisor_id: user.id,
        experience_years: parseInt(professionalData.experience) || 0,
        languages_spoken: professionalData.languages.join(","),
        certificate_url: professionalData.certUrl,
      });

      // Update Company - look up UUID from insurance_companies by name
      if (professionalData.companyName) {
        const { data: companyData } = await supabase
          .from("insurance_companies")
          .select("id")
          .eq("company_name", professionalData.companyName)
          .maybeSingle();

        if (companyData) {
          await supabase.from("advisor_companies").upsert({
            advisor_id: user.id,
            company_id: companyData.id,
            contact_email: profileData.email,
            contact_no: profileData.phone,
          });
        }
      }

      toast.success("Profile updated");
      setIsEditingProfessional(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleLanguage = (lang: string) => {
    if (!isEditingProfessional) return;
    setProfessionalData(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const removeFile = async (type: string) => {
    if (!user) return;
    try {
      setSaving(true);
      // Optional: Delete from storage too, but for now just clear DB and state
      if (type === "profile-pic") {
        setProfileData(prev => ({ ...prev, profileUrl: "" }));
        await supabase.from("profiles").update({ profile_url: "" }).eq("advisor_id", user.id);
      } else if (type === "irdai_cert") {
        setProfessionalData(prev => ({ ...prev, certUrl: "" }));
        await supabase.from("profiles").update({ certificate_url: "" }).eq("advisor_id", user.id);
      } else if (type === "aadhar") {
        setProfessionalData(prev => ({ ...prev, aadharUrl: "" }));
      } else if (type === "verification_video") {
        setProfessionalData(prev => ({ ...prev, videoUrl: "" }));
      }
      toast.success(`${type.replace('_', ' ')} removed`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

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
                {!isEditingProfile && (
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="ml-auto px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
                  >
                    Update Profile
                  </button>
                )}
              </div>

              <div className="flex items-center gap-6 mb-6">
                <div className="size-24 rounded-full bg-primary flex items-center justify-center overflow-hidden border-2 border-border shadow-sm">
                  {profileData.profileUrl ? (
                    <img src={profileData.profileUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl text-primary-foreground font-semibold">
                      {profileData.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex gap-2 mb-2">
                    <button 
                      onClick={() => isEditingProfile && fileInputRef.current?.click()}
                      disabled={!isEditingProfile}
                      className={`px-4 py-2 bg-primary text-primary-foreground rounded-lg transition-opacity text-sm flex items-center gap-2 ${!isEditingProfile ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}
                    >
                      <Upload className="size-4" />
                      {profileData.profileUrl ? "Change Photo" : "Upload Photo"}
                    </button>
                    {isEditingProfile && profileData.profileUrl && (
                      <button 
                        onClick={() => removeFile("profile-pic")}
                        className="p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
                      >
                        <X className="size-4" />
                      </button>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "profile-pic")}
                  />
                  <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Full Name</label>
                  <p className="text-sm font-medium py-2">{profileData.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Professional Role</label>
                  <p className="text-sm font-medium py-2">{profileData.jobTitle}</p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Email Address</label>
                  <div className="flex items-center gap-2 py-2">
                    <Mail className="size-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{profileData.email}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Phone Number</label>
                  {isEditingProfile ? (
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 py-2">
                      <Phone className="size-4 text-muted-foreground" />
                      <p className="text-sm font-medium">{profileData.phone}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block text-muted-foreground">City</label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                      className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-sm font-medium py-2">{profileData.city || "—"}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block text-muted-foreground">State</label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={profileData.state}
                      onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                      className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-sm font-medium py-2">{profileData.state || "—"}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Address</label>
                  {isEditingProfile ? (
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 py-2">
                      <MapPin className="size-4 text-muted-foreground" />
                      <p className="text-sm font-medium">{profileData.address || "—"}</p>
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Short Bio / About</label>
                  {isEditingProfile ? (
                    <textarea
                      value={profileData.shortBio}
                      onChange={(e) => setProfileData({ ...profileData, shortBio: e.target.value })}
                      placeholder="Tell clients about yourself and your expertise..."
                      rows={4}
                      className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  ) : (
                    <p className="text-sm font-medium py-2 whitespace-pre-wrap">{profileData.shortBio || "No bio added yet."}</p>
                  )}
                </div>
              </div>

              {isEditingProfile && (
                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                    Save Changes
                  </button>
                </div>
              )}
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
                {!isEditingProfessional && (
                  <button 
                    onClick={() => setIsEditingProfessional(true)}
                    className="ml-auto px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
                  >
                    Update Professional Info
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-1.5 block text-muted-foreground">IRDAI License Number</label>
                  <p className="text-sm font-medium py-2">{professionalData.irdaiLicense}</p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Years of Experience</label>
                  {isEditingProfessional ? (
                    <input
                      type="number"
                      value={professionalData.experience}
                      onChange={(e) => setProfessionalData({ ...professionalData, experience: e.target.value })}
                      min="0"
                      className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-sm font-medium py-2">{professionalData.experience} Years</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Company Name</label>
                  {isEditingProfessional ? (
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={professionalData.companyName}
                        onChange={(e) => setProfessionalData({ ...professionalData, companyName: e.target.value })}
                        placeholder="e.g. HDFC ERGO"
                        className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 py-2">
                      <Briefcase className="size-4 text-muted-foreground" />
                      <p className="text-sm font-medium">{professionalData.companyName || "No company added yet."}</p>
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block text-muted-foreground">Specializations</label>
                  {isEditingProfessional ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {specializations.map((spec) => (
                        <label key={spec} className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                          <input
                            type="checkbox"
                            checked={professionalData.specializationId === spec}
                            onChange={() => setProfessionalData({ ...professionalData, specializationId: spec })}
                            className="size-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                          />
                          <span className="text-sm font-medium">{spec}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 py-1">
                      {professionalData.specializationId ? (
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium border border-primary/20">
                          {professionalData.specializationId}
                        </span>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No specialization selected.</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block text-muted-foreground">Verification Documents</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* IRDAI Certificate */}
                    <div className="relative group">
                      <div 
                        onClick={() => handleDocumentClick("irdai_cert", professionalData.certUrl)}
                        className={`border-2 border-dashed border-border rounded-xl p-6 text-center transition-all bg-muted/30 ${!professionalData.certUrl && isEditingProfessional ? "hover:border-primary cursor-pointer" : "cursor-default"}`}
                      >
                        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                          <Award className="size-6 text-primary" />
                        </div>
                        <p className="text-sm font-semibold mb-1">IRDAI Certificate</p>
                        <p className="text-xs text-muted-foreground">{professionalData.certUrl ? "Click to view" : isEditingProfessional ? "Click to upload" : "Not uploaded"}</p>
                      </div>
                      {isEditingProfessional && professionalData.certUrl && (
                        <button 
                          onClick={() => removeFile("irdai_cert")}
                          className="absolute -top-2 -right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-lg hover:bg-destructive/90 transition-colors z-10"
                        >
                          <X className="size-3" />
                        </button>
                      )}
                    </div>

                    {/* Aadhar Card */}
                    <div className="relative group">
                      <div 
                        onClick={() => handleDocumentClick("aadhar", professionalData.aadharUrl)}
                        className={`border-2 border-dashed border-border rounded-xl p-6 text-center transition-all bg-muted/30 ${!professionalData.aadharUrl && isEditingProfessional ? "hover:border-primary cursor-pointer" : "cursor-default"}`}
                      >
                        <div className="size-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                          <FileCheck className="size-6 text-green-600" />
                        </div>
                        <p className="text-sm font-semibold mb-1">Aadhar Card</p>
                        <p className="text-xs text-muted-foreground">{professionalData.aadharUrl ? "Click to view" : isEditingProfessional ? "Click to upload" : "Not uploaded"}</p>
                      </div>
                      {isEditingProfessional && professionalData.aadharUrl && (
                        <button 
                          onClick={() => removeFile("aadhar")}
                          className="absolute -top-2 -right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-lg hover:bg-destructive/90 transition-colors z-10"
                        >
                          <X className="size-3" />
                        </button>
                      )}
                    </div>

                    {/* Verification Video */}
                    <div className="relative group">
                      <div 
                        onClick={() => handleDocumentClick("verification_video", professionalData.videoUrl)}
                        className={`border-2 border-dashed border-border rounded-xl p-6 text-center transition-all bg-muted/30 ${!professionalData.videoUrl && isEditingProfessional ? "hover:border-primary cursor-pointer" : "cursor-default"}`}
                      >
                        <div className="size-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
                          <Video className="size-6 text-blue-600" />
                        </div>
                        <p className="text-sm font-semibold mb-1">Verification Video</p>
                        <p className="text-xs text-muted-foreground">{professionalData.videoUrl ? "Click to view" : isEditingProfessional ? "Click to upload" : "Not uploaded"}</p>
                      </div>
                      {isEditingProfessional && professionalData.videoUrl && (
                        <button 
                          onClick={() => removeFile("verification_video")}
                          className="absolute -top-2 -right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-lg hover:bg-destructive/90 transition-colors z-10"
                        >
                          <X className="size-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block text-muted-foreground">Languages Spoken</label>
                  {isEditingProfessional ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {languages.map((lang) => (
                        <label key={lang} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-muted transition-colors">
                          <input
                            type="checkbox"
                            checked={professionalData.languages.includes(lang)}
                            onChange={() => toggleLanguage(lang)}
                            className="size-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                          />
                          <span className="text-sm">{lang}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 py-1">
                      {professionalData.languages.length > 0 ? professionalData.languages.map(lang => (
                        <span key={lang} className="px-3 py-1 bg-muted text-foreground rounded-full text-xs font-medium border border-border">
                          {lang}
                        </span>
                      )) : (
                        <p className="text-sm text-muted-foreground italic">No languages selected.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {isEditingProfessional && (
                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    onClick={() => setIsEditingProfessional(false)}
                    className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveProfessional}
                    disabled={saving}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                    Save Changes
                  </button>
                </div>
              )}
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