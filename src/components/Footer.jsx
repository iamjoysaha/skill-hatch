export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">SkillHatch</h3>
            <p className="text-sm">
              Empowering learners to achieve their goals through personalized
              roadmaps and expert mentorship.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Learn</h3>
            <ul className="space-y-2">
              {["Roadmaps", "Mentors", "Progress Tracker", "Community"].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-sm hover:text-yellow-400 transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              {["Help Center", "Contact Us", "FAQs", "Privacy Policy"].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-sm hover:text-yellow-400 transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
            <ul className="space-y-2">
              {["Blog", "Twitter", "LinkedIn", "Newsletter"].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-sm hover:text-yellow-400 transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">&copy; 2025 SkillHatch. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {[
              { icon: "fab fa-twitter", label: "Twitter" },
              { icon: "fab fa-linkedin-in", label: "LinkedIn" },
              { icon: "fab fa-facebook-f", label: "Facebook" },
            ].map((item, i) => (
              <a key={i} href="#" className="hover:text-yellow-400 transition text-white text-lg" aria-label={item.label}>
                <i className={item.icon}></i>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}