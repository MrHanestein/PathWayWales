-- Create jobs table for Welsh tech jobs
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  city TEXT NOT NULL,
  entry_level TEXT NOT NULL CHECK (entry_level IN ('easy', 'moderate', 'difficult')),
  salary_min INTEGER,
  salary_max INTEGER,
  requirements TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  source TEXT DEFAULT 'manual',
  posted_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  description TEXT,
  lat DECIMAL,
  lng DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  assessment_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Jobs are publicly readable (no auth required to view jobs)
CREATE POLICY "Jobs are viewable by everyone" 
ON public.jobs 
FOR SELECT 
USING (true);

-- Profiles policies - users can only access their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with realistic Welsh tech jobs
INSERT INTO public.jobs (title, company, city, entry_level, salary_min, salary_max, requirements, skills, source, description, lat, lng) VALUES
-- Cardiff Jobs
('IT Support Technician', 'Welsh Government', 'Cardiff', 'easy', 22000, 26000, ARRAY['Basic IT knowledge', 'Good communication', 'Customer service experience'], ARRAY['Windows', 'Office 365', 'Troubleshooting'], 'gov_wales', 'Provide first-line IT support to government staff across Wales.', 51.4816, -3.1791),
('Junior Software Developer', 'Admiral Group', 'Cardiff', 'moderate', 28000, 35000, ARRAY['1+ year coding experience', 'Computer Science degree or equivalent', 'Team player'], ARRAY['JavaScript', 'Python', 'SQL', 'Git'], 'indeed', 'Join our digital team building insurance technology solutions.', 51.4837, -3.1681),
('Data Entry Clerk', 'NHS Wales', 'Cardiff', 'easy', 20000, 23000, ARRAY['Attention to detail', 'Basic computer skills', 'GCSE English'], ARRAY['Excel', 'Data entry', 'Typing'], 'reed', 'Process patient data and maintain accurate health records.', 51.4895, -3.1762),
('Senior Cloud Architect', 'Deloitte Digital', 'Cardiff', 'difficult', 70000, 90000, ARRAY['5+ years cloud experience', 'AWS/Azure certifications', 'Solution architecture background'], ARRAY['AWS', 'Azure', 'Kubernetes', 'Terraform'], 'linkedin', 'Lead cloud transformation projects for enterprise clients.', 51.4780, -3.1825),
('Apprentice Developer', 'Confused.com', 'Cardiff', 'easy', 18000, 22000, ARRAY['Enthusiasm to learn', 'Basic coding knowledge', 'Problem-solving attitude'], ARRAY['HTML', 'CSS', 'JavaScript basics'], 'indeed', 'Start your tech career with our 2-year development apprenticeship.', 51.4650, -3.1655),
('DevOps Engineer', 'GoCompare', 'Cardiff', 'moderate', 45000, 55000, ARRAY['2-3 years DevOps experience', 'CI/CD pipeline experience', 'Scripting skills'], ARRAY['Docker', 'Jenkins', 'Linux', 'Python'], 'reed', 'Build and maintain our deployment infrastructure.', 51.4720, -3.1590),

-- Swansea Jobs
('Help Desk Analyst', 'DVLA', 'Swansea', 'easy', 23000, 27000, ARRAY['Customer service background', 'Basic technical knowledge', 'Problem-solving skills'], ARRAY['ServiceNow', 'Windows', 'Phone support'], 'gov_wales', 'Provide technical support for DVLA digital services.', 51.6214, -3.9436),
('Cyber Security Analyst', 'Amazon Web Services', 'Swansea', 'difficult', 55000, 70000, ARRAY['3+ years security experience', 'CISSP or equivalent', 'Incident response experience'], ARRAY['SIEM', 'Penetration testing', 'Security frameworks'], 'linkedin', 'Protect our cloud infrastructure and customer data.', 51.6195, -3.9485),
('Web Developer', 'Swansea University', 'Swansea', 'moderate', 32000, 40000, ARRAY['2 years web development', 'Portfolio of projects', 'Team collaboration'], ARRAY['React', 'PHP', 'WordPress', 'CSS'], 'university', 'Develop and maintain university web applications.', 51.6107, -3.9790),
('IT Trainee', 'Swansea Council', 'Swansea', 'easy', 19000, 21000, ARRAY['Interest in technology', 'Good attitude', 'Willing to learn'], ARRAY['Basic IT', 'Microsoft Office'], 'gov_wales', 'Start your IT career with local government.', 51.6225, -3.9400),

-- Newport Jobs
('Data Analyst', 'Office for National Statistics', 'Newport', 'moderate', 30000, 38000, ARRAY['Statistics background', 'Data analysis experience', 'Degree level education'], ARRAY['R', 'Python', 'SQL', 'Tableau'], 'gov_wales', 'Analyze UK population and economic data.', 51.5842, -2.9977),
('Junior Data Scientist', 'ONS', 'Newport', 'moderate', 35000, 42000, ARRAY['Machine learning knowledge', 'Programming skills', 'Statistical background'], ARRAY['Python', 'scikit-learn', 'Pandas', 'Statistics'], 'indeed', 'Apply data science to national statistics.', 51.5860, -2.9950),
('Technical Writer', 'Intellectual Property Office', 'Newport', 'easy', 25000, 30000, ARRAY['Excellent writing skills', 'Technical understanding', 'Attention to detail'], ARRAY['Technical writing', 'Documentation', 'Research'], 'reed', 'Create clear documentation for patent systems.', 51.5830, -3.0020),

-- Wrexham Jobs
('Manufacturing IT Support', 'JCB', 'Wrexham', 'easy', 24000, 28000, ARRAY['IT support experience', 'Manufacturing environment preferred', 'Hands-on approach'], ARRAY['Industrial systems', 'Windows', 'Networking'], 'indeed', 'Support IT systems in our manufacturing facility.', 53.0418, -2.9931),
('Cloud Solutions Architect', 'Amazon', 'Wrexham', 'difficult', 75000, 95000, ARRAY['5+ years AWS experience', 'Professional certifications', 'Enterprise experience'], ARRAY['AWS', 'Cloud architecture', 'Solution design'], 'linkedin', 'Design cloud solutions for enterprise customers.', 53.0450, -2.9900),
('Graduate Software Engineer', 'Moneypenny', 'Wrexham', 'moderate', 28000, 32000, ARRAY['Recent CS graduate', 'Programming fundamentals', 'Eager to learn'], ARRAY['JavaScript', 'Node.js', 'React'], 'university', 'Join our tech team building communication platforms.', 53.0480, -3.0010),

-- Bangor Jobs
('Research Software Developer', 'Bangor University', 'Bangor', 'moderate', 33000, 42000, ARRAY['Research environment experience', 'Scientific programming', 'PhD preferred'], ARRAY['Python', 'MATLAB', 'Research computing'], 'university', 'Develop software for academic research projects.', 53.2274, -4.1293),
('IT Technician', 'Betsi Cadwaladr Health Board', 'Bangor', 'easy', 21000, 25000, ARRAY['Basic IT skills', 'NHS experience helpful', 'Patient-focused'], ARRAY['Healthcare IT', 'Windows', 'Support'], 'gov_wales', 'Provide IT support across North Wales hospitals.', 53.2250, -4.1320),

-- Aberystwyth Jobs
('Academic Software Developer', 'Aberystwyth University', 'Aberystwyth', 'moderate', 30000, 38000, ARRAY['Academic environment experience', 'Full-stack development', 'Research skills'], ARRAY['Python', 'JavaScript', 'Linux', 'Git'], 'university', 'Build research and teaching applications.', 52.4153, -4.0829),
('Digital Apprentice', 'Ceredigion Council', 'Aberystwyth', 'easy', 17000, 19000, ARRAY['Local resident preferred', 'Interest in digital', 'Good communication'], ARRAY['Digital skills', 'Social media', 'IT basics'], 'gov_wales', 'Learn digital skills while supporting council services.', 52.4130, -4.0850),

-- Bridgend Jobs
('Network Engineer', 'Sony UK', 'Bridgend', 'moderate', 38000, 48000, ARRAY['CCNA or equivalent', 'Network infrastructure experience', 'Manufacturing environment'], ARRAY['Cisco', 'Networking', 'Firewalls', 'VPNs'], 'indeed', 'Manage network infrastructure for manufacturing.', 51.5079, -3.5768),
('IT Administrator', 'Bridgend Council', 'Bridgend', 'easy', 23000, 27000, ARRAY['Windows Server knowledge', 'Active Directory basics', 'Team player'], ARRAY['Windows Server', 'Active Directory', 'Office 365'], 'gov_wales', 'Administer IT systems for local government.', 51.5050, -3.5780),

-- Merthyr Tydfil Jobs
('Tech Support Specialist', 'General Dynamics', 'Merthyr Tydfil', 'easy', 24000, 29000, ARRAY['Technical aptitude', 'Security clearance eligible', 'Problem solver'], ARRAY['Technical support', 'Secure systems', 'Troubleshooting'], 'indeed', 'Provide tech support for defense systems.', 51.7481, -3.3815),

-- Llandudno Jobs
('Hospitality IT Manager', 'Celtic Collection', 'Llandudno', 'moderate', 35000, 42000, ARRAY['Hospitality IT experience', 'Management skills', 'PMS systems'], ARRAY['Hotel systems', 'POS', 'Network management'], 'reed', 'Manage IT for luxury hotel operations.', 53.3241, -3.8276),

-- Caerphilly Jobs
('Systems Administrator', 'Caerphilly County Council', 'Caerphilly', 'moderate', 32000, 38000, ARRAY['Sysadmin experience', 'Windows/Linux', 'Scripting skills'], ARRAY['Windows Server', 'Linux', 'PowerShell', 'Virtualization'], 'gov_wales', 'Maintain council IT infrastructure.', 51.5783, -3.2180),

-- Port Talbot Jobs
('Industrial Control Systems Engineer', 'Tata Steel', 'Port Talbot', 'difficult', 50000, 65000, ARRAY['ICS/SCADA experience', 'Engineering background', 'Industrial environment'], ARRAY['SCADA', 'PLC', 'Industrial networking'], 'linkedin', 'Manage control systems for steel production.', 51.5906, -3.7985),

-- Neath Jobs
('IT Support Technician', 'Neath Port Talbot Council', 'Neath', 'easy', 22000, 26000, ARRAY['Helpdesk experience', 'Customer service', 'Local area knowledge'], ARRAY['Windows', 'Office 365', 'Remote support'], 'gov_wales', 'First-line IT support for council staff.', 51.6603, -3.8055),

-- Rhyl Jobs
('Digital Marketing Assistant', 'Tourism Wales', 'Rhyl', 'easy', 20000, 24000, ARRAY['Social media savvy', 'Basic design skills', 'Content creation'], ARRAY['Social media', 'Canva', 'Analytics'], 'reed', 'Promote Welsh tourism digitally.', 53.3191, -3.4916),

-- Newtown Jobs
('Software Tester', 'Laura Ashley (Digital)', 'Newtown', 'easy', 25000, 30000, ARRAY['Attention to detail', 'Testing methodology', 'Bug reporting'], ARRAY['Manual testing', 'JIRA', 'Test documentation'], 'indeed', 'Quality assurance for e-commerce platform.', 52.5129, -3.3137),

-- Barry Jobs
('Junior Full Stack Developer', 'Vale of Glamorgan Council', 'Barry', 'moderate', 28000, 34000, ARRAY['Full stack basics', 'Local government interest', 'Team collaboration'], ARRAY['JavaScript', 'Node.js', 'SQL', 'React'], 'gov_wales', 'Develop council digital services.', 51.3998, -3.2683),

-- Colwyn Bay Jobs
('IT Trainer', 'Grwp Llandrillo Menai', 'Colwyn Bay', 'easy', 26000, 32000, ARRAY['Training experience', 'IT knowledge', 'Welsh language desirable'], ARRAY['Training', 'Microsoft Office', 'Presentation skills'], 'university', 'Train students in digital skills.', 53.2946, -3.7256);