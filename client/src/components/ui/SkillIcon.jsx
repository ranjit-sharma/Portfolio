import {
  SiReact,
  SiHtml5,
  SiJavascript,
  SiTailwindcss,
  SiBootstrap,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiMongoose,
  SiMysql,
  SiCplusplus,
  SiGit,
  SiGithub,
  SiPostman,
  SiTypescript,
  SiPython,
  SiDocker,
  SiPostgresql,
  SiNextdotjs,
  SiRedux,
} from 'react-icons/si';
import { FaCss3Alt, FaJava } from 'react-icons/fa6';
import { VscVscode } from 'react-icons/vsc';
import {
  TbApi,
  TbShieldLock,
  TbLayersIntersect,
  TbShieldCheck,
  TbSql,
  TbBinaryTree,
  TbCube,
  TbDatabase,
  TbDeviceDesktop,
  TbNetwork,
  TbCode,
  TbRocket,
  TbBug,
} from 'react-icons/tb';
import LeetCodeIcon from './LeetCodeIcon';

/**
 * Modern Tech Skill Icons using react-icons (Simple Icons, Tabler, FontAwesome 6, VSC)
 */
export default function SkillIcon({ name, size = 24, style = {} }) {
  const n = (name || '').trim().toLowerCase();

  // LeetCode
  if (n.includes('leetcode')) {
    return <LeetCodeIcon size={size} withBackground={true} style={style} />;
  }

  // Full-Stack Development
  if (n.includes('full-stack') || n.includes('fullstack')) {
    return <TbCode size={size} color="var(--accent)" style={style} />;
  }

  // React
  if (n.includes('react')) {
    return <SiReact size={size} color="#61DAFB" style={style} />;
  }

  // Next.js
  if (n.includes('next')) {
    return <SiNextdotjs size={size} style={{ color: 'var(--text-primary)', ...style }} />;
  }

  // Node.js
  if (n.includes('node')) {
    return <SiNodedotjs size={size} color="#5FA04E" style={style} />;
  }

  // Express.js
  if (n.includes('express')) {
    return <SiExpress size={size} style={{ color: 'var(--text-primary)', ...style }} />;
  }

  // JavaScript (must check before Java)
  if (n.includes('javascript') || n === 'js' || n.includes('es6')) {
    return <SiJavascript size={size} color="#F7DF1E" style={style} />;
  }

  // TypeScript
  if (n.includes('typescript') || n === 'ts') {
    return <SiTypescript size={size} color="#3178C6" style={style} />;
  }

  // HTML5
  if (n.includes('html')) {
    return <SiHtml5 size={size} color="#E34F26" style={style} />;
  }

  // CSS3
  if (n.includes('css')) {
    return <FaCss3Alt size={size} color="#1572B6" style={style} />;
  }

  // Tailwind CSS
  if (n.includes('tailwind')) {
    return <SiTailwindcss size={size} color="#06B6D4" style={style} />;
  }

  // Bootstrap
  if (n.includes('bootstrap')) {
    return <SiBootstrap size={size} color="#7952B3" style={style} />;
  }

  // EJS
  if (n.includes('ejs')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
        <rect width="24" height="24" rx="4" fill="#B4CA65" />
        <text x="12" y="16" fill="#1C1E21" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="monospace">
          &lt;% %&gt;
        </text>
      </svg>
    );
  }

  // MongoDB
  if (n.includes('mongo') && !n.includes('mongoose')) {
    return <SiMongodb size={size} color="#47A248" style={style} />;
  }

  // Mongoose
  if (n.includes('mongoose')) {
    return <SiMongoose size={size} color="#880000" style={style} />;
  }

  // MySQL
  if (n.includes('mysql')) {
    return <SiMysql size={size} color="#4479A1" style={style} />;
  }

  // PostgreSQL
  if (n.includes('postgres')) {
    return <SiPostgresql size={size} color="#336791" style={style} />;
  }

  // SQL
  if (n === 'sql' || n.includes('sql ')) {
    return <TbSql size={size} color="#00758F" style={style} />;
  }

  // Java (strictly Java, not JavaScript)
  if ((n === 'java' || n.startsWith('java ') || n.includes('core java')) && !n.includes('script')) {
    return <FaJava size={size} color="#ED8B00" style={style} />;
  }

  // C++ / C
  if (n.includes('c++') || n === 'cpp' || n === 'c') {
    return <SiCplusplus size={size} color="#00599C" style={style} />;
  }

  // Python
  if (n.includes('python') || n === 'py') {
    return <SiPython size={size} color="#3776AB" style={style} />;
  }

  // GitHub
  if (n.includes('github')) {
    return <SiGithub size={size} style={{ color: 'var(--text-primary)', ...style }} />;
  }

  // Git
  if (n === 'git' || (n.includes('git') && !n.includes('github'))) {
    return <SiGit size={size} color="#F05032" style={style} />;
  }

  // VS Code
  if (n.includes('vscode') || n.includes('vs code') || n.includes('visual studio code')) {
    return <VscVscode size={size} color="#007ACC" style={style} />;
  }

  // Postman
  if (n.includes('postman')) {
    return <SiPostman size={size} color="#FF6C37" style={style} />;
  }

  // REST APIs
  if (n.includes('rest') || n.includes('api')) {
    return <TbApi size={size} style={{ color: 'var(--accent)', ...style }} />;
  }

  // Authentication & Authorization / Security
  if (n.includes('auth') || n.includes('security') || n.includes('passport')) {
    return <TbShieldLock size={size} color="#10B981" style={style} />;
  }

  // Middleware
  if (n.includes('middleware')) {
    return <TbLayersIntersect size={size} color="#A855F7" style={style} />;
  }

  // Input Validation
  if (n.includes('valid') || n.includes('joi')) {
    return <TbShieldCheck size={size} color="#38BDF8" style={style} />;
  }

  // Error Handling / Debugging / Clean Code
  if (n.includes('error') || n.includes('debug') || n.includes('clean code')) {
    return <TbBug size={size} color="#F43F5E" style={style} />;
  }

  // Data Structures & Algorithms / DSA / Problem Solving
  if (n.includes('data structure') || n.includes('algorithm') || n.includes('dsa') || n.includes('problem')) {
    return <TbBinaryTree size={size} color="#F59E0B" style={style} />;
  }

  // OOP
  if (n.includes('oop') || n.includes('object-oriented')) {
    return <TbCube size={size} color="#8B5CF6" style={style} />;
  }

  // DBMS / Database Integration
  if (n.includes('dbms') || n.includes('database')) {
    return <TbDatabase size={size} color="#0EA5E9" style={style} />;
  }

  // Performance / Speed / API
  if (n.includes('performance') || n.includes('speed')) {
    return <TbRocket size={size} color="#EC4899" style={style} />;
  }

  // Operating Systems
  if (n.includes('operating system') || n === 'os' || n.includes('linux')) {
    return <TbDeviceDesktop size={size} color="#10B981" style={style} />;
  }

  // Computer Networks
  if (n.includes('network')) {
    return <TbNetwork size={size} color="#EC4899" style={style} />;
  }

  // Docker
  if (n.includes('docker')) {
    return <SiDocker size={size} color="#2496ED" style={style} />;
  }

  // Redux
  if (n.includes('redux')) {
    return <SiRedux size={size} color="#764ABC" style={style} />;
  }

  // Fallback
  return <TbCode size={size} style={{ color: 'var(--accent)', ...style }} />;
}
