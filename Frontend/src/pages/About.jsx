// Static About page describing the site and author.
const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">

      {/* Hero */}
      <div className="text-center mb-16">
        <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
          About us
        </span>
        <h1 className="text-4xl font-bold text-gray-800 mt-4 mb-4">
          We write about things that matter
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
          AngiBlog is a space for developers, designers, and curious minds to learn, grow, and stay inspired.
          We publish weekly articles on web development, AI, tools, and modern tech.
        </p>
      </div>

      {/* Mission */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-blue-50 rounded-xl p-6 flex flex-col gap-3">
          <div className="text-3xl">✍️</div>
          <h3 className="font-bold text-gray-800">Quality writing</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Every article is carefully written and reviewed to make sure it's accurate, practical, and easy to follow.
          </p>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 flex flex-col gap-3">
          <div className="text-3xl">🚀</div>
          <h3 className="font-bold text-gray-800">Always up to date</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            The tech world moves fast. We stay on top of trends so you don't have to — new articles every week.
          </p>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 flex flex-col gap-3">
          <div className="text-3xl">🤝</div>
          <h3 className="font-bold text-gray-800">Community first</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            We believe knowledge should be free and accessible to everyone, no paywalls, no gatekeeping.
          </p>
        </div>
      </div>

      {/* Author */}
      <div className="flex flex-col md:flex-row gap-8 items-center bg-gray-50 rounded-2xl p-8 mb-16">
        
        {/* Avatar (improved) */}
        <img
          src="https://api.dicebear.com/7.x/initials/svg?seed=Tochukwu"
          alt="Tochukwu Sunday"
          className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100"
        />

        <div className="flex flex-col gap-2">
          <span className="text-blue-500 text-xs font-semibold uppercase tracking-widest">
            Founder & Author
          </span>
          <h2 className="text-2xl font-bold text-gray-800">
            Tochukwu Sunday
          </h2>

          <p className="text-gray-500 text-sm leading-relaxed max-w-xl">
            A passionate developer and writer who loves building things for the web.
            AngiBlog was created to share knowledge, document learnings, and help other developers
            level up their skills. When not coding, he's probably watching YouTube or reading about AI.
          </p>

          {/* FIXED EMAIL LINK */}
          <a
            href="mailto:Tochukwusun24@gmail.com"
            className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors w-fit"
          >
            Tochukwusun24@gmail.com
          </a>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="text-center bg-blue-500 rounded-2xl p-10">
        <h2 className="text-2xl font-bold text-white mb-2">
          Want to get in touch?
        </h2>
        <p className="text-blue-100 text-sm mb-6">
          Have a question, suggestion, or want to collaborate? Send us a message.
        </p>

        {/* FIXED BUTTON LINK */}
        <a
          href="mailto:Tochukwusun24@gmail.com"
          className="bg-white text-blue-500 px-6 py-2.5 rounded-md font-semibold text-sm hover:bg-blue-50 transition-colors inline-block"
        >
          Send an email
        </a>
      </div>

    </div>
  );
};

export default About;