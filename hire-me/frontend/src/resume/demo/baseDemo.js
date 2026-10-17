import { DEMO_AVATAR } from './avatar';

/**
 * A COMPLETE resume (every section, every field) used to preview templates.
 * Same shape as the builder draft's `content` - see resume/schema/resumeSchema.js.
 * Descriptions are plain sentences: the template turns each sentence into a bullet.
 */
export function makeBaseDemo() {
  return {
    personalInformation: {
      photo: { url: DEMO_AVATAR, publicId: 'demo' },
      fullName: 'Rahim Uddin',
      email: 'rahim.uddin@example.com',
      phone: '+880 1712 345678',
      location: 'Dhaka, Bangladesh',
      professionalTitle: 'Senior Full-Stack Developer',
      linkedin: 'https://linkedin.com/in/rahim-uddin',
      website: 'https://rahim.dev',
    },
    professionalSummary:
      'Full-stack developer with 6+ years of experience building fast, accessible web applications. Strong in React, Next.js and Node.js, with a focus on clean architecture and measurable business results.',
    workExperience: [
      {
        id: 'demo-job-1', companyName: 'Nexa Technologies', jobTitle: 'Senior Full-Stack Developer', employeeType: 'Full-time',
        location: 'Dhaka', startDate: '2022-03-01', endDate: '', currentlyWorking: true,
        jobDescription:
          'Lead a team of 5 engineers building a SaaS analytics platform. Reduced page load time by 40% with server-side rendering and caching. Introduced automated testing, cutting production bugs by 30%. Mentor junior developers through weekly code reviews.',
      },
      {
        id: 'demo-job-2', companyName: 'BrightSoft Ltd.', jobTitle: 'Frontend Developer', employeeType: 'Full-time',
        location: 'Dhaka', startDate: '2019-06-01', endDate: '2022-02-01', currentlyWorking: false,
        jobDescription:
          'Built a design system used by 4 product teams. Migrated a legacy jQuery app to React with zero downtime. Improved Lighthouse accessibility scores from 62 to 97.',
      },
      {
        id: 'demo-job-3', companyName: 'PixelCraft Studio', jobTitle: 'Junior Web Developer', employeeType: 'Internship',
        location: 'Remote', startDate: '2018-07-01', endDate: '2019-05-01', currentlyWorking: false,
        jobDescription: 'Developed responsive landing pages for 15+ clients. Collaborated with designers to turn Figma files into pixel-perfect code.',
      },
    ],
    education: [
      {
        id: 'demo-edu-1', institutionName: 'University of Dhaka', degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science & Engineering', startDate: '2014-01-01', endDate: '2018-01-01', currentlyStudying: false,
        gpa: '3.75 / 4.00', description: 'Graduated with honours. Led the university programming club. Won the national collegiate hackathon in 2017.',
      },
    ],
    projects: [
      {
        id: 'demo-project-1', projectName: 'TechWorld E-commerce Platform', projectType: 'Personal Project', role: 'Full-Stack Developer',
        keyResponsibilities: 'Built the REST API and authentication. Designed the product search with MongoDB indexes.',
        keyAchievements: 'Improved page performance by 35%. Reached 2,000 monthly users.',
        technologies: ['Next.js', 'Node.js', 'MongoDB', 'Tailwind CSS'], projectUrl: 'https://techworld.example.com',
        projectDescription: 'An online store with real-time inventory and secure checkout.',
      },
      {
        id: 'demo-project-2', projectName: 'ResumeFlow', projectType: 'Open Source', role: 'Maintainer',
        keyResponsibilities: 'Reviewed pull requests. Wrote the documentation.',
        keyAchievements: 'Gained 800 GitHub stars.',
        technologies: ['React', 'Redux Toolkit', 'Express'], projectUrl: '', projectDescription: 'A free resume builder for students.',
      },
    ],
    skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'Redux Toolkit', 'Tailwind CSS', 'Git', 'Figma', 'REST APIs'],
    languages: [
      { id: 'demo-lang-1', name: 'Bengali', level: 'Native' },
      { id: 'demo-lang-2', name: 'English', level: 'Fluent' },
      { id: 'demo-lang-3', name: 'Hindi', level: 'Intermediate' },
    ],
    references: [
      { id: 'demo-ref-1', name: 'Sarah Ahmed', jobTitle: 'Engineering Manager', company: 'Nexa Technologies', relationship: 'Current manager', email: 'sarah.ahmed@example.com', phone: '+880 1811 000111' },
    ],
    targetJob: { title: '', description: '' },
  };
}
