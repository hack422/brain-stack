import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaTelegramPlane, FaGithub, FaLinkedin, FaEnvelope, FaLightbulb, FaCode, FaUserShield, FaUsers, FaCogs, FaDatabase, FaCloud } from 'react-icons/fa';
import { MdSecurity } from 'react-icons/md';

export default function Home() {
  return (
    <>
      <Head>
        <title>Brainstack Education</title>
      </Head>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-[#0a0a23] to-[#23234b] flex flex-col justify-center">
        {/* Hero section remains unchanged */}
        <section id="home" className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto py-16 px-4 md:px-8 min-h-screen">
          {/* Left: Hero Text */}
          <div className="flex-1 text-left">
            <span className="inline-block bg-blue-700 text-white px-4 py-1 rounded-full text-sm font-semibold mb-6">Full-Stack Developer & Telegram Bot Developer</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Namaste, I&apos;m <span className="text-blue-400">Pratham Khurana</span>
            </h1>
            <div className="text-lg md:text-xl text-gray-300 font-medium mb-2">
              Python Developer <span className="mx-2">|</span> Telegrami Bot Developer <span className="mx-2">|</span> KALI LINUX User
            </div>
            <div className="text-gray-400 mb-8">Building Next-Gen Tech Solutions with Modern Technologies</div>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 text-white rounded font-semibold shadow">View Projects</button>
              <button className="bg-white border border-gray-300 hover:bg-gray-100 px-6 py-2 text-gray-900 rounded font-semibold shadow">Download PDF</button>
            </div>
            <div className="flex space-x-4 text-2xl text-gray-300">
              <a href="#" className="hover:text-blue-400"><FaTelegramPlane /></a>
              <a href="#" className="hover:text-blue-400"><FaGithub /></a>
              <a href="#" className="hover:text-blue-400"><FaLinkedin /></a>
              <a href="#" className="hover:text-blue-400"><FaEnvelope /></a>
            </div>
          </div>
          {/* Right: Logo */}
          <div className="flex-1 flex justify-center mt-10 md:mt-0">
            <div className="bg-white rounded-full shadow-lg flex items-center justify-center w-64 h-64">
              <img src="/bstack.png" alt="Brainstack Education" className="w-48 h-48 object-contain" />
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
              <div className="flex gap-4 mb-8">
                <button className="bg-blue-700 text-white px-4 py-1 rounded-full font-semibold">&lt;/&gt; Technical Skills</button>
                <button className="bg-[#181828] text-gray-400 px-4 py-1 rounded-full font-semibold">&#128104;&#8205;&#128187; Soft Skills</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#181828] rounded-lg p-4">
                <div className="font-semibold text-white mb-2 flex items-center gap-2"><FaCode className="text-blue-400" /> Programming Languages</div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">Python</span>
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">HTML</span>
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">JavaScript</span>
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">SQL</span>
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">C++</span>
                </div>
              </div>
              <div className="bg-[#181828] rounded-lg p-4">
                <div className="font-semibold text-white mb-2 flex items-center gap-2"><FaTelegramPlane className="text-blue-400" /> Telegram Bot Development</div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">Telegram Bot API</span>
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">python-telegram-bot</span>
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">Webhook Integration</span>
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">Bot Framework</span>
                </div>
              </div>
              <div className="bg-[#181828] rounded-lg p-4">
                <div className="font-semibold text-white mb-2 flex items-center gap-2"><MdSecurity className="text-blue-400" /> Security & Penetration Testing</div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">KALI LINUX</span>
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">Penetration Testing</span>
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">Security Auditing</span>
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">Ethical Hacking</span>
                </div>
              </div>
              <div className="bg-[#181828] rounded-lg p-4">
                <div className="font-semibold text-white mb-2 flex items-center gap-2"><FaCogs className="text-blue-400" /> Web Development</div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">HTML</span>
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">CSS</span>
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">JavaScript</span>
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">React</span>
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">Node.js</span>
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">Express.js</span>
                </div>
              </div>
              <div className="bg-[#181828] rounded-lg p-4">
                <div className="font-semibold text-white mb-2 flex items-center gap-2"><FaDatabase className="text-blue-400" /> Database Management</div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">MySQL</span>
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">MongoDB</span>
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">Firebase</span>
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">SQL</span>
                </div>
              </div>
              <div className="bg-[#181828] rounded-lg p-4">
                <div className="font-semibold text-white mb-2 flex items-center gap-2"><FaCloud className="text-blue-400" /> Cloud & DevOps</div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">AWS</span>
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">Firebase</span>
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">Docker</span>
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">Git</span>
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">GitHub</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="min-h-screen flex flex-col justify-center bg-gradient-to-b from-[#181828] to-[#23234b] py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center">
              <span className="inline-block bg-blue-900 text-blue-300 px-4 py-1 rounded-full text-sm font-semibold mb-4">My Work</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2 text-center">GitHub Projects</h2>
              <div className="w-32 h-1 bg-blue-500 rounded-full mb-8"></div>
              <div className="flex gap-4 mb-8 flex-wrap justify-center">
                <button className="bg-blue-700 text-white px-4 py-1 rounded-full font-semibold">All</button>
                <button className="bg-[#181828] text-gray-400 px-4 py-1 rounded-full font-semibold">JavaScript</button>
                <button className="bg-[#181828] text-gray-400 px-4 py-1 rounded-full font-semibold">Python</button>
                <button className="bg-[#181828] text-gray-400 px-4 py-1 rounded-full font-semibold">TypeScript</button>
                <button className="bg-[#181828] text-gray-400 px-4 py-1 rounded-full font-semibold">Web</button>
              </div>
              <div className="text-gray-400 text-lg mt-8 mb-8">No projects found for this filter.</div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}