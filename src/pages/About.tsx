import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center text-primary hover:text-primary/80 mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Leaderboard
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text">
          About Our Mission
        </h1>

        <div className="space-y-8 text-lg leading-relaxed">
          <section className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-4">Our Purpose</h2>
            <p className="mb-4">
              We are a community-driven platform dedicated to exposing and combating cryptocurrency scams perpetrated by influential figures. Our mission is to protect innocent investors and restore integrity to the crypto community.
            </p>
            <p>
              Too often, high-profile individuals abuse their influence to profit from fraudulent schemes, leaving community members devastated and without recourse. We're here to change that by giving the community a voice and a means to take action.
            </p>
          </section>

          <section className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">1. Nomination Process</h3>
                <p>Anyone can nominate a scammer by providing detailed evidence of their fraudulent activities, including wallet addresses, transaction records, and documentation of their actions.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">2. Community Verification</h3>
                <p>Nominations enter a pending state where the community can review and vote. A nomination needs 500 votes to reach the main leaderboard, ensuring community consensus on legitimate cases.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">3. Legal Action</h3>
                <p>Once a scammer reaches 1,000 lawsuit signatures, we compile all evidence and signatures and forward them to specialized lawsuit firms who will pursue legal action on behalf of the affected community members.</p>
              </div>
            </div>
          </section>

          <section className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-4">Using the Platform</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Viewing Scammers</h3>
                <p>Browse the main leaderboard to see confirmed scammers or check the pending nominations section for recent submissions. Each entry includes detailed information about the scam and evidence.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Voting and Signing</h3>
                <p>You can vote on pending nominations to help them reach the main leaderboard. For confirmed scammers, you can sign the lawsuit petition if you have evidence or have been affected by their actions.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Submitting Nominations</h3>
                <p>When submitting a new nomination, provide as much detail as possible, including:</p>
                <ul className="list-disc ml-6 mt-2">
                  <li>Wallet addresses involved</li>
                  <li>Transaction records</li>
                  <li>Screenshots of communications</li>
                  <li>Social media evidence</li>
                  <li>Timeline of events</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;