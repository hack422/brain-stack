import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaSteam, FaRegComments, FaBrain, FaSyncAlt, FaTelegramPlane, FaLightbulb, FaCode, FaUserShield, FaUsers, FaCogs, FaBook, FaCalculator, FaClock, FaClipboardList, FaUsers as FaEvents } from 'react-icons/fa';
import { MdSecurity } from 'react-icons/md';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import GitHubProjects from '../components/GitHubProjects';


// --- Data for your skills (Best Practice) ---

const technicalSkills = [
  {
    icon: <FaCode className="text-blue-400" />,
    title: 'Programming Languages',
    skills: ['Python', 'HTML', 'JavaScript', 'SQL', 'C++']
  },
  {
    icon: <FaCogs className="text-blue-400" />,
    title: 'Web Development',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express.js']
  },
  {
    icon: <FaTelegramPlane className="text-blue-400" />,
    title: 'Telegram Bot Development',
    skills: ['Telegram Bot API', 'python-telegram-bot', 'Webhook Integration', 'Bot Framework']
  },
  {
    icon: <MdSecurity className="text-blue-400" />,
    title: 'Security & Penetration Testing',
    skills: ['Kali Linux', 'Penetration Testing', 'Security Auditing', 'Ethical Hacking']
  }
];

const softSkills = [
  {
    icon: <FaRegComments className="text-blue-400" />,
    title: 'Communication',
    description: 'Clearly expressing ideas, actively listening, and adapting your message to your audience.'
  },
  {
    icon: <FaUsers className="text-blue-400" />,
    title: 'Teamwork',
    description: 'Collaborating well with others, being supportive, and contributing to a positive group dynamic.'
  },
  {
    icon: <FaBrain className="text-blue-400" />,
    title: 'Problem-Solving',
    description: 'Thinking critically and creatively to overcome obstacles and find effective solutions.'
  },
  {
    icon: <FaSyncAlt className="text-blue-400" />,
    title: 'Adaptability',
    description: 'Staying flexible and open-minded in the face of change or uncertainty.'
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('technical');
  const [showOthersDropdown, setShowOthersDropdown] = useState(false);
  const [projectFilter, setProjectFilter] = useState('All');

  // Define styles for active and inactive buttons to keep JSX clean
  const activeButtonStyle = "bg-blue-700 text-white";
  const inactiveButtonStyle = "bg-[#181828] text-gray-400 hover:bg-[#2a2a3c]";
  const commonButtonStyle = "px-4 py-2 rounded-full font-semibold transition-colors duration-200";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setShowOthersDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Brain Stack - Smart Education Platform | Study Notes, Formulas & More</title>
        <meta name="description" content="Access comprehensive study materials, formulas, timetables, assignments, and events. Smart education platform for students to excel in academics." />
        <meta name="keywords" content="study notes, formulas, timetable, assignments, education, student resources, academic materials" />
        <meta name="author" content="Brain Stack" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://brainstackeducation.in/" />
        <meta property="og:title" content="Brain Stack - Smart Education Platform" />
        <meta property="og:description" content="Access comprehensive study materials, formulas, timetables, assignments, and events. Smart education platform for students." />
        <meta property="og:image" content="https://brainstackeducation.in/bstack.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://brainstackeducation.in/" />
        <meta property="twitter:title" content="Brain Stack - Smart Education Platform" />
        <meta property="twitter:description" content="Access comprehensive study materials, formulas, timetables, assignments, and events." />
        <meta property="twitter:image" content="https://brainstackeducation.in/bstack.png" />

        {/* Additional SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://brainstackeducation.in/" />
        <link rel="icon" href="/favicon.ico" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "Brain Stack",
              "description": "Smart education platform providing study materials, formulas, and academic resources",
              "url": "https://brainstackeducation.in",
              "logo": "https://brainstackeducation.in/bstack.png",
              "sameAs": [
                "https://t.me/your-telegram",
                "https://github.com/hack422"
              ]
            })
          }}
        />
      </Head>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-[#0a0a23] to-[#23234b] flex flex-col justify-center">
        {/* Home/Study Section */}
        <section id="home" className="flex flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto py-16 px-4 lg:px-8 min-h-screen">
          {/* Left: Study Content */}
          <div className="flex-1 text-center lg:text-left mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Study Smart,<br />
              Achieve More
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              Access comprehensive study materials, formulas, and expert-curated content to excel in your academics.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              {/* Study Notes Button */}
              <Link
                href="/materials"
                className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold shadow-lg transition-colors duration-200 w-full sm:w-auto justify-center"
              >
                <FaBook className="text-white" size={20} />
                Study Notes
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              {/* Others Button with Dropdown */}
              <div className="relative dropdown-container w-full sm:w-auto">
                <button
                  onClick={() => setShowOthersDropdown(!showOthersDropdown)}
                  className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold shadow-lg transition-colors duration-200 w-full sm:w-auto justify-center"
                >
                  Others
                  <svg className={`w-5 h-5 transition-transform duration-200 ${showOthersDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showOthersDropdown && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 lg:left-0 lg:transform-none mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 dropdown-container">
                    <div className="py-2">
                      <Link href="/materials?type=pyq" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors">
                        <FaSteam className="text-blue-400" size={20} />
                        <div className="text-left">
                          <div className="font-semibold text-white">PYQs</div>
                          <div className="text-sm text-gray-400">Previous Year Questions</div>
                        </div>
                      </Link>
                      <Link href="/materials?type=ebook" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors">
                        <FaBook className="text-yellow-400" size={20} />
                        <div className="text-left">
                          <div className="font-semibold text-white">E-Books</div>
                          <div className="text-sm text-gray-400">Digital Books</div>
                        </div>
                      </Link>
                      <Link href="/materials?type=formulas" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors">
                        <FaCalculator className="text-green-400" size={20} />
                        <div className="text-left">
                          <div className="font-semibold text-white">Formulas</div>
                          <div className="text-sm text-gray-400">Important Formulas</div>
                        </div>
                      </Link>
                      <Link href="/materials?type=timetable" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors">
                        <FaClock className="text-purple-400" size={20} />
                        <div className="text-left">
                          <div className="font-semibold text-white">Timetable</div>
                          <div className="text-sm text-gray-400">Class Schedule</div>
                        </div>
                      </Link>
                      <Link href="/materials?type=assignments" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors">
                        <FaClipboardList className="text-orange-400" size={20} />
                        <div className="text-left">
                          <div className="font-semibold text-white">Assignments</div>
                          <div className="text-sm text-gray-400">Assignment Portal</div>
                        </div>
                      </Link>
                      <Link href="/materials?type=events" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors">
                        <FaEvents className="text-pink-400" size={20} />
                        <div className="text-left">
                          <div className="font-semibold text-white">Events</div>
                          <div className="text-sm text-gray-400">Campus Events</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Logo */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="bg-white rounded-full shadow-2xl flex items-center justify-center w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80">
              <Image src="/bstack.png" alt="Brain Stack Education" width={240} height={240} className="w-36 h-36 md:w-48 md:h-48 lg:w-60 lg:h-60 object-contain" />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="min-h-screen flex flex-col justify-center bg-gradient-to-b from-[#181828] to-[#23234b] py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center">
              <span className="inline-block bg-blue-900 text-blue-300 px-4 py-1 rounded-full text-sm font-semibold mb-4">About Me</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2 text-center">Who I Am</h2>
              <div className="w-24 h-1 bg-blue-500 rounded-full mb-8"></div>
            </div>
            <div className="md:flex md:space-x-8">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <div className="text-xl font-bold text-blue-400 mb-2">Python Developer & Telegram Bot Specialist</div>
                <p className="text-gray-300 mb-6">I am Pratham Khurana, a passionate Python developer with expertise in Telegram bot development, web technologies, and cybersecurity. I specialize in creating innovative solutions using Python, HTML, and security testing with KALI LINUX.</p>
                <div className="bg-[#181828] rounded-lg p-4 mb-4">
                  <div className="text-blue-400 font-semibold mb-1">Vision Statement</div>
                  <div className="text-gray-300 text-sm">I aim to create impactful technology solutions that solve real-world problems, focusing on bot development, security, and user experience.</div>
                </div>
              </div>
              <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#181828] rounded-lg p-4 flex flex-col items-start">
                  <FaUsers className="text-blue-400 text-2xl mb-2" />
                  <div className="font-semibold text-white">Leadership & Strategy</div>
                  <div className="text-gray-400 text-sm">Proven ability to lead teams and develop effective strategies for growth.</div>
                </div>
                <div className="bg-[#181828] rounded-lg p-4 flex flex-col items-start">
                  <FaCode className="text-blue-400 text-2xl mb-2" />
                  <div className="font-semibold text-white">Python & Bot Development</div>
                  <div className="text-gray-400 text-sm">Expert in Python programming and Telegram bot development.</div>
                </div>
                <div className="bg-[#181828] rounded-lg p-4 flex flex-col items-start">
                  <FaLightbulb className="text-blue-400 text-2xl mb-2" />
                  <div className="font-semibold text-white">Problem-Solving</div>
                  <div className="text-gray-400 text-sm">Innovative approach to complex challenges with creative solutions.</div>
                </div>
                <div className="bg-[#181828] rounded-lg p-4 flex flex-col items-start">
                  <FaUserShield className="text-blue-400 text-2xl mb-2" />
                  <div className="font-semibold text-white">Security & KALI LINUX</div>
                  <div className="text-gray-400 text-sm">Experienced in penetration testing and security auditing using KALI LINUX.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="min-h-screen flex flex-col justify-center bg-gradient-to-b from-[#23234b] to-[#181828] py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center">
              <span className="inline-block bg-blue-900 text-blue-300 px-4 py-1 rounded-full text-sm font-semibold mb-4">My Expertise</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2 text-center">Skills & Competencies</h2>
              <div className="w-32 h-1 bg-blue-500 rounded-full mb-8"></div>

              {/* 2. Add onClick handlers and dynamic classNames to buttons */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => setActiveTab('technical')}
                  className={`${commonButtonStyle} ${activeTab === 'technical' ? activeButtonStyle : inactiveButtonStyle}`}
                >
                  &lt;/&gt; Technical Skills
                </button>
                <button
                  onClick={() => setActiveTab('soft')}
                  className={`${commonButtonStyle} ${activeTab === 'soft' ? activeButtonStyle : inactiveButtonStyle}`}
                >
                  &#128104;&#8205;&#128187; Soft Skills
                </button>
              </div>
            </div>

            {/* 3. Conditionally render content based on the activeTab state */}
            <div>
              {activeTab === 'technical' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                  {technicalSkills.map((category) => (
                    <div key={category.title} className="bg-[#181828] rounded-lg p-6 shadow-lg border border-white/10">
                      <div className="font-semibold text-white mb-4 flex items-center gap-3 text-lg">{category.icon} {category.title}</div>
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill) => (
                          <span key={skill} className="bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                  {softSkills.map((skill) => (
                    <div key={skill.title} className="bg-[#181828] rounded-lg p-6 shadow-lg border border-white/10">
                      <div className="font-semibold text-white mb-3 flex items-center gap-3 text-lg">{skill.icon} {skill.title}</div>
                      <p className="text-gray-400 text-sm">{skill.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="min-h-screen flex flex-col justify-center bg-gradient-to-b from-[#181828] to-[#23234b] py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center mb-12">
              <span className="inline-block bg-blue-900 text-blue-300 px-4 py-1 rounded-full text-sm font-semibold mb-4">My Work</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2 text-center">GitHub Projects</h2>
              <div className="w-32 h-1 bg-blue-500 rounded-full mb-4"></div>
              <p className="text-gray-300 text-center max-w-2xl">
                Explore my latest projects and contributions on GitHub. From web applications to automation tools,
                each project represents a journey of learning and innovation.
              </p>
            </div>
            <GitHubProjects
              activeFilter={projectFilter}
              onFilterChange={setProjectFilter}
            />
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}