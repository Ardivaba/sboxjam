export default function RulesPage() {
  return (
    <div className="min-h-screen pt-[60px]">
      <div className="max-w-[900px] mx-auto px-6 py-16">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-text-bright mb-2">
            Rules & <span className="text-gradient">Guidelines</span>
          </h1>
          <p className="text-text-muted text-lg mb-12">
            Everything you need to know before participating in the s&box jam.
          </p>
        </div>

        <div className="space-y-6">
          <section className="card p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="text-primary-light font-bold text-sm">1</span>
              </div>
              <h2 className="text-xl font-semibold text-text-bright">Eligibility</h2>
            </div>
            <ul className="space-y-3 text-text">
              <li className="flex items-start gap-3">
                <span className="material-symbols-rounded text-primary text-lg mt-0.5">check_circle</span>
                <span>Must have a valid s&box account</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-rounded text-primary text-lg mt-0.5">check_circle</span>
                <span>Participants must be aged 13 or older</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-rounded text-primary text-lg mt-0.5">check_circle</span>
                <span>Teams of 1–4 people</span>
              </li>
            </ul>
          </section>

          <section className="card p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="text-primary-light font-bold text-sm">2</span>
              </div>
              <h2 className="text-xl font-semibold text-text-bright">Theme</h2>
            </div>
            <ul className="space-y-3 text-text">
              <li className="flex items-start gap-3">
                <span className="material-symbols-rounded text-primary text-lg mt-0.5">palette</span>
                <span>The theme will be revealed at the start of the jam</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-rounded text-primary text-lg mt-0.5">palette</span>
                <span>Your game must meaningfully incorporate the theme</span>
              </li>
            </ul>
          </section>

          <section className="card p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="text-primary-light font-bold text-sm">3</span>
              </div>
              <h2 className="text-xl font-semibold text-text-bright">Timeline</h2>
            </div>
            <ul className="space-y-3 text-text">
              <li className="flex items-start gap-3">
                <span className="material-symbols-rounded text-primary text-lg mt-0.5">timer</span>
                <span>72 hours from theme reveal to submission deadline</span>
              </li>
            </ul>
          </section>

          <section className="card p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="text-primary-light font-bold text-sm">4</span>
              </div>
              <h2 className="text-xl font-semibold text-text-bright">Submissions</h2>
            </div>
            <ul className="space-y-3 text-text">
              <li className="flex items-start gap-3">
                <span className="material-symbols-rounded text-primary text-lg mt-0.5">upload</span>
                <span>Game must be built during the jam period</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-rounded text-primary text-lg mt-0.5">upload</span>
                <span>Pre-existing code libraries and tools are allowed, but core gameplay must be new</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-rounded text-primary text-lg mt-0.5">upload</span>
                <span>Final submission must be playable in s&box</span>
              </li>
            </ul>
          </section>

          <section className="card p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="text-primary-light font-bold text-sm">5</span>
              </div>
              <h2 className="text-xl font-semibold text-text-bright">Judging Criteria</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-md bg-bg-dark/50">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-rounded text-primary text-lg">lightbulb</span>
                  <span className="text-text-bright">Creativity</span>
                </div>
                <span className="text-primary-light font-semibold">25%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-md bg-bg-dark/50">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-rounded text-primary text-lg">sports_esports</span>
                  <span className="text-text-bright">Gameplay</span>
                </div>
                <span className="text-primary-light font-semibold">25%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-md bg-bg-dark/50">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-rounded text-primary text-lg">auto_awesome</span>
                  <span className="text-text-bright">Polish</span>
                </div>
                <span className="text-primary-light font-semibold">20%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-md bg-bg-dark/50">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-rounded text-primary text-lg">palette</span>
                  <span className="text-text-bright">Theme Adherence</span>
                </div>
                <span className="text-primary-light font-semibold">20%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-md bg-bg-dark/50">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-rounded text-primary text-lg">code</span>
                  <span className="text-text-bright">Technical Achievement</span>
                </div>
                <span className="text-primary-light font-semibold">10%</span>
              </div>
            </div>
          </section>

          <section className="card p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="text-primary-light font-bold text-sm">6</span>
              </div>
              <h2 className="text-xl font-semibold text-text-bright">Code of Conduct</h2>
            </div>
            <ul className="space-y-3 text-text">
              <li className="flex items-start gap-3">
                <span className="material-symbols-rounded text-error text-lg mt-0.5">block</span>
                <span>No NSFW content</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-rounded text-error text-lg mt-0.5">block</span>
                <span>No harassment of any kind</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-rounded text-error text-lg mt-0.5">block</span>
                <span>No cheating or use of stolen assets</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-rounded text-success text-lg mt-0.5">favorite</span>
                <span>Respect other participants and their work</span>
              </li>
            </ul>
          </section>

          <section className="card p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-md bg-error/20 border border-error/30 flex items-center justify-center">
                <span className="text-error font-bold text-sm">7</span>
              </div>
              <h2 className="text-xl font-semibold text-text-bright">Disqualification</h2>
            </div>
            <ul className="space-y-3 text-text">
              <li className="flex items-start gap-3">
                <span className="material-symbols-rounded text-error text-lg mt-0.5">warning</span>
                <span>Plagiarism or submitting work not created during the jam</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-rounded text-error text-lg mt-0.5">warning</span>
                <span>Late submissions past the deadline</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-rounded text-error text-lg mt-0.5">warning</span>
                <span>Breaking the Code of Conduct</span>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-16 animate-fade-in">
          <h2 className="text-2xl font-bold text-text-bright mb-6 flex items-center gap-3">
            <span className="material-symbols-rounded text-primary">help</span>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="glass rounded-lg p-5">
              <h3 className="text-text-bright font-medium mb-2">Can I participate solo?</h3>
              <p className="text-text-muted">Yes! Teams can be anywhere from 1 to 4 people. Solo developers are absolutely welcome.</p>
            </div>
            <div className="glass rounded-lg p-5">
              <h3 className="text-text-bright font-medium mb-2">Can I use assets from the s&box asset library?</h3>
              <p className="text-text-muted">Yes, you can use any assets available through the official s&box asset library and any freely licensed resources.</p>
            </div>
            <div className="glass rounded-lg p-5">
              <h3 className="text-text-bright font-medium mb-2">What if I started learning s&box recently?</h3>
              <p className="text-text-muted">All skill levels are welcome. Check out our Guides page for resources to help you get started quickly.</p>
            </div>
            <div className="glass rounded-lg p-5">
              <h3 className="text-text-bright font-medium mb-2">Can I switch teams after the jam starts?</h3>
              <p className="text-text-muted">No. Teams must be finalized before the jam begins. Make sure your team is registered and confirmed.</p>
            </div>
            <div className="glass rounded-lg p-5">
              <h3 className="text-text-bright font-medium mb-2">How are submissions judged?</h3>
              <p className="text-text-muted">Submissions are judged by a panel of community members and s&box developers based on the criteria listed above.</p>
            </div>
            <div className="glass rounded-lg p-5">
              <h3 className="text-text-bright font-medium mb-2">Can I use AI-generated content?</h3>
              <p className="text-text-muted">AI tools are permitted as part of your development workflow, but your game should demonstrate original creative direction and design.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
